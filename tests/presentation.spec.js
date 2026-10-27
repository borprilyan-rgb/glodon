import { test, expect } from '@playwright/test'
import { getTasData } from '../src/data/tas/index.js'
import { getReportLessons } from '../src/data/tas/tasReports.js'
import { getTrbData } from '../src/data/trb/index.js'
import { getTmeData } from '../src/data/tme/index.js'

const origin = 'http://127.0.0.1:5173'

test('presentation home close icon returns to the main home', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en'))
  await page.goto(`${origin}/present`)
  const close = page.getByRole('link', { name: 'Close', exact: true })
  await expect(close).toBeVisible()
  await expect(close.locator('svg')).toBeVisible()
  await close.click()
  await expect(page).toHaveURL(`${origin}/`)
  await expect(page.locator('.presentation')).toHaveCount(0)
})

for (const [language, width] of [['en', 1440], ['id', 390]]) {
  test(`presenter home lists every part and step and opens selected steps directly (${language}, ${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(language => localStorage.setItem('cubicost-tas-tutorial-language-v1', language), language)
    const courses = {
      tas: [...getTasData(language).allSteps, ...getReportLessons(language)],
      trb: getTrbData(language).allSteps,
      tme: getTmeData(language).allSteps,
    }
    for (const [product, lessons] of Object.entries(courses)) {
      await page.goto(`${origin}/present`)
      await page.locator('.presentation-applications').getByRole('button', { name: product === 'tme' ? 'TME-C' : product.toUpperCase(), exact: true }).click()
      await expect(page).toHaveURL(`${origin}/present`)
      await expect(page.locator('.presentation-image')).toHaveCount(0)
      await expect(page.locator('.presentation-outline')).toHaveCount(1)
      const card = page.locator(`.presentation-outline--${product}`)
      const parts = card.locator('.presentation-home-part')
      await expect(card.locator('h3 button[aria-expanded="true"]')).toHaveCount(0)
      await expect(parts.first().locator('h3 button')).toHaveAttribute('aria-expanded', 'false')
      expect(await card.evaluate(element => getComputedStyle(element).overflowY)).toBe('visible')
      await expect(parts).toHaveCount(new Set(lessons.map(step => step.partId)).size)
      await expect(card.locator('.presentation-home-steps a')).toHaveCount(lessons.length)
      for (const step of lessons) {
        const href = `/present?${new URLSearchParams({ product, lesson: step.id, slide: '0' })}`
        await expect(card.locator(`a[href="${href}"]`)).toHaveText(`${language === 'en' ? 'STEP' : 'LANGKAH'} ${step.stepNumber}${step.title}`)
      }
      await parts.first().locator('h3 button').click()
      await expect(parts.first().locator('ol')).toBeVisible()
      await parts.first().locator('h3 button').click()
      await expect(parts.first().locator('ol')).toBeHidden()
      await parts.last().locator('h3 button').click()
      await expect(card.locator('h3 button[aria-expanded="true"]')).toHaveCount(1)
      const selected = lessons.at(-1)
      const href = `/present?${new URLSearchParams({ product, lesson: selected.id, slide: '0' })}`
      await card.locator(`a[href="${href}"]`).click()
      await expect(page).toHaveURL(`${origin}${href}`)
      await expect(page.locator('.presentation-image img')).toHaveAttribute('src', selected.actions[0].presenterImage || selected.actions[0].image)
      await page.reload()
      await expect(page).toHaveURL(`${origin}${href}`)
      await expect(page.locator('.presentation-image img')).toHaveAttribute('src', selected.actions[0].presenterImage || selected.actions[0].image)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
  })
}

test('enlarged screenshot stays inside fullscreen and preserves the slide', async ({ page }) => {
  await openEnglish(page, '/present?product=tme&lesson=setting-gambar&slide=1')
  await page.getByRole('button', { name: 'Fullscreen', exact: true }).click()
  const slideUrl = page.url()
  await page.getByRole('button', { name: 'Enlarge Image', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Enlarged screenshot preview' })
  await expect(dialog).toBeVisible()
  expect(await dialog.evaluate((element) => document.fullscreenElement.contains(element))).toBe(true)
  const image = dialog.locator('img')
  await expect(image).toBeVisible()
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
  await expect(dialog.getByText('150%', { exact: true })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(slideUrl)
  await page.screenshot({ path: 'test-results/presentation-expanded.png', fullPage: true })
  await page.getByRole('button', { name: 'Close Image', exact: true }).click()
  await expect(dialog).toBeHidden()
  await expect(page.getByRole('button', { name: 'Exit Fullscreen', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Enlarge Image', exact: true })).toBeFocused()
  await expect(page).toHaveURL(slideUrl)
  await page.getByRole('button', { name: 'Exit Fullscreen', exact: true }).click()
  await page.getByRole('button', { name: 'Enlarge Image', exact: true }).click()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('walkthrough continues across lessons and sections in both directions', async ({ page }) => {
  await openEnglish(page, '/present?product=tme&lesson=setting-gambar&slide=2')
  await page.getByRole('button', { name: 'Next Lesson', exact: true }).click()
  await expect(page).toHaveURL(/lesson=mvac-equipment-plenum-grille&slide=0/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Equipment, plenums, grilles, ducts, flexible ducts, dampers, and grouping')
  await page.getByRole('button', { name: 'Previous Lesson', exact: true }).click()
  await expect(page).toHaveURL(/lesson=setting-gambar&slide=2/)
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/lesson=mvac-equipment-plenum-grille&slide=0/)
  await page.reload()
  await expect(page).toHaveURL(/lesson=mvac-equipment-plenum-grille&slide=0/)
  await page.getByRole('heading', { level: 1 }).click()
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(/lesson=setting-gambar&slide=2/)
  await page.goto(`${origin}/present?product=tme&lesson=measurement-settings`)
  await expect(page.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled()
  await page.goto(`${origin}/present?product=tme&lesson=penyesuaian-atribut&slide=999`)
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled()
})

async function openEnglish(page, path = '/present') {
  await page.goto(`${origin}${path}`)
  await page.getByRole('button', { name: 'Ganti ke bahasa Inggris' }).click()
}

test('presentation home cards open courses and support fullscreen and lesson return', async ({ page }) => {
  await openEnglish(page)
  await expect(page.locator('.presentation-selection-title')).toHaveCount(0)
  await expect(page.locator('.presentation-application')).toHaveCount(3)
  await expect(page.locator('.presentation-heading')).toHaveCount(0)
  await expect(page.locator('.presentation-home')).toBeVisible()
  await expect(page.locator('.presentation-applications button')).toHaveCount(3)
  await expect(page.locator('.presentation-course-nav')).toHaveCount(0)
  await expect(page.locator('.presentation-controls')).toHaveCount(0)
  await page.locator('.presentation-stage').focus()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(`${origin}/present`)
  await page.getByRole('button', { name: 'Switch to Indonesian' }).click()
  await expect(page.locator('.presentation-selection-title')).toHaveCount(0)
  await expect(page.locator('.presentation-heading')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Ganti ke bahasa Inggris' })).toBeVisible()
  await page.getByRole('button', { name: 'Ganti ke bahasa Inggris' }).click()
  await page.getByRole('button', { name: 'Fullscreen', exact: true }).click()
  await page.locator('.presentation-applications').getByRole('button', { name: 'TME-C', exact: true }).click()
  await page.getByRole('button', { name: 'Start presenting TME-C', exact: true }).click()
  await expect(page).toHaveURL(/product=tme&lesson=measurement-settings&slide=0/)
  await expect(page.getByRole('button', { name: 'Exit Fullscreen', exact: true })).toBeVisible()
  await expect(page.locator('.presentation-course-nav button')).toHaveCount(3)
  await expect(page.getByRole('button', { name: 'Overview', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  const returnUrl = page.url()
  await page.getByRole('button', { name: 'Exit Fullscreen', exact: true }).click()
  await page.getByRole('link', { name: 'Open Lesson' }).click()
  await page.getByRole('link', { name: 'Return To Presentation' }).click()
  await expect(page).toHaveURL(returnUrl)
  for (const [label, product, lesson] of [['TAS', 'tas', 'measurement-settings'], ['TRB', 'trb', 'export-tas-model']]) {
    await page.goto(`${origin}/present`)
    await page.locator('.presentation-applications').getByRole('button', { name: label, exact: true }).click()
    await page.getByRole('button', { name: `Start presenting ${label}`, exact: true }).click()
    await expect(page).toHaveURL(`${origin}/present?product=${product}&lesson=${lesson}&slide=0`)
  }
})

test('walkthrough survives refresh and lesson pages hide the presentation entry', async ({ page }) => {
  await openEnglish(page, '/present?product=tme&lesson=setting-gambar')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Upload drawings and check scale')
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Assign floors and set the reference point')
  await page.screenshot({ path: 'test-results/presentation-lesson.png', fullPage: true })
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Assign floors and set the reference point')
  await page.getByRole('link', { name: 'Close', exact: true }).click()
  await expect(page).toHaveURL(`${origin}/present`)
  await expect(page.locator('.presentation-home')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Present This Lesson', exact: true })).toHaveCount(0)
  await page.goto(`${origin}/present?product=tme&lesson=setting-gambar`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Upload drawings and check scale')
  await page.getByRole('button', { name: 'Fullscreen', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Close', exact: true })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Open Lesson', exact: true })).toBeHidden()
  await expect(page.getByRole('button', { name: 'Overview', exact: true })).toBeHidden()
  for (const [label, product, lesson] of [['TAS', 'tas', 'measurement-settings'], ['TRB', 'trb', 'export-tas-model'], ['TME-C', 'tme', 'measurement-settings']]) {
    await page.getByRole('button', { name: label, exact: true }).click()
    await expect(page).toHaveURL(`${origin}/present?product=${product}&lesson=${lesson}&slide=0`)
    await expect(page.getByRole('button', { name: label, exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', { name: 'Exit Fullscreen', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled()
  }
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await page.getByRole('button', { name: 'TME-C', exact: true }).click()
  await expect(page).toHaveURL(/lesson=measurement-settings&slide=0/)

})

test('slides fit desktop and mobile widths and recover from invalid parameters', async ({ page }) => {
  await openEnglish(page, '/present?product=invalid&lesson=missing&slide=999')
  await expect(page.locator('.presentation-heading')).toHaveCount(0)
  await expect(page.locator('.presentation-home')).toBeVisible()
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 })
    for (let slide = 0; slide < 5; slide++) {
      await page.goto(`${origin}/present?slide=${slide}`)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      await expect(page.locator('.presentation-home')).toBeVisible()
    }
  }
  await page.screenshot({ path: 'test-results/presentation-mobile.png', fullPage: true })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${origin}/present?slide=1`)
  await page.screenshot({ path: 'test-results/presentation-desktop.png', fullPage: true })
})
