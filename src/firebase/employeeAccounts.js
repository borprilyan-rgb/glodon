import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { doc, getDocFromServer } from 'firebase/firestore'
import { getServices } from './client'
import { firebaseConnectionsEnabled } from '../data/backendMode.js'

let functions
const registrationRecovery = new Map()
export const employeeAuthEnabled = firebaseConnectionsEnabled && import.meta.env.VITE_EMPLOYEE_AUTH_ENABLED === 'true'
function backend() {
  if (!employeeAuthEnabled) throw new Error('Employee account services are not enabled in this environment.')
  if (!functions) {
    const { app } = getServices('employee')
    const emulator = import.meta.env.VITE_FIREBASE_USE_EMULATORS === 'true'
    if (!emulator) {
      const siteKey = import.meta.env.VITE_EMPLOYEE_APP_CHECK_SITE_KEY
      if (!siteKey) throw new Error('Employee account services require App Check configuration.')
      initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(siteKey), isTokenAutoRefreshEnabled: true })
    }
    functions = getFunctions(app, 'asia-southeast2')
    if (emulator) connectFunctionsEmulator(functions, '127.0.0.1', 5001)
  }
  return functions
}
export function validEmployeeProfile(profile) {
  return profile?.schemaVersion === 1 && profile.role === 'employee' && profile.status === 'active'
    && typeof profile.employeeId === 'string' && /^[0-9]{6}$/.test(profile.employeeId)
    && typeof profile.name === 'string' && !!profile.name.trim() && profile.name.length <= 100
    && typeof profile.jobTitle === 'string' && Number.isInteger(profile.sessionValidAfter)
}
export async function loadEmployeeProfile(user) {
  if (!firebaseConnectionsEnabled) throw new Error('Firebase connections are temporarily disabled.')
  if (!user || user.isAnonymous) throw new Error('An active employee account is required.')
  const token = await user.getIdTokenResult()
  if (token.signInProvider !== 'password') throw new Error('An active employee account is required.')
  const snapshot = await getDocFromServer(doc(getServices('employee').db, 'employees', user.uid))
  const profile = snapshot.data()
  if (!snapshot.exists() || !validEmployeeProfile(profile) || token.claims.auth_time <= profile.sessionValidAfter) throw new Error('This employee account is unavailable. Contact an administrator.')
  return { ...profile, uid: user.uid }
}
export async function loginEmployee(employeeId, password) {
  const { data } = await httpsCallable(backend(), 'resolveEmployeeLogin')({ employeeId })
  await signInWithEmailAndPassword(getServices('employee').auth, data.syntheticEmail, password)
}
export async function registerEmployee({ name, employeeId, password }) {
  const key = 'cubicost:employee-registration:' + employeeId
  let recovery = registrationRecovery.get(key)
  try { recovery = JSON.parse(sessionStorage.getItem(key)) || recovery } catch { /* Retain the in-memory recovery secret when storage is unavailable. */ }
  if (!recovery || recovery.name !== name.trim()) {
    recovery = { name: name.trim(), registrationId: crypto.randomUUID(), recoverySecret: [...crypto.getRandomValues(new Uint8Array(32))].map(b => b.toString(16).padStart(2, '0')).join('') }
    try { sessionStorage.setItem(key, JSON.stringify(recovery)) } catch { /* Backend login can finish provisioning once Auth exists. */ }
  }
  registrationRecovery.set(key, recovery)
  const { data } = await httpsCallable(backend(), 'registerEmployee')({ ...recovery, employeeId, password })
  await signInWithEmailAndPassword(getServices('employee').auth, data.syntheticEmail, password)
  registrationRecovery.delete(key)
  try { sessionStorage.removeItem(key) } catch { /* No password is stored. */ }
}
export const observeEmployee = callback => onAuthStateChanged(getServices('employee').auth, callback)
export const logoutEmployee = () => signOut(getServices('employee').auth)
