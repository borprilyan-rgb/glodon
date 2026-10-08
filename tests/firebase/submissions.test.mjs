import { test } from 'node:test'
import assert from 'node:assert/strict'
import { setImmediate as nextTurn } from 'node:timers/promises'
import { createSubmissionStore, OUTBOX_PREFIX } from '../../src/firebase/submissionStore.js'
import { getSectionExercise } from '../../src/data/sectionExercises.js'
import { answersFor } from './fixtures.mjs'
import { resultsCsv, jakartaDateRange } from '../../src/firebase/resultsCsv.js'

const profile = { name: 'Ayu', jobTitle: 'Engineer', employeeId: '000012' }
const receipt = '2026-10-08T01:00:00.000Z'
function memoryStorage() {
  const values = new Map()
  return { get length() { return values.size }, key: index => [...values.keys()][index], getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) }
}
function setup(overrides = {}) {
  const local = memoryStorage()
  let nextId = 0
  return { local, store: createSubmissionStore({ storage: () => local, uuid: () => `00000000-0000-4000-8000-${String(++nextId).padStart(12, '0')}`, authenticate: async () => 'anonymous-uid', send: async () => receipt, ...overrides }) }
}

test('all nine assessments produce participant, answers, scoring, version and unverified metadata', () => {
  for (const course of ['tas', 'trb', 'tme']) for (const section of [1, 2, 3]) {
    const exercise = getSectionExercise(course, section)
    const answers = answersFor(exercise)
    const { store } = setup()
    const record = store.enqueue(exercise, profile, answers)
    assert.deepEqual(record.payload.answers, answers)
    assert.equal(record.payload.score, exercise.score(answers).total)
    assert.equal(record.payload.passed, exercise.score(answers).passed)
    assert.equal(record.payload.maximumScore, 100)
    assert.equal(record.payload.course, course)
    assert.equal(record.payload.section, section)
    assert.equal(record.payload.employeeId, '000012')
    assert.equal(record.payload.assessmentVersion, exercise.storageKey.match(/:(v\d+)$/)[1])
    assert.equal(record.payload.scoreVerified, false)
    assert.equal(record.status, 'pending')
  }
})

test('duplicate submit and simultaneous retries share one ID and only report saved after confirmation', async () => {
  let confirm
  let calls = 0
  const { store } = setup({ send: async () => { calls++; return new Promise(resolve => { confirm = resolve }) } })
  const exercise = getSectionExercise('tme', 1)
  const answers = answersFor(exercise)
  const id = store.begin(exercise)
  store.enqueue(exercise, profile, answers)
  store.enqueue(exercise, profile, Object.fromEntries(Object.entries(answers).reverse()))
  const first = store.sync(id)
  const second = store.sync(id)
  await nextTurn()
  assert.equal(calls, 1)
  assert.equal(store.getSnapshot().length, 1)
  assert.equal(store.getSnapshot()[0].status, 'saving')
  assert.equal(store.getSnapshot()[0].confirmedAt, null)
  confirm(receipt)
  await Promise.all([first, second])
  assert.equal(store.getSnapshot()[0].status, 'saved')
  assert.equal(store.getSnapshot()[0].confirmedAt, receipt)
})

test('failed submission survives reload and retries with its original payload, UID and ID', async () => {
  const { local, store } = setup({ send: async () => { throw new Error('Disconnected') } })
  const exercise = getSectionExercise('trb', 1)
  const record = store.enqueue(exercise, profile, answersFor(exercise))
  await store.sync(record.payload.attemptId)
  assert.equal(store.getSnapshot()[0].status, 'failed')
  let received
  const recovered = createSubmissionStore({ storage: () => local, authenticate: async () => 'anonymous-uid', send: async payload => { received = payload; return receipt } })
  assert.equal(recovered.getSnapshot()[0].status, 'pending')
  await recovered.syncPending()
  assert.equal(received.attemptId, record.payload.attemptId)
  assert.equal(received.uid, 'anonymous-uid')
  assert.equal(recovered.getSnapshot()[0].status, 'saved')
})

test('retakes have distinct IDs and retain earlier pending records', () => {
  const { store } = setup()
  const exercise = getSectionExercise('tas', 1)
  const first = store.enqueue(exercise, profile, answersFor(exercise))
  store.startNew(exercise)
  const second = store.enqueue(exercise, profile, answersFor(exercise))
  assert.notEqual(first.payload.attemptId, second.payload.attemptId)
  assert.equal(store.getSnapshot().length, 2)
  assert.equal(store.getSnapshot()[0].status, 'pending')
})

test('denied storage is explicit; in-memory retry still works', async () => {
  const { store } = setup({ storage: () => { throw new Error('Storage blocked') } })
  const exercise = getSectionExercise('tme', 2)
  const record = store.enqueue(exercise, profile, answersFor(exercise))
  assert.equal(record.localSaved, false)
  await store.sync(record.payload.attemptId)
  assert.equal(store.getSnapshot()[0].status, 'saved')
  assert.equal(store.getSnapshot()[0].localSaved, false)
})

test('authentication changes never silently transfer a pending attempt to a new owner', async () => {
  const { local, store } = setup({ send: async () => { throw new Error('Disconnected') } })
  const exercise = getSectionExercise('tme', 1)
  const record = store.enqueue(exercise, profile, answersFor(exercise))
  await store.sync(record.payload.attemptId)
  let writes = 0
  const recovered = createSubmissionStore({ storage: () => local, authenticate: async () => 'different-uid', send: async () => { writes++; return receipt } })
  await recovered.syncPending()
  assert.equal(writes, 0)
  assert.equal(recovered.getSnapshot()[0].status, 'failed')
  assert.equal(recovered.getSnapshot()[0].payload.uid, 'anonymous-uid')
})

test('timeout remains pending; late authentication cannot overwrite the failed state', async () => {
  let authenticate
  let writes = 0
  const { store } = setup({ timeoutMs: 10, authenticate: () => new Promise(resolve => { authenticate = resolve }), send: async () => { writes++; return receipt } })
  const exercise = getSectionExercise('tme', 3)
  const record = store.enqueue(exercise, profile, answersFor(exercise))
  await store.sync(record.payload.attemptId)
  assert.equal(store.getSnapshot()[0].status, 'failed')
  authenticate('anonymous-uid')
  await nextTurn()
  assert.equal(writes, 0)
  assert.equal(store.getSnapshot()[0].status, 'failed')
})

test('unconfirmed saved flags and malformed local records cannot report a confirmed save', () => {
  const { local, store: original } = setup()
  const exercise = getSectionExercise('tme', 1)
  const record = original.enqueue(exercise, profile, answersFor(exercise))
  local.setItem(`${OUTBOX_PREFIX}broken`, '{bad json')
  local.setItem(`${OUTBOX_PREFIX}${record.payload.attemptId}`, JSON.stringify({ ...record, status: 'saved', confirmedAt: 'invalid date', error: {} }))
  const malformedId = '00000000-0000-4000-8000-000000000002'
  local.setItem(`${OUTBOX_PREFIX}${malformedId}`, JSON.stringify({ ...record, payload: { ...record.payload, attemptId: malformedId, section: {} } }))
  const store = createSubmissionStore({ storage: () => local })
  assert.equal(store.getSnapshot().length, 1)
  assert.equal(store.getSnapshot()[0].status, 'pending')
  assert.equal(store.getSnapshot()[0].confirmedAt, null)
  assert.equal(store.getSnapshot()[0].error, null)
  assert.equal(local.getItem(`${OUTBOX_PREFIX}broken`), '{bad json')
  assert.ok(local.getItem(`${OUTBOX_PREFIX}${malformedId}`), 'Malformed records are retained, not deleted')
})

test('incomplete answers and invalid employee IDs never enter the queue', () => {
  const { store } = setup()
  const exercise = getSectionExercise('tme', 1)
  assert.throws(() => store.enqueue(exercise, profile, {}), /incomplete/)
  assert.throws(() => store.enqueue(exercise, { ...profile, employeeId: '001-A' }, answersFor(exercise)), /participant/)
  assert.equal(store.getSnapshot().length, 0)
})

test('CSV preserves answers and six-digit IDs, quotes delimiters and blocks spreadsheet formulas', () => {
  const csv = resultsCsv([{ ...profile, name: '=HYPERLINK("bad")', jobTitle: 'Engineer, "QS"', answers: { q1: '0' } }])
  assert.ok(csv.includes('"\'=HYPERLINK(""bad"")"'))
  assert.ok(csv.includes('"\'000012"'))
  assert.ok(csv.includes('"Engineer, ""QS"""'))
  assert.ok(csv.includes('"{""q1"":""0""}"'))
})

test('admin date boundaries use Jakarta calendar days and reject reversed ranges', () => {
  const range = jakartaDateRange('2026-10-08', '2026-10-08')
  assert.equal(range.from.toISOString(), '2026-10-07T17:00:00.000Z')
  assert.equal(range.until.toISOString(), '2026-10-08T17:00:00.000Z')
  assert.throws(() => jakartaDateRange('2026-10-09', '2026-10-08'), /end date/)
  assert.throws(() => jakartaDateRange('2026-02-31', ''), /valid date/)
})
