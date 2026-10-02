import { test, expect } from '@playwright/test'
import { getSectionExercise } from '../src/data/sectionExercises.js'
import { preparationNumber } from '../src/data/trb/sectionOneExercise.js'

const exercise = getSectionExercise('trb', 1)
const perfect = { q1: '1', q2: '0', q3: '2', q4: '1', q5: '0', q6: '2', q7: '0', q8: '1', height1: '3.50', height2: '3.60', gridDistance: '6000' }

test('TRB preparation requires scope, heights, mapping and readiness despite a high total', () => {
  expect(exercise.score(perfect)).toMatchObject({ total: 100, criticalPassed: true, passed: true })
  expect(exercise.score({})).toMatchObject({ total: 0, passed: false })
  expect(exercise.score({ ...perfect, q2: '1', q3: '0' })).toMatchObject({ total: 80, passed: true })
  for (const field of ['q1', 'q4', 'q5', 'q8', 'height1', 'height2']) {
    const result = exercise.score({ ...perfect, [field]: '2' })
    expect(result.total).toBeGreaterThanOrEqual(85)
    expect(result).toMatchObject({ criticalPassed: false, passed: false })
  }
  expect(exercise.score({ ...perfect, q7: '1' }).scores[6]).toBe(5)
  expect(exercise.score({ ...perfect, gridDistance: '4000' }).scores[6]).toBe(5)
  expect(exercise.score({ ...perfect, height1: '3,50 m', height2: '3.60 m', gridDistance: '6.000 mm' }).total).toBe(100)
})

test('TRB dimensions validate their own units and require every field', () => {
  for (const value of ['6000', '6,000', '6.000', '6 000 mm']) expect(preparationNumber(value, 'gridDistance')).toBe(6000)
  for (const value of ['0', '-3.5', '3.5 mm', '3.5 m²', 'abc', 'Infinity']) expect(preparationNumber(value, 'height1')).toBeNaN()
  for (const value of ['0', '-6000', '6 m', '6000 m³', 'abc']) expect(preparationNumber(value, 'gridDistance')).toBeNaN()
  expect(exercise.answered(3, { q4: '1', height1: '3.5' })).toBe(false)
  expect(exercise.issues(3, { q4: '1', height1: '3.5', height2: 'bad' })).toEqual([{ field: 'height2', reason: 'number' }])
  expect(exercise.answered(6, { q7: '0', gridDistance: '6,000 mm' })).toBe(true)
})

test('TRB saved submissions reject incomplete answers and ignore the previous test version', () => {
  const previous = globalThis.localStorage
  try {
    globalThis.localStorage = { getItem: key => key === exercise.storageKey ? JSON.stringify({ started: true, submitted: true, index: 99, answers: { ...perfect, extra: 'ignored' } }) : null }
    expect(exercise.load()).toMatchObject({ submitted: true, index: 7, answers: perfect })
    expect(exercise.load().answers).not.toHaveProperty('extra')
    globalThis.localStorage = { getItem: () => JSON.stringify({ started: true, submitted: true, answers: { ...perfect, height2: '' } }) }
    expect(exercise.load().submitted).toBe(false)
    globalThis.localStorage = { getItem: key => key.endsWith(':v1') ? JSON.stringify({ started: true, submitted: true, answers: perfect }) : null }
    expect(exercise.load()).toMatchObject({ started: false, submitted: false, answers: {} })
    globalThis.localStorage = { getItem: () => '{bad json' }
    expect(exercise.load().started).toBe(false)
  } finally { globalThis.localStorage = previous }
})

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Test User', jobTitle: 'Engineer', employeeId: '0012' })))
})

test('TRB mobile dimensions validate and persist across languages', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('http://127.0.0.1:5173/trb/tests/section-1')
  await page.locator('.mobile-header-language').click()
  await page.getByRole('button', { name: 'Start exercise' }).click()
  await page.getByRole('button', { name: /^Question 4:/ }).click()
  await page.locator('input[name="q4"][value="1"]').check()
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByRole('alert')).toContainText('Approved Floor 2 height (m)')
  await page.getByLabel('Approved Floor 1 height (m)', { exact: true }).fill('3,50 m')
  await page.getByLabel('Approved Floor 2 height (m)', { exact: true }).fill('3.60 mm')
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByRole('alert')).toContainText('positive number in the stated unit')
  await page.getByLabel('Approved Floor 2 height (m)', { exact: true }).fill('3,60 m')
  await page.reload()
  await expect(page.getByLabel('Approved Floor 2 height (m)', { exact: true })).toHaveValue('3,60 m')
  await page.locator('.mobile-header-language').click()
  await expect(page.getByLabel('Tinggi Lantai 1 yang disetujui (m)', { exact: true })).toHaveValue('3,50 m')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/trb-section-one-mobile.png', fullPage: true })
})

test('TRB old answers reset; current scores export and survive retry', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/trb/tests')
  await page.evaluate(() => {
    const old = { started: true, submitted: true, answers: { q1: '1', q2: '0', q3: '2', q4: '1', q5: '0' } }
    localStorage.setItem('cubicost:trb:section-1-exercise:v1', JSON.stringify(old))
    localStorage.setItem('cubicost:trb:section-1-exercise:v1:result', JSON.stringify({ answers: old.answers }))
  })
  await page.reload()
  await expect(page.locator('.course-scores__pending')).toHaveCount(3)
  await page.goto('http://127.0.0.1:5173/trb/tests/section-1')
  await page.locator('button[lang="en"]').click()
  await page.getByRole('button', { name: 'Start exercise' }).click()
  await expect(page.locator('input:checked')).toHaveCount(0)
  for (let index = 0; index < 8; index++) {
    if (index === 3) {
      await page.getByLabel('Approved Floor 1 height (m)', { exact: true }).fill('3.50')
      await page.getByLabel('Approved Floor 2 height (m)', { exact: true }).fill('3.60')
    }
    if (index === 6) await page.getByLabel('A–B reference distance (mm)', { exact: true }).fill('6,000 mm')
    await page.locator(`input[name="q${index + 1}"][value="${perfect[`q${index + 1}`]}"]`).check()
    await page.getByRole('button', { name: index === 7 ? 'Submit answers' : 'Next question' }).click()
  }
  await page.getByRole('link', { name: 'View exercise scores' }).click()
  await expect(page.locator('.course-scores__row strong')).toHaveText(['100/100', '0/100', '0/100'])
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download score card' }).click()
  const download = await downloadEvent
  expect(download.suggestedFilename()).toBe('cubicost-trb-Test-User.png')
  await download.saveAs('test-results/trb-section-one-score.png')
  expect(await download.failure()).toBeNull()
  await page.getByRole('button', { name: 'Retry exercise' }).click()
  await expect(page.getByText('Question 1 / 8', { exact: true })).toBeVisible()
  await expect(page.locator('input:checked')).toHaveCount(0)
  await page.goto('http://127.0.0.1:5173/trb/tests')
  await page.reload()
  await expect(page.locator('.course-scores__row strong')).toHaveText(['100/100', '0/100', '0/100'])
})
