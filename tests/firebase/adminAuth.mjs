import { expect } from '@playwright/test'

// Test fixture only: create a manually provisioned account in the local Auth
// emulator without signing the browser in or adding registration to the app.
export async function provisionAdmin(page, { email, password }) {
  return page.evaluate(async ({ email, password }) => {
    const { getServices } = await import('/src/firebase/client.js')
    const { auth } = getServices('admin')
    if (auth.app.options.projectId !== 'demo-cubicost' || !auth.emulatorConfig) throw new Error('Local emulators required.')
    const response = await fetch(`http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${auth.app.options.apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true }),
    })
    if (!response.ok) throw new Error('Emulator account provisioning failed.')
    return (await response.json()).localId
  }, { email, password })
}

export async function passwordSignIn(page, { email, password, uid, language = 'en', authorized = true }) {
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel(language === 'en' ? 'Password' : 'Kata sandi', { exact: true }).fill(password)
  await page.getByRole('button', { name: language === 'en' ? 'Sign In' : 'Masuk', exact: true }).click()
  if (authorized) await expect(page.getByRole('button', { name: language === 'en' ? 'Apply Filters' : 'Terapkan Filter', exact: true })).toBeVisible()
  else await expect(page.getByRole('alert')).toContainText(language === 'en' ? 'not authorized' : 'belum diizinkan')
  const identity = await page.evaluate(async () => {
    const { getServices } = await import('/src/firebase/client.js')
    const user = getServices('admin').auth.currentUser
    return { uid: user.uid, provider: (await user.getIdTokenResult()).signInProvider }
  })
  expect(identity).toEqual({ uid, provider: 'password' })
}
