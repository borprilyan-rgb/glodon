import { before, beforeEach, after, test } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { createRegistrationService, consumeRateLimit } from '../../functions/src/registration.js'
const require = createRequire(new URL('../../functions/package.json',import.meta.url))
const { initializeApp, deleteApp } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const { getFirestore } = require('firebase-admin/firestore')
let app, db, auth, environment, service
const input = (employeeId='000123') => ({ name:'Employee Fixture',employeeId,password:'Password!123',registrationId:randomUUID(),recoverySecret:randomUUID().replaceAll('-','')+randomUUID().replaceAll('-','') })
before(async () => {
  assert.equal(process.env.GCLOUD_PROJECT,'demo-cubicost')
  assert.equal(process.env.FIRESTORE_EMULATOR_HOST,'127.0.0.1:8080')
  assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,'127.0.0.1:9099')
  app=initializeApp({projectId:'demo-cubicost'},'employee-foundation-tests');db=getFirestore(app);auth=getAuth(app)
  environment=await initializeTestEnvironment({projectId:'demo-cubicost',firestore:{host:'127.0.0.1',port:8080,rules:readFileSync(new URL('../../firestore.employee.rules',import.meta.url),'utf8')}})
  service=createRegistrationService({db,auth,domain:'employees.example.test'})
})
beforeEach(async()=>environment.clearFirestore())
after(async()=>{await environment?.clearFirestore();await environment?.cleanup();await deleteApp(app)})
test('registration creates one canonical profile, opaque identifier, and immutable recovery result',async()=>{
  const data=input();const first=await service.register(data);const second=await service.register({...data,password:'Different!123'})
  assert.equal(first.syntheticEmail,second.syntheticEmail);assert.match(first.syntheticEmail,/^e-[a-f0-9]{32}@employees.example.test$/)
  assert.ok(!first.syntheticEmail.includes(data.employeeId))
  const registry=(await db.doc('employeeNumbers/'+data.employeeId).get()).data()
  const profile=(await db.doc('employees/'+registry.uid).get()).data()
  assert.equal(profile.employeeId,'000123');assert.equal(profile.jobTitle,'Not provided');assert.equal(profile.role,'employee');assert.equal(profile.status,'active')
  assert.ok(!JSON.stringify(registry).includes(data.password));assert.equal((await db.collection('accountAuditEvents').get()).size,1)
  const response=await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:first.syntheticEmail,password:data.password,returnSecureToken:true})})
  assert.equal(response.status,200);assert.equal((await response.json()).localId,registry.uid)
})
test('concurrent different registration claims produce exactly one winner',async()=>{
  const results=await Promise.allSettled([service.register(input()),service.register(input())]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.find(r=>r.status==='rejected').reason.code,'already-exists')
  assert.equal((await db.collection('employees').get()).size,1)
})
test('concurrent retries of the same authorization provision once',async()=>{
  const data=input();const results=await Promise.all([service.register(data),service.register(data)]);assert.equal(results[0].syntheticEmail,results[1].syntheticEmail);assert.equal((await db.collection('employees').get()).size,1)
})
test('interruption before Auth creation recovers with original reservation, not another registrant',async()=>{
  const data=input();const broken=createRegistrationService({db,auth:{createUser:async()=>{throw new Error('Interrupted')},getUser:auth.getUser.bind(auth)},domain:'employees.example.test'})
  await assert.rejects(broken.register(data));const reserved=(await db.doc('employeeNumbers/'+data.employeeId).get()).data();await assert.rejects(service.register(input()),{code:'already-exists'})
  await service.register(data);assert.equal((await db.doc('employeeNumbers/'+data.employeeId).get()).data().uid,reserved.uid)
})
test('interruption after Auth creation is recovered by login lookup with original UID',async()=>{
  const data=input();const broken=createRegistrationService({db,auth,domain:'employees.example.test',afterAuthCreated:async()=>{throw new Error('Interrupted')}})
  await assert.rejects(broken.register(data));assert.equal((await db.collection('employees').get()).size,0)
  const reserved=(await db.doc('employeeNumbers/'+data.employeeId).get()).data();const result=await service.resolve(data.employeeId)
  assert.equal(result.syntheticEmail,reserved.syntheticEmail);assert.equal((await db.doc('employees/'+reserved.uid).get()).data().status,'active')
})
test('transactional limits reject abuse and reset the time window',async()=>{
  for(let i=0;i<5;i++)await consumeRateLimit(db,{ip:'test',action:'register',employeeId:'000123',now:60000})
  await assert.rejects(consumeRateLimit(db,{ip:'test',action:'register',employeeId:'000123',now:60000}),{code:'resource-exhausted'})
  await consumeRateLimit(db,{ip:'test',action:'register',employeeId:'000123',now:120000})
})
test('candidate rules enforce employee ownership, session cutoff, and server-controlled profiles',async()=>{
  const profile={schemaVersion:1,name:'Alice',employeeId:'000123',jobTitle:'Not provided',role:'employee',status:'active',sessionValidAfter:100}
  await db.doc('employees/alice').set(profile)
  const context=(uid,provider='password',time=200)=>environment.authenticatedContext(uid,{firebase:{sign_in_provider:provider},auth_time:time}).firestore()
  const alice=context('alice');await assertSucceeds(getDoc(doc(alice,'employees/alice')))
  for(const database of [context('bob'),context('unprovisioned'),context('alice','anonymous'),context('alice','password',100),environment.unauthenticatedContext().firestore()])await assertFails(getDoc(doc(database,'employees/alice')))
  await assertFails(getDocs(collection(alice,'employees')))
  for(const path of ['employeeNumbers/000123','accountRateLimits/hidden','passwordResetRequests/hidden','accountAuditEvents/hidden','employees/alice/progress/tas','testAttempts/hidden'])await assertFails(getDoc(doc(alice,path)))
  await assertFails(setDoc(doc(alice,'employees/new'),profile));await assertFails(updateDoc(doc(alice,'employees/alice'),{role:'admin'}));await assertFails(deleteDoc(doc(alice,'employees/alice')));await assertFails(setDoc(doc(alice,'admins/alice'),{enabled:true}))
  await assertFails(setDoc(doc(alice,'testAttempts/new'),{uid:'alice'}));await assertFails(setDoc(doc(context('legacy','anonymous'),'testAttempts/new'),{uid:'legacy'}))
  for(const status of ['resetRequired','disabled','changingPassword']){await db.doc('employees/alice').update({status});await assertFails(getDoc(doc(alice,'employees/alice')))}
})
test('existing password admin allowlist and immutable reports remain enforced',async()=>{
  await db.doc('admins/admin').set({enabled:true});await db.doc('testAttempts/historical').set({uid:'original',score:80})
  const context=(uid,provider='password')=>environment.authenticatedContext(uid,{firebase:{sign_in_provider:provider}}).firestore();const admin=context('admin')
  await assertSucceeds(getDocs(collection(admin,'testAttempts')));await assertSucceeds(getDoc(doc(admin,'admins/admin')))
  await assertFails(updateDoc(doc(admin,'testAttempts/historical'),{score:100}));await assertFails(deleteDoc(doc(admin,'testAttempts/historical')));await assertFails(updateDoc(doc(admin,'admins/admin'),{enabled:false}))
  await assertFails(getDocs(collection(context('admin','google.com'),'testAttempts')));await assertFails(getDocs(collection(context('stranger'),'testAttempts')))
  await db.doc('admins/admin').update({enabled:false});await assertFails(getDocs(collection(admin,'testAttempts')))
})
