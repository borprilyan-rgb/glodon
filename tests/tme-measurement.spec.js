import { test, expect } from '@playwright/test'
import { getTmeData } from '../src/data/tme/index.js'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

test('measurement lessons are bilingual, correctly grouped, and use existing assets', () => {
  for (const language of ['en', 'id']) {
    const course = getTmeData(language)
    expect(course.lessonCount).toBe(20)
    expect(course.allSteps.slice(0, 3).map((step) => step.id)).toEqual(['measurement-settings', 'setting-lantai', 'setting-gambar'])
    const lesson = course.allSteps[0]
    expect(lesson.partNumber).toBe('01')
    expect(lesson.actions).toHaveLength(3)
    expect(lesson.actions.map((action) => action.title)).toEqual(['Plumbing & Sanitary', 'Fire Service', 'MVAC'])
    expect(lesson.title).toBe('Measurement Settings')
    for (const action of lesson.actions) {
      expect(action.description).toContain('Project Settings > Measurement Settings >')
      expect(action.description.length).toBeLessThan(200)
    }
    for (const action of course.allSteps.flatMap((step) => step.actions)) {
      expect(existsSync(resolve('public', action.image.slice(1))), action.image).toBe(true)
    }
  }
})

test('new measurement lessons load in the course and presentation with zoom', async ({ page }) => {
  for (const [slide, imageName] of [[0, 'plumbing.png'], [1, 'fire-service.png'], [2, 'mvac.png']]) {
    await page.goto(`http://127.0.0.1:5173/tme/lesson/measurement-settings`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Measurement Settings')
    await expect(page.locator('.tutorial-step table')).toHaveCount(0)
    await expect(page.locator('.screenshot-media__instructions li')).toHaveCount(2)
    await expect(page.locator('.screenshot-media__caption .tas-command').filter({ hasText: /^Measurement Setting$/ })).toHaveCount(0)
    await page.locator('.screenshot-media__caption').screenshot({ path: 'test-results/measurement-caption.png' })
    await page.goto(`http://127.0.0.1:5173/present?product=tme&lesson=measurement-settings&slide=${slide}`)
    const image = page.locator('.presentation-image img')
    await expect(image).toBeVisible()
    await expect(image).toHaveAttribute('src', `/tutorial/tme/measurement-settings/${imageName}`)
    await expect.poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true)
    await page.getByRole('button', { name: 'Perbesar gambar', exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Tutup gambar', exact: true }).click()
    await page.getByRole('button', { name: 'Ganti ke bahasa Inggris' }).click()
    await expect(page.locator('.presentation-eyebrow')).toContainText('Measurement Settings')
    await expect(page.locator('.presentation-instructions')).toContainText('Review the settings shown in the reference image.')
    await page.getByRole('button', { name: 'Switch to Indonesian' }).click()
  }
  await page.screenshot({ path: 'test-results/tme-measurement.png', fullPage: true })
})
