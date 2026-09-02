import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'

const baseURL = 'http://127.0.0.1:4173/'
const output = 'artifacts/visual-check/'
const results = []
const record = (name, passed, detail = '') => results.push({ name, passed, detail })
const checkOverflow = async (page, label) => {
  const sizes = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth }))
  record(`${label}: no horizontal overflow`, sizes.page <= sizes.viewport, JSON.stringify(sizes))
}

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
const page = await context.newPage()

page.on('pageerror', (error) => record('No page errors', false, error.message))

await page.goto(baseURL, { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })
record('English is default', await page.locator('html').getAttribute('lang') === 'en')
await checkOverflow(page, 'Desktop overview')
await page.screenshot({ path: `${output}desktop-1440x900.png` })

await page.locator('.language-switcher button[lang="id"]').click()
record('Switch to Indonesian', await page.locator('html').getAttribute('lang') === 'id')
await page.goto(`${baseURL}#/part-1/floor-settings`, { waitUntil: 'networkidle' })
const actions = page.locator('.action-list__item')
record('Four numbered actions rendered', await actions.count() === 4)
record('First action selected', await actions.nth(0).getAttribute('aria-current') === 'step')
await actions.nth(2).click()
record('Click selects action 3', await actions.nth(2).getAttribute('aria-current') === 'step')
record('Indonesian image indicator', (await page.locator('.screenshot-navigation strong').textContent())?.includes('Gambar 3 dari 4'))
await page.locator('.screenshot-navigation button').first().click()
record('Previous image selects action 2', await actions.nth(1).getAttribute('aria-current') === 'step')
await page.locator('.screenshot-navigation button').last().click()
record('Next image selects action 3', await actions.nth(2).getAttribute('aria-current') === 'step')
await actions.nth(0).click()
await page.locator('.screenshot-media__image').click()
record('Lightbox opens', await page.locator('.lightbox[role="dialog"]').isVisible())
await page.screenshot({ path: `${output}desktop-lightbox.png` })
await page.keyboard.press('Escape')
record('Escape closes lightbox', await page.locator('.lightbox').count() === 0)
record('Focus returns to opener', await page.evaluate(() => document.activeElement?.classList.contains('screenshot-media__image')))
await actions.nth(1).click()
await page.locator('.screenshot-media__placeholder').waitFor({ state: 'visible' })
record('Missing image fallback shown', await page.locator('.screenshot-media__placeholder').isVisible())
await page.screenshot({ path: `${output}desktop-missing-fallback.png` })

await page.goto(`${baseURL}#/part-1/create-project`, { waitUntil: 'networkidle' })
await page.locator('.action-list__item').nth(3).click()
const unitsWarning = page.locator('.action-list__item.is-active .action-inline-warning')
record('Project-units warning follows its action', await unitsWarning.isVisible())
record('Project-units warning uses combined copy', (await unitsWarning.textContent())?.includes('Satuan proyek menentukan cara jarak'))
await page.screenshot({ path: `${output}desktop-units-warning.png` })

await page.goto(`${baseURL}#/part-3/verify-deduction`, { waitUntil: 'networkidle' })
await page.locator('.action-list__item').nth(4).click()
record('Comparison mode has two media panels', await page.locator('.screenshot-viewer--comparison .screenshot-media').count() === 2)
await page.screenshot({ path: `${output}desktop-comparison.png`, fullPage: true })

await page.goto(`${baseURL}#/part-1/floor-settings`, { waitUntil: 'networkidle' })
const completeButton = page.locator('.complete-button')
if ((await completeButton.textContent())?.includes('Selesai')) await completeButton.click()
record('Completion disabled before checklist confirmation', await completeButton.isDisabled())
const completionChecks = page.locator('.completion-card input[type="checkbox"]')
for (let index = 0; index < await completionChecks.count(); index += 1) await completionChecks.nth(index).check()
record('Completion enabled after checklist confirmation', await completeButton.isEnabled())
await completeButton.click()
await page.reload({ waitUntil: 'networkidle' })
record('Tutorial progress persists after reload', (await page.locator('.complete-button').textContent())?.includes('Selesai'))
record('Checklist state persists after reload', await page.locator('.completion-card input:checked').count() === await completionChecks.count())
await page.locator('.language-switcher button[lang="en"]').click()
record('Switch to English preserves route', page.url().includes('#/part-1/floor-settings'))
record('Switch to English preserves completion', (await page.locator('.complete-button').textContent())?.includes('Completed'))

await page.setViewportSize({ width: 768, height: 1024 })
await page.goto(`${baseURL}#/part-1/floor-settings`, { waitUntil: 'networkidle' })
await checkOverflow(page, 'Tablet lesson')
await page.screenshot({ path: `${output}tablet-768x1024.png` })

await page.setViewportSize({ width: 390, height: 844 })
await page.reload({ waitUntil: 'networkidle' })
await checkOverflow(page, 'Mobile lesson')
record('Mobile action row scrollable', await page.locator('.action-list').evaluate((element) => getComputedStyle(element).overflowX === 'auto'))
await page.locator('.mobile-language button', { hasText: 'ID' }).click()
record('Mobile language switch works', await page.locator('html').getAttribute('lang') === 'id')
await page.locator('.action-list__item').nth(1).click()
await page.locator('.screenshot-media__placeholder').waitFor({ state: 'visible' })
record('Mobile missing fallback shown', await page.locator('.screenshot-media__placeholder').isVisible())
await page.screenshot({ path: `${output}mobile-390x844.png` })

const failures = results.filter((result) => !result.passed)
await writeFile(`${output}results.json`, JSON.stringify({ results, failures: failures.length }, null, 2))
await browser.close()
console.log(JSON.stringify({ assertions: results.length, failures }, null, 2))
if (failures.length) process.exitCode = 1
