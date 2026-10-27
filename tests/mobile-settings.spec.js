import { test, expect } from '@playwright/test'

const origin = 'http://127.0.0.1:5173'

test('mobile language and night mode controls live in Settings and remain persisted', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${origin}/tas/`)
  const mobileHeader = page.locator('.mobile-header-row')
  await expect(mobileHeader.locator('.theme-toggle, .language-switcher, button[lang]')).toHaveCount(0)
  await page.locator('.mobile-bottom-nav a[href="/settings"]').click()
  await expect(page.locator('.settings-page__header')).toHaveCount(0)
  await expect(page.locator('.settings-page__card p')).toHaveCount(0)
  await page.getByRole('button', { name: 'Bahasa: ID' }).click()
  await expect(page.getByRole('radiogroup', { name: 'Bahasa' })).toBeVisible()
  await page.getByRole('radio', { name: 'English', exact: true }).check()
  await page.getByRole('button', { name: 'Back to Settings' }).click()
  await expect(page.getByRole('button', { name: 'Language: EN' })).toBeVisible()
  await page.getByRole('button', { name: 'Appearance: Light Mode' }).click()
  await page.getByRole('radio', { name: 'Night Mode', exact: true }).check()
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
  await page.goto(`${origin}/settings`)
  await expect(page.locator('.settings-page__card--mobile-only')).toBeHidden()
})

test('mobile Settings enters and exits fullscreen for the whole app', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${origin}/settings`)
  const fullscreen = page.getByRole('button', { name: 'Mode Layar Penuh: Nonaktif. Masuk ke Layar Penuh' })
  await expect(fullscreen).toBeVisible()
  await expect(page.getByText('Fitur ini mungkin tidak didukung di semua perangkat.')).toBeVisible()
  await fullscreen.click()
  await expect.poll(() => page.evaluate(() => document.fullscreenElement?.classList.contains('app-shell') || false)).toBe(true)
  const exit = page.getByRole('button', { name: 'Mode Layar Penuh: Aktif. Keluar dari Layar Penuh' })
  await expect(exit).toBeVisible()
  await exit.click()
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(false)

  await page.goto(`${origin}/tas/lesson/axis-grid`)
  await expect(page.locator('.mobile-fullscreen-toggle')).toHaveCount(0)
})
