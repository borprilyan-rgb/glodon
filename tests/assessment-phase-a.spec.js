import { test, expect } from '@playwright/test'
import { randomUUID } from 'node:crypto'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, writeBatch, Timestamp, getDoc } from 'firebase/firestore'
import { getCurrentAssessment, getHistoricalAssessment } from '../functions/src/assessments/registry.js'
import { provisionAdmin, passwordSignIn } from './firebase/adminAuth.mjs'
const origin = 'http://127.0.0.1:5173'
for (const language of ['en','id']) test(language + ' private administrator review preserves nine assessments, historical partial credit and unknown results', async ({page}, testInfo) => {
  test.setTimeout(60000)
  await page.setViewportSize(language === 'id' ? {width:390,height:844} : {width:1280,height:900})
  await page.goto(origin); await page.evaluate(l => localStorage.setItem('cubicost-tas-tutorial-language-v1',l), language); await page.goto(origin + '/admin/results')
  const email = 'phase-a-review-' + randomUUID() + '@example.test'; const password = 'Fixture!123'
  const uid = await provisionAdmin(page,{email,password}); const employeeId = language === 'id' ? '223344' : '334455'
  const definitions = ['tas','trb','tme'].flatMap(course => [1,2,3].map(section => getCurrentAssessment(course,section)))
  definitions.push(getHistoricalAssessment('tas',2))
  const records = definitions.map(exercise => {
    const answers = {...exercise.expectedAnswers}; const choice = exercise.copy[language].questions.find(q => q.type === 'choice'); answers[choice.id] = choice.options.find(([value]) => value !== answers[choice.id])[0]
    if (exercise.course === 'tas' && exercise.section === 2 && exercise.assessmentVersion === 'v2') answers.slabThickness = '140'
    const scored = exercise.score(answers)
    return {attemptId:randomUUID(),uid:'historic-fixture',name:'Review ' + exercise.versionId,jobTitle:'Engineer',employeeId,course:exercise.course,section:exercise.section,assessmentVersion:exercise.assessmentVersion,answers,score:scored.total,maximumScore:100,passed:scored.passed,scoreVerified:false,submittedAt:Timestamp.now()}
  })
  const unknown = {...records[0],attemptId:randomUUID(),name:'Unknown version',assessmentVersion:'v99',score:37,passed:false,answers:{q1:'A'}}
  const environment = await initializeTestEnvironment({projectId:'demo-cubicost',firestore:{host:'127.0.0.1',port:8080}})
  try {
    await environment.withSecurityRulesDisabled(async c => {const batch=writeBatch(c.firestore());batch.set(doc(c.firestore(),'admins',uid),{enabled:true});for(const record of [...records,unknown])batch.set(doc(c.firestore(),'testAttempts',record.attemptId),record);await batch.commit()})
    await passwordSignIn(page,{email,password,uid,language});await page.locator('#admin-employeeId').fill(employeeId);await page.getByRole('button',{name:language==='en'?'Apply Filters':'Terapkan Filter',exact:true}).click();await expect(page.locator('.admin-result-row')).toHaveCount(11)
    for(let n=0;n<records.length;n++){
      const record=records[n], exercise=definitions[n];await page.getByRole('button',{name:(language==='en'?'Details for ':'Detail untuk ')+record.name,exact:true}).click()
      const review=page.locator('[id="details-'+record.attemptId+'"]').locator('.admin-answer-review');await expect(review.locator('h3')).toHaveText(exercise.copy[language].questions.map(q=>q.title))
      const result=exercise.score(record.answers);for(let index=0;index<result.scores.length;index++)await expect(review.locator('.admin-answer-status').nth(index)).toContainText(result.scores[index]+' / '+exercise.points[index])
      const wrongIndex=exercise.copy[language].questions.findIndex(q=>q.type==='choice');await expect(review.locator('.admin-answer-question').nth(wrongIndex).locator('.admin-answer-expected')).toBeVisible()
      if(exercise.versionId==='tas-2-v2'){await expect(review.locator('.admin-answer-question').nth(3).locator('.admin-answer-status')).toContainText('10 / 20');await expect(review.locator('.admin-answer-question').nth(3)).toContainText('150 mm');await page.screenshot({path:testInfo.outputPath(language+'-historical-review.png'),fullPage:true})}
      await page.getByRole('button',{name:(language==='en'?'Details for ':'Detail untuk ')+record.name,exact:true}).click()
    }
    await page.getByRole('button',{name:(language==='en'?'Details for ':'Detail untuk ')+'Unknown version',exact:true}).click();await expect(page.locator('[id="details-'+unknown.attemptId+'"] .admin-answer-fallback')).toContainText(language==='en'?'unavailable':'tidak tersedia')
    await environment.withSecurityRulesDisabled(async c=>{for(const record of [...records,unknown])expect((await getDoc(doc(c.firestore(),'testAttempts',record.attemptId))).data()).toEqual(record)})
  }finally{await environment.cleanup()}
})
test('development server blocks private sources, fixtures, raw modules and maps',async({request})=>{
  for(const path of ['/functions/src/assessments/registry.js','/functions/src/assessments/definitions/docxTestSource.js?raw','/functions/src/assessments/forms.json','/tests/fixtures/assessment-baseline.json.gz','/scripts/validateAssessmentRelease.mjs','/.cache/employee-tests.log','/dist/assets/AdminResults-D5j_5gP9.js','/assets/old.js.map','/@fs/C:/Users/borpr/glodon/functions/src/assessments/registry.js','/%66unctions/src/assessments/registry.js']){const response=await request.get(origin+path);expect(response.status(),path).toBe(403)}
})
test('all nine public forms render original bilingual questions through the existing question component',async({page})=>{
  test.setTimeout(60000);await page.goto(origin)
  for(const course of ['tas','trb','tme'])for(const section of [1,2,3])for(const language of ['en','id']){
    const expected=getCurrentAssessment(course,section).copy[language].questions
    for(let index=0;index<expected.length;index++){
      await page.evaluate(async({course,section,language,index})=>{
        const ReactModule=await import('/node_modules/.vite/deps/react.js');const React=ReactModule.default||ReactModule;const clientModule=await import('/node_modules/.vite/deps/react-dom_client.js');const createRoot=clientModule.createRoot||clientModule.default.createRoot;const {getSectionExercise}=await import('/src/data/sectionExercises.js');const {default:Question}=await import('/src/components/SectionExercise.jsx')
        if(!window.phaseAQuestionRoot){const element=document.createElement('div');element.id='phase-a-question-preview';document.body.append(element);window.phaseAQuestionRoot=createRoot(element)}
        const form=getSectionExercise(course,section)
        // Presentation-only harness. Dummy points contain no grading policy; no submission is exercised.
        const exercise={...form,load:()=>({started:true,submitted:false,index,answers:{}}),issues:()=>[],answered:()=>false,points:Array(form.copy.en.questions.length).fill(0)}
        window.phaseAQuestionRoot.render(React.createElement(Question,{key:form.versionId+language+index,language,profile:{name:'Preview',jobTitle:'Engineer',employeeId:'000123'},exercise}))
      },{course,section,language,index})
      const preview=page.locator('#phase-a-question-preview .exercise-question');await expect(preview.locator('h2')).toHaveText(expected[index].title)
      for(const [,text]of expected[index].options||[])await expect(preview).toContainText(text)
    }
  }
})
test('homepage visual revamp and assessment submission gates remain intact',async({page},testInfo)=>{
  for(const width of [390,1440]){await page.setViewportSize({width,height:900});await page.goto(origin);await expect(page.locator('.hub-building')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:testInfo.outputPath('home-'+width+'.png'),fullPage:true})}
  for(const course of ['tas','trb','tme'])for(const section of [1,2,3]){await page.goto(origin+'/'+course+'/tests/section-'+section);await expect(page.locator('.employee-phase-note h2')).toContainText(/not enabled yet|belum diaktifkan/);await expect(page.locator('.exercise-question')).toHaveCount(0)}
})
