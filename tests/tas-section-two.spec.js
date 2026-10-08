import { test, expect } from '@playwright/test'
import { getSectionExercise } from '../src/data/sectionExercises.js'

const exercise = getSectionExercise('tas', 2)
const perfect = { q1: '1', q2: '2', q3: '0', q4: '1', q5: '2', q6: '0', q7: '1', q8: '2', slabThickness: '150', openingWidth: '900', openingHeight: '2100' }

test('section 2 awards partial credit but requires correct beam and slab checks', () => {
  expect(exercise.points.reduce((sum, points) => sum + points, 0)).toBe(100)
  expect(exercise.score(perfect)).toMatchObject({ total: 100, passed: true })
  expect(exercise.score({ ...perfect, q1: '0', q2: '0' })).toMatchObject({ total: 80, passed: true })
  expect(exercise.score({ ...perfect, q3: '1' })).toMatchObject({ total: 85, criticalPassed: false, passed: false })
  expect(exercise.score({ ...perfect, slabThickness: '100' })).toMatchObject({ total: 90, criticalPassed: false, passed: false })
  expect(exercise.score({ ...perfect, q4: '0' })).toMatchObject({ total: 90, criticalPassed: false, passed: false })
  expect(exercise.score({ ...perfect, openingWidth: '2100', openingHeight: '900' }).total).toBe(90)
  expect(exercise.score({ ...perfect, openingHeight: '2.100 mm' }).total).toBe(100)
  expect(exercise.answered(3, { q4: '1' })).toBe(false)
  expect(exercise.answered(3, { q4: '1', slabThickness: '-150' })).toBe(false)
  expect(exercise.answered(6, { ...perfect, openingHeight: 'abc' })).toBe(false)
})

test('section 2 loads only current answers and requires complete dimensions for a saved submission', () => {
  const previous = globalThis.localStorage
  try {
    globalThis.localStorage = { getItem: key => key === exercise.storageKey ? JSON.stringify({ started: true, submitted: true, index: 99, answers: { ...perfect, extra: 'ignore' } }) : null }
    expect(exercise.load()).toMatchObject({ submitted: true, index: 7, answers: perfect })
    expect(exercise.load().answers.extra).toBeUndefined()
    globalThis.localStorage = { getItem: () => JSON.stringify({ started: true, submitted: true, answers: { ...perfect, slabThickness: '' } }) }
    expect(exercise.load().submitted).toBe(false)
    expect(exercise.storageKey.endsWith(':v2')).toBe(true)
  } finally { globalThis.localStorage = previous }
})

test('section 2 dimensions validate and persist on mobile in both languages', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Test User', jobTitle: 'Engineer', employeeId: '000012' })))
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('http://127.0.0.1:5173/tas/tests/section-2')
  await page.locator('.mobile-header-language').click()
  await page.getByRole('button', { name: 'Start exercise' }).click()
  await page.getByRole('button', { name: /^Question 4:/ }).click()
  await page.locator('input[name="q4"][value="1"]').check()
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByRole('alert')).toContainText('Slab thickness (mm)')
  await page.getByLabel('Slab thickness (mm)', { exact: true }).fill('-150')
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await page.getByLabel('Slab thickness (mm)', { exact: true }).fill('150 mm')
  await page.reload()
  await expect(page.getByLabel('Slab thickness (mm)', { exact: true })).toHaveValue('150 mm')
  await page.locator('.mobile-header-language').click()
  await expect(page.getByLabel('Ketebalan pelat (mm)', { exact: true })).toHaveValue('150 mm')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/tas-section-two-mobile.png', fullPage: true })
})
