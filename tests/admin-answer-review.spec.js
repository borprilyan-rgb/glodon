import { test, expect } from '@playwright/test'
import { randomUUID } from 'node:crypto'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, writeBatch, Timestamp, getDoc } from 'firebase/firestore'
import { getSectionExercise } from '../src/data/sectionExercises.js'
import { provisionAdmin, passwordSignIn } from './firebase/adminAuth.mjs'

const origin = 'http://127.0.0.1:5173'

for (const language of ['en', 'id']) test(`${language} admin answer review matches participant scoring for all nine assessments and safely handles old versions`, async ({ page, context }, testInfo) => {
  test.setTimeout(60000)
  const mobile = language === 'id'
  await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 })
  await page.goto(origin)
  await page.evaluate(language => localStorage.setItem('cubicost-tas-tutorial-language-v1', language), language)
  await page.goto(`${origin}/admin/results`)
  const email = `review-${randomUUID()}@example.test`
  const password = `Aa1!${randomUUID()}`
  const uid = await provisionAdmin(page, { email, password })
  const employeeId = mobile ? '556677' : '778899'
  const records = []
  for (const course of ['tas', 'trb', 'tme']) for (const section of [1, 2, 3]) {
    const exercise = getSectionExercise(course, section)
    const answers = { ...exercise.expectedAnswers }
    const choice = exercise.copy[language].questions.find(question => question.type === 'choice')
    answers[choice.id] = choice.options.find(([key]) => key !== answers[choice.id])[0]
    if (course === 'tas' && section === 2) answers.slabThickness = '140'
    const score = exercise.score(answers)
    records.push({ attemptId: randomUUID(), uid: 'review-participant', name: `Review ${course.toUpperCase()} ${section}`, jobTitle: 'Engineer', employeeId, course, section, answers, score: score.total, maximumScore: 100, passed: score.passed, scoreVerified: false, assessmentVersion: exercise.storageKey.match(/:(v\d+)$/)[1], submittedAt: Timestamp.now() })
  }
  const old = { ...records[1], attemptId: randomUUID(), name: 'Unavailable', assessmentVersion: 'v1', answers: { q1: '0', slabThickness: '150' } }
  const environment = await initializeTestEnvironment({ projectId: 'demo-cubicost', firestore: { host: '127.0.0.1', port: 8080 } })
  const participantPage = await context.newPage()
  try {
    await environment.withSecurityRulesDisabled(async testContext => {
      const database = testContext.firestore()
      const batch = writeBatch(database)
      batch.set(doc(database, 'admins', uid), { enabled: true })
      for (const record of [...records, old]) batch.set(doc(database, 'testAttempts', record.attemptId), record)
      await batch.commit()
    })
    await passwordSignIn(page, { email, password, uid, language })
    await page.locator('#admin-employeeId').fill(employeeId)
    await page.getByRole('button', { name: language === 'en' ? 'Apply Filters' : 'Terapkan Filter', exact: true }).click()
    await expect(page.locator('.admin-result-row')).toHaveCount(10)
    await participantPage.goto(origin)
    for (const record of records) {
      const exercise = getSectionExercise(record.course, record.section)
      const definition = exercise.copy[language]
      await page.getByRole('button', { name: `${language === 'en' ? 'Details for' : 'Detail untuk'} ${record.name}`, exact: true }).click()
      const details = page.locator(`[id="details-${record.attemptId}"]`)
      const review = details.locator('.admin-answer-review')
      await expect(details.locator('.admin-job-title')).toContainText('Engineer')
      await expect(details).not.toContainText(record.attemptId)
      await expect(details).not.toContainText(record.uid)
      await expect(details).not.toContainText(language === 'en' ? 'Assessment version' : 'Versi penilaian')
      await expect(details.locator('pre')).toHaveCount(0)
      await expect(review.locator('h3')).toHaveText(definition.questions.map(question => question.title))
      const scored = exercise.score(record.answers)
      const statuses = review.locator('.admin-answer-status')
      for (let index = 0; index < definition.questions.length; index++) {
        await expect(statuses.nth(index)).toContainText(`${scored.scores[index]} / ${exercise.points[index]}`)
        const choice = definition.questions[index]
        if (choice.type === 'choice') {
          await expect(review.locator('.admin-answer-question').nth(index).locator('.admin-answer-fields').first()).toContainText(choice.options.find(([key]) => key === record.answers[choice.id])[1])
        }
      }
      const wrongIndex = definition.questions.findIndex(question => question.type === 'choice')
      const wrong = review.locator('.admin-answer-question').nth(wrongIndex)
      await expect(wrong.locator('.admin-answer-status')).toContainText(language === 'en' ? 'Incorrect' : 'Salah')
      await expect(wrong.locator('.admin-answer-explanation')).toHaveText(definition.questions[wrongIndex].explanation)
      if (record.course === 'tas' && record.section === 2) {
        const slab = review.locator('.admin-answer-question').nth(3)
        await expect(slab.locator('.admin-answer-status')).toHaveText(language === 'en' ? 'Partially correct 10 / 20 points' : 'Sebagian benar 10 / 20 poin')
        await expect(slab.locator('.admin-answer-fields').first()).toContainText('140 mm')
        await expect(slab.locator('.admin-answer-expected')).toContainText('150 mm')
        await review.scrollIntoViewIfNeeded()
        const bounds = await review.boundingBox()
        expect(bounds.x).toBeGreaterThanOrEqual(0)
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(mobile ? 390 : 1280)
        await page.screenshot({ path: testInfo.outputPath(`${language}-expanded-answer-review.png`) })
      }
      // Load the same saved responses through the actual participant result UI.
      await participantPage.evaluate(({ exerciseKey, answers, language, employeeId }) => {
        localStorage.setItem('cubicost:participant', JSON.stringify({ name: 'Review participant', jobTitle: 'Engineer', employeeId }))
        localStorage.setItem('cubicost-tas-tutorial-language-v1', language)
        localStorage.setItem(exerciseKey, JSON.stringify({ started: true, submitted: true, index: 0, answers }))
      }, { exerciseKey: exercise.storageKey, answers: record.answers, language, employeeId })
      await participantPage.goto(`${origin}${exercise.path}`)
      await expect(participantPage.locator('.exercise-result-heading strong')).toHaveCount(exercise.points.length)
      const participantScores = await participantPage.locator('.exercise-result-heading strong').allTextContents()
      expect(participantScores).toEqual(scored.scores.map((points, index) => `${points} / ${exercise.points[index]}`))
      await expect(participantPage.locator('.exercise-results article p')).toHaveText(definition.questions.map(question => question.explanation))
      await page.getByRole('button', { name: `${language === 'en' ? 'Details for' : 'Detail untuk'} ${record.name}`, exact: true }).click()
    }
    await page.getByRole('button', { name: `${language === 'en' ? 'Details for' : 'Detail untuk'} Unavailable`, exact: true }).click()
    const unavailable = page.locator(`[id="details-${old.attemptId}"]`)
    await expect(unavailable.locator('.admin-answer-fallback')).toContainText(language === 'en' ? 'unavailable' : 'tidak tersedia')
    await expect(unavailable.locator('.admin-answer-question, .admin-answer-status')).toHaveCount(0)
    await expect(unavailable.locator('.admin-answer-fields')).toContainText('q1:0')
    await expect(unavailable.locator('.admin-answer-fields')).toContainText('slabThickness:150')
    await environment.withSecurityRulesDisabled(async testContext => {
      for (const record of [...records, old]) {
        const saved = (await getDoc(doc(testContext.firestore(), 'testAttempts', record.attemptId))).data()
        expect(saved).toEqual(record)
      }
    })
  } finally { await participantPage.close(); await environment.cleanup() }
})
