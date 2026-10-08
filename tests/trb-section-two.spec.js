import { test, expect } from '@playwright/test'
import { getSectionExercise } from '../src/data/sectionExercises.js'
import { reinforcementNumber } from '../src/data/trb/sectionTwoExercise.js'

const exercise = getSectionExercise('trb', 2)
const perfect = { q1: '2', q2: '0', q3: '1', q4: '2', q5: '0', q6: '1', q7: '2', q8: '0', columnCount: '8', columnDiameter: '20', tieSpacing: '150', slabSpacing: '150', supportLength: '1200' }

test('TRB section 2 requires data checks, column values, synchronisation and wall checks', () => {
  expect(exercise.score(perfect)).toMatchObject({ total: 100, passed: true })
  expect(exercise.score({})).toMatchObject({ total: 0, passed: false })
  expect(exercise.score({ ...perfect, q3: '0', q5: '1' })).toMatchObject({ total: 80, passed: true })
  for (const [field, value] of Object.entries({ q1: '0', q2: '1', q4: '0', q8: '1', columnCount: '6', columnDiameter: '16', tieSpacing: '100' })) {
    const result = exercise.score({ ...perfect, [field]: value })
    expect(result.total).toBeGreaterThanOrEqual(85)
    expect(result).toMatchObject({ criticalPassed: false, passed: false })
  }
  expect(exercise.score({ ...perfect, q2: '1' }).scores[1]).toBe(9)
  expect(exercise.score({ ...perfect, q6: '0' }).scores[5]).toBe(5)
  expect(exercise.score({ ...perfect, slabSpacing: '100' }).scores[5]).toBe(5)
  expect(exercise.score({ ...perfect, supportLength: '1.200 mm', columnDiameter: '20 mm' }).total).toBe(100)
})

test('TRB section 2 accepts mm formats but rejects fractional counts and wrong units', () => {
  for (const value of ['1200', '1,200', '1.200', '1 200 mm']) expect(reinforcementNumber(value, 'supportLength')).toBe(1200)
  for (const value of ['0', '-8', '8 mm', '8.5', '8,5', 'eight']) expect(reinforcementNumber(value, 'columnCount')).toBeNaN()
  for (const value of ['0', '-150', '150.5', '150 m', '150 m²', 'abc', 'Infinity']) expect(reinforcementNumber(value, 'slabSpacing')).toBeNaN()
  expect(exercise.answered(1, { q2: '0', columnCount: '8', columnDiameter: '20' })).toBe(false)
  expect(exercise.issues(1, { q2: '0', columnCount: '8.5', columnDiameter: '20', tieSpacing: '150' })).toEqual([{ field: 'columnCount', reason: 'number' }])
  expect(exercise.answered(6, { q7: '2', supportLength: '1,200 mm' })).toBe(true)
})

test('TRB section 2 restores complete current answers and ignores old submissions', () => {
  const previous = globalThis.localStorage
  try {
    globalThis.localStorage = { getItem: key => key === exercise.storageKey ? JSON.stringify({ started: true, submitted: true, index: 99, answers: { ...perfect, extra: 'ignore' } }) : null }
    expect(exercise.load()).toMatchObject({ submitted: true, index: 7, answers: perfect })
    expect(exercise.load().answers).not.toHaveProperty('extra')
    globalThis.localStorage = { getItem: () => JSON.stringify({ started: true, submitted: true, answers: { ...perfect, tieSpacing: '' } }) }
    expect(exercise.load().submitted).toBe(false)
    globalThis.localStorage = { getItem: key => key.endsWith(':v1') ? JSON.stringify({ started: true, submitted: true, answers: perfect }) : null }
    expect(exercise.load()).toMatchObject({ started: false, submitted: false, answers: {} })
    globalThis.localStorage = { getItem: () => '{bad json' }
    expect(exercise.load().started).toBe(false)
  } finally { globalThis.localStorage = previous }
})

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Test User', jobTitle: 'Engineer', employeeId: '000012' })))
})

test('TRB section 2 mobile inputs validate, restore and switch languages', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('http://127.0.0.1:5173/trb/tests/section-2')
  await page.locator('.mobile-header-language').click()
  await page.getByRole('button', { name: 'Start exercise' }).click()
  await page.getByRole('button', { name: /^Question 2:/ }).click()
  await page.locator('input[name="q2"][value="0"]').check()
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByRole('alert')).toContainText('C1 Floor 1 longitudinal bar count')
  await page.getByLabel('C1 Floor 1 longitudinal bar count', { exact: true }).fill('8.5')
  await page.getByLabel('C1 Floor 1 longitudinal bar diameter (mm)', { exact: true }).fill('20 mm')
  await page.getByLabel('C1 Floor 1 tie spacing (mm)', { exact: true }).fill('150 mm')
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByRole('alert')).toContainText('positive whole number')
  await page.getByLabel('C1 Floor 1 longitudinal bar count', { exact: true }).fill('8')
  await page.reload()
  await expect(page.getByLabel('C1 Floor 1 tie spacing (mm)', { exact: true })).toHaveValue('150 mm')
  await page.locator('.mobile-header-language').click()
  await expect(page.getByLabel('Jumlah batang utama C1 Lantai 1', { exact: true })).toHaveValue('8')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/trb-section-two-mobile.png', fullPage: true })
})

test('TRB section 2 resets old scores, links combined lessons, exports and retains results after retry', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/trb/tests')
  await page.evaluate(() => {
    const answers = Object.fromEntries([2, 0, 1, 2, 0, 1, 2, 0, 1, 2].map((value, index) => [`q${index + 1}`, String(value)]))
    localStorage.setItem('cubicost:trb:section-2-exercise:v1', JSON.stringify({ started: true, submitted: true, answers }))
    localStorage.setItem('cubicost:trb:section-2-exercise:v1:result', JSON.stringify({ answers }))
  })
  await page.reload()
  await expect(page.locator('.course-scores__pending')).toHaveCount(3)
  await page.goto('http://127.0.0.1:5173/trb/tests/section-2')
  await page.locator('button[lang="en"]').click()
  await page.getByRole('button', { name: 'Start exercise' }).click()
  await expect(page.locator('input:checked')).toHaveCount(0)
  for (let index = 0; index < 8; index++) {
    for (const field of exercise.copy.en.questions[index].fields) await page.getByLabel(field.label, { exact: true }).fill(perfect[field.name])
    await page.locator(`input[name="q${index + 1}"][value="${perfect[`q${index + 1}`]}"]`).check()
    await page.getByRole('button', { name: index === 7 ? 'Submit answers' : 'Next question' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Section 2 passed', exact: true })).toBeVisible()
  for (const lesson of ['pile-cap-data-check', 'column-schedule']) await expect(page.locator(`.exercise-results a[href="/trb/lesson/${lesson}"]`)).toBeVisible()
  await page.getByRole('link', { name: 'View exercise scores' }).click()
  await expect(page.locator('.course-scores__row strong')).toHaveText(['0/100', '100/100', '0/100'])
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download score card' }).click()
  const download = await downloadEvent
  expect(download.suggestedFilename()).toBe('cubicost-trb-Test-User.png')
  await download.saveAs('test-results/trb-section-two-score.png')
  expect(await download.failure()).toBeNull()
  await page.getByRole('button', { name: 'Retry exercise' }).click()
  await expect(page.getByText('Question 1 / 8', { exact: true })).toBeVisible()
  await expect(page.locator('input:checked')).toHaveCount(0)
  await page.goto('http://127.0.0.1:5173/trb/tests')
  await page.reload()
  await expect(page.locator('.course-scores__row strong')).toHaveText(['0/100', '100/100', '0/100'])
})
