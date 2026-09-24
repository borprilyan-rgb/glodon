import { test, expect } from '@playwright/test'
import { getTmeData } from '../src/data/tme/index.js'
import { measurementReferences } from '../src/data/tme/measurementReference.js'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

test('measurement lessons are bilingual, correctly grouped, and use existing assets', () => {
  for (const language of ['en', 'id']) {
    const course = getTmeData(language)
    expect(course.lessonCount).toBe(22)
    expect(course.allSteps.slice(0, 5).map((step) => step.id)).toEqual(['plumbing-measurement-settings', 'fire-measurement-settings', 'mvac-measurement-settings', 'setting-lantai', 'setting-gambar'])
    for (const [id, part] of [['mvac-measurement-settings', '01'], ['fire-measurement-settings', '01'], ['plumbing-measurement-settings', '01']]) {
      const lesson = course.allSteps.find((step) => step.id === id)
      expect(lesson.partNumber).toBe(part)
      expect(lesson.actions).toHaveLength(3)
      const descriptions = lesson.actions.map((action) => action.description).join(' ')
      for (const [, label, unit, value] of measurementReferences[id].rows) {
        expect(descriptions).toContain(label)
        expect(descriptions).toContain(`${value}${unit ? ` ${unit}` : ''}`)
      }
      expect(lesson.title).toContain(language === 'en' ? 'Measurement Settings' : 'Pengaturan Pengukuran')
    }
    for (const action of course.allSteps.flatMap((step) => step.actions)) {
      expect(existsSync(resolve('public', action.image.slice(1))), action.image).toBe(true)
    }
  }
})

test('new measurement lessons load in the course and presentation with zoom', async ({ page }) => {
  for (const id of ['plumbing-measurement-settings', 'fire-measurement-settings', 'mvac-measurement-settings']) {
    await page.goto(`http://127.0.0.1:5173/tme/lesson/${id}`)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Pengaturan Pengukuran')
    await expect(page.locator('.tutorial-step table')).toHaveCount(0)
    await page.goto(`http://127.0.0.1:5173/present?product=tme&lesson=${id}`)
    const image = page.locator('.presentation-image img')
    await expect(image).toBeVisible()
    await expect.poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true)
    await page.getByRole('button', { name: 'Perbesar gambar', exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Tutup gambar', exact: true }).click()
    await page.getByRole('button', { name: 'Ganti ke bahasa Inggris' }).click()
    await expect(page.locator('.presentation-eyebrow')).toContainText('Measurement Settings')
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(page.locator('.presentation-instructions')).toContainText(id.startsWith('fire') ? '6000 mm' : '12000 mm')
    await page.getByRole('button', { name: 'Switch to Indonesian' }).click()
  }
  await page.screenshot({ path: 'test-results/tme-measurement.png', fullPage: true })
})
