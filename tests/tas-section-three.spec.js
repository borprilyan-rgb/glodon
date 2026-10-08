import { test, expect } from '@playwright/test'
import { getSectionExercise } from '../src/data/sectionExercises.js'
import { volumeAnswer } from '../src/data/tas/sectionThreeExercise.js'

const exercise = getSectionExercise('tas', 3)
const perfect = { q1: '0', q2: '1', q3: '2', q4: '0', q5: '1', q6: '2', q7: '0', q8: '1', beamVolume: '0.70', reportVolume: '23' }

test('section 3 requires correct scope, deduction investigation and report verification', () => {
  expect(exercise.score(perfect)).toMatchObject({ total: 100, passed: true })
  expect(exercise.score({})).toMatchObject({ total: 0, passed: false })
  expect(exercise.score({ ...perfect, q4: '1', q6: '0' })).toMatchObject({ total: 80, passed: true })
  for (const field of ['q1', 'q2', 'q8']) {
    expect(exercise.score({ ...perfect, [field]: '2' })).toMatchObject({ total: 85, criticalPassed: false, passed: false })
  }
  expect(exercise.score({ ...perfect, beamVolume: '0.75' }).total).toBe(90)
  expect(exercise.score({ ...perfect, reportVolume: '22.5' }).total).toBe(95)
  expect(exercise.score({ ...perfect, beamVolume: '0,70 m³', reportVolume: '23.00 m3' }).total).toBe(100)
  expect(exercise.answered(2, { q3: '2' })).toBe(false)
  for (const value of ['-0.7', '0.7 m²', '0.7 mm', 'abc', '1,000.00']) {
    expect(volumeAnswer(value)).toBeNaN()
    expect(exercise.answered(2, { q3: '2', beamVolume: value })).toBe(false)
  }
})

test('section 3 saved submissions require all eight actions and numeric answers', () => {
  const previous = globalThis.localStorage
  try {
    globalThis.localStorage = { getItem: key => key === exercise.storageKey ? JSON.stringify({ started: true, submitted: true, index: 99, answers: perfect }) : null }
    expect(exercise.load()).toMatchObject({ submitted: true, index: 7, answers: perfect })
    globalThis.localStorage = { getItem: () => JSON.stringify({ started: true, submitted: true, answers: { ...perfect, reportVolume: '' } }) }
    expect(exercise.load().submitted).toBe(false)
    globalThis.localStorage = { getItem: key => key.endsWith(':v1') ? JSON.stringify({ started: true, submitted: true, answers: perfect }) : null }
    expect(exercise.load()).toMatchObject({ started: false, submitted: false, answers: {} })
  } finally { globalThis.localStorage = previous }
})

test('section 3 volume inputs validate and persist across languages on mobile', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Test User', jobTitle: 'Engineer', employeeId: '000012' })))
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('http://127.0.0.1:5173/tas/tests/section-3')
  await page.locator('.mobile-header-language').click()
  await page.getByRole('button', { name: 'Start exercise' }).click()
  await page.getByRole('button', { name: /^Question 3:/ }).click()
  await page.locator('input[name="q3"][value="2"]').check()
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByRole('alert')).toContainText('B1 net concrete volume (m³)')
  await page.getByLabel('B1 net concrete volume (m³)', { exact: true }).fill('0.70 m²')
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByRole('alert')).toContainText('non-negative volume in m³')
  await page.getByLabel('B1 net concrete volume (m³)', { exact: true }).fill('0,70 m³')
  await page.reload()
  await expect(page.getByLabel('B1 net concrete volume (m³)', { exact: true })).toHaveValue('0,70 m³')
  await page.locator('.mobile-header-language').click()
  await expect(page.getByLabel('Volume beton bersih B1 (m³)', { exact: true })).toHaveValue('0,70 m³')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/tas-section-three-mobile.png', fullPage: true })
})
