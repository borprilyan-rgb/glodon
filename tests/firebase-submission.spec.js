import { test, expect } from '@playwright/test'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { collection, doc, setDoc, getDocs, getDoc, query, where } from 'firebase/firestore'
import { getSectionExercise } from '../src/data/sectionExercises.js'
import { answersFor } from './firebase/fixtures.mjs'
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { provisionAdmin, passwordSignIn } from './firebase/adminAuth.mjs'

const origin = 'http://127.0.0.1:5173'
const profile = { name: 'Firebase Test', jobTitle: 'Engineer', employeeId: '987654' }
const environment = () => initializeTestEnvironment({ projectId: 'demo-cubicost', firestore: { host: '127.0.0.1', port: 8080 } })
async function seed(page, exercise) {
  await page.goto(origin)
  await page.evaluate(({ profile, exerciseKey, answers, last }) => {
    localStorage.setItem('cubicost:participant', JSON.stringify(profile))
    localStorage.setItem(exerciseKey, JSON.stringify({ started: true, submitted: false, index: last, answers }))
    localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en')
  }, { profile, exerciseKey: exercise.storageKey, answers: answersFor(exercise), last: exercise.points.length - 1 })
  await page.goto(`${origin}${exercise.path}`)
}
async function submit(page) {
  await page.locator('.exercise-navigation button[type="submit"]').click()
  await expect(page.locator('.exercise-result')).toBeVisible()
}
async function localAttempt(page) {
  return page.evaluate(() => {
    const key = Object.keys(localStorage).find(key => key.startsWith('cubicost:firebase:attempt:'))
    return JSON.parse(localStorage.getItem(key))
  })
}

for (const course of ['tas', 'trb', 'tme']) test(`${course} submission receives a server timestamp and exact assessment metadata`, async ({ page }) => {
  const exercise = getSectionExercise(course, 1)
  await seed(page, exercise)
  await submit(page)
  await expect(page.locator('.central-submissions [role="status"]')).toHaveText('Saved centrally', { timeout: 20000 })
  const record = await localAttempt(page)
  const env = await environment()
  try {
    const snapshot = await env.authenticatedContext(record.payload.uid, { firebase: { sign_in_provider: 'anonymous' } }).firestore()
    const saved = (await getDoc(doc(snapshot, 'testAttempts', record.payload.attemptId))).data()
    expect(saved.employeeId).toBe('987654')
    expect(saved.answers).toEqual(answersFor(exercise))
    expect(saved.course).toBe(course)
    expect(saved.score).toBe(exercise.score(answersFor(exercise)).total)
    expect(saved.maximumScore).toBe(100)
    expect(saved.assessmentVersion).toBe(exercise.storageKey.match(/:(v\d+)$/)[1])
    expect(saved.submittedAt.toMillis()).toBeGreaterThan(0)
    expect(saved.scoreVerified).toBe(false)
  } finally { await env.cleanup() }
})

test('failed central save persists across refresh; acknowledgment retry cannot duplicate; retakes create a new record', async ({ page }) => {
  const exercise = getSectionExercise('tme', 2)
  await seed(page, exercise)
  await page.route('http://127.0.0.1:9099/**', route => route.abort())
  await submit(page)
  await expect(page.locator('.central-submissions [role="status"]')).toContainText('Central save failed', { timeout: 20000 })
  const first = await localAttempt(page)
  expect(first.status).toBe('failed')
  await page.unroute('http://127.0.0.1:9099/**')
  await page.reload()
  await expect(page.locator('.central-submissions [role="status"]')).toHaveText('Saved centrally', { timeout: 20000 })
  expect((await localAttempt(page)).payload.attemptId).toBe(first.payload.attemptId)
  await page.evaluate(id => {
    const key = `cubicost:firebase:attempt:${id}`
    const record = JSON.parse(localStorage.getItem(key))
    localStorage.setItem(key, JSON.stringify({ ...record, status: 'pending', confirmedAt: null }))
  }, first.payload.attemptId)
  await page.reload()
  await expect(page.locator('.central-submissions [role="status"]')).toHaveText('Saved centrally', { timeout: 20000 })
  await page.locator('.exercise-result button').click()
  await page.evaluate(({ key, answers }) => localStorage.setItem(key, JSON.stringify({ started: true, submitted: false, index: 4, answers })), { key: exercise.storageKey, answers: answersFor(exercise) })
  await page.reload()
  await submit(page)
  await expect(page.locator('.central-submissions [role="status"]')).toHaveText(['Saved centrally', 'Saved centrally'], { timeout: 20000 })
  const env = await environment()
  try {
    await env.withSecurityRulesDisabled(async context => {
      const matches = await getDocs(query(collection(context.firestore(), 'testAttempts'), where('employeeId', '==', profile.employeeId), where('course', '==', 'tme'), where('section', '==', 2)))
      expect(matches.size).toBe(2)
      expect(new Set(matches.docs.map(document => document.id)).size).toBe(2)
    })
  } finally { await env.cleanup() }
})

test('admin password identity is denied until its UID is authorized, then can filter and export CSV', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cubicost-tas-tutorial-language-v1', 'en'))
  await page.goto(`${origin}/admin/results`)
  await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible()
  await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
  const email = `admin-${randomUUID()}@example.test`
  const password = `Aa1!${randomUUID()}`
  const uid = await provisionAdmin(page, { email, password })
  await passwordSignIn(page, { email, password, uid, authorized: false })
  await expect(page.getByRole('alert')).toContainText('not authorized')
  await expect(page.getByRole('button', { name: 'Apply Filters', exact: true })).toHaveCount(0)
  const env = await environment()
  try {
    await env.withSecurityRulesDisabled(async context => { await setDoc(doc(context.firestore(), 'admins', uid), { enabled: true }) })
    await page.reload()

    await expect(page.getByRole('button', { name: 'Apply Filters', exact: true })).toBeVisible()
    await page.getByLabel('Employee ID', { exact: true }).fill('987654')
    await page.getByLabel('Course', { exact: true }).selectOption('tme')
    await page.getByLabel('Section', { exact: true }).selectOption('2')
    await page.getByRole('button', { name: 'Apply Filters', exact: true }).click()
    await expect(page.locator('.admin-result-row')).toHaveCount(2)
    await page.getByLabel('From date').fill('2050-01-01')
    await page.getByLabel('To date').fill('2050-01-01')
    await page.getByRole('button', { name: 'Apply Filters', exact: true }).click()
    await expect(page.locator('.admin-result-row')).toHaveCount(0)
    await page.getByLabel('From date').fill('')
    await page.getByLabel('To date').fill('')
    await page.getByRole('button', { name: 'Apply Filters', exact: true }).click()
    await expect(page.locator('.admin-result-row')).toHaveCount(2)
    const downloaded = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Export CSV' }).click()
    const download = await downloaded
    expect(download.suggestedFilename()).toBe('cubicost-test-results.csv')
    expect(await download.failure()).toBeNull()
    await download.saveAs('test-results/admin-results.csv')
    const csv = readFileSync('test-results/admin-results.csv', 'utf8')
    expect(csv).toContain('"attemptId"')
    expect(csv).toContain("'987654")
    expect(csv.split('\r\n')).toHaveLength(3)
    await page.getByRole('button', { name: 'Sign Out', exact: true }).click()
    await expect(page.locator('.admin-result-row')).toHaveCount(0)
  } finally { await env.cleanup() }
})
