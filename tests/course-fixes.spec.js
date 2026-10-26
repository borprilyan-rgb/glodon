import { test, expect } from '@playwright/test'
import { getTasData } from '../src/data/tas/index.js'
import { getTrbData } from '../src/data/trb/index.js'
import { getTmeData } from '../src/data/tme/index.js'
import { getReportLessons } from '../src/data/tas/tasReports.js'

const origin = 'http://127.0.0.1:5173'
const courses = {
  tas: [...getTasData('en').allSteps, ...getReportLessons('en')],
  trb: getTrbData('en').allSteps,
  tme: getTmeData('en').allSteps,
}

for (const [product, lessons] of Object.entries(courses)) {
  test(`${product}: final lesson/part alone does not complete the course; every lesson does`, async ({ page }) => {
    const last = lessons.at(-1)
    await page.addInitScript(() => {
      localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en')
      localStorage.setItem('cubicost:tutorial:tas:migrated-v1', '1')
      localStorage.setItem('cubicost:tutorial:tas:curriculum-v2-migrated', '1')
    })
    await page.goto(`${origin}/${product}/`)
    const seed = async ids => page.evaluate(({ product, ids, reports }) => {
      localStorage.setItem(`cubicost:tutorial:${product}:progress`, JSON.stringify({ completed: ids.filter(id => !reports.includes(id)), started: ids, checklists: {} }))
      if (product === 'tas') localStorage.setItem('cubicost:tas:reports:progress:v3', JSON.stringify(Object.fromEntries(reports.map(id => [id, { completed: ids.includes(id), checks: [] }]))))
    }, { product, ids, reports: product === 'tas' ? getReportLessons().map(step => step.id) : [] })
    await seed([last.id])
    await page.goto(`${origin}/${product}/lesson/${last.id}`)
    await expect(page.locator('.completion-success h2')).toHaveText('Lesson completed ✓')
    await seed(lessons.filter(step => step.partId === last.partId).map(step => step.id))
    await page.reload()
    await expect(page.locator('.completion-success h2')).toHaveText(`Part ${last.partNumber} completed ✓`)
    await seed(lessons.map(step => step.id))
    await page.reload()
    await expect(page.locator('.completion-success h2')).toHaveText('Learning complete ✓')
  })
}

test('completed lesson retains mobile Previous/Next through every screenshot and leaves only at the last one', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en')
    localStorage.setItem('cubicost:tutorial:trb:progress', JSON.stringify({ completed: ['export-tas-model'], started: ['export-tas-model'], checklists: {} }))
  })
  await page.goto(`${origin}/trb/lesson/export-tas-model`)
  const nav = page.locator('.mobile-action-navigation')
  await expect(nav.getByRole('button', { name: 'Previous' })).toBeDisabled()
  for (let image = 1; image <= 4; image++) {
    await expect(nav.locator('strong')).toHaveText(`${image} of 4`)
    if (image > 1) await expect(nav.getByRole('button', { name: 'Previous' })).toBeEnabled()
    if (image < 4) {
      await expect(nav.locator('a')).toHaveCount(0)
      await nav.getByRole('button', { name: 'Next', exact: true }).click()
      await expect(page).toHaveURL(`${origin}/trb/lesson/export-tas-model`)
    }
  }
  await expect(nav.locator('a')).toHaveAttribute('href', '/trb/lesson/import-tas-model')
  await nav.getByRole('button', { name: 'Previous' }).click()
  await expect(nav.locator('strong')).toHaveText('3 of 4')
  await expect(nav.getByRole('button', { name: 'Next', exact: true })).toBeEnabled()
  await page.reload()
  await expect(page.locator('.completion-success')).toBeVisible()
})

test('report-only storage failure warns, preserves the previous record and in-memory checks, then recovers', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en')
    localStorage.setItem('cubicost:tutorial:tas:migrated-v1', '1')
    localStorage.setItem('cubicost:tutorial:tas:curriculum-v2-migrated', '1')
    const key = 'cubicost:tas:reports:progress:v3'
    const original = Storage.prototype.setItem
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ 'pile-cap-report': { completed: false, checks: [0] } }))
    window.restoreReportStorage = () => { Storage.prototype.setItem = original }
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('Full', 'QuotaExceededError')
      return original.call(this, name, value)
    }
  })
  await page.goto(`${origin}/tas/lesson/pile-cap-report`)
  const warning = page.getByRole('status').filter({ hasText: 'Your learning progress could not be saved' })
  await expect(warning).toBeVisible()
  const checks = page.locator('#lesson-completion input[type="checkbox"]')
  await expect(checks.nth(0)).toBeChecked()
  await checks.nth(1).check()
  await expect(checks.nth(1)).toBeChecked()
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('cubicost:tas:reports:progress:v3'))['pile-cap-report'].checks)).toEqual([0])
  await page.evaluate(() => window.restoreReportStorage())
  await checks.nth(2).check()
  await expect(warning).toHaveCount(0)
  await page.reload()
  for (let index = 0; index < 3; index++) await expect(checks.nth(index)).toBeChecked()
})

for (const product of ['tas', 'trb', 'tme']) {
  test(`${product}: invalid lesson shows localized fallback and returns to its course`, async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${origin}/${product}/lesson/not-a-real-lesson`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Materi tidak ditemukan')
    await page.locator('button[lang="en"]').click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lesson not found')
    await page.locator('.tutorial-step a.primary-button').click()
    await expect(page).toHaveURL(`${origin}/${product}/`)
    await expect(page.locator('.course-map-parts')).toBeVisible()
    expect(errors).toEqual([])
  })
}

for (const product of ['tas', 'trb']) {
  test(`${product}: switching language preserves assessment answers and the current question`, async ({ page }) => {
    await page.addInitScript(product => {
      localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Learner', jobTitle: 'Engineer', employeeId: '000012' }))
      localStorage.setItem(`cubicost:${product}:section-1-exercise:v3`, JSON.stringify({ started: true, submitted: false, index: 1, answers: { q1: 'A', q2: 'B' } }))
    }, product)
    await page.goto(`${origin}/${product}/tests/section-1`)
    const question = page.locator('.exercise-question h2')
    const indonesian = await question.textContent()
    await page.locator('button[lang="en"]').click()
    await expect(question).not.toHaveText(indonesian)
    await expect(page.locator('input[name="q2"][value="B"]')).toBeChecked()
    await expect(page.locator('.exercise-question-meta')).toContainText('2 / 5')
    await page.locator('button[lang="id"]').click()
    await expect(question).toHaveText(indonesian)
    await expect(page.locator('input[name="q2"][value="B"]')).toBeChecked()
  })
}
