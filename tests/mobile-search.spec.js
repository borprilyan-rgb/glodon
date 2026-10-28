import { test, expect } from '@playwright/test'

const origin = 'http://127.0.0.1:5173'

for (const language of ['en', 'id']) {
  test(`${language}: mobile icon navigation and cross-course search`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: language === 'id' ? 320 : 390, height: 844 })
    await page.addInitScript(({ language }) => {
      localStorage.setItem('cubicost-tas-tutorial-language-v1', language)
      localStorage.setItem('cubicost:theme', language === 'id' ? 'dark' : 'light')
    }, { language })
    await page.goto(origin)
    const nav = page.getByRole('navigation', { name: language === 'en' ? 'Primary navigation' : 'Navigasi utama' })
    const labels = language === 'en' ? ['Course', 'Assessment', 'Scores', 'Search', 'Settings'] : ['Kursus', 'Latihan', 'Nilai', 'Cari', 'Pengaturan']
    await expect(nav.getByRole('link')).toHaveCount(5)
    for (const label of labels) await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible()
    await expect(nav).toHaveText('')
    const widths = await nav.getByRole('link').evaluateAll(links => links.map(link => link.getBoundingClientRect().width))
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1)
    await nav.getByRole('link', { name: labels[3], exact: true }).click()
    await expect(page).toHaveURL(origin + '/search')
    const input = page.getByRole('searchbox')
    await expect(input).toBeFocused()
    await expect(nav.getByRole('link', { name: labels[3], exact: true })).toHaveAttribute('aria-current', 'page')
    const popular = page.locator('.mobile-search-results a')
    await expect(page.getByRole('heading', { name: language === 'en' ? 'Popular topics' : 'Topik populer' })).toBeVisible()
    await expect(popular).toHaveCount(6)
    await expect(page.locator('.mobile-search-results a[href^="/tas/lesson/"]').first()).toBeVisible()
    await expect(page.locator('.mobile-search-results a[href^="/trb/lesson/"]').first()).toBeVisible()
    await expect(page.locator('.mobile-search-results a[href^="/tme/lesson/"]').first()).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('mobile-search.png'), fullPage: true })

    // These queries cover titles, introductions, action titles, and action descriptions.
    const cases = language === 'en'
      ? [
          ['measurement settings', '/tas/lesson/measurement-settings'],
          ['trace deductions', '/tas/lesson/measurement-rules'],
          ['beam-end relationships', '/trb/lesson/beam-support-layout'],
          ['plumbing sanitary', '/tme/lesson/measurement-settings'],
        ]
      : [
          ['measurement settings', '/tas/lesson/measurement-settings'],
          ['titik tumpuan', '/trb/lesson/beam-support-layout'],
          ['duct', '/tme/lesson/mvac-duct'],
        ]
    for (const [query, href] of cases) {
      await input.fill(query)
      await expect(page.locator(`.mobile-search-results a[href="${href}"]`)).toBeVisible()
    }
    await input.fill('zzzz-no-matching-lesson')
    await expect(page.getByRole('status')).toContainText(language === 'en' ? 'No results' : 'Materi tidak ditemukan')
    await page.getByRole('button', { name: language === 'en' ? 'Clear search' : 'Hapus pencarian' }).click()
    await expect(input).toHaveValue('')
    await expect(input).toBeFocused()
    await expect(popular).toHaveCount(6)
    const target = await popular.first().getAttribute('href')
    const title = await popular.first().locator('strong').innerText()
    await popular.first().click()
    await expect(page).toHaveURL(origin + target)
    await expect(page.locator('.step-header h1')).toHaveText(title)
    await expect(nav.getByRole('link', { name: labels[0], exact: true })).toHaveAttribute('aria-current', 'page')
    await expect(nav).toBeVisible()
  })
}

test('Search remains mobile-only and resizing restores the desktop hub', async ({ page }) => {
  await page.setViewportSize({ width: 767, height: 844 })
  await page.goto(origin + '/search')
  await expect(page.getByRole('searchbox')).toBeVisible()
  await page.setViewportSize({ width: 1024, height: 900 })
  await expect(page.locator('.mobile-bottom-nav')).toBeHidden()
  await expect(page.locator('.mobile-search-page')).toHaveCount(0)
  await expect(page.locator('.course-hub')).toBeVisible()
  await page.reload()
  await expect(page.locator('.course-hub')).toBeVisible()
  await expect(page.locator('.mobile-bottom-nav')).toBeHidden()
})
