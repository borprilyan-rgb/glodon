import { test, expect } from '@playwright/test'

const origin = 'http://127.0.0.1:5173'

test('night mode toggles and persists across normal pages and presenter view', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en'))
  await page.goto(origin)
  const root = page.locator('html')
  await expect(root).toHaveAttribute('data-theme', 'light')
  await page.getByRole('button', { name: 'Night mode', exact: true }).click()
  await expect(root).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('button', { name: 'Night mode', exact: true })).toHaveAttribute('aria-pressed', 'true')
  expect(await page.evaluate(() => localStorage.getItem('cubicost:theme'))).toBe('dark')
  for (const route of ['/exercises', '/present']) {
    await page.goto(`${origin}${route}`)
    await expect(root).toHaveAttribute('data-theme', 'dark')
    await expect(page.getByRole('button', { name: 'Night mode', exact: true })).toHaveAttribute('aria-pressed', 'true')
  }
  await expect(page.locator('.presentation-brand')).toHaveCSS('color', 'rgb(232, 239, 250)')
  await expect(page.locator('.presentation-brand')).toHaveAttribute('href', '/')
  await page.getByRole('button', { name: 'Night mode', exact: true }).click()
  await expect(root).toHaveAttribute('data-theme', 'light')
  await page.goto(`${origin}/tas/`)
  await expect(root).toHaveAttribute('data-theme', 'light')
  await expect(page.getByRole('button', { name: 'Night mode', exact: true })).toHaveAttribute('aria-pressed', 'false')
})

test('dark surfaces cover courses, lessons, exercises, scores, contact and presentation without altering screenshots', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    localStorage.setItem('cubicost:theme', 'dark')
    localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en')
    localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Learner', jobTitle: 'Engineer', employeeId: '000012' }))
  })
  const routes = [
    ['/', '.hub-course-card'],
    ['/tas/', '.course-part'], ['/trb/', '.course-part'], ['/tme/', '.course-part'],
    ['/exercises', '.exercise-hub__card'], ['/exercises/score', '.course-scores'], ['/contact', '.contact-card'],
    ['/tas/lesson/axis-grid', '.action-viewer__list'], ['/trb/lesson/export-tas-model', '.action-viewer__list'], ['/tme/lesson/measurement-settings', '.action-viewer__list'],
    ['/tas/tests/section-1', '.exercise-card'], ['/present', '.presentation-outline'],
  ]
  for (const [route, selector] of routes) {
    await page.goto(`${origin}${route}`)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.locator(selector).first()).toHaveCSS('background-color', 'rgb(23, 36, 57)')
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(14, 23, 38)')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.goto(`${origin}/present?product=tas&lesson=axis-grid&slide=0`)
  const image = page.locator('.presentation-image img')
  await expect(image).toBeVisible()
  const source = await image.getAttribute('src')
  await expect(image).toHaveCSS('filter', 'none')
  await page.getByRole('button', { name: 'Night mode', exact: true }).click()
  await expect(image).toHaveAttribute('src', source)
  await expect(image).toHaveCSS('filter', 'none')
  expect(errors).toEqual([])
})

test('mobile night mode remains accessible without horizontal overflow', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cubicost:theme', 'dark')
    localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en')
  })
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/', '/tas/', '/exercises', '/present']) {
      await page.goto(`${origin}${route}`)
      const toggle = page.getByRole('button', { name: 'Night mode', exact: true })
      await expect(toggle).toBeVisible()
      await toggle.click()
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
      await toggle.click()
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
  }
  await page.screenshot({ path: 'test-results/night-presenter-mobile.png', fullPage: true })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(origin)
  await page.screenshot({ path: 'test-results/night-home-desktop.png', fullPage: true })
})

test('theme remains usable when preference storage is blocked', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError') } }))
  await page.goto(origin)
  await page.getByRole('button', { name: 'Mode malam', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Mode malam', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  expect(errors).toEqual([])
})

test('switching themes preserves the current assessment answers and question', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en')
    localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Learner', jobTitle: 'Engineer', employeeId: '000012' }))
    localStorage.setItem('cubicost:tas:section-1-exercise:v3', JSON.stringify({ started: true, submitted: false, index: 1, answers: { q1: 'A', q2: 'B' } }))
  })
  await page.goto(`${origin}/tas/tests/section-1`)
  const before = await page.evaluate(() => localStorage.getItem('cubicost:tas:section-1-exercise:v3'))
  await page.getByRole('button', { name: 'Night mode', exact: true }).click()
  await expect(page.locator('input[name="q2"][value="B"]')).toBeChecked()
  await expect(page.locator('.exercise-question-meta')).toContainText('2 / 5')
  expect(await page.evaluate(() => localStorage.getItem('cubicost:tas:section-1-exercise:v3'))).toBe(before)
})
