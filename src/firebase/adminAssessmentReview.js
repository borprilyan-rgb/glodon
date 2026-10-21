import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { getServices } from './client'
import { firebaseConnectionsEnabled } from '../data/backendMode.js'

let functions
export async function fetchAdminAssessmentReview(attemptId, language) {
  if (!firebaseConnectionsEnabled) throw new Error('Firebase connections are temporarily disabled.')
  if (!functions) {
    const { app } = getServices('admin')
    if (import.meta.env.VITE_FIREBASE_USE_EMULATORS !== 'true') {
      const siteKey = import.meta.env.VITE_EMPLOYEE_APP_CHECK_SITE_KEY
      if (!siteKey) throw new Error('Administrator review requires App Check configuration.')
      initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(siteKey), isTokenAutoRefreshEnabled: true })
    }
    functions = getFunctions(app, 'asia-southeast2')
    if (import.meta.env.VITE_FIREBASE_USE_EMULATORS === 'true') connectFunctionsEmulator(functions, '127.0.0.1', 5001)
  }
  const { data } = await httpsCallable(functions, 'reviewAdminAssessment')({ attemptId, language })
  return data
}
