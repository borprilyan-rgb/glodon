import { test, expect } from '@playwright/test'
import { scoreExercise, questionAnswered, numberAnswer } from '../src/data/tas/sectionOneExercise.js'

const perfect = { settings: 'review', rules: 'inspect', projectName: 'ASG Training', ground: '-0.5', ruleSet: 'SMPI', attributes: 'private', height1: '3.5', height2: '3,50', grade: 'K-300', copy: 'yes', drawing: 'split', length: '6000', verify: 'independent', grid: 'A/1', alignmentCheck: 'other' }

test('scoring requires both the threshold and correct scale and alignment', () => {
  expect(scoreExercise(perfect)).toMatchObject({ total: 100, passed: true })
  expect(scoreExercise({ ...perfect, attributes: 'public', drawing: 'same' })).toMatchObject({ total: 80, passed: true })
  expect(scoreExercise({ ...perfect, length: '3000' })).toMatchObject({ total: 90, passed: false })
  expect(scoreExercise({ ...perfect, grid: 'B/1' })).toMatchObject({ total: 95, passed: false })
  expect(scoreExercise({}).total).toBe(0)
  for (const length of ['6000', '6,000', '6.000', '6 000 mm']) {
    expect(scoreExercise({ ...perfect, length }).total).toBe(100)
  }
  expect(numberAnswer('3,5 m', 'height1')).toBe(3.5)
  expect(numberAnswer('3.5 mm', 'height1')).toBeNaN()
  expect(questionAnswered(2, { ...perfect, ground: '' })).toBeFalsy()
})

test('exercise validates, resumes, scores and retries on mobile', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/tas/exercise/section-1')
  await page.locator('button[lang="en"]').click()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Start exercise' }).click()
  const next = () => page.getByRole('button', { name: 'Next question' }).click()
  const choose = (field, value) => page.locator(`input[name="${field}"][value="${value}"]`).check()
  await next()
  await expect(page.getByRole('alert')).toBeVisible()
  await choose('settings', 'review')
  await next()
  await page.reload()
  await expect(page.getByText('Question 2 / 8')).toBeVisible()
  await choose('rules', 'inspect')
  await next()
  await page.getByRole('textbox', { name: 'Project name' }).fill('ASG Training')
  await page.getByRole('textbox', { name: 'Ground elevation (m)' }).fill('-0.5m')
  await page.getByLabel('Measurement rules', { exact: true }).selectOption('SMPI')
  await next()
  await choose('attributes', 'private')
  await next()
  await page.getByLabel('Floor 1 height (m)').fill('3.5')
  await page.getByLabel('Floor 2 height (m)').fill('3,50')
  await page.getByLabel('Concrete grade for both floors').selectOption('K-300')
  await choose('copy', 'yes')
  await next()
  await choose('drawing', 'split')
  await next()
  await page.getByLabel('Actual length to enter (mm)').fill('6000')
  await choose('verify', 'independent')
  await next()
  await page.getByRole('button', { name: 'A/1', exact: true }).click()
  await choose('alignmentCheck', 'other')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/exercise-mobile.png', fullPage: true })
  await page.getByRole('button', { name: 'Submit answers' }).click()
  await expect(page.getByRole('heading', { name: 'Section 1 passed' })).toBeVisible()
  await expect(page.locator('.exercise-score')).toHaveText('100/100')
  await expect(page.locator('.exercise-results a')).toHaveCount(8)
  await page.reload()
  await expect(page.locator('.exercise-score')).toHaveText('100/100')
  await page.locator('.mobile-header-language').click()
  await expect(page.getByRole('heading', { name: 'Lulus Bagian 1' })).toBeVisible()
  await page.getByRole('button', { name: 'Coba lagi' }).click()
  await expect(page.getByText('Pertanyaan 1 / 8')).toBeVisible()
  await expect(page.locator('input:checked')).toHaveCount(0)
})

test('course map and final lesson link to the exercise', async ({ page }) => {
  for (const path of ['/tas/course', '/tas/lesson/axis-grid']) {
    await page.goto(`http://127.0.0.1:5173${path}`)
    await expect(page.locator('.exercise-entry a[href="/tas/exercise/section-1"]')).toHaveCount(1)
  }
  await page.goto('http://127.0.0.1:5173/tas/exercise/section-1')
  await page.screenshot({ path: 'test-results/exercise-desktop.png', fullPage: true })
})


test('number navigation preserves answers and identifies missing fields at submission', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/tas/exercise/section-1')
  await page.locator('button[lang="en"]').click()
  await page.getByRole('button', { name: 'Start exercise' }).click()
  const jump = (number) => page.getByRole('navigation', { name: 'Question navigation' }).getByRole('button', { name: new RegExp(`^Question ${number}:`) }).click()
  await jump(3)
  await page.getByRole('textbox', { name: 'Project name' }).fill('ASG Training')
  await page.getByRole('textbox', { name: 'Ground elevation (m)' }).fill('zero')
  await page.getByRole('button', { name: 'Next question' }).click()
  await expect(page.getByRole('alert')).toContainText('Ground elevation (m): Enter a number')
  await expect(page.getByRole('alert')).toContainText('Measurement rules: An answer is still needed')
  await page.getByRole('textbox', { name: 'Ground elevation (m)' }).fill('-0,5 m')
  await page.getByLabel('Measurement rules', { exact: true }).selectOption('SMPI')
  await jump(8)
  await page.getByRole('button', { name: 'A/1', exact: true }).click()
  await page.locator('input[name="alignmentCheck"][value="other"]').check()
  await page.getByRole('button', { name: 'Submit answers' }).click()
  await expect(page.getByText('Question 1 / 8')).toBeVisible()
  await expect(page.getByRole('alert')).toContainText('Select an answer: An answer is still needed')
  await jump(3)
  await expect(page.getByRole('textbox', { name: 'Ground elevation (m)' })).toHaveValue('-0,5 m')
  await expect(page.getByRole('navigation').getByRole('button', { name: /^Question 3:/ })).toHaveAttribute('aria-current', 'step')
})


test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('cubicost:participant')) localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Test User', jobTitle: 'Engineer', employeeId: '0012' }))
  })
})
