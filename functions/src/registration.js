import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { HttpsError } from 'firebase-functions/v2/https'
import { FieldValue } from 'firebase-admin/firestore'

const digest = value => createHash('sha256').update(value).digest('hex')
const fail = (code, message) => { throw new HttpsError(code, message) }
export function validateRegistration(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).some(k => !['name', 'employeeId', 'password', 'registrationId', 'recoverySecret'].includes(k))) fail('invalid-argument', 'Invalid registration.')
  if (typeof data.name !== 'string' || !data.name.trim() || data.name.trim().length > 100 || !/^[0-9]{6}$/.test(data.employeeId || '') || typeof data.employeeId !== 'string') fail('invalid-argument', 'Enter a name and a six-digit employee number.')
  if (typeof data.password !== 'string' || data.password.length < 8 || data.password.length > 128) fail('invalid-argument', 'Password must contain 8–128 characters.')
  if (!/^[a-f0-9-]{36}$/.test(data.registrationId || '') || !/^[a-f0-9]{64}$/.test(data.recoverySecret || '')) fail('invalid-argument', 'Invalid recovery authorization.')
  return { ...data, name: data.name.trim() }
}
export function createRegistrationService({ db, auth, domain, afterAuthCreated = async () => {} }) {
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain || '')) throw new Error('Configure EMPLOYEE_AUTH_DOMAIN before enabling registration.')
  async function activate(reference, reservation) {
    const user = await auth.getUser(reservation.uid)
    if (user.email !== reservation.syntheticEmail || user.disabled || !user.providerData.some(p => p.providerId === 'password')) fail('failed-precondition', 'Account provisioning requires review.')
    const employee = db.doc('employees/' + reservation.uid)
    await db.runTransaction(async tx => {
      const [current, profile] = await Promise.all([tx.get(reference), tx.get(employee)])
      if (!current.exists || current.data().registrationId !== reservation.registrationId) fail('failed-precondition', 'Registration changed.')
      if (profile.exists) {
        if (profile.data().employeeId !== reference.id || profile.data().name !== reservation.name || profile.data().status !== 'active') fail('failed-precondition', 'Account is unavailable.')
      } else {
        tx.create(employee, { schemaVersion: 1, employeeId: reference.id, name: reservation.name, jobTitle: 'Not provided', role: 'employee', status: 'active', sessionValidAfter: 0, resetGeneration: 0, activeResetRequestId: null, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() })
      }
      if (current.data().state !== 'active') {
        tx.update(reference, { state: 'active', updatedAt: FieldValue.serverTimestamp() })
        tx.create(db.doc('accountAuditEvents/registration-' + reservation.registrationId), { type: 'registration', subjectUid: reservation.uid, actorUid: reservation.uid, outcome: 'completed', createdAt: FieldValue.serverTimestamp() })
      }
    })
    return { syntheticEmail: reservation.syntheticEmail }
  }
  async function register(input) {
    const data = validateRegistration(input)
    const reference = db.doc('employeeNumbers/' + data.employeeId)
    const secretHash = digest(data.recoverySecret)
    const proposed = { uid: randomUUID(), syntheticEmail: 'e-' + randomBytes(16).toString('hex') + '@' + domain, name: data.name, registrationId: data.registrationId, recoverySecretHash: secretHash, state: 'reserved', createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }
    const reservation = await db.runTransaction(async tx => {
      const current = await tx.get(reference)
      if (current.exists) {
        const saved = current.data()
        if (saved.registrationId !== data.registrationId || saved.recoverySecretHash !== secretHash || saved.name !== data.name) fail('already-exists', 'Employee number is unavailable.')
        return saved
      }
      tx.create(reference, proposed)
      return proposed
    })
    // Never put an Auth mutation inside a retryable Firestore transaction.
    try {
      await auth.createUser({ uid: reservation.uid, email: reservation.syntheticEmail, password: data.password, displayName: reservation.name })
    } catch (error) {
      if (!['auth/uid-already-exists', 'auth/email-already-exists'].includes(error.code)) fail('unavailable', 'Registration interrupted. Retry with the same details and original password.')
    }
    await afterAuthCreated()
    return activate(reference, reservation)
  }
  async function resolve(employeeId) {
    if (typeof employeeId !== 'string' || !/^[0-9]{6}$/.test(employeeId)) fail('invalid-argument', 'Enter a six-digit employee number.')
    const reference = db.doc('employeeNumbers/' + employeeId)
    const record = await reference.get()
    if (record.exists) {
      // A valid Auth account can recover a lost profile-creation response from any device.
      try { return await activate(reference, record.data()) } catch (error) {
        if (error.code !== 'auth/user-not-found') throw new HttpsError('unavailable', 'Sign-in is unavailable.')
      }
    }
    return { syntheticEmail: 'e-' + randomBytes(16).toString('hex') + '@' + domain }
  }
  return { register, resolve }
}
export async function consumeRateLimit(db, { ip, action, employeeId, now = Date.now() }) {
  const bucket = Math.floor(now / 60000)
  const limits = [[action + ':ip:' + ip, action === 'register' ? 10 : 30], [action + ':employee:' + employeeId, action === 'register' ? 5 : 15]]
  const refs = limits.map(([key]) => db.doc('accountRateLimits/' + digest(key)))
  await db.runTransaction(async tx => {
    const records = await Promise.all(refs.map(ref => tx.get(ref)))
    const counts = records.map(record => record.exists && record.data().bucket === bucket ? record.data().count : 0)
    if (counts.some((count, i) => count >= limits[i][1])) fail('resource-exhausted', 'Too many attempts. Try again later.')
    refs.forEach((ref, i) => tx.set(ref, { bucket, count: counts[i] + 1 }))
  })
}
