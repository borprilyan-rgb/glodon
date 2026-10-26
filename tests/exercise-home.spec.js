import { test, expect } from '@playwright/test'

const origin = 'http://127.0.0.1:5173'

test('exercise home displays and edits shared personal details without the removed copy', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en')
    if (!localStorage.getItem('cubicost:participant')) localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Learner', jobTitle: 'Engineer', employeeId: '000012' }))
  })
  await page.goto(`${origin}/exercises`)
  const details = page.locator('.participant-profile-card')
  await expect(details.getByRole('heading', { name: 'Personal Details' })).toBeVisible()
  await expect(details).toContainText('000012')
  await expect(page.getByRole('link', { name: 'View scores', exact: true })).toHaveCount(0)
  await expect(page.getByText('Details are available to edit.', { exact: true })).toHaveCount(0)
  await expect(page.locator('.employee-phase-note')).toHaveCount(0)
  await details.getByRole('button', { name: 'Edit Details' }).click()
  await page.getByLabel('Job title', { exact: true }).fill('Quantity Surveyor')
  await page.getByRole('button', { name: 'Save Details', exact: true }).click()
  await expect(details).toContainText('Quantity Surveyor')
  await expect(details.getByRole('button', { name: 'Edit Details' })).toBeDisabled()
  await page.reload()
  await expect(details).toContainText('Quantity Surveyor')
  for (const product of ['tas', 'trb', 'tme']) {
    await page.goto(`${origin}/${product}/tests`)
    await expect(page.locator('.participant-profile-card')).toContainText('Quantity Surveyor')
    await expect(page.locator('.test-list.exercise-card')).toHaveCount(1)
    await expect(page.locator('.test-list > article')).toHaveCount(3)
    await expect(page.locator('.course-scores')).toHaveCount(0)
    await expect(page.getByText('Do a section exercise, review your results, and download your score card.', { exact: true })).toHaveCount(0)
    await expect(page.locator('.employee-phase-note')).toHaveCount(0)
    await page.goto(`${origin}/${product}/tests/section-1`)
    await expect(page.locator('.employee-phase-note')).toHaveCount(0)
    await expect(page.locator('.section-exercise')).toBeVisible()
  }
})

test('new learners can save personal details on exercise home while course selection remains available', async ({ page }) => {
  await page.goto(`${origin}/exercises`)
  await expect(page.locator('.exercise-hub__card')).toHaveCount(3)
  await expect(page.getByRole('heading', { name: 'Data Diri', exact: true })).toBeVisible()
  await page.getByLabel('Nama', { exact: true }).fill('Ayu')
  await page.getByLabel('Jabatan', { exact: true }).fill('Engineer')
  await page.getByLabel('No. Karyawan', { exact: true }).fill('000123')
  await page.getByRole('button', { name: 'Simpan Data Diri' }).click()
  await expect(page.locator('.participant-profile-card')).toContainText('000123')
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('cubicost:participant')).employeeId)).toBe('000123')
  await expect(page.locator('.exercise-hub__card')).toHaveCount(3)
  await expect(page.locator('.exercise-hub__scores')).toHaveCount(0)
  await page.locator('.lesson-topbar__tools a[href="/exercises/score"]').click()
  await expect(page).toHaveURL(`${origin}/exercises/score`)
  await expect(page.locator('.exercise-hub__scores')).toBeVisible()
  await expect(page.locator('.course-scores')).toHaveCount(3)
  await expect(page.locator('.course-scores').first()).toContainText('000123')
})

for (const width of [1440, 390]) {
  test(`score page supports direct access, refresh and returning to exercises at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(() => localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en'))
    await page.goto(`${origin}/exercises`)
    if (width < 768) {
      await page.locator('.mobile-header-row button[aria-expanded]').click()
      await page.getByRole('dialog').getByRole('link', { name: 'Scores', exact: true }).click()
    } else await page.locator('.lesson-topbar__tools').getByRole('link', { name: 'Scores', exact: true }).click()
    await expect(page).toHaveURL(`${origin}/exercises/score`)
    await expect(page.getByRole('heading', { name: 'Exercise score overview', exact: true })).toBeVisible()
    await expect(page.locator('.course-scores')).toHaveCount(3)
    await page.reload()
    await expect(page.locator('.course-scores')).toHaveCount(3)
    await expect(page.locator('.course-scores__row')).toHaveCount(9)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.locator('.exercise-score-page > a').click()
    await expect(page).toHaveURL(`${origin}/exercises`)
    await expect(page.locator('.exercise-hub__card')).toHaveCount(3)
    await expect(page.locator('.exercise-hub__scores')).toHaveCount(0)
  })
}
