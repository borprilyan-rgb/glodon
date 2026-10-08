import { test, expect } from '@playwright/test'
import { randomUUID } from 'node:crypto'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, setDoc } from 'firebase/firestore'
import { provisionAdmin, passwordSignIn } from './firebase/adminAuth.mjs'

const origin = 'http://127.0.0.1:5173'
async function open(page, language = 'en') {
  await page.goto(origin)
  await page.evaluate(language => localStorage.setItem('cubicost-tas-tutorial-language-v1', language), language)
  await page.goto(`${origin}/admin/results`)
}
async function identities(page) {
  return page.evaluate(async () => {
    const { getServices } = await import('/src/firebase/client.js')
    await Promise.all([getServices('admin').auth.authStateReady(), getServices().auth.authStateReady()])
    return { admin: getServices('admin').auth.currentUser?.uid || null, participant: getServices().auth.currentUser?.uid, anonymous: getServices().auth.currentUser?.isAnonymous }
  })
}

for (const language of ['en', 'id']) test(`${language} compact login supports keyboard password visibility, generic failure/reset messages and no registration`, async ({ page }, testInfo) => {
  await page.setViewportSize(language === 'en' ? { width: 1280, height: 800 } : { width: 390, height: 844 })
  await open(page, language)
  const c = language === 'en'
    ? { password: 'Password', show: 'Show password', hide: 'Hide password', login: 'Sign In', forgot: 'Forgot Password', invalid: 'Check your email and password', reset: 'If this account supports', setup: 'One-time password setup' }
    : { password: 'Kata sandi', show: 'Tampilkan kata sandi', hide: 'Sembunyikan kata sandi', login: 'Masuk', forgot: 'Lupa Kata Sandi', invalid: 'Periksa email dan kata sandi', reset: 'Jika akun ini mendukung', setup: 'Pengaturan kata sandi satu kali' }
  const password = page.getByLabel(c.password, { exact: true })
  await expect(password).toHaveAttribute('type', 'password')
  const show = page.getByRole('button', { name: c.show, exact: true })
  await show.focus()
  await page.keyboard.press('Enter')
  await expect(password).toHaveAttribute('type', 'text')
  await expect(page.getByRole('button', { name: c.hide, exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('Space')
  await expect(password).toHaveAttribute('type', 'password')
  await expect(page.getByRole('button', { name: /register|sign up|daftar/i })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /google|link password|tautkan/i })).toHaveCount(0)
  await expect(page.locator('.admin-auth-setup')).toHaveCount(0)
  await expect(page.getByText(c.setup, { exact: true })).toHaveCount(0)
  const email = `missing-${randomUUID()}@example.test`
  await page.getByLabel('Email', { exact: true }).fill(email)
  await password.fill(`Aa1!${randomUUID()}`)
  await page.getByRole('button', { name: c.login, exact: true }).click()
  await expect(page.locator('.admin-login [role="alert"]')).toContainText(c.invalid)
  await expect(password).toHaveValue('')
  expect((await identities(page)).admin).toBeNull()
  await page.getByRole('button', { name: c.forgot, exact: true }).click()
  await expect(page.locator('.admin-login [role="status"]')).toContainText(c.reset)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath(`${language}-admin-login.png`) })
})

test('password login, reset and logout preserve the provisioned admin UID and anonymous participant', async ({ page, request }) => {
  await open(page)
  const email = `admin-${randomUUID()}@example.test`
  const password = `Aa1!${randomUUID()}`
  const uid = await provisionAdmin(page, { email, password })
  const participant = await page.evaluate(async () => (await import('/src/firebase/client.js')).participantUid())
  const original = { uid, participant }
  const environment = await initializeTestEnvironment({ projectId: 'demo-cubicost', firestore: { host: '127.0.0.1', port: 8080 } })
  try {
    await environment.withSecurityRulesDisabled(async context => { await setDoc(doc(context.firestore(), 'admins', original.uid), { enabled: true }) })
    await page.reload()
    await passwordSignIn(page, { email, password, uid })
    expect(await identities(page)).toEqual({ admin: original.uid, participant: original.participant, anonymous: true })
    expect(await page.evaluate(async () => { const { getServices } = await import('/src/firebase/client.js'); return (await getServices('admin').auth.currentUser.getIdTokenResult()).claims.firebase.sign_in_provider })).toBe('password')
    await page.getByRole('button', { name: 'Sign Out', exact: true }).click()
    expect(await identities(page)).toEqual({ admin: null, participant: original.participant, anonymous: true })
    await page.getByLabel('Email', { exact: true }).fill(email)
    await page.getByLabel('Password', { exact: true }).fill(`Wrong!${randomUUID()}`)
    await page.getByRole('button', { name: 'Sign In', exact: true }).click()
    await expect(page.locator('.admin-login [role="alert"]')).toContainText('Check your email and password')
    await page.getByRole('button', { name: 'Forgot Password', exact: true }).click()
    await expect(page.locator('.admin-login [role="status"]')).toContainText('If this account supports')
    const response = await request.get('http://127.0.0.1:9099/emulator/v1/projects/demo-cubicost/oobCodes')
    expect(response.ok()).toBe(true)
    const reset = (await response.json()).oobCodes.find(code => code.email === email && code.requestType === 'PASSWORD_RESET')
    expect(reset).toBeTruthy()
    const newPassword = `Aa1!${randomUUID()}`
    await page.evaluate(async ({ code, password }) => {
      const { getServices } = await import('/src/firebase/client.js')
      const { confirmPasswordReset } = await import('/node_modules/.vite/deps/firebase_auth.js')
      await confirmPasswordReset(getServices('admin').auth, code, password)
    }, { code: reset.oobCode, password: newPassword })
    await page.getByLabel('Password', { exact: true }).fill(newPassword)
    await page.getByRole('button', { name: 'Sign In', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Apply Filters', exact: true })).toBeVisible()
    expect(await identities(page)).toEqual({ admin: original.uid, participant: original.participant, anonymous: true })
    expect(await page.evaluate(password => [localStorage, sessionStorage].every(storage => Object.keys(storage).every(key => !storage.getItem(key).includes(password))), newPassword)).toBe(true)
  } finally { await environment.cleanup() }
})

test('unauthorized password accounts cannot load results or register through the interface', async ({ page }) => {
  await open(page)
  const email = `denied-${randomUUID()}@example.test`
  const password = `Aa1!${randomUUID()}`
  const uid = await provisionAdmin(page, { email, password })
  const participant = await page.evaluate(async () => (await import('/src/firebase/client.js')).participantUid())
  await passwordSignIn(page, { email, password, uid, authorized: false })
  await expect(page.getByRole('button', { name: 'Apply Filters', exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /google|register|sign up|link password/i })).toHaveCount(0)
  expect(await identities(page)).toEqual({ admin: uid, participant, anonymous: true })
})
