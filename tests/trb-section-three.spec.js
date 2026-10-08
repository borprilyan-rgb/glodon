import { test, expect } from '@playwright/test'
import { getSectionExercise } from '../src/data/sectionExercises.js'
import { rebarQuantityNumber } from '../src/data/trb/sectionThreeExercise.js'

const exercise = getSectionExercise('trb', 3)
const perfect = { q1: '1', q2: '0', q3: '2', q4: '1', q5: '0', q6: '2', q7: '0', q8: '1', barLength: '24', barWeight: '59.28', reportWeight: '2.50' }

test('TRB section 3 requires scope, investigation, recalculation and final verification', () => {
  expect(exercise.score(perfect)).toMatchObject({ total: 100, passed: true })
  expect(exercise.score({})).toMatchObject({ total: 0, passed: false })
  expect(exercise.score({ ...perfect, q5: '1', q6: '0', q7: '1' })).toMatchObject({ total: 80, passed: true })
  for (const field of ['q1', 'q2', 'q4', 'q8']) {
    expect(exercise.score({ ...perfect, [field]: '2' })).toMatchObject({ total: 85, criticalPassed: false, passed: false })
  }
  expect(exercise.score({ ...perfect, q3: '0' }).scores[2]).toBe(10)
  expect(exercise.score({ ...perfect, barWeight: '60' }).scores[2]).toBe(10)
  expect(exercise.score({ ...perfect, barLength: '25', barWeight: '60' }).scores[2]).toBe(5)
  expect(exercise.score({ ...perfect, reportWeight: '2500' }).scores[4]).toBe(5)
  expect(exercise.score({ ...perfect, barLength: '24 m', barWeight: '59,28 kg', reportWeight: '2,50 t' }).total).toBe(100)
})

test('TRB quantity inputs accept decimal commas and enforce length, kg and tonne units', () => {
  expect(rebarQuantityNumber('24.00 m', 'barLength')).toBe(24)
  expect(rebarQuantityNumber('59,28 kg', 'barWeight')).toBe(59.28)
  expect(rebarQuantityNumber('2.50 t', 'reportWeight')).toBe(2.5)
  for (const [field, values] of Object.entries({ barLength: ['-24', '24 mm', '24 m²'], barWeight: ['59.28 t', '59.28 kg/m', '59 kg extra'], reportWeight: ['2500 kg', '2.5 m', '1,000.00', '2e3'] })) {
    for (const value of [...values, '', 'abc', 'Infinity']) expect(rebarQuantityNumber(value, field)).toBeNaN()
  }
  expect(exercise.answered(2, { q3: '2', barLength: '24' })).toBe(false)
  expect(exercise.issues(2, { q3: '2', barLength: '24', barWeight: '59.28 t' })).toEqual([{ field: 'barWeight', reason: 'number' }])
  expect(exercise.answered(4, { q5: '0', reportWeight: '2,50 t' })).toBe(true)
})

test('TRB section 3 restores complete submissions and ignores the old test version', () => {
  const previous = globalThis.localStorage
  try {
    globalThis.localStorage = { getItem: key => key === exercise.storageKey ? JSON.stringify({ started: true, submitted: true, index: 99, answers: { ...perfect, extra: 'ignore' } }) : null }
    expect(exercise.load()).toMatchObject({ submitted: true, index: 7, answers: perfect })
    expect(exercise.load().answers).not.toHaveProperty('extra')
    globalThis.localStorage = { getItem: () => JSON.stringify({ started: true, submitted: true, answers: { ...perfect, barWeight: '' } }) }
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

test('TRB section 3 mobile quantities validate and persist across languages', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('http://127.0.0.1:5173/trb/tests/section-3')
  await page.locator('.mobile-header-language').click()
  await page.getByRole('button', { name: 'Start exercise' }).click()
  await page.getByRole('button', { name: /^Question 3:/ }).click()
  await page.locator('input[name="q3"][value="2"]').check()
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByRole('alert')).toContainText('B1 sample reinforcement weight (kg)')
  await page.getByLabel('B1 sample total bar length (m)', { exact: true }).fill('24 m')
  await page.getByLabel('B1 sample reinforcement weight (kg)', { exact: true }).fill('59.28 t')
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByRole('alert')).toContainText('requested unit')
  await page.getByLabel('B1 sample reinforcement weight (kg)', { exact: true }).fill('59,28 kg')
  await page.reload()
  await expect(page.getByLabel('B1 sample reinforcement weight (kg)', { exact: true })).toHaveValue('59,28 kg')
  await page.locator('.mobile-header-language').click()
  await expect(page.getByLabel('Berat tulangan sampel B1 (kg)', { exact: true })).toHaveValue('59,28 kg')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/trb-section-three-mobile.png', fullPage: true })
})

test('TRB section 3 old scores reset and current scores export and survive retry', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/trb/tests')
  await page.evaluate(() => {
    const answers = { q1: '1', q2: '0', q3: '2', q4: '1', q5: '0' }
    localStorage.setItem('cubicost:trb:section-3-exercise:v1', JSON.stringify({ started: true, submitted: true, answers }))
    localStorage.setItem('cubicost:trb:section-3-exercise:v1:result', JSON.stringify({ answers }))
  })
  await page.reload()
  await expect(page.locator('.course-scores__pending')).toHaveCount(3)
  await page.goto('http://127.0.0.1:5173/trb/tests/section-3')
  await page.locator('button[lang="en"]').click()
  await page.getByRole('button', { name: 'Start exercise' }).click()
  await expect(page.locator('input:checked')).toHaveCount(0)
  for (let index = 0; index < 8; index++) {
    for (const field of exercise.copy.en.questions[index].fields) await page.getByLabel(field.label, { exact: true }).fill(perfect[field.name])
    await page.locator(`input[name="q${index + 1}"][value="${perfect[`q${index + 1}`]}"]`).check()
    await page.getByRole('button', { name: index === 7 ? 'Submit answers' : 'Next question' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Section 3 passed', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'View exercise scores' }).click()
  await expect(page.locator('.course-scores__row strong')).toHaveText(['0/100', '0/100', '100/100'])
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download score card' }).click()
  const download = await downloadEvent
  expect(download.suggestedFilename()).toBe('cubicost-trb-Test-User.png')
  await download.saveAs('test-results/trb-section-three-score.png')
  expect(await download.failure()).toBeNull()
  await page.getByRole('button', { name: 'Retry exercise' }).click()
  await expect(page.getByText('Question 1 / 8', { exact: true })).toBeVisible()
  await expect(page.locator('input:checked')).toHaveCount(0)
  await page.goto('http://127.0.0.1:5173/trb/tests')
  await page.reload()
  await expect(page.locator('.course-scores__row strong')).toHaveText(['0/100', '0/100', '100/100'])
})
