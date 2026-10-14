import { getAdminAssessmentReview } from './assessments/adminReview.js'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { defineString } from 'firebase-functions/params'
import { createRegistrationService, consumeRateLimit, validateRegistration } from './registration.js'

initializeApp()
const employeeDomain = defineString('EMPLOYEE_AUTH_DOMAIN', { default: '' })
const emulator = process.env.FUNCTIONS_EMULATOR === 'true'
const options = { region: 'asia-southeast2', enforceAppCheck: !emulator, maxInstances: 2, timeoutSeconds: 30, memory: '256MiB' }
function service() {
  if (emulator && !process.env.GCLOUD_PROJECT?.startsWith('demo-')) throw new HttpsError('failed-precondition', 'Local testing requires a demo project.')
  return createRegistrationService({ db: getFirestore(), auth: getAuth(), domain: emulator ? 'employees.example.test' : employeeDomain.value() })
}
export const registerEmployee = onCall(options, async request => {
  const input = validateRegistration(request.data)
  await consumeRateLimit(getFirestore(), { ip: request.rawRequest.ip || 'unknown', action: 'register', employeeId: input.employeeId })
  return service().register(input)
})
export const resolveEmployeeLogin = onCall(options, async request => {
  if (!request.data || typeof request.data.employeeId !== 'string' || !/^[0-9]{6}$/.test(request.data.employeeId) || Object.keys(request.data).length !== 1) throw new HttpsError('invalid-argument', 'Enter a six-digit employee number.')
  await consumeRateLimit(getFirestore(), { ip: request.rawRequest.ip || 'unknown', action: 'login', employeeId: request.data.employeeId })
  return service().resolve(request.data.employeeId)
})

// Phase A: existing administrator answer review, read-only. No submission callable.
export const reviewAdminAssessment = onCall(options, request => getAdminAssessmentReview(request, { db: getFirestore(), auth: getAuth() }))
