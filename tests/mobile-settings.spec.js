import { test, expect } from '@playwright/test'

const origin = 'http://127.0.0.1:5173'

test('mobile language and night mode controls live in Settings and remain persisted', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${origin}/tas/`)
  const mobileHeader = page.locator('.mobile-header-row')
  await expect(mobileHeader.locator('.theme-toggle, .language-switcher, button[lang]')).toHaveCount(0)
  await page.locator('.mobile-bottom-nav a[href="/settings"]').click()
  await expect(page.getByRole('heading', { name: 'Pengaturan', exact: true })).toBeVisible()
  await expect(page.getByRole('group', { name: 'Bahasa' })).toBeVisible()
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Night mode', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await page.goto(`${origin}/tas/lesson/axis-grid`)
  await expect(page.locator('.mobile-bottom-nav')).toHaveCount(0)
  await expect(mobileHeader.locator('.theme-toggle, .language-switcher, button[lang]')).toHaveCount(0)
})

test('desktop language and theme controls remain in the header', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(`${origin}/tas/`)
  await expect(page.locator('.lesson-topbar__tools .language-switcher')).toBeVisible()
  await expect(page.locator('.lesson-topbar__tools .theme-toggle')).toBeVisible()
})
