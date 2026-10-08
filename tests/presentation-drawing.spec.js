import { test, expect } from '@playwright/test'
import { getTasData } from '../src/data/tas/index.js'

const origin = 'http://127.0.0.1:5173'

async function open(page) {
  await page.goto(`${origin}/present?product=tme&lesson=measurement-settings`)
  await page.getByRole('button', { name: 'Ganti ke bahasa Inggris' }).click()
  await expect(page.locator('.presentation-image img')).toBeVisible()
}

async function pixels(canvas) {
  return canvas.evaluate((element) => {
    const bytes = element.getContext('2d').getImageData(0, 0, element.width, element.height).data
    let count = 0
    for (let index = 3; index < bytes.length; index += 4) if (bytes[index] > 0) count++
    return count
  })
}

async function stroke(page, canvas, y = 0.5) {
  const box = await canvas.boundingBox()
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * y)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * y, { steps: 12 })
  await page.mouse.up()
}

test('TAS starts with Measurement Settings without duplicating lessons', () => {
  for (const language of ['en', 'id']) {
    const data = getTasData(language)
    expect(data.allSteps[0].id).toBe('measurement-settings')
    expect(data.allSteps[0].partId).toBe('part-1')
    expect(data.allSteps[1].id).toBe('measurement-rules')
    expect(data.allSteps[1].partId).toBe('part-1')
    expect(data.allSteps[2].id).toBe('create-project')
    expect(data.allSteps).toHaveLength(18)
    expect(new Set(data.allSteps.map((step) => step.id)).size).toBe(18)
  }
})

test('drawing is opt-in, per slide, editable, and shared with the fullscreen image', async ({ page }) => {
  await open(page)
  const canvas = page.locator('.presentation-image canvas')
  await expect(canvas).not.toHaveClass(/is-drawing/)
  const language = await page.getByRole('button', { name: 'Switch to Indonesian' }).boundingBox()
  const pencil = await page.getByRole('button', { name: 'Draw on image' }).boundingBox()
  expect(Math.abs(language.y - pencil.y)).toBeLessThan(5)
  expect(pencil.x).toBeGreaterThan(language.x)
  await page.getByRole('button', { name: 'Draw on image' }).click()
  await stroke(page, canvas)
  await expect.poll(() => pixels(canvas)).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Eraser', exact: true }).click()
  await stroke(page, canvas)
  await expect.poll(() => pixels(canvas)).toBe(0)
  await page.getByRole('button', { name: 'Undo drawing' }).click()
  await expect.poll(() => pixels(canvas)).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Highlighter', exact: true }).click()
  await page.getByRole('button', { name: 'Yellow', exact: true }).click()
  await page.getByLabel('Stroke size').selectOption('8')
  await stroke(page, canvas, 0.7)
  await page.getByRole('button', { name: 'Clear drawing' }).click()
  await expect.poll(() => pixels(canvas)).toBe(0)
  await page.getByRole('button', { name: 'Undo drawing' }).click()
  await expect.poll(() => pixels(canvas)).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(canvas).not.toHaveClass(/is-drawing/)
  await expect.poll(() => pixels(canvas)).toBe(0)
  await page.getByRole('button', { name: 'Previous', exact: true }).click()
  await expect.poll(() => pixels(canvas)).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Finish drawing' }).click()
  await page.getByRole('button', { name: 'Fullscreen', exact: true }).click()
  await page.getByRole('button', { name: 'Enlarge Image', exact: true }).click()
  const expanded = page.getByRole('dialog').locator('canvas')
  await expect.poll(() => pixels(expanded)).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
  await expect.poll(() => pixels(expanded)).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Draw on image' }).click()
  await page.getByRole('button', { name: 'Clear drawing' }).click()
  await expect.poll(() => pixels(expanded)).toBe(0)
  await page.getByRole('button', { name: 'Pen', exact: true }).click()
  await stroke(page, expanded, 0.4)
  await expect.poll(() => pixels(expanded)).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Close Image', exact: true }).click()
  await expect.poll(() => pixels(canvas)).toBeGreaterThan(0)
  await expect(page.getByRole('button', { name: 'Exit Fullscreen', exact: true })).toBeVisible()
  await page.screenshot({ path: 'test-results/drawing-desktop.png', fullPage: true })
  await page.reload()
  await expect.poll(() => pixels(canvas)).toBe(0)
})

test('mobile drawing toolbar fits and accepts touch pointer strokes', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await open(page)
  await page.getByRole('button', { name: 'Draw on image' }).tap()
  const canvas = page.locator('.presentation-image canvas')
  await canvas.scrollIntoViewIfNeeded()
  const box = await canvas.boundingBox()
  const session = await context.newCDPSession(page)
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width * 0.3, y: box.y + box.height * 0.5 }] })
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + box.width * 0.7, y: box.y + box.height * 0.5 }] })
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect.poll(() => pixels(canvas)).toBeGreaterThan(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/drawing-mobile.png', fullPage: true })
  await page.getByRole('button', { name: 'Finish drawing' }).tap()
  await page.getByRole('button', { name: 'Enlarge Image' }).tap()
  await page.getByRole('button', { name: 'Draw on image' }).tap()
  expect(await page.getByRole('dialog').evaluate((element) => element.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/drawing-mobile-expanded.png', fullPage: true })
  await context.close()
})
