import { test, expect } from '@playwright/test'
import { reportPrototype } from '../src/data/tas/pileCapReport.js'
import { getReportLessons } from '../src/data/tas/tasReports.js'

const reportLessons = getReportLessons('en')

async function openReport(page) {
  await page.addInitScript(() => localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en'))
  await page.goto('http://127.0.0.1:5173/tas/lesson/pile-cap-report')
}

test('existing action and image controls stay synchronized without interactive tables', async ({ page }) => {
  await openReport(page)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(reportPrototype.title)
  await expect(page.locator('.action-list__item')).toHaveCount(1)
  await expect(page.locator('table')).toHaveCount(0)
  await expect(page.locator('.step-header > p')).toHaveCount(0)
  await expect(page.locator('.action-list__item p')).toHaveCount(0)
  await expect(page.locator('.screenshot-media__instruction')).toBeVisible()
  await expect(page.locator('.screenshot-media__image img')).toHaveAttribute('src', reportPrototype.actions[0].image)
  await expect(page.getByRole('button', { name: 'Next Image', exact: true })).toBeDisabled()
  await expect(page.locator('.step-navigation a')).toHaveCount(2)
  await expect(page.locator('.step-navigation a').first()).toHaveAttribute('href', '/tas/lesson/calculate-verify-quantity')
  await expect(page.locator('.step-navigation a').last()).toHaveAttribute('href', '/tas/lesson/slab-report')
})

test('Beam action selection and image navigation remain synchronized after column removal', async ({ page }) => {
  await openReport(page)
  await page.goto('http://127.0.0.1:5173/tas/lesson/beam-report')
  const beam = reportLessons.find(step => step.id === 'beam-report')
  await expect(page.locator('.action-list__item')).toHaveCount(3)
  await page.getByRole('button', { name: 'Next Image', exact: true }).click()
  await expect(page.locator('.screenshot-media__image img')).toHaveAttribute('src', beam.actions[1].image)
  await expect(page.getByRole('listitem', { name: 'Select action 2' })).toHaveAttribute('aria-current', 'step')
  await page.getByRole('button', { name: 'Previous Image', exact: true }).click()
  await expect(page.locator('.screenshot-media__image img')).toHaveAttribute('src', beam.actions[0].image)
  await page.getByRole('listitem', { name: 'Select action 3' }).click()
  await expect(page.locator('.screenshot-media__image img')).toHaveAttribute('src', beam.actions[2].image)
  await expect(page.locator('.screenshot-media__instruction')).not.toContainText('Number(pc)')
})

test('mobile retains completion behavior and the existing responsive lesson structure', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openReport(page)
  await expect(page.locator('.action-viewer__list')).toBeVisible()
  await expect(page.locator('.action-viewer__media')).toBeVisible()
  const complete = page.getByRole('button', { name: 'Mark As Complete', exact: true })
  await expect(complete).toBeDisabled()
  for (const checkbox of await page.locator('.completion-card input').all()) await checkbox.check()
  await complete.click()
  await expect(page.locator('.completion-success')).toBeVisible()
  await page.reload()
  await expect(page.locator('.completion-success')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('every report action switches the existing viewer to its worksheet image', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en'))
  for (const step of reportLessons) {
    await page.goto(`http://127.0.0.1:5173/tas/lesson/${step.id}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(step.title)
    await expect(page.locator('.action-list__item')).toHaveCount(step.actions.length)
    for (const [index, action] of step.actions.entries()) {
      await page.getByRole('listitem', { name: `Select action ${index + 1}` }).click()
      await expect(page.locator('.screenshot-media__image img')).toHaveAttribute('src', action.image)
      await expect(page.locator('.screenshot-media__instruction')).toContainText(action.description.split('\n')[0])
    }
    await expect(page.locator('.step-header > p')).toHaveCount(0)
    await expect(page.locator('.action-list__item p')).toHaveCount(0)
  }
})

test('language changes the explanations without changing the selected report or its column names', async ({ page }) => {
  await openReport(page)
  await expect(page.locator('.screenshot-media__instruction')).toContainText('Volume(m3): Used for concrete volume.')
  const image = await page.locator('.screenshot-media__image img').getAttribute('src')
  await page.locator('.language-switcher button[lang="id"]').click()
  await expect(page.locator('.screenshot-media__instruction')).toContainText('Volume(m3): Digunakan untuk volume beton.')
  await expect(page.locator('.screenshot-media__image img')).toHaveAttribute('src', image)
  await page.locator('.language-switcher button[lang="en"]').click()
  await expect(page.locator('.screenshot-media__instruction')).toContainText('Volume(m3): Used for concrete volume.')
  await expect(page.locator('.screenshot-media__image img')).toHaveAttribute('src', image)
})
