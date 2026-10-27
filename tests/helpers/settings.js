export async function changeLanguageFromSettings(page, language) {
  const returnTo = page.url()
  await page.goto(new URL('/settings', returnTo).href)
  await page.locator(`.language-switcher button[lang="${language}"]`).click()
  await page.goto(returnTo)
}
