import { test, expect } from '@playwright/test'

const origin = 'http://127.0.0.1:5173'

for (const failure of ['unavailable', 'full']) {
  test(`${failure} storage keeps learning and presentation usable and warns about persistence`, async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.addInitScript(failure => {
      if (failure === 'unavailable') {
        Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError') } })
        Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Blocked', 'SecurityError') } })
      } else {
        Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError') }
      }
    }, failure)
    await page.goto(`${origin}/trb/lesson/export-tas-model`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('status').filter({ hasText: /kemajuan.*tidak dapat disimpan/i })).toBeVisible()
    await page.locator('button[lang="en"]').click()
    await expect(page.getByRole('status').filter({ hasText: /progress could not be saved/i })).toBeVisible()
    await page.goto(`${origin}/present?product=tme&lesson=measurement-settings`)
    await expect(page.locator('.presentation-image img')).toBeVisible()
    expect(errors).toEqual([])
  })
}

test('malformed progress and score records do not crash lessons or test pages', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Test User', jobTitle: 'Engineer', employeeId: '000012' }))
    const attemptId = '00000000-0000-4000-8000-000000000001'
    localStorage.setItem(`cubicost:firebase:attempt:${attemptId}`, JSON.stringify({ payload: { attemptId, course: 'tas', answers: {}, section: {}, score: {} }, status: 'saved', confirmedAt: 'invalid date' }))
    for (const product of ['tas', 'trb', 'tme']) localStorage.setItem(`cubicost:tutorial:${product}:progress`, JSON.stringify({ checklists: { 'measurement-settings': {}, 'export-tas-model': {} } }))
    localStorage.setItem('cubicost:tas:section-1-exercise:v1:result', JSON.stringify({ answers: { settings: 'review', rules: 'inspect', projectName: {}, ground: '-0.5', ruleSet: 'SMPI', attributes: 'private', height1: '3.5', height2: '3.5', grade: 'K-300', copy: 'yes', drawing: 'split', length: '6000', verify: 'independent', grid: 'A/1', alignmentCheck: 'other' } }))
  })
  for (const product of ['tas', 'trb', 'tme']) {
    await page.goto(`${origin}/${product}/lesson/${product === 'trb' ? 'export-tas-model' : 'measurement-settings'}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  }
  await page.goto(`${origin}/tas/tests`)
  await expect(page.locator('.test-list > article')).toHaveCount(3)
  await expect(page.locator('.course-scores__pending')).toHaveCount(3)
  await expect(page.getByRole('button', { name: 'Unduh kartu nilai' })).toBeDisabled()
  expect(errors).toEqual([])
})

test('quota failures retain readable TAS progress even when migration writes fail', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cubicost:tutorial:tas:progress', JSON.stringify({ completed: ['identify-columns'], started: ['identify-columns'], checklists: {} }))
    localStorage.setItem('cubicost:tutorial:tas:lastLesson', 'identify-columns')
    Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError') }
  })
  await page.goto(`${origin}/tas/lesson/identify-columns`)
  await expect(page.locator('.completion-success')).toBeVisible()
  await expect(page.getByRole('status').filter({ hasText: /kemajuan.*tidak dapat disimpan/i })).toBeVisible()
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('cubicost:tutorial:tas:progress')).completed)).toEqual(['identify-columns'])
})

test('registration and assessment remain usable without storage and report failed saves', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError') } })
  })
  await page.goto(`${origin}/tas/tests/section-1`)
  await page.getByLabel('Nama', { exact: true }).fill('Ayu')
  await page.getByLabel('Jabatan').fill('Engineer')
  await page.getByLabel('No. Karyawan').fill('000012')
  await page.getByRole('button', { name: 'Lanjut ke latihan' }).click()
  await expect(page.getByRole('status').filter({ hasText: /Data diri tidak dapat disimpan/ })).toBeVisible()
  await page.getByRole('button', { name: 'Mulai Latihan' }).click()
  await expect(page.locator('.exercise-question')).toBeVisible()
  await expect(page.locator('.exercise-bottom [role="status"]')).toBeVisible()
  await page.locator('input[name="settings"][value="review"]').check()
  await page.locator('.exercise-navigation button[type="submit"]').click()
  await expect(page.locator('.exercise-question-meta')).toContainText('2 / 8')
  expect(errors).toEqual([])
})

test('assessment save warning clears after storage recovers and the next answer is persisted', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Test User', jobTitle: 'Engineer', employeeId: '000012' }))
    const setItem = Storage.prototype.setItem
    window.restoreStorage = () => { Storage.prototype.setItem = setItem }
    Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError') }
  })
  await page.goto(`${origin}/tas/tests/section-1`)
  await page.getByRole('button', { name: 'Mulai Latihan' }).click()
  await expect(page.locator('.exercise-bottom [role="status"]')).toBeVisible()
  await page.evaluate(() => window.restoreStorage())
  await page.locator('input[name="settings"][value="review"]').check()
  await expect(page.locator('.exercise-bottom [role="status"]')).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('cubicost:tas:section-1-exercise:v1')).answers.settings)).toBe('review')
  await page.reload()
  await expect(page.locator('input[name="settings"][value="review"]')).toBeChecked()
})
