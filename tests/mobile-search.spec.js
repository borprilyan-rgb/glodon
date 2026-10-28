import { test, expect } from '@playwright/test'
import { buildSearchCatalog, searchLessons } from '../src/data/courseSearch.js'
import { getTasData } from '../src/data/tas/index.js'
import { getTrbData } from '../src/data/trb/index.js'
import { getTmeData } from '../src/data/tme/index.js'
import { getReportLessons } from '../src/data/tas/tasReports.js'
import { getProductLabel } from '../src/data/productConfig.js'

const origin = 'http://127.0.0.1:5173'

function makeSearchCourses(language) {
  const tas = getTasData(language)
  const reports = getReportLessons(language)
  tas.tutorialParts = tas.tutorialParts.map(part => part.id === 'part-3' ? {
    ...part,
    title: 'Report',
    shortTitle: 'Report',
    steps: reports,
  } : part)
  return { tas, trb: getTrbData(language), tme: getTmeData(language) }
}

test('all course and part titles find their lessons in both languages', () => {
  for (const language of ['en', 'id']) {
    const coursesByLanguage = { en: makeSearchCourses('en'), id: makeSearchCourses('id') }
    const courses = coursesByLanguage[language]
    const catalog = buildSearchCatalog(coursesByLanguage, language)
    for (const [product, course] of Object.entries(courses)) {
      const courseResults = new Set(searchLessons(catalog, `Cubicost ${getProductLabel(product)}`).map(lesson => lesson.key))
      for (const part of course.tutorialParts) {
        const partResults = new Set(searchLessons(catalog, part.title).map(lesson => lesson.key))
        for (const lesson of part.steps) {
          expect(courseResults.has(`${product}:${lesson.id}`)).toBe(true)
          expect(partResults.has(`${product}:${lesson.id}`)).toBe(true)
        }
      }
    }
  }
})

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
    const popular = page.locator('.mobile-search-topics a')
    await expect(page.getByRole('heading', { name: language === 'en' ? 'Popular topics' : 'Topik populer' })).toBeVisible()
    await expect(popular).toHaveCount(6)
    await expect(page.locator('.mobile-search-topics a[href^="/tas/lesson/"]').first()).toBeVisible()
    await expect(page.locator('.mobile-search-topics a[href^="/trb/lesson/"]').first()).toBeVisible()
    await expect(page.locator('.mobile-search-topics a[href^="/tme/lesson/"]').first()).toBeVisible()
    await expect(popular.first().locator('small')).toContainText('·')
    await expect(popular.first().locator('small')).not.toContainText('Â·')
    await page.screenshot({ path: testInfo.outputPath('mobile-search.png'), fullPage: true })

    await input.fill(language === 'en' ? 'MVAC Work' : 'Pekerjaan MVAC')
    for (const lessonId of ['mvac-equipment-plenum-grille', 'mvac-duct', 'mvac-pipa-ac']) {
      await expect(page.locator(`.mobile-search-results a[href="/tme/lesson/${lessonId}"]`)).toBeVisible()
    }

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
    await input.fill(language === 'en' ? 'ground elevation' : 'Actual length')
    await expect(page.locator('.mobile-search-result__excerpt mark').first()).toBeVisible()
    await expect(page.locator('.mobile-search-result__excerpt').first()).toContainText(language === 'en' ? 'ground elevation' : 'actual length')
    await input.fill('zzzz-no-matching-lesson')
    await expect(page.getByRole('status')).toContainText(language === 'en' ? 'No results' : 'Materi tidak ditemukan')
    await expect(page.getByRole('button', { name: language === 'en' ? 'Clear search and try again' : 'Hapus pencarian dan coba lagi' })).toBeVisible()
    await expect(page.locator('.mobile-search-topics--recovery a')).toHaveCount(3)
    await page.getByRole('button', { name: language === 'en' ? 'Clear search' : 'Hapus pencarian', exact: true }).click()
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
