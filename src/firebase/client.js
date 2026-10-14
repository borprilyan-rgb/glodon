import { initializeApp, getApps } from 'firebase/app'
import { initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence, inMemoryPersistence, connectAuthEmulator, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, doc, getDocFromServer, collection, query, where, orderBy, limit, startAfter, getDocsFromServer, Timestamp } from 'firebase/firestore'
import { jakartaDateRange } from './resultsCsv.js'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
const services = new Map()

export function getServices(role = 'participant') {
  if (import.meta.env.VITE_FIREBASE_ENABLED === 'false' || !config.apiKey || !config.projectId || !config.appId || !config.authDomain) throw new Error('Firebase is not configured. Your result remains pending in this browser.')
  if (services.has(role)) return services.get(role)
  const name = `cubicost-${role}`
  const app = getApps().find(app => app.name === name) || initializeApp(config, name)
  const auth = initializeAuth(app, {
    persistence: role === 'admin' ? [browserSessionPersistence, inMemoryPersistence] : [indexedDBLocalPersistence, browserLocalPersistence, inMemoryPersistence],
  })
  const db = getFirestore(app)
  if (import.meta.env.VITE_FIREBASE_USE_EMULATORS === 'true') {
    if (!config.projectId.startsWith('demo-')) throw new Error('Emulator mode requires a demo- project ID.')
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    connectFirestoreEmulator(db, '127.0.0.1', 8080)
  }
  const result = { auth, db, app }
  services.set(role, result)
  return result
}

// Phase 4 is not enabled. No anonymous or employee assessment writes are allowed.
export async function participantUid() { throw new Error('Employee assessment submission is not enabled yet.') }
export async function sendAttempt() { throw new Error('Employee assessment submission is not enabled yet.') }

export const signInAdmin = (email, password) => signInWithEmailAndPassword(getServices('admin').auth, email.trim(), password)
export const resetAdminPassword = email => sendPasswordResetEmail(getServices('admin').auth, email.trim())
export const signOutAdmin = () => signOut(getServices('admin').auth)
export const observeAdmin = callback => onAuthStateChanged(getServices('admin').auth, callback)
export async function isAuthorizedAdmin(user) {
  if (!user || user.isAnonymous || (await user.getIdTokenResult()).signInProvider !== 'password') return false
  const record = await getDocFromServer(doc(getServices('admin').db, 'admins', user.uid))
  return record.exists() && record.data().enabled === true
}

export async function fetchResults(filters = {}, cursor = null) {
  const constraints = []
  for (const field of ['employeeId', 'course', 'section']) {
    if (filters[field]) constraints.push(where(field, '==', field === 'section' ? Number(filters[field]) : filters[field]))
  }
  const { from, until } = jakartaDateRange(filters.from, filters.until)
  if (from) constraints.push(where('submittedAt', '>=', Timestamp.fromDate(from)))
  if (until) constraints.push(where('submittedAt', '<', Timestamp.fromDate(until)))
  constraints.push(orderBy('submittedAt', 'desc'))
  if (cursor) constraints.push(startAfter(cursor))
  constraints.push(limit(100))
  const page = await getDocsFromServer(query(collection(getServices('admin').db, 'testAttempts'), ...constraints))
  return { rows: page.docs.map(document => ({ ...document.data(), submittedAt: document.data().submittedAt.toDate().toISOString() })), cursor: page.docs.at(-1), hasMore: page.size === 100 }
}
