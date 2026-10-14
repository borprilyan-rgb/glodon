import { before, after, test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { initializeTestEnvironment, assertFails } from '@firebase/rules-unit-testing'
import { getDoc, doc, setDoc, collection, getDocs } from 'firebase/firestore'
import { getAdminAssessmentReview } from '../../functions/src/assessments/adminReview.js'
const require = createRequire(new URL('../../functions/package.json', import.meta.url))
const { initializeApp, deleteApp } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const { getFirestore } = require('firebase-admin/firestore')
let app, auth, db, environment, adminRequest, employeeRequest
before(async () => {
  assert.equal(process.env.GCLOUD_PROJECT, 'demo-cubicost'); assert.equal(process.env.FIRESTORE_EMULATOR_HOST, '127.0.0.1:8080'); assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST, '127.0.0.1:9099')
  app = initializeApp({projectId:'demo-cubicost'}, 'assessment-security'); auth = getAuth(app); db = getFirestore(app)
  environment = await initializeTestEnvironment({projectId:'demo-cubicost', firestore:{host:'127.0.0.1',port:8080,rules:readFileSync(new URL('../../firestore.employee.rules',import.meta.url),'utf8')}})
  async function identity() {
    const email = 'phase-a-' + randomUUID() + '@example.test'; const password = 'Fixture!123'
    const user = await auth.createUser({email,password})
    const response = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true})})
    const data = await response.json(); const token = await auth.verifyIdToken(data.idToken)
    return {auth:{uid:user.uid,token},rawRequest:{headers:{authorization:'Bearer ' + data.idToken}},data:{attemptId:'historical-phase-a',language:'en'}}
  }
  adminRequest = await identity(); employeeRequest = await identity()
  await db.doc('admins/' + adminRequest.auth.uid).set({enabled:true})
  await db.doc('employees/' + employeeRequest.auth.uid).set({schemaVersion:1,name:'Employee',employeeId:'000123',jobTitle:'Engineer',role:'employee',status:'active',sessionValidAfter:0})
  await db.doc('testAttempts/historical-phase-a').set({course:'tas',section:2,assessmentVersion:'v99',answers:{q1:'A'},score:37,passed:false})
})
after(async () => { await environment?.cleanup(); await deleteApp(app) })
test('employee, anonymous, missing token and non-allowlisted accounts cannot use private review', async () => {
  for (const request of [employeeRequest,{data:adminRequest.data},{...adminRequest,rawRequest:{headers:{}}},{...adminRequest,auth:{...adminRequest.auth,token:{firebase:{sign_in_provider:'anonymous'}}}},{...adminRequest,rawRequest:{headers:{authorization:'Bearer forged'}}}]) await assert.rejects(getAdminAssessmentReview(request,{db,auth}),{code:'permission-denied'})
})
test('administrator review is read-only; unknown versions preserve raw answers and stored totals', async () => {
  const reference = db.doc('testAttempts/historical-phase-a'); const before = (await reference.get()).data()
  const review = await getAdminAssessmentReview(adminRequest,{db,auth})
  assert.equal(review.available,false); assert.deepEqual(review.stored,[{label:'q1',value:'A'}]); assert.deepEqual((await reference.get()).data(),before)
  await assert.rejects(getAdminAssessmentReview({...adminRequest,data:{...adminRequest.data,answers:{q1:'B'},score:100}},{db,auth}),{code:'invalid-argument'})
  await db.doc('admins/' + adminRequest.auth.uid).update({enabled:false}); await assert.rejects(getAdminAssessmentReview(adminRequest,{db,auth}),{code:'permission-denied'})
  await db.doc('admins/' + adminRequest.auth.uid).update({enabled:true}); await auth.updateUser(adminRequest.auth.uid,{disabled:true}); await assert.rejects(getAdminAssessmentReview(adminRequest,{db,auth}),{code:'permission-denied'})
})
test('employee cannot read private definitions, report documents or immutable result writes', async () => {
  const employee = environment.authenticatedContext(employeeRequest.auth.uid,{firebase:{sign_in_provider:'password'},auth_time:Math.floor(Date.now()/1000)}).firestore()
  for (const path of ['privateAssessmentDefinitions/tas-2-v3','assessmentGraders/tas-2-v3','testAttempts/historical-phase-a','admins/' + adminRequest.auth.uid]) await assertFails(getDoc(doc(employee,path)))
  await assertFails(getDocs(collection(employee,'testAttempts')))
  await assertFails(setDoc(doc(employee,'testAttempts/forged'),{score:100}))
  await assertFails(setDoc(doc(employee,'assessmentForms/tas-2-v3'),{expectedAnswers:{q1:'A'}}))
})
