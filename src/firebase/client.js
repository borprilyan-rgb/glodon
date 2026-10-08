import { initializeApp, getApps } from 'firebase/app'
import { initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence, inMemoryPersistence, browserPopupRedirectResolver, connectAuthEmulator, signInAnonymously, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, doc, runTransaction, serverTimestamp, getDocFromServer, collection, query, where, orderBy, limit, startAfter, getDocsFromServer, Timestamp } from 'firebase/firestore'
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
let anonymousSignIn

export function getServices(role = 'participant') {
  if (import.meta.env.VITE_FIREBASE_ENABLED === 'false' || !config.apiKey || !config.projectId || !config.appId || !config.authDomain) throw new Error('Firebase is not configured. Your result remains pending in this browser.')
  if (services.has(role)) return services.get(role)
  const name = `cubicost-${role}`
  const app = getApps().find(app => app.name === name) || initializeApp(config, name)
  const auth = initializeAuth(app, {
    persistence: role === 'admin' ? [browserSessionPersistence, inMemoryPersistence] : [indexedDBLocalPersistence, browserLocalPersistence, inMemoryPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
  })
  const db = getFirestore(app)
  if (import.meta.env.VITE_FIREBASE_USE_EMULATORS === 'true') {
    if (!config.projectId.startsWith('demo-')) throw new Error('Emulator mode requires a demo- project ID.')
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    connectFirestoreEmulator(db, '127.0.0.1', 8080)
  }
  const result = { auth, db }
  services.set(role, result)
  return result
}

export async function participantUid() {
  const { auth } = getServices()
  await auth.authStateReady()
  if (!auth.currentUser) {
    anonymousSignIn ||= signInAnonymously(auth).finally(() => { anonymousSignIn = null })
    await anonymousSignIn
  }
  if (!auth.currentUser.isAnonymous) throw new Error('Participant submissions require an anonymous session.')
  return auth.currentUser.uid
}

function matchesRecord(actual, expected) {
  return Object.keys(expected).every(key => key === 'answers'
    ? Object.keys(expected.answers).length === Object.keys(actual.answers || {}).length && Object.entries(expected.answers).every(([field, value]) => actual.answers?.[field] === value)
    : actual[key] === expected[key])
}

// Transactions read from the server and only create absent documents. Retried
// requests confirm the same immutable payload rather than issuing an update.
export async function sendAttempt(payload) {
  const { db } = getServices()
  if (await participantUid() !== payload.uid) throw new Error('The original anonymous sign-in is no longer available. This attempt is still pending; restore the original browser session before retrying.')
  const reference = doc(db, 'testAttempts', payload.attemptId)
  await runTransaction(db, async transaction => {
    const existing = await transaction.get(reference)
    if (existing.exists()) {
      if (!matchesRecord(existing.data(), payload)) throw new Error('This attempt ID already belongs to different submitted data.')
    } else {
      transaction.set(reference, { ...payload, submittedAt: serverTimestamp() })
    }
  }, { maxAttempts: 3 })
  const confirmation = await getDocFromServer(reference)
  if (!confirmation.exists() || !matchesRecord(confirmation.data(), payload) || !confirmation.data().submittedAt) throw new Error('The server has not confirmed this attempt.')
  return confirmation.data().submittedAt.toDate().toISOString()
}

export const signInAdmin = () => signInWithPopup(getServices('admin').auth, new GoogleAuthProvider())
export const signOutAdmin = () => signOut(getServices('admin').auth)
export const observeAdmin = callback => onAuthStateChanged(getServices('admin').auth, callback)
export async function isAuthorizedAdmin(user) {
  if (!user?.providerData.some(provider => provider.providerId === 'google.com')) return false
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
