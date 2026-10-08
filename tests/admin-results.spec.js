import { test, expect } from '@playwright/test'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, writeBatch, Timestamp } from 'firebase/firestore'
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { provisionAdmin, passwordSignIn } from './firebase/adminAuth.mjs'

const origin = 'http://127.0.0.1:5173'
const languageKey = 'cubicost-tas-tutorial-language-v1'
const labels = {
  en: { title: 'Test Results', home: 'Back to Home', account: 'Account details', about: 'About these results', employee: 'Employee ID', from: 'From date', to: 'To date', apply: 'Apply Filters', export: 'Export CSV', more: 'Load More', details: 'Details for Ayu', job: 'Engineer', answers: 'Answers', count: '100 attempts loaded' },
  id: { title: 'Hasil Tes', home: 'Kembali ke Beranda', account: 'Detail akun', about: 'Tentang hasil ini', employee: 'No. Karyawan', from: 'Tanggal mulai', to: 'Tanggal akhir', apply: 'Terapkan Filter', export: 'Ekspor CSV', more: 'Muat Lagi', details: 'Detail untuk Ayu', job: 'Engineer', answers: 'Jawaban', count: '100 percobaan dimuat' },
}

for (const language of ['en', 'id']) test(`${language} admin layout supports compact filters, keyboard details, pagination and complete CSV export`, async ({ page }, testInfo) => {
  const c = labels[language]
  const mobile = language === 'id'
  await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 })
  await page.goto(origin)
  await page.evaluate(({ key, language }) => localStorage.setItem(key, language), { key: languageKey, language })
  await page.goto(`${origin}/admin/results`)
  await expect(page.getByRole('heading', { level: 1, name: c.title })).toBeVisible()
  const email = `layout-${language}-${randomUUID()}@example.test`
  const password = `Aa1!${randomUUID()}`
  const uid = await provisionAdmin(page, { email, password })
  const employeeId = mobile ? '111222' : '333444'
  const environment = await initializeTestEnvironment({ projectId: 'demo-cubicost', firestore: { host: '127.0.0.1', port: 8080 } })
  try {
    await environment.withSecurityRulesDisabled(async context => {
      const db = context.firestore()
      const batch = writeBatch(db)
      batch.set(doc(db, 'admins', uid), { enabled: true })
      for (let index = 0; index < 105; index++) {
        const attemptId = randomUUID()
        batch.set(doc(db, 'testAttempts', attemptId), { attemptId, uid: 'participant-layout', name: 'Ayu', jobTitle: 'Engineer', employeeId, course: 'tme', section: 1, answers: { q1: '0', q2: '0', q3: '0', q4: '0', q5: '0' }, score: 100, maximumScore: 100, passed: true, scoreVerified: false, assessmentVersion: 'v1', submittedAt: Timestamp.fromMillis(Date.UTC(2026, 9, 1, 0, 0, index)) })
      }
      await batch.commit()
    })
    await page.reload()
    await passwordSignIn(page, { email, password, uid, language })
    const apply = page.getByRole('button', { name: c.apply, exact: true })
    await expect(apply).toBeVisible()
    await expect(page.locator('.lesson-topbar')).toHaveCount(1)
    await expect(page.locator('.lesson-topbar .admin-label')).toHaveText('Admin')
    await expect(page.locator('.lesson-topbar .admin-signout')).toHaveCount(1)
    await expect(page.locator('.admin-results .admin-signout')).toHaveCount(0)
    await expect(page.locator('.lesson-topbar .admin-email')).toHaveText(email)
    await expect(page.getByText(c.account, { exact: true })).toHaveCount(0)
    await expect(page.locator('.admin-account')).toHaveCount(0)
    await expect(page.getByRole('button', { name: language === 'en' ? 'Sign Out' : 'Keluar', exact: true })).toBeVisible()
    await page.getByLabel(c.employee, { exact: true }).fill(employeeId)
    await page.getByLabel(c.from, { exact: true }).fill('2026-10-01')
    await page.getByLabel(c.to, { exact: true }).fill('2026-10-01')
    await page.getByLabel(c.to, { exact: true }).press('Tab')
    // Native date inputs include separately focusable calendar segments.
    for (let step = 0; step < 5 && !await apply.evaluate(button => button === document.activeElement); step++) await page.keyboard.press('Tab')
    await expect(apply).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('.admin-result-row')).toHaveCount(100)
    await expect(page.locator('.admin-results-toolbar [role="status"]')).toHaveText(c.count)
    await expect(page.locator('.admin-table th')).toHaveCount(8)
    const bounds = await page.locator('.admin-filters input, .admin-filters select').evaluateAll(inputs => inputs.map(input => ({ height: input.getBoundingClientRect().height, top: input.getBoundingClientRect().top })))
    expect(new Set(bounds.map(input => input.height)).size).toBe(1)
    if (!mobile) {
      expect(new Set(bounds.map(input => input.top)).size).toBe(1)
      expect((await page.locator('.admin-table').boundingBox()).y).toBeLessThan(300)
    } else {
      expect(bounds.every((input, index) => index === 0 || input.top > bounds[index - 1].top)).toBe(true)
      expect((await page.locator('.admin-table').boundingBox()).y).toBeLessThan(750)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: testInfo.outputPath(`${language}-admin-results.png`), fullPage: false })
    await page.getByRole('button', { name: c.more, exact: true }).click()
    await expect(page.locator('.admin-result-row')).toHaveCount(105)
    const detail = page.getByRole('button', { name: c.details, exact: true }).first()
    await detail.focus()
    await page.keyboard.press('Enter')
    await expect(detail).toHaveAttribute('aria-expanded', 'true')
    const controlled = await detail.getAttribute('aria-controls')
    await expect(page.locator(`[id="${controlled}"]`)).toBeVisible()
    await expect(page.locator(`[id="${controlled}"]`)).toContainText(c.job)
    await expect(page.locator(`[id="${controlled}"] .admin-answer-question`)).toHaveCount(5)
    await expect(page.locator(`[id="${controlled}"] .admin-answer-question h3`).first()).toContainText(language === 'en' ? 'Why should the drawing revision' : 'Mengapa drawing revision')
    await expect(page.locator(`[id="${controlled}"] pre`)).toHaveCount(0)
    await expect(page.locator(`[id="${controlled}"]`)).not.toContainText('participant-layout')
    await expect(page.locator(`[id="${controlled}"]`)).not.toContainText(controlled.replace('details-', ''))
    await page.keyboard.press('Space')
    await expect(page.locator(`[id="${controlled}"]`)).toBeHidden()
    await expect(page.getByText(c.about, { exact: true })).toHaveCount(0)
    await expect(page.locator('#admin-export-help')).toHaveCount(0)
    await page.getByLabel(c.employee, { exact: true }).fill('999999')
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: c.export, exact: true }).click()
    const download = await downloadPromise
    const exportPath = testInfo.outputPath('results.csv')
    await download.saveAs(exportPath)
    const csv = readFileSync(exportPath, 'utf8')
    expect(csv.split('\r\n')).toHaveLength(106)
    expect(csv).toContain(`'${employeeId}`)
    expect(csv).not.toContain('999999')
    expect(csv).toContain('"jobTitle"')
    expect(csv).toContain('"answers"')
    expect(csv).toContain('"assessmentVersion"')
    expect(csv).toContain('"attemptId"')
    expect(csv).toContain('"uid"')
    if (mobile) await page.locator('.mobile-header-language').click()
    else await page.locator(`button[lang="${language === 'en' ? 'id' : 'en'}"]`).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(labels[language === 'en' ? 'id' : 'en'].title)
    expect(await page.evaluate(key => localStorage.getItem(key), languageKey)).toBe(language === 'en' ? 'id' : 'en')
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(labels[language === 'en' ? 'id' : 'en'].title)
    await expect(page.getByRole('link', { name: labels[language === 'en' ? 'id' : 'en'].home })).toHaveAttribute('href', '/')
    // Header links use the same navigation as the rest of the learning centre.
    if (mobile) {
      await page.locator('.mobile-header-row button[aria-expanded]').click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page.getByRole('dialog')).toHaveCount(0)
      await expect(page.locator('.mobile-header-row button[aria-expanded]')).toBeFocused()
      await page.keyboard.press('Enter')
      await page.getByRole('dialog').getByRole('link', { name: 'Contact', exact: true }).click()
    } else await page.locator('.lesson-topbar').getByRole('link', { name: 'Kontak', exact: true }).click()
    await expect(page).toHaveURL(`${origin}/contact`)
    await page.goBack()
    await expect(page).toHaveURL(`${origin}/admin/results`)
    await expect(page.locator('.admin-filters')).toBeVisible()
    await page.locator(mobile ? '.mobile-header__logo' : '.lesson-brand').click()
    await expect(page).toHaveURL(`${origin}/`)
    await page.goBack()
    await expect(page.locator('.admin-filters')).toBeVisible()
    await page.locator('.lesson-topbar .admin-signout').focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('.admin-login')).toBeVisible()
    await expect(page.locator('.admin-filters, .admin-table, .admin-results-toolbar')).toHaveCount(0)
    await expect(page.locator('.lesson-topbar .admin-signout, .lesson-topbar .admin-email')).toHaveCount(0)
    await page.reload()
    await expect(page.locator('.admin-login')).toBeVisible()
    await expect(page.locator('.admin-table')).toHaveCount(0)

  } finally { await environment.cleanup() }
})
