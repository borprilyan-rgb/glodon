import { test, expect } from '@playwright/test'
import { getSectionExercise, exerciseForLastLesson } from '../src/data/sectionExercises.js'
import { getTasData } from '../src/data/tas/index.js'
import { getTrbData } from '../src/data/trb/index.js'

const origin = 'http://127.0.0.1:5173'
const exercises = [
  ['tas', 2, [1, 2, 0, 1, 2, 0, 1, 2]],
  ['tas', 3, [0, 1, 2, 0, 1, 2, 0, 1]],
  ['trb', 1, [1, 0, 2, 1, 0, 2, 0, 1]],
  ['trb', 2, [2, 0, 1, 2, 0, 1, 2, 0]],
  ['trb', 3, [1, 0, 2, 1, 0, 2, 0, 1]],
]

test('every new exercise covers its section, has bilingual questions and scores out of 100', () => {
  for (const [product, section, correct] of exercises) {
    const definition = getSectionExercise(product, section)
    const part = (product === 'tas' ? getTasData('en') : getTrbData('en')).tutorialParts[section - 1]
    const lessonIds = new Set(part.steps.map((step) => step.id))
    const answers = Object.fromEntries(correct.map((answer, index) => [`q${index + 1}`, String(answer)]))
    if (product === 'tas' && section === 2) Object.assign(answers, { slabThickness: '150', openingWidth: '900', openingHeight: '2100' })
    if (product === 'tas' && section === 3) Object.assign(answers, { beamVolume: '0.70', reportVolume: '23' })
    if (product === 'trb' && section === 1) Object.assign(answers, { height1: '3.50', height2: '3.60', gridDistance: '6000' })
    if (product === 'trb' && section === 2) Object.assign(answers, { columnCount: '8', columnDiameter: '20', tieSpacing: '150', slabSpacing: '150', supportLength: '1200' })
    if (product === 'trb' && section === 3) Object.assign(answers, { barLength: '24', barWeight: '59.28', reportWeight: '2.50' })
    expect(definition.score(answers)).toMatchObject({ total: 100, passed: true })
    expect(definition.score({})).toMatchObject({ total: 0, passed: false })
    expect(definition.score({ ...answers, q1: String((correct[0] + 1) % 3) }).passed).toBe(!(product === 'tas' && section === 3 || product === 'trb'))
    expect(definition.answered(0, { q1: '99' })).toBe(false)
    for (const language of ['en', 'id']) {
      const questions = definition.copy[language].questions
      expect(new Set(questions.flatMap(question => [question.lesson, ...(question.relatedLessons || []).map(lesson => lesson.id)]))).toEqual(lessonIds)
      expect(questions).toHaveLength(correct.length)
      for (const question of questions) {
        expect(question.title.length).toBeGreaterThan(10)
        expect(question.explanation.length).toBeGreaterThan(10)
        expect(question.options).toHaveLength(3)
      }
    }
    expect(exerciseForLastLesson(product, part.steps.at(-1).id)?.path).toBe(definition.path)
  }
  for (const section of [1, 2, 3]) {
    const definition = getSectionExercise('tme', section)
    expect(definition.path).toBe(`/tme/tests/section-${section}`)
    expect(definition.copy.en.questions).toHaveLength(5)
    expect(definition.copy.id.questions).toHaveLength(5)
    expect(definition.points.reduce((sum, points) => sum + points, 0)).toBe(100)
    expect(definition.answered(0, { q1: '99' })).toBe(false)
    expect(definition.score({})).toMatchObject({ total: 0, passed: false })
  }
  expect(exerciseForLastLesson('tme', 'measurement-settings')).toBeNull()
})

for (const [product, section, correct] of exercises) {
  test(`${product} section ${section} completes, persists and retries`, async ({ page }) => {
    const definition = getSectionExercise(product, section)
    await page.goto(`${origin}${definition.path}`)
    await page.locator('button[lang="en"]').click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(definition.copy.en.title)
    await page.getByRole('button', { name: 'Start exercise' }).click()
    for (let index = 0; index < correct.length; index++) {
      await expect(page.getByText(`Question ${index + 1} / ${correct.length}`, { exact: true })).toBeVisible()
      if (product === 'tas' && section === 2 && index === 3) await page.getByLabel('Slab thickness (mm)', { exact: true }).fill('150')
      if (product === 'tas' && section === 2 && index === 6) {
        await page.getByLabel('D1 width (mm)', { exact: true }).fill('900')
        await page.getByLabel('D1 height (mm)', { exact: true }).fill('2100')
      }
      if (product === 'tas' && section === 3 && index === 2) await page.getByLabel('B1 net concrete volume (m³)', { exact: true }).fill('0.70')
      if (product === 'tas' && section === 3 && index === 4) await page.getByLabel('Combined concrete volume (m³)', { exact: true }).fill('23')
      if (product === 'trb' && section === 1 && index === 3) {
        await page.getByLabel('Approved Floor 1 height (m)', { exact: true }).fill('3.50')
        await page.getByLabel('Approved Floor 2 height (m)', { exact: true }).fill('3.60')
      }
      if (product === 'trb' && section === 1 && index === 6) await page.getByLabel('A–B reference distance (mm)', { exact: true }).fill('6000')
      if (product === 'trb' && section === 2) {
        for (const field of definition.copy.en.questions[index].fields) {
          const values = { columnCount: '8', columnDiameter: '20', tieSpacing: '150', slabSpacing: '150', supportLength: '1200' }
          await page.getByLabel(field.label, { exact: true }).fill(values[field.name])
        }
      }
      if (product === 'trb' && section === 3) {
        for (const field of definition.copy.en.questions[index].fields) {
          const values = { barLength: '24', barWeight: '59.28', reportWeight: '2.50' }
          await page.getByLabel(field.label, { exact: true }).fill(values[field.name])
        }
      }
      await page.locator(`input[name="q${index + 1}"][value="${correct[index]}"]`).check()
      await page.getByRole('button', { name: index === correct.length - 1 ? 'Submit answers' : 'Next question' }).click()
    }
    await expect(page.getByRole('heading', { name: `Section ${section} passed`, exact: true })).toBeVisible()
    await expect(page.locator('.exercise-score')).toHaveText('100/100')
    for (let index = 0; index < correct.length; index++) {
      await expect(page.locator('.exercise-results article').nth(index).locator('a').first()).toHaveAttribute('href', `/${product}/lesson/${definition.copy.en.questions[index].lesson}`)
    }
    await page.reload()
    await expect(page.locator('.exercise-score')).toHaveText('100/100')
    await page.locator('button[lang="id"]').click()
    await expect(page.getByRole('heading', { name: `Lulus Bagian ${section}` })).toBeVisible()
    await page.getByRole('button', { name: 'Coba lagi' }).click()
    await expect(page.locator('input:checked')).toHaveCount(0)
  })
}

test('section progress is isolated and mobile numbered navigation fits', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${origin}/trb/exercise/section-2`)
  await page.locator('.mobile-header-language').click()
  await page.getByRole('button', { name: 'Start exercise' }).click()
  await page.locator('input[name="q1"][value="2"]').check()
  await page.getByRole('navigation').getByRole('button', { name: /^Question 8:/ }).click()
  await page.reload()
  await expect(page.getByText('Question 8 / 8')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/trb-exercise-mobile.png', fullPage: true })
  await page.goto(`${origin}/tas/exercise/section-2`)
  await page.getByRole('button', { name: 'Start exercise' }).click()
  await expect(page.getByText('Question 1 / 8')).toBeVisible()
  await expect(page.locator('input:checked')).toHaveCount(0)
  await page.goto(`${origin}/trb/exercise/section-2`)
  await expect(page.getByText('Question 8 / 8')).toBeVisible()
  await page.getByRole('navigation').getByRole('button', { name: /^Question 1:/ }).click()
  await expect(page.locator('input[name="q1"][value="2"]')).toBeChecked()
})

test('course maps and lessons do not embed test entry cards', async ({ page }) => {
  for (const product of ['tas', 'trb', 'tme']) {
    await page.goto(`${origin}/${product}/course`)
    await expect(page.locator('.exercise-entry a')).toHaveCount(0)
  }
  for (const [product, section] of exercises) {
    const part = (product === 'tas' ? getTasData('en') : getTrbData('en')).tutorialParts[section - 1]
    await page.goto(`${origin}/${product}/lesson/${part.steps.at(-1).id}`)
    await expect(page.locator('.exercise-entry a')).toHaveCount(0)
  }
  await page.goto(`${origin}/trb/exercise/section-1`)
  await page.screenshot({ path: 'test-results/trb-exercise-desktop.png', fullPage: true })
})


test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('cubicost:participant')) localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Test User', jobTitle: 'Engineer', employeeId: '000012' }))
  })
})
