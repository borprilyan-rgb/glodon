import { HttpsError } from 'firebase-functions/v2/https'
import { reviewAssessment } from './review.js'

export async function getAdminAssessmentReview(request, { db, auth }) {
  if (!request.auth || request.auth.token?.firebase?.sign_in_provider !== 'password') throw new HttpsError('permission-denied', 'Administrator access required.')
  const bearer = request.rawRequest?.headers?.authorization
  if (typeof bearer !== 'string' || !bearer.startsWith('Bearer ')) throw new HttpsError('permission-denied', 'Administrator access required.')
  try {
    const token = await auth.verifyIdToken(bearer.slice(7), true)
    if (token.uid !== request.auth.uid || token.firebase?.sign_in_provider !== 'password') throw new Error('Invalid administrator session.')
  } catch { throw new HttpsError('permission-denied', 'Administrator access required.') }
  const administrator = await db.doc('admins/' + request.auth.uid).get()
  if (!administrator.exists || administrator.data().enabled !== true) throw new HttpsError('permission-denied', 'Administrator access required.')
  const input = request.data
  if (!input || typeof input !== 'object' || Object.keys(input).some(key => !['attemptId', 'language'].includes(key)) || typeof input.attemptId !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(input.attemptId) || !['en', 'id'].includes(input.language)) throw new HttpsError('invalid-argument', 'Invalid result request.')
  const record = await db.doc('testAttempts/' + input.attemptId).get()
  if (!record.exists) throw new HttpsError('not-found', 'Result unavailable.')
  // Read-only review uses the exact archived version, never rewrites stored totals.
  const review = reviewAssessment(record.data(), input.language)
  return JSON.parse(JSON.stringify(review))
}
