import { lazy, Suspense, useEffect, useState } from 'react'
import { getTasData } from './data/tas/index.js'
import { getTrbData } from './data/trb/index.js'
import { getTmeData } from './data/tme/index.js'
import { uiText } from './data/uiText'
import TutorialLayout from './components/TutorialLayout'
import CourseHub from './components/CourseHub'

import LandingPage from './components/LandingPage'
import CourseMapPage from './components/CourseMapPage'
import TutorialStep from './components/TutorialStep'
import PileCapReportLesson from './components/PileCapReportLesson'
import { getReportLessons, getReportLesson, emptyReportProgress, loadReportProgress, reportProgressKey } from './data/tas/tasReports'
import ContactPage from './components/ContactPage'



import Presentation, { PresentationEntry } from './components/Presentation'


const AdminResults = lazy(() => import('./components/AdminResults'))

const LEGACY_TAS_KEY = 'cubicost-tas-tutorial-progress-v1'
const TAS_PROGRESS_KEY = 'cubicost:tutorial:tas:progress'
const TAS_LAST_LESSON_KEY = 'cubicost:tutorial:tas:lastLesson'
const TAS_MIGRATION_KEY = 'cubicost:tutorial:tas:migrated-v1'
const TAS_CURRICULUM_MIGRATION_KEY = 'cubicost:tutorial:tas:curriculum-v2-migrated'
const TAS_CURRICULUM_BACKUP_KEY = 'cubicost:tutorial:tas:progress:curriculum-v1-backup'
const TRB_PROGRESS_KEY = 'cubicost:tutorial:trb:progress'
const TRB_LAST_LESSON_KEY = 'cubicost:tutorial:trb:lastLesson'
const TME_PROGRESS_KEY = 'cubicost:tutorial:tme:progress'
const TME_LAST_LESSON_KEY = 'cubicost:tutorial:tme:lastLesson'

const LANGUAGE_KEY = 'cubicost-tas-tutorial-language-v1'
const TAS_LESSON_IDS = new Set(getTasData('en').allSteps.map((step) => step.id))
const TRB_LESSON_IDS = new Set(getTrbData('en').allSteps.map((step) => step.id))
const TME_LESSON_IDS = new Set(getTmeData('en').allSteps.map((step) => step.id))
const TAS_LAST_LESSON_MAP = { 'floor-settings': 'floor-grade-settings', 'import-drawing': 'import-split-drawing', 'set-scale': 'scale-relocate-drawing', 'verify-scale': 'scale-relocate-drawing', 'view-expression': 'measurement-rules', 'filter-deduction': 'measurement-rules', 'change-rule': 'measurement-rules', recalculate: 'calculate-verify-quantity', 'verify-deduction': 'calculate-verify-quantity', 'quantity-category': 'quantity-reports', 'configure-report': 'quantity-reports' }

function mapTasLessonId(id) { return TAS_LESSON_IDS.has(id) ? id : TAS_LAST_LESSON_MAP[id] || null }

function routeFromLocation() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const hashParts = window.location.hash.replace(/^#\/?/, '').split('/')
  const exerciseMatch = path.match(/^\/(tas|trb|tme)\/(?:exercise|tests)\/section-([1-3])$/)
  if (exerciseMatch) {
    if (path.includes('/exercise/')) window.history.replaceState({}, '', path.replace('/exercise/', '/tests/'))
    return { product: exerciseMatch[1], page: 'exercise', section: Number(exerciseMatch[2]) }
  }
  if (path === '/exercises') return { page: 'exercises' }
  if (path === '/present') return { page: 'presentation' }
  if (path === '/contact') return { page: 'contact' }
  if (path === '/admin/results') return { page: 'admin' }
  if (path === '/trb/reference' || (path === '/' && hashParts[0] === 'trb' && hashParts[1] === 'reference')) {
    window.history.replaceState({}, '', '/trb/course')
    return { product: 'trb', page: 'course' }
  }
  if (path === '/') {
    const [first, second] = hashParts
    if (first === 'course') return { product: 'tas', page: 'course' }
    if (first && first !== 'tas' && first !== 'trb' && first !== 'tme') return { product: 'tas', page: 'lesson', stepId: mapTasLessonId(second) || second }
    return { page: 'hub' }
  }
  const [product, view, stepId] = path.split('/').filter(Boolean)
  if (!['tas', 'trb', 'tme'].includes(product)) return { page: 'hub' }
  if (view === 'tests') return { product, page: 'tests' }
  if (view === 'course') return { product, page: 'course' }
  if (view === 'lesson' && stepId) return { product, page: 'lesson', stepId: product === 'tas' ? mapTasLessonId(stepId) || stepId : stepId }
  return { product, page: 'welcome' }
}

function normaliseProgress(saved, initialStepId, storedLastLesson) {
  const completed = new Set((Array.isArray(saved) ? saved : Array.isArray(saved?.completed) ? saved.completed : []).filter(id => typeof id === 'string'))
  const rawChecks = !Array.isArray(saved) && saved?.checklists
  const checklists = Object.fromEntries(Object.entries(rawChecks && typeof rawChecks === 'object' ? rawChecks : {}).filter(([, checks]) => Array.isArray(checks)).map(([id, checks]) => [id, checks.filter(index => Number.isInteger(index) && index >= 0)]))
  const started = new Set((Array.isArray(saved) ? saved : Array.isArray(saved?.started) ? saved.started : [...completed, ...Object.keys(checklists)]).filter(id => typeof id === 'string'))
  if (initialStepId) started.add(initialStepId)
  return { completed, checklists, started, lastLesson: initialStepId || storedLastLesson || (!Array.isArray(saved) && saved?.lastLesson) || null }
}

// TODO: Consolidate duplicated TAS/TRB/TME progress loading, persistence and checklist updates
// only with migration coverage; preserve all storage keys and product-specific validation.
function loadTasProgress(initialStepId) {
  try {
    if (!localStorage.getItem(TAS_MIGRATION_KEY)) {
      const legacy = localStorage.getItem(LEGACY_TAS_KEY)
      if (legacy && !localStorage.getItem(TAS_PROGRESS_KEY)) {
        const migrated = normaliseProgress(JSON.parse(legacy), null, null)
        localStorage.setItem(TAS_PROGRESS_KEY, JSON.stringify({ completed: [...migrated.completed], checklists: migrated.checklists, started: [...migrated.started] }))
        if (migrated.lastLesson) localStorage.setItem(TAS_LAST_LESSON_KEY, migrated.lastLesson)
      }
      localStorage.setItem(TAS_MIGRATION_KEY, '1')
    }
    if (!localStorage.getItem(TAS_CURRICULUM_MIGRATION_KEY)) {
      const currentRaw = localStorage.getItem(TAS_PROGRESS_KEY)
      if (currentRaw && !localStorage.getItem(TAS_CURRICULUM_BACKUP_KEY)) localStorage.setItem(TAS_CURRICULUM_BACKUP_KEY, currentRaw)
      const current = JSON.parse(currentRaw || '[]')
      const oldCompleted = new Set(Array.isArray(current) ? current : current.completed || [])
      const oldStarted = new Set(Array.isArray(current) ? current : current.started || [...oldCompleted])
      const completed = new Set(['identify-columns', 'identify-beams', 'identify-slabs', 'identify-openings', 'apply-finishes'].filter((id) => oldCompleted.has(id)))
      if (['view-expression', 'measurement-rules', 'filter-deduction', 'change-rule'].every((id) => oldCompleted.has(id))) completed.add('measurement-rules')
      if (['recalculate', 'verify-deduction'].every((id) => oldCompleted.has(id))) completed.add('calculate-verify-quantity')
      if (['quantity-category', 'configure-report'].every((id) => oldCompleted.has(id))) completed.add('quantity-reports')
      const started = new Set([...oldStarted].map(mapTasLessonId).filter(Boolean))
      const checklists = Object.fromEntries(Object.entries(Array.isArray(current) ? {} : current.checklists || {}).filter(([id]) => TAS_LESSON_IDS.has(id)))
      localStorage.setItem(TAS_PROGRESS_KEY, JSON.stringify({ completed: [...completed], checklists, started: [...started] }))
      const previousLast = localStorage.getItem(TAS_LAST_LESSON_KEY) || (!Array.isArray(current) && current.lastLesson) || null
      const mappedLast = mapTasLessonId(previousLast)
      mappedLast ? localStorage.setItem(TAS_LAST_LESSON_KEY, mappedLast) : localStorage.removeItem(TAS_LAST_LESSON_KEY)
      localStorage.setItem(TAS_CURRICULUM_MIGRATION_KEY, '1')
    }
    return normaliseProgress(JSON.parse(localStorage.getItem(TAS_PROGRESS_KEY) || '[]'), initialStepId, localStorage.getItem(TAS_LAST_LESSON_KEY))
  } catch {
    // A failed migration write must not hide progress that is still readable.
    try { return normaliseProgress(JSON.parse(localStorage.getItem(TAS_PROGRESS_KEY) || localStorage.getItem(LEGACY_TAS_KEY) || '[]'), initialStepId, localStorage.getItem(TAS_LAST_LESSON_KEY)) }
    catch { return normaliseProgress([], initialStepId, null) }
  }
}

function loadTrbProgress(initialStepId) {
  try {
    const progress = normaliseProgress(JSON.parse(localStorage.getItem(TRB_PROGRESS_KEY) || '[]'), TRB_LESSON_IDS.has(initialStepId) ? initialStepId : null, localStorage.getItem(TRB_LAST_LESSON_KEY))
    progress.completed = new Set([...progress.completed].filter((id) => TRB_LESSON_IDS.has(id)))
    progress.started = new Set([...progress.started].filter((id) => TRB_LESSON_IDS.has(id)))
    if (!TRB_LESSON_IDS.has(progress.lastLesson)) progress.lastLesson = null
    return progress
  }
  catch { return normaliseProgress([], initialStepId, null) }
}

function loadTmeProgress(initialStepId) {
  try {
    const progress = normaliseProgress(JSON.parse(localStorage.getItem(TME_PROGRESS_KEY) || '[]'), TME_LESSON_IDS.has(initialStepId) ? initialStepId : null, localStorage.getItem(TME_LAST_LESSON_KEY))
    progress.completed = new Set([...progress.completed].filter((id) => TME_LESSON_IDS.has(id)))
    progress.started = new Set([...progress.started].filter((id) => TME_LESSON_IDS.has(id)))
    progress.checklists = Object.fromEntries(Object.entries(progress.checklists).filter(([id]) => TME_LESSON_IDS.has(id)))
    if (!TME_LESSON_IDS.has(progress.lastLesson)) progress.lastLesson = null
    return progress
  } catch { return normaliseProgress([], initialStepId, null) }
}

export default function App() {
  const initialRoute = routeFromLocation()
  const [route, setRoute] = useState(initialRoute)
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'id' } catch { return 'id' }
  })
  const reportLessons = getReportLessons(language)
  const [tasProgress, setTasProgress] = useState(() => loadTasProgress(initialRoute.product === 'tas' && !getReportLesson(initialRoute.stepId) ? initialRoute.stepId : null))
  const [reportProgress, setReportProgress] = useState(loadReportProgress)
  const [trbProgress, setTrbProgress] = useState(() => loadTrbProgress(initialRoute.product === 'trb' ? initialRoute.stepId : null))
  const [tmeProgress, setTmeProgress] = useState(() => loadTmeProgress(initialRoute.product === 'tme' ? initialRoute.stepId : null))
  const [query, setQuery] = useState('')
  const [progressSaveFailed, setProgressSaveFailed] = useState({})
  const { tutorialParts, allSteps } = getTasData(language)
  const trb = getTrbData(language)
  const tme = getTmeData(language)
  const t = uiText[language]
  const completed = tasProgress.completed

  useEffect(() => {
    const onLocationChange = () => {
      const nextRoute = routeFromLocation()
      setRoute(nextRoute)
      if (nextRoute.product === 'tas' && nextRoute.stepId && !getReportLesson(nextRoute.stepId)) setTasProgress((current) => {
        const started = new Set(current.started)
        started.add(nextRoute.stepId)
        return { ...current, started, lastLesson: nextRoute.stepId }
      })
      if (nextRoute.product === 'trb' && nextRoute.stepId) setTrbProgress((current) => {
        const started = new Set(current.started)
        started.add(nextRoute.stepId)
        return { ...current, started, lastLesson: nextRoute.stepId }
      })
      if (nextRoute.product === 'tme' && nextRoute.stepId) setTmeProgress((current) => {
        const started = new Set(current.started)
        started.add(nextRoute.stepId)
        return { ...current, started, lastLesson: nextRoute.stepId }
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('popstate', onLocationChange)
    window.addEventListener('hashchange', onLocationChange)
    return () => { window.removeEventListener('popstate', onLocationChange); window.removeEventListener('hashchange', onLocationChange) }
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(TAS_PROGRESS_KEY, JSON.stringify({ completed: [...tasProgress.completed], checklists: tasProgress.checklists, started: [...tasProgress.started] }))
      tasProgress.lastLesson ? localStorage.setItem(TAS_LAST_LESSON_KEY, tasProgress.lastLesson) : localStorage.removeItem(TAS_LAST_LESSON_KEY)
      queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, tas: false })))
    } catch { queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, tas: true }))) }
  }, [tasProgress])
  useEffect(() => {
    try {
      localStorage.setItem(TRB_PROGRESS_KEY, JSON.stringify({ completed: [...trbProgress.completed], checklists: trbProgress.checklists, started: [...trbProgress.started] }))
      trbProgress.lastLesson ? localStorage.setItem(TRB_LAST_LESSON_KEY, trbProgress.lastLesson) : localStorage.removeItem(TRB_LAST_LESSON_KEY)
      queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, trb: false })))
    } catch { queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, trb: true }))) }
  }, [trbProgress])
  useEffect(() => {
    try {
      localStorage.setItem(TME_PROGRESS_KEY, JSON.stringify({ completed: [...tmeProgress.completed], checklists: tmeProgress.checklists, started: [...tmeProgress.started] }))
      tmeProgress.lastLesson ? localStorage.setItem(TME_LAST_LESSON_KEY, tmeProgress.lastLesson) : localStorage.removeItem(TME_LAST_LESSON_KEY)
      queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, tme: false })))
    } catch { queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, tme: true }))) }
  }, [tmeProgress])
  useEffect(() => { try { localStorage.setItem(LANGUAGE_KEY, language) } catch { /* Keep the language usable without storage. */ } document.documentElement.lang = language }, [language])

  const activeData = route.product === 'trb' ? trb : route.product === 'tme' ? tme : { tutorialParts, allSteps }
  const activeIndex = activeData.allSteps.findIndex((step) => step.id === route.stepId && (!route.partId || step.partId === route.partId))
  const activeReport = route.product === 'tas' && route.page === 'lesson' ? getReportLesson(route.stepId, language) : null
  const isReportPrototype = Boolean(activeReport)
  const activeStep = activeReport || (activeIndex >= 0 ? { ...activeData.allSteps[activeIndex], partStepCount: activeData.tutorialParts.find((part) => part.id === activeData.allSteps[activeIndex].partId).steps.length } : null)
  useEffect(() => {
    try { localStorage.setItem(reportProgressKey, JSON.stringify(reportProgress)) } catch { /* Keep the lesson usable without browser storage. */ }
  }, [reportProgress])
  const term = query.trim().toLocaleLowerCase(language)
  const tasCourseSteps = [...allSteps.filter(step => step.partId !== 'part-3'), ...reportLessons]
  const tasCourseParts = tutorialParts.map(part => part.id === 'part-3' ? { ...part, title: 'Report', shortTitle: 'Report', summary: language === 'en' ? 'Read Quantity columns for each report type.' : 'Mengenal kolom Quantity untuk setiap jenis report.', steps: reportLessons } : part)
  const tasCourseCompleted = new Set([...tasProgress.completed, ...reportLessons.filter(step => reportProgress[step.id].completed).map(step => step.id)].filter(id => tasCourseSteps.some(step => step.id === id)))
  const tasCourseStarted = new Set([...tasProgress.started, ...reportLessons.filter(step => reportProgress[step.id].completed || reportProgress[step.id].checks.length).map(step => step.id)])
  const filteredParts = tasCourseParts.map(part => ({ ...part, steps: term ? part.steps.filter(step => `${step.title} ${step.intro || ''} ${(step.instructions || step.actions.map(action => action.title)).join(' ')}`.toLocaleLowerCase(language).includes(term)) : part.steps })).filter(part => part.steps.length)
  const filteredTrbParts = trb.tutorialParts.map((part) => ({ ...part, steps: term ? part.steps.filter((step) => `${step.title} ${step.intro} ${step.instructions.join(' ')}`.toLocaleLowerCase(language).includes(term)) : part.steps })).filter((part) => part.steps.length)
  const filteredTmeParts = tme.tutorialParts.map((part) => ({ ...part, steps: term ? part.steps.filter((step) => `${step.title} ${step.intro} ${step.instructions.join(' ')}`.toLocaleLowerCase(language).includes(term)) : part.steps })).filter((part) => part.steps.length)
  const lastIncomplete = tasProgress.lastLesson && !tasCourseCompleted.has(tasProgress.lastLesson) ? tasCourseSteps.find(step => step.id === tasProgress.lastLesson) : null
  const continueStep = lastIncomplete || tasCourseSteps.find(step => !tasCourseCompleted.has(step.id)) || tasCourseSteps[0]
  const trbLastIncomplete = trbProgress.lastLesson && !trbProgress.completed.has(trbProgress.lastLesson) ? trb.allSteps.find((step) => step.id === trbProgress.lastLesson) : null
  const continueTrbStep = trbLastIncomplete || trb.allSteps.find((step) => !trbProgress.completed.has(step.id)) || trb.allSteps[0]
  const tmeLastIncomplete = tmeProgress.lastLesson && !tmeProgress.completed.has(tmeProgress.lastLesson) ? tme.allSteps.find((step) => step.id === tmeProgress.lastLesson) : null
  const continueTmeStep = tmeLastIncomplete || tme.allSteps.find((step) => !tmeProgress.completed.has(step.id)) || tme.allSteps[0]

  const toggleCheck = (checkIndex) => setTasProgress((current) => {
    const selected = new Set(current.completed.has(activeStep.id) ? activeStep.checks.map((_, index) => index) : current.checklists[activeStep.id] || [])
    selected.has(checkIndex) ? selected.delete(checkIndex) : selected.add(checkIndex)
    const nextCompleted = new Set(current.completed)
    if (selected.size < activeStep.checks.length) nextCompleted.delete(activeStep.id)
    return { ...current, completed: nextCompleted, checklists: { ...current.checklists, [activeStep.id]: [...selected] } }
  })
  const toggleComplete = () => setTasProgress((current) => {
    const nextCompleted = new Set(current.completed)
    nextCompleted.has(activeStep.id) ? nextCompleted.delete(activeStep.id) : nextCompleted.add(activeStep.id)
    return { ...current, completed: nextCompleted }
  })
  const reset = () => { if (window.confirm(t.resetConfirm)) { setTasProgress({ completed: new Set(), checklists: {}, started: new Set(), lastLesson: null }); setReportProgress(emptyReportProgress()) } }
  const resetTrb = () => { if (window.confirm(t.resetConfirm)) setTrbProgress({ completed: new Set(), checklists: {}, started: new Set(), lastLesson: null }) }
  const updateTrbCheck = (checkIndex) => setTrbProgress((current) => {
    const selected = new Set(current.completed.has(activeStep.id) ? activeStep.checks.map((_, index) => index) : current.checklists[activeStep.id] || [])
    selected.has(checkIndex) ? selected.delete(checkIndex) : selected.add(checkIndex)
    const nextCompleted = new Set(current.completed)
    if (selected.size < activeStep.checks.length) nextCompleted.delete(activeStep.id)
    return { ...current, completed: nextCompleted, checklists: { ...current.checklists, [activeStep.id]: [...selected] } }
  })
  const toggleTrbComplete = () => setTrbProgress((current) => {
    const nextCompleted = new Set(current.completed)
    nextCompleted.has(activeStep.id) ? nextCompleted.delete(activeStep.id) : nextCompleted.add(activeStep.id)
    return { ...current, completed: nextCompleted }
  })
  const resetTme = () => { if (window.confirm(t.resetConfirm)) setTmeProgress({ completed: new Set(), checklists: {}, started: new Set(), lastLesson: null }) }
  const updateTmeCheck = (checkIndex) => setTmeProgress((current) => {
    const selected = new Set(current.completed.has(activeStep.id) ? activeStep.checks.map((_, index) => index) : current.checklists[activeStep.id] || [])
    selected.has(checkIndex) ? selected.delete(checkIndex) : selected.add(checkIndex)
    const nextCompleted = new Set(current.completed)
    if (selected.size < activeStep.checks.length) nextCompleted.delete(activeStep.id)
    return { ...current, completed: nextCompleted, checklists: { ...current.checklists, [activeStep.id]: [...selected] } }
  })
  const toggleTmeComplete = () => setTmeProgress((current) => {
    const nextCompleted = new Set(current.completed)
    nextCompleted.has(activeStep.id) ? nextCompleted.delete(activeStep.id) : nextCompleted.add(activeStep.id)
    return { ...current, completed: nextCompleted }
  })

  const product = route.product || null
  const visibleProgress = product === 'tas' && route.page === 'course' ? { completed: tasCourseCompleted } : isReportPrototype ? { completed: new Set(reportLessons.filter(step => reportProgress[step.id].completed).map(step => step.id)) } : product === 'trb' ? trbProgress : product === 'tme' ? tmeProgress : tasProgress
  const visibleTotal = product === 'tas' && route.page === 'course' ? tasCourseSteps.length : isReportPrototype ? 8 : product === 'trb' ? trb.allSteps.length : product === 'tme' ? tme.allSteps.length : allSteps.length
  if (route.page === 'presentation') {
    const legacyLesson = new URLSearchParams(window.location.search).get('lesson')
    const legacy = allSteps.some(step => step.partId === 'part-3' && step.id === legacyLesson)
    return <Presentation courses={{ tas: legacy ? { tutorialParts, allSteps } : { tutorialParts: tasCourseParts, allSteps: tasCourseSteps }, trb, tme }} language={language} onLanguageChange={setLanguage} />
  }
  if (route.page === 'admin') return <Suspense fallback={<p role="status">{language === 'en' ? 'Loading admin page…' : 'Memuat halaman admin…'}</p>}><AdminResults language={language} onLanguageChange={setLanguage} /></Suspense>
  return <TutorialLayout page={route.page} product={product} activeStep={activeStep} completed={visibleProgress.completed} total={visibleTotal} showProgress={Boolean(product) && !['welcome', 'tests', 'exercise'].includes(route.page)} language={language} onLanguageChange={setLanguage} t={t}>
    {!['exercise', 'tests', 'exercises'].includes(route.page) && <PresentationEntry language={language} />}
    {(product ? progressSaveFailed[product] : Object.values(progressSaveFailed).some(Boolean)) && <p role="status">{language === 'en' ? 'Your learning progress could not be saved in this browser. Changes may be lost after refreshing.' : 'Kemajuan belajar tidak dapat disimpan di browser ini. Perubahan dapat hilang setelah memuat ulang.'}</p>}


    {route.page === 'hub' && <CourseHub language={language} tas={{ allSteps, progress: tasProgress, continueStep }} trb={{ ...trb, progress: trbProgress, continueStep: continueTrbStep }} tme={{ ...tme, progress: tmeProgress, continueStep: continueTmeStep }} t={t} />}

    {['exercise', 'tests', 'exercises'].includes(route.page) && <section className="exercise-card employee-phase-note"><h2>{language === 'en' ? 'Employee assessments are not enabled yet' : 'Latihan karyawan belum diaktifkan'}</h2><p>{language === 'en' ? 'Assessment submissions and score cards will be connected in a later phase.' : 'Pengiriman hasil latihan dan kartu nilai akan dihubungkan pada tahap berikutnya.'}</p></section>}
    {route.page === 'contact' && <ContactPage t={t} />}
    {product === 'tas' && route.page === 'welcome' && <LandingPage allSteps={allSteps} completed={completed} started={tasProgress.started} continueStep={continueStep} product="tas" language={language} t={t} />}
    {product === 'tas' && route.page === 'course' && <CourseMapPage parts={filteredParts} allSteps={tasCourseSteps} completed={tasCourseCompleted} started={tasCourseStarted} lastLesson={tasProgress.lastLesson} continueStep={continueStep} onReset={reset} query={query} setQuery={setQuery} product="tas" language={language} t={t} />}
    {activeReport && <PileCapReportLesson key={activeReport.id} step={activeReport} progress={reportProgress[activeReport.id]} onCheck={(index) => setReportProgress(current => { const entry = current[activeReport.id]; return { ...current, [activeReport.id]: { ...entry, checks: entry.checks.includes(index) ? entry.checks.filter(item => item !== index) : [...entry.checks, index] } } })} onToggle={() => setReportProgress(current => ({ ...current, [activeReport.id]: { ...current[activeReport.id], completed: !current[activeReport.id].completed } }))} previous={reportLessons[activeReport.stepNumber - 2] || allSteps.filter(step => step.partId === 'part-2').at(-1)} next={reportLessons[activeReport.stepNumber]} t={t} />}
    {product === 'tas' && route.page === 'lesson' && !isReportPrototype && activeStep && <TutorialStep step={activeStep} index={activeIndex} total={allSteps.length} isComplete={completed.has(activeStep.id)} selectedChecks={tasProgress.checklists[activeStep.id] || []} onCheck={toggleCheck} onToggle={toggleComplete} previous={allSteps[activeIndex - 1]} next={activeStep.id === 'apply-finishes' ? reportLessons[0] : allSteps[activeIndex + 1]} product="tas" language={language} t={t} />}
    {product === 'trb' && route.page === 'welcome' && <LandingPage product="trb" course={trb} allSteps={trb.allSteps} completed={trbProgress.completed} started={trbProgress.started} continueStep={continueTrbStep} t={t} />}
    {product === 'trb' && route.page === 'course' && <CourseMapPage parts={filteredTrbParts} allSteps={trb.allSteps} completed={trbProgress.completed} started={trbProgress.started} lastLesson={trbProgress.lastLesson} continueStep={continueTrbStep} onReset={resetTrb} query={query} setQuery={setQuery} product="trb" course={trb} language={language} t={t} />}
    {product === 'trb' && route.page === 'lesson' && activeStep && <TutorialStep step={activeStep} index={activeIndex} total={trb.allSteps.length} isComplete={trbProgress.completed.has(activeStep.id)} selectedChecks={trbProgress.checklists[activeStep.id] || []} onCheck={updateTrbCheck} onToggle={toggleTrbComplete} previous={trb.allSteps[activeIndex - 1]} next={trb.allSteps[activeIndex + 1]} product="trb" language={language} t={t} />}
    {product === 'tme' && route.page === 'welcome' && <LandingPage product="tme" course={tme} allSteps={tme.allSteps} completed={tmeProgress.completed} started={tmeProgress.started} continueStep={continueTmeStep} t={t} />}
    {product === 'tme' && route.page === 'course' && <CourseMapPage parts={filteredTmeParts} allSteps={tme.allSteps} completed={tmeProgress.completed} started={tmeProgress.started} lastLesson={tmeProgress.lastLesson} continueStep={continueTmeStep} onReset={resetTme} query={query} setQuery={setQuery} product="tme" course={tme} t={t} />}
    {product === 'tme' && route.page === 'lesson' && activeStep && <TutorialStep step={activeStep} index={activeIndex} total={tme.allSteps.length} isComplete={tmeProgress.completed.has(activeStep.id)} selectedChecks={tmeProgress.checklists[activeStep.id] || []} onCheck={updateTmeCheck} onToggle={toggleTmeComplete} previous={tme.allSteps[activeIndex - 1]} next={tme.allSteps[activeIndex + 1]} product="tme" t={t} />}
  </TutorialLayout>
}
