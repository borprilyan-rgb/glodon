import { before, after, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { doc, setDoc, getDoc, getDocs, collection, updateDoc, deleteDoc, serverTimestamp, Timestamp, runTransaction } from 'firebase/firestore'
import { getSectionExercise } from '../../src/data/sectionExercises.js'
import { createSubmissionStore } from '../../src/firebase/submissionStore.js'
import { participant, answersFor } from './fixtures.mjs'

let environment
const provider = sign_in_provider => ({ firebase: { sign_in_provider } })
const db = (uid = 'alice', signIn = 'anonymous') => environment.authenticatedContext(uid, provider(signIn)).firestore()
function attempt(course = 'tme', section = 1, overrides = {}) {
  const exercise = getSectionExercise(course, section)
  const store = createSubmissionStore({ storage: () => { throw new Error('No local storage in rules tests') }, uuid: randomUUID })
  return { ...store.enqueue(exercise, participant, answersFor(exercise)).payload, uid: 'alice', submittedAt: serverTimestamp(), ...overrides }
}
before(async () => {
  assert.ok(process.env.FIRESTORE_EMULATOR_HOST, 'Run rules tests through npm run test:firebase; never against a production project.')
  environment = await initializeTestEnvironment({ projectId: 'demo-cubicost', firestore: { rules: readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8') } })
})
beforeEach(async () => { await environment.clearFirestore() })
after(async () => { await environment?.cleanup() })

test('all nine supported assessment schemas accept anonymous, server-timestamped attempts', async () => {
  for (const course of ['tas', 'trb', 'tme']) for (const section of [1, 2, 3]) {
    const data = attempt(course, section)
    const reference = doc(db(), 'testAttempts', data.attemptId)
    await assertSucceeds(setDoc(reference, data))
    const saved = await assertSucceeds(getDoc(reference))
    assert.ok(saved.data().submittedAt instanceof Timestamp)
    assert.equal(saved.data().scoreVerified, false)
  }
})

test('transaction retries are idempotent while all updates and deletes are denied', async () => {
  const database = db()
  const data = attempt()
  const reference = doc(database, 'testAttempts', data.attemptId)
  const submit = () => runTransaction(database, async transaction => {
    const existing = await transaction.get(reference)
    if (!existing.exists()) transaction.set(reference, data)
    return existing.exists()
  })
  const concurrent = await Promise.all([assertSucceeds(submit()), assertSucceeds(submit())])
  assert.deepEqual(concurrent.sort(), [false, true])
  assert.equal(await assertSucceeds(submit()), true)
  await assertFails(setDoc(reference, data))
  await assertFails(updateDoc(reference, { score: 100 }))
  await assertFails(deleteDoc(reference))
  await environment.withSecurityRulesDisabled(async context => { assert.equal((await getDocs(collection(context.firestore(), 'testAttempts'))).size, 1) })
})

test('participants cannot read others, list attempts, spoof ownership or promote themselves', async () => {
  const data = attempt()
  await assertSucceeds(setDoc(doc(db(), 'testAttempts', data.attemptId), data))
  await assertFails(getDoc(doc(db('bob'), 'testAttempts', data.attemptId)))
  await assertFails(getDocs(collection(db(), 'testAttempts')))
  await assertFails(setDoc(doc(db('bob'), 'testAttempts', randomUUID()), attempt()))
  await assertFails(setDoc(doc(db(), 'admins', 'alice'), { enabled: true }))
  await assertFails(setDoc(doc(db('alice', 'google.com'), 'admins', 'alice'), { enabled: true }))
  await assertFails(getDoc(doc(environment.unauthenticatedContext().firestore(), 'testAttempts', data.attemptId)))
  await assertFails(setDoc(doc(environment.unauthenticatedContext().firestore(), 'testAttempts', randomUUID()), attempt()))
})

test('only enabled admin UIDs with password tokens can list all results; admins cannot alter results', async () => {
  await environment.withSecurityRulesDisabled(async context => { await setDoc(doc(context.firestore(), 'admins', 'admin'), { enabled: true }) })
  const data = attempt()
  await setDoc(doc(db(), 'testAttempts', data.attemptId), data)
  const admin = db('admin', 'password')
  await assertSucceeds(getDocs(collection(admin, 'testAttempts')))
  await assertSucceeds(getDoc(doc(admin, 'testAttempts', data.attemptId)))
  const passwordAdmin = admin
  await assertFails(getDoc(doc(db('admin', 'google.com'), 'admins', 'admin')))
  await assertFails(getDocs(collection(db('admin', 'google.com'), 'testAttempts')))
  await assertFails(getDoc(doc(db('admin', 'google.com'), 'testAttempts', data.attemptId)))
  await assertSucceeds(getDoc(doc(passwordAdmin, 'admins', 'admin')))
  await assertSucceeds(getDocs(collection(passwordAdmin, 'testAttempts')))
  await assertSucceeds(getDoc(doc(passwordAdmin, 'testAttempts', data.attemptId)))
  await assertFails(getDocs(collection(db('stranger', 'google.com'), 'testAttempts')))
  await assertFails(getDocs(collection(db('stranger', 'password'), 'testAttempts')))
  await assertFails(getDocs(collection(db('admin', 'custom'), 'testAttempts')))
  await assertFails(setDoc(doc(passwordAdmin, 'admins', 'admin'), { enabled: true }))
  await assertFails(updateDoc(doc(passwordAdmin, 'admins', 'admin'), { enabled: false }))
  await assertFails(deleteDoc(doc(passwordAdmin, 'admins', 'admin')))
  await assertFails(getDocs(collection(passwordAdmin, 'admins')))
  await assertFails(deleteDoc(doc(passwordAdmin, 'testAttempts', data.attemptId)))
  await assertFails(getDocs(collection(db('admin', 'anonymous'), 'testAttempts')))
  await assertFails(updateDoc(doc(admin, 'testAttempts', data.attemptId), { score: 0 }))
  await assertFails(updateDoc(doc(passwordAdmin, 'testAttempts', data.attemptId), { score: 0 }))
  await assertFails(setDoc(doc(admin, 'testAttempts', randomUUID()), attempt('tme', 1, { uid: 'admin' })))
  await environment.withSecurityRulesDisabled(async context => { await updateDoc(doc(context.firestore(), 'admins', 'admin'), { enabled: false }) })
  await assertFails(getDocs(collection(admin, 'testAttempts')))
  await assertFails(getDocs(collection(passwordAdmin, 'testAttempts')))
})

test('invalid identity, scoring, dates, versions, answer types and extra fields are denied', async () => {
  const invalid = [
    { employeeId: '001-A' }, { employeeId: '12345' }, { employeeId: 123456 }, { name: ' ' }, { jobTitle: 'x'.repeat(101) },
    { score: 101 }, { score: -1 }, { score: 1.5 }, { maximumScore: 200 }, { passed: 'true' }, { passed: true, score: 20 },
    { scoreVerified: true }, { submittedAt: Timestamp.fromMillis(0) }, { course: 'unknown' }, { section: 4 }, { section: '1' },
    { assessmentVersion: 'v999' }, { answers: { q1: {} } }, { answers: { q1: '0', q2: '0', q3: '0', q4: '0', q5: '0', extra: '0' } },
    { answers: { q1: '0', q2: '0', q3: '0', q4: '0', q5: '99' } }, { uid: 'bob' }, { extra: 'injected' },
  ]
  for (const fields of invalid) {
    const data = attempt('tme', 1, fields)
    await assertFails(setDoc(doc(db(), 'testAttempts', data.attemptId), data))
  }
  const missing = attempt()
  delete missing.name
  await assertFails(setDoc(doc(db(), 'testAttempts', missing.attemptId), missing))
  const mismatch = attempt()
  await assertFails(setDoc(doc(db(), 'testAttempts', randomUUID()), mismatch))
})
