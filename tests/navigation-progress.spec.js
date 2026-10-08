import { test, expect } from '@playwright/test'
import { getTasData } from '../src/data/tas/index.js'
import { getTrbData } from '../src/data/trb/index.js'
import { getTmeData } from '../src/data/tme/index.js'

const origin = 'http://127.0.0.1:5173'
for (const [product, getCourse] of Object.entries({ tas: getTasData, trb: getTrbData, tme: getTmeData })) {
  test(`${product} direct lessons, refresh, navigation and browser back preserve completion`, async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const step = getCourse('id').allSteps[0]
    const path = `${origin}/${product}/lesson/${step.id}`
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(step.title)
    for (const checkbox of await page.locator('.completion-card input[type="checkbox"]').all()) await checkbox.check()
    await page.locator('.complete-button').click()
    await expect(page.locator('.completion-success')).toBeVisible()
    await page.reload()
    await expect(page.locator('.completion-success')).toBeVisible()
    expect(await page.evaluate(product => JSON.parse(localStorage.getItem(`cubicost:tutorial:${product}:progress`)).completed, product)).toContain(step.id)
    expect(await page.evaluate(product => localStorage.getItem(`cubicost:tutorial:${product}:lastLesson`), product)).toBe(step.id)
    await page.locator('.course-map-button').click()
    await expect(page).toHaveURL(`${origin}/${product}/course`)
    await expect(page.locator(`.course-lesson[href="/${product}/lesson/${step.id}"]`)).toHaveClass(/is-completed/)
    await page.goBack()
    await expect(page).toHaveURL(path)
    await expect(page.locator('.completion-success')).toBeVisible()
    await page.locator('.lesson-topbar__tools a[href="/"]').click()
    await expect(page).toHaveURL(`${origin}/`)
    await page.goBack()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(step.title)
    expect(errors).toEqual([])
  })
}

test('TME-C test links and refresh consistently show three assessments', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Test User', jobTitle: 'Engineer', employeeId: '000012' })))
  await page.goto(`${origin}/exercises`)
  await page.locator('.exercise-hub__card a[href="/tme/tests"]').click()
  await expect(page.locator('.test-list > article')).toHaveCount(3)
  await page.reload()
  await expect(page.locator('.test-list > article')).toHaveCount(3)
  await page.goBack()
  await expect(page).toHaveURL(`${origin}/exercises`)
})

test('legacy TAS progress keeps its backup, mapped lesson and curriculum completion after migration', async ({ page }) => {
  const legacy = { completed: ['identify-columns', 'view-expression', 'measurement-rules', 'filter-deduction', 'change-rule', 'recalculate', 'verify-deduction', 'quantity-category', 'configure-report'], started: ['floor-settings', 'identify-columns'], checklists: { 'identify-columns': [0] }, lastLesson: 'floor-settings' }
  await page.addInitScript(legacy => {
    if (!localStorage.getItem('cubicost-tas-tutorial-progress-v1')) localStorage.setItem('cubicost-tas-tutorial-progress-v1', JSON.stringify(legacy))
  }, legacy)
  await page.goto(`${origin}/tas/course`)
  const data = await page.evaluate(() => ({
    progress: JSON.parse(localStorage.getItem('cubicost:tutorial:tas:progress')),
    backup: JSON.parse(localStorage.getItem('cubicost:tutorial:tas:progress:curriculum-v1-backup')),
    lastLesson: localStorage.getItem('cubicost:tutorial:tas:lastLesson'),
    legacyMigrated: localStorage.getItem('cubicost:tutorial:tas:migrated-v1'),
    curriculumMigrated: localStorage.getItem('cubicost:tutorial:tas:curriculum-v2-migrated'),
  }))
  expect(data.progress.completed).toEqual(['identify-columns', 'measurement-rules', 'calculate-verify-quantity', 'quantity-reports'])
  expect(data.progress.started).toEqual(['floor-grade-settings', 'identify-columns'])
  expect(data.progress.checklists).toEqual({ 'identify-columns': [0] })
  expect(data.backup.completed).toEqual(legacy.completed)
  expect(data.lastLesson).toBe('floor-grade-settings')
  expect(data.legacyMigrated).toBe('1')
  expect(data.curriculumMigrated).toBe('1')
  await page.reload()
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('cubicost:tutorial:tas:progress')))).toEqual(data.progress)
})
