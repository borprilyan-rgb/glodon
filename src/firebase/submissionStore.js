export const OUTBOX_PREFIX = 'cubicost:firebase:attempt:'

function validStoredPayload(payload) {
  return payload && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(payload.attemptId)
    && ['name', 'jobTitle', 'employeeId', 'assessmentVersion'].every(field => typeof payload[field] === 'string')
    && /^\d{6}$/.test(payload.employeeId) && ['tas', 'trb', 'tme'].includes(payload.course)
    && Number.isInteger(payload.section) && payload.section >= 1 && payload.section <= 3
    && Number.isInteger(payload.score) && payload.score >= 0 && payload.score <= 100 && payload.maximumScore === 100
    && typeof payload.passed === 'boolean' && payload.scoreVerified === false
    && (payload.uid === undefined || typeof payload.uid === 'string')
    && payload.answers && typeof payload.answers === 'object' && !Array.isArray(payload.answers)
    && Object.values(payload.answers).every(value => typeof value === 'string')
}

function payloadFor(exercise, profile, answers, id) {
  if (!/^\d{6}$/.test(profile.employeeId) || !profile.name?.trim() || !profile.jobTitle?.trim()) throw new Error('Complete the participant details before submitting.')
  if (!exercise.copy.en.questions.every((_, index) => exercise.answered(index, answers))) throw new Error('This assessment has incomplete answers.')
  const score = exercise.score(answers)
  return {
    attemptId: id, name: profile.name.trim(), jobTitle: profile.jobTitle.trim(), employeeId: profile.employeeId,
    course: exercise.product, section: exercise.section, answers: { ...answers }, score: score.total,
    maximumScore: exercise.points.reduce((total, points) => total + points, 0), passed: score.passed,
    assessmentVersion: exercise.storageKey.match(/:(v\d+)$/)?.[1], scoreVerified: false,
  }
}

export function createSubmissionStore({ storage = () => localStorage, uuid = () => crypto.randomUUID(), authenticate, send, timeoutMs = 15000 } = {}) {
  const records = new Map()
  const active = new Map()
  const listeners = new Set()
  const flights = new Map()
  let snapshot = []
  let loaded = false
  const emit = () => { snapshot = [...records.values()]; listeners.forEach(listener => listener()) }
  function load() {
    if (loaded) return
    loaded = true
    try {
      const local = storage()
      for (let index = 0; index < local.length; index++) {
        const key = local.key(index)
        if (!key?.startsWith(OUTBOX_PREFIX)) continue
        try {
          const record = JSON.parse(local.getItem(key))
          if (!validStoredPayload(record?.payload) || key !== `${OUTBOX_PREFIX}${record.payload.attemptId}`) continue
          const confirmedAt = typeof record.confirmedAt === 'string' && Number.isFinite(Date.parse(record.confirmedAt)) ? record.confirmedAt : null
          records.set(record.payload.attemptId, { ...record, confirmedAt, error: typeof record.error === 'string' ? record.error : null, status: record.status === 'saved' && confirmedAt ? 'saved' : 'pending', localSaved: true })
        } catch { /* Preserve malformed local records without crashing or sending them. */ }
      }
    } catch { /* New submissions still work in memory when browser storage is denied. */ }
    emit()
  }
  function persist(record) {
    const next = { ...record, localSaved: true }
    try { storage().setItem(`${OUTBOX_PREFIX}${record.payload.attemptId}`, JSON.stringify(next)) }
    catch { next.localSaved = false }
    records.set(record.payload.attemptId, next)
    emit()
    return next
  }
  function marker(exercise) {
    if (active.has(exercise.storageKey)) return active.get(exercise.storageKey)
    try {
      const saved = JSON.parse(storage().getItem(`${exercise.storageKey}:attempt`))
      if (/^[\w-]{36}$/.test(saved?.id)) { active.set(exercise.storageKey, saved); return saved }
    } catch { /* No recoverable active attempt. */ }
    return null
  }
  function saveMarker(exercise, value) {
    active.set(exercise.storageKey, value)
    try { storage().setItem(`${exercise.storageKey}:attempt`, JSON.stringify(value)) } catch { /* UI warns when the outbox cannot persist. */ }
    return value.id
  }
  function startNew(exercise) { return saveMarker(exercise, { id: uuid(), submitted: false }) }
  function begin(exercise) { const current = marker(exercise); return current && !current.submitted ? current.id : startNew(exercise) }
  function enqueue(exercise, profile, answers) {
    load()
    const id = marker(exercise)?.id || begin(exercise)
    const payload = payloadFor(exercise, profile, answers, id)
    const existing = records.get(id)
    if (existing) {
      const same = Object.keys(payload).every(key => key === 'answers' ? Object.keys(payload.answers).length === Object.keys(existing.payload.answers).length && Object.entries(payload.answers).every(([field, value]) => existing.payload.answers[field] === value) : payload[key] === existing.payload[key])
      if (!same) throw new Error('Start a new attempt before changing submitted answers.')
      return existing
    }
    const record = persist({ payload, status: 'pending', confirmedAt: null, error: null })
    saveMarker(exercise, { id, submitted: true })
    return record
  }
  async function sync(id) {
    load()
    if (flights.has(id)) return flights.get(id)
    const record = records.get(id)
    if (!record || record.status === 'saved') return record
    const operation = (async () => {
      let current = persist({ ...record, status: 'saving', error: null })
      let timer
      let finished = false
      try {
        const confirmedAt = await Promise.race([
          (async () => {
            const uid = await authenticate()
            if (finished) throw new Error('Authentication completed after the confirmation timeout. Retry this pending attempt.')
            if (current.payload.uid && current.payload.uid !== uid) throw new Error('The original anonymous session changed. This attempt remains pending.')
            current = persist({ ...current, payload: { ...current.payload, uid } })
            return send(current.payload)
          })(),
          new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Server confirmation timed out. The attempt remains pending; retry safely.')), timeoutMs) }),
        ])
        return persist({ ...current, status: 'saved', confirmedAt, error: null })
      } catch (error) {
        return persist({ ...current, status: 'failed', error: error.message || 'Central saving failed. Please retry.' })
      } finally { finished = true; clearTimeout(timer) }
    })()
    flights.set(id, operation)
    try { return await operation } finally { flights.delete(id) }
  }
  return {
    begin, startNew, enqueue, sync,
    syncPending() { load(); return Promise.all([...records.values()].filter(record => record.status !== 'saved').map(record => sync(record.payload.attemptId))) },
    subscribe(listener) { load(); listeners.add(listener); return () => listeners.delete(listener) },
    getSnapshot() { load(); return snapshot },
  }
}

const client = () => import('./client.js')
export const submissionStore = createSubmissionStore({
  authenticate: async () => (await client()).participantUid(),
  send: async payload => (await client()).sendAttempt(payload),
})
