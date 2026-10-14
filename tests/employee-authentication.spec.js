import { test, expect } from '@playwright/test'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, updateDoc } from 'firebase/firestore'
const origin='http://127.0.0.1:5173'
const employeeNumber=()=>String(Math.floor(Math.random()*900000)+100000)
async function open(page,language='en') { await page.goto(origin);await page.evaluate(l=>localStorage.setItem('cubicost-tas-tutorial-language-v1',l),language);await page.goto(origin+'/account') }
async function registration(page,{employeeId,password,name='Employee Fixture'},en=true) {
  await page.getByRole('button',{name:en?'Register':'Daftar',exact:true}).click()
  await page.locator('#employee-name').fill(name);await page.locator('#employee-number').fill(employeeId);await page.locator('#employee-password').fill(password);await page.locator('#employee-confirmation').fill(password)
  await page.getByRole('button',{name:en?'Create Account':'Buat Akun',exact:true}).click()
}
for(const language of ['en','id'])test(language+' registration, persistence, duplicate rejection, password failure and logout',async({page},testInfo)=>{
  const en=language==='en';await page.setViewportSize(en?{width:1280,height:900}:{width:320,height:844});await open(page,language)
  const employeeId=employeeNumber();const password='Fixture!123';await registration(page,{employeeId,password},en)
  await expect(page.locator('.employee-auth h1')).toHaveText('Employee Fixture');await expect(page.locator('.employee-auth')).toContainText(employeeId)
  const uid=await page.evaluate(async()=>{const {getServices}=await import('/src/firebase/client.js');const {auth}=getServices('employee');if(auth.app.options.projectId!=='demo-cubicost'||!auth.emulatorConfig)throw new Error('Demo emulator required');return auth.currentUser.uid})
  await page.reload();await expect(page.locator('.employee-auth h1')).toHaveText('Employee Fixture')
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  await page.screenshot({path:testInfo.outputPath(language+'-employee-account.png'),fullPage:true})
  await page.getByRole('button',{name:en?'Sign Out':'Keluar',exact:true}).click();await expect(page.locator('#employee-number')).toBeVisible()
  await registration(page,{employeeId,password},en);await expect(page.getByRole('alert')).toContainText(en?'already registered':'sudah terdaftar')
  await page.getByRole('button',{name:en?'Sign In':'Masuk',exact:true}).first().click();await page.locator('#employee-number').fill(employeeId);await page.locator('#employee-password').fill('Incorrect!123');await page.locator('form button[type="submit"]').click();await expect(page.getByRole('alert')).toContainText(en?'Unable to sign in':'Tidak dapat masuk')
  await page.locator('#employee-password').fill(password);await page.locator('form button[type="submit"]').click();await expect(page.locator('.employee-auth h1')).toHaveText('Employee Fixture')
  expect(await page.evaluate(async()=>(await import('/src/firebase/client.js')).getServices('employee').auth.currentUser.uid)).toBe(uid)
  await page.goto(origin+'/tas/tests/section-1');await expect(page.getByRole('heading',{name:en?'Employee assessments are not enabled yet':'Latihan karyawan belum diaktifkan'})).toBeVisible();await expect(page.locator('.exercise-question')).toHaveCount(0)
  await expect(page.locator('.employee-phase-note').first()).toContainText(en?'not synchronized':'belum disinkronkan')
  expect(await page.evaluate(async()=>{try{await(await import('/src/firebase/client.js')).sendAttempt({});return false}catch{return true}})).toBe(true)
  expect(await page.evaluate(p=>[localStorage,sessionStorage].every(s=>Object.keys(s).every(k=>!s.getItem(k).includes(p))),password)).toBe(true)
})
test('registration validation and responsive account forms',async({page},testInfo)=>{
  await open(page);await page.getByRole('button',{name:'Register',exact:true}).click()
  await page.locator('#employee-name').fill('Validation Fixture');await page.locator('#employee-number').fill('00123');await page.locator('#employee-password').fill('1234567');await page.locator('#employee-confirmation').fill('1234567')
  expect(await page.locator('form').evaluate(el=>el.checkValidity())).toBe(false)
  await page.locator('#employee-number').fill('001234');await page.locator('#employee-password').fill('Password!123');await page.locator('#employee-confirmation').fill('Different!123');await page.locator('form button[type="submit"]').click();await expect(page.getByRole('alert')).toHaveText('Passwords do not match.')
  for(const width of [320,390,768,1024,1440]){await page.setViewportSize({width,height:900});await page.reload();await page.getByRole('button',{name:'Register',exact:true}).click();await page.evaluate(()=>window.scrollTo({top:0,left:0,behavior:'instant'}));expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:testInfo.outputPath('registration-'+width+'.png'),fullPage:true})}
  expect(await page.locator('input[type="email"]').count()).toBe(0)
})
test('unprovisioned and disabled accounts never display private profile content',async({page})=>{
  await open(page);const employeeId=employeeNumber();await registration(page,{employeeId,password:'Fixture!123',name:'Private Profile Fixture'});await expect(page.locator('.employee-auth h1')).toHaveText('Private Profile Fixture')
  const uid=await page.evaluate(async()=>(await import('/src/firebase/client.js')).getServices('employee').auth.currentUser.uid)
  const environment=await initializeTestEnvironment({projectId:'demo-cubicost',firestore:{host:'127.0.0.1',port:8080}})
  try{await environment.withSecurityRulesDisabled(c=>updateDoc(doc(c.firestore(),'employees',uid),{status:'disabled'}));await page.reload();await expect(page.locator('.employee-auth h1')).toHaveText('Account unavailable');await expect(page.getByText('Private Profile Fixture',{exact:true})).toHaveCount(0)}finally{await environment.cleanup()}
  await page.getByRole('button',{name:'Sign Out',exact:true}).click()
  await page.evaluate(async()=>{const {getServices}=await import('/src/firebase/client.js');const auth=getServices('employee').auth;const response=await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'unprovisioned-'+crypto.randomUUID()+'@example.test',password:'Fixture!123',returnSecureToken:true})});const data=await response.json();const {signInWithEmailAndPassword}=await import('/node_modules/.vite/deps/firebase_auth.js');await signInWithEmailAndPassword(auth,data.email,'Fixture!123')})
  await expect(page.locator('.employee-auth h1')).toHaveText('Account unavailable')
})

test('employee login works in a separate browser session',async({page,browser})=>{
  await open(page);const employeeId=employeeNumber();await registration(page,{employeeId,password:'Fixture!123',name:'Second Session Fixture'});await expect(page.locator('.employee-auth h1')).toHaveText('Second Session Fixture')
  const uid=await page.evaluate(async()=>(await import('/src/firebase/client.js')).getServices('employee').auth.currentUser.uid)
  const context=await browser.newContext()
  try{const second=await context.newPage();await open(second);await expect(second.locator('#employee-number')).toBeVisible();await second.locator('#employee-number').fill(employeeId);await second.locator('#employee-password').fill('Fixture!123');await second.locator('form button[type="submit"]').click();await expect(second.locator('.employee-auth h1')).toHaveText('Second Session Fixture');expect(await second.evaluate(async()=>(await import('/src/firebase/client.js')).getServices('employee').auth.currentUser.uid)).toBe(uid)}finally{await context.close()}
})
