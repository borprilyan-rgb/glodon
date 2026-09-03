import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'

const base = 'http://127.0.0.1:4173/'
const output = 'artifacts/visual-check/'
const results = []
const record = (name, passed, detail = '') => results.push({ name, passed, detail })
const overflow = async (page, label) => {
  const width = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
  record(`${label} has no horizontal overflow`, width.scroll <= width.client, JSON.stringify(width))
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(`${base}#/course`, { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })

record('Course route renders', await page.locator('.course-map-page').isVisible())
record('Course map contains three parts', await page.locator('.course-part').count() === 3)
record('Course map contains eighteen lessons', await page.locator('.course-lesson').count() === 18)
record('No lesson completed when course opens', await page.locator('.course-lesson.is-completed').count() === 0)
record('Continue Learning targets first lesson initially', (await page.locator('.course-map-hero .primary-button').getAttribute('href')) === '#/part-1/create-project')
await overflow(page, 'Desktop course map')
await page.screenshot({ path: `${output}course-map-desktop.png` })

const lessonLinks = await page.locator('.course-lesson').evaluateAll((links) => links.map((link) => link.getAttribute('href')))
for (const href of lessonLinks) {
  await page.goto(`${base}${href}`, { waitUntil: 'networkidle' })
  record(`Direct route ${href}`, await page.locator('.tutorial-step').isVisible())
}

await page.goto(`${base}#/part-1/create-project`, { waitUntil: 'networkidle' })
record('Full course list absent from lesson', await page.locator('.course-lessons').count() === 0 && await page.locator('.sidebar').count() === 0)
record('Course Map button visible on lesson', await page.locator('.course-map-button').isVisible())
const checks = page.locator('.completion-card input[type="checkbox"]')
for (let index = 0; index < await checks.count(); index += 1) await checks.nth(index).check()
await page.locator('.complete-button').click()
await page.locator('.course-map-button').click()
await page.locator('.course-map-page').waitFor({ state: 'visible' })
record('Course Map button returns to course route', page.url().endsWith('#/course'))
await page.locator('.course-lesson.is-completed').first().waitFor({ state: 'visible' })
record('Completed lesson shown on map', await page.locator('.course-lesson.is-completed').count() === 1)

await page.goto(`${base}#/part-1/import-drawing`, { waitUntil: 'networkidle' })
await page.goto(`${base}#/course`, { waitUntil: 'networkidle' })
const currentLesson = page.locator('.course-lesson[aria-current="page"]')
record('Most recent lesson identified', (await currentLesson.getAttribute('href')) === '#/part-1/import-drawing')
record('Most recent incomplete lesson is in progress', await currentLesson.getAttribute('class').then((value) => value.includes('is-inProgress')))
record('Continue Learning targets recent incomplete lesson', (await page.locator('.course-map-hero .primary-button').getAttribute('href')) === '#/part-1/import-drawing')

await page.goto(`${base}#/part-1/floor-settings`, { waitUntil: 'networkidle' })
await page.locator('.step-link--next').click()
record('Next Lesson navigates directly', page.url().includes('#/part-1/import-drawing'))
await page.goBack({ waitUntil: 'networkidle' })
record('Browser Back restores prior lesson', page.url().includes('#/part-1/floor-settings'))
await page.goForward({ waitUntil: 'networkidle' })
record('Browser Forward restores next lesson', page.url().includes('#/part-1/import-drawing'))
await page.locator('.step-link').first().click()
record('Previous Lesson navigates directly', page.url().includes('#/part-1/floor-settings'))
await page.screenshot({ path: `${output}focused-lesson-desktop.png` })
await overflow(page, 'Desktop lesson')

await page.reload({ waitUntil: 'networkidle' })
record('Progress survives refresh', await page.locator('.lesson-topbar .progress').isVisible())
await page.locator('.lesson-topbar .language-switcher button[lang="id"]').click()
record('Indonesian lesson localization works', await page.locator('html').getAttribute('lang') === 'id')
await page.goto(`${base}#/course`, { waitUntil: 'networkidle' })
record('Indonesian course localization works', (await page.locator('.course-map-hero .primary-button').textContent()).includes('Lanjutkan Belajar'))

await page.setViewportSize({ width: 390, height: 844 })
await page.reload({ waitUntil: 'networkidle' })
await overflow(page, 'Mobile course map')
await page.screenshot({ path: `${output}course-map-mobile.png` })
await page.locator('.course-lesson').first().click()
await page.locator('.tutorial-step').waitFor({ state: 'visible' })
await overflow(page, 'Mobile lesson')
record('Mobile lesson retains Course Map control', await page.locator('.course-map-button').isVisible())
await page.screenshot({ path: `${output}focused-lesson-mobile.png` })

const failures = results.filter((result) => !result.passed)
await writeFile(`${output}course-map-results.json`, JSON.stringify({ results, failures: failures.length }, null, 2))
await browser.close()
console.log(JSON.stringify({ assertions: results.length, failures }, null, 2))
if (failures.length) process.exitCode = 1
