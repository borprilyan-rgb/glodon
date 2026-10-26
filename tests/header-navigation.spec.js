import { test, expect } from '@playwright/test'

test('Contact Us is a footer text link across desktop and mobile pages', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/', '/tas/', '/trb/', '/tme/', '/exercises', '/exercises/score', '/tas/tests/section-1', '/contact', '/present', '/present?product=tas&lesson=axis-grid&slide=0']) {
      await page.goto(`http://127.0.0.1:5173${route}`)
      const contact = page.locator('a[href="/contact"]')
      await expect(contact).toHaveCount(1)
      await expect(page.locator('.site-footer').getByRole('link', { name: 'Contact Us', exact: true })).toHaveAttribute('href', '/contact')
      await contact.scrollIntoViewIfNeeded()
      await expect(contact).toBeVisible()
      await expect(contact).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    }
  }
  await page.locator('.site-footer a').click()
  await expect(page).toHaveURL('http://127.0.0.1:5173/contact')
})

test('new visitors start in Indonesian and an explicit English choice survives navigation', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'id')
  await expect(page.getByRole('button', { name: 'Bahasa Indonesia', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await page.goto('http://127.0.0.1:5173/present')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('lesson header keeps Learning Map and moves Contact Us to the footer; brand still returns home', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/tas/lesson/pile-cap-report')
  const tools = page.locator('.lesson-topbar__tools')
  await expect(tools.locator('a')).toHaveCount(1)
  await expect(page.locator('header a[href="/contact"]')).toHaveCount(0)
  await expect(page.locator('.site-footer').getByRole('link', { name: 'Contact Us', exact: true })).toHaveAttribute('href', '/contact')
  await expect(tools.locator('a[href="/tas/"]')).toBeVisible()
  await tools.locator('a[href="/tas/"]').click()
  await expect(page).toHaveURL('http://127.0.0.1:5173/tas/')
  await expect(tools.locator('a')).toHaveCount(2)
  await expect(tools.locator('a[href="/exercises"]')).toBeVisible()
  await expect(tools.locator('a[href="/"]')).toBeVisible()
  await page.locator('.lesson-topbar > .lesson-brand').click()
  await expect(page).toHaveURL('http://127.0.0.1:5173/')
})

test('mobile menu keeps other destinations and keyboard dismissal returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('http://127.0.0.1:5173/tas/lesson/pile-cap-report')
  const menu = page.locator('.mobile-header-row button[aria-expanded]')
  await menu.click()
  const drawer = page.getByRole('dialog')
  await expect(drawer.locator('a[href="/contact"]')).toHaveCount(0)
  for (const path of ['/', '/present', '/exercises']) await expect(drawer.locator(`nav a[href="${path}"]`)).toBeVisible()
  await expect(drawer.getByRole('link', { name: 'Peta Belajar', exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(menu).toBeFocused()
  await menu.click()
  await drawer.getByRole('link', { name: 'Peta Belajar', exact: true }).click()
  await expect(page).toHaveURL('http://127.0.0.1:5173/tas/')
})
