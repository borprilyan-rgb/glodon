import { useEffect, useState } from 'react'
import { getTasData } from './data/tas/index.js'
import { getTrbData } from './data/trb/index.js'
import { uiText } from './data/uiText'
import TutorialLayout from './components/TutorialLayout'
import CourseHub from './components/CourseHub'
import LandingPage from './components/LandingPage'
import CourseMapPage from './components/CourseMapPage'
import TrbCourseMap from './components/TrbCourseMap'
import TutorialStep from './components/TutorialStep'

const LEGACY_TAS_KEY = 'cubicost-tas-tutorial-progress-v1'
const TAS_PROGRESS_KEY = 'cubicost:tutorial:tas:progress'
const TAS_LAST_LESSON_KEY = 'cubicost:tutorial:tas:lastLesson'
const TAS_MIGRATION_KEY = 'cubicost:tutorial:tas:migrated-v1'
const TRB_PROGRESS_KEY = 'cubicost:tutorial:trb:progress'
const LANGUAGE_KEY = 'cubicost-tas-tutorial-language-v1'

function routeFromLocation() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/') {
    const [first, second] = window.location.hash.replace(/^#\/?/, '').split('/')
    if (first === 'course') return { product: 'tas', page: 'course' }
    if (first && first !== 'tas' && first !== 'trb') return { product: 'tas', page: 'lesson', partId: first, stepId: second }
    return { page: 'hub' }
  }
  const [product, view, stepId] = path.split('/').filter(Boolean)
  if (!['tas', 'trb'].includes(product)) return { page: 'hub' }
  if (view === 'course') return { product, page: 'course' }
  if (view === 'lesson' && stepId) return { product, page: 'lesson', stepId }
  return { product, page: 'welcome' }
}

function normaliseProgress(saved, initialStepId, storedLastLesson) {
  const completed = new Set(Array.isArray(saved) ? saved : saved?.completed || [])
  const checklists = Array.isArray(saved) ? {} : saved?.checklists || {}
  const started = new Set(Array.isArray(saved) ? saved : saved?.started || [...completed, ...Object.keys(checklists)])
  if (initialStepId) started.add(initialStepId)
  return { completed, checklists, started, lastLesson: initialStepId || storedLastLesson || (!Array.isArray(saved) && saved?.lastLesson) || null }
}

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
    return normaliseProgress(JSON.parse(localStorage.getItem(TAS_PROGRESS_KEY) || '[]'), initialStepId, localStorage.getItem(TAS_LAST_LESSON_KEY))
  } catch { return normaliseProgress([], initialStepId, null) }
}

export default function App() {
  const initialRoute = routeFromLocation()
  const [route, setRoute] = useState(initialRoute)
  const [language, setLanguage] = useState(() => localStorage.getItem(LANGUAGE_KEY) === 'id' ? 'id' : 'en')
  const [tasProgress, setTasProgress] = useState(() => loadTasProgress(initialRoute.product === 'tas' ? initialRoute.stepId : null))
  const [query, setQuery] = useState('')
  const { tutorialParts, allSteps } = getTasData(language)
  const trb = getTrbData(language)
  const t = uiText[language]
  const completed = tasProgress.completed

  useEffect(() => {
    const onLocationChange = () => {
      const nextRoute = routeFromLocation()
      setRoute(nextRoute)
      if (nextRoute.product === 'tas' && nextRoute.stepId) setTasProgress((current) => {
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
    localStorage.setItem(TAS_PROGRESS_KEY, JSON.stringify({ completed: [...tasProgress.completed], checklists: tasProgress.checklists, started: [...tasProgress.started] }))
    tasProgress.lastLesson ? localStorage.setItem(TAS_LAST_LESSON_KEY, tasProgress.lastLesson) : localStorage.removeItem(TAS_LAST_LESSON_KEY)
  }, [tasProgress])
  useEffect(() => {
    if (!localStorage.getItem(TRB_PROGRESS_KEY)) localStorage.setItem(TRB_PROGRESS_KEY, JSON.stringify({ completed: [], checklists: {}, started: [] }))
  }, [])
  useEffect(() => { localStorage.setItem(LANGUAGE_KEY, language); document.documentElement.lang = language }, [language])

  const activeIndex = allSteps.findIndex((step) => step.id === route.stepId && (!route.partId || step.partId === route.partId))
  const activeStep = activeIndex >= 0 ? { ...allSteps[activeIndex], partStepCount: tutorialParts.find((part) => part.id === allSteps[activeIndex].partId).steps.length } : null
  const term = query.trim().toLocaleLowerCase(language)
  const filteredParts = tutorialParts.map((part) => ({ ...part, steps: term ? part.steps.filter((step) => `${step.title} ${step.intro} ${step.instructions.join(' ')}`.toLocaleLowerCase(language).includes(term)) : part.steps })).filter((part) => part.steps.length)
  const lastIncomplete = tasProgress.lastLesson && !completed.has(tasProgress.lastLesson) ? allSteps.find((step) => step.id === tasProgress.lastLesson) : null
  const continueStep = lastIncomplete || allSteps.find((step) => !completed.has(step.id)) || allSteps[0]

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
  const reset = () => { if (window.confirm(t.resetConfirm)) setTasProgress({ completed: new Set(), checklists: {}, started: new Set(), lastLesson: null }) }

  const product = route.product || null
  return <TutorialLayout product={product} activeStep={activeStep} completed={completed} total={allSteps.length} showProgress={product === 'tas' && route.page !== 'welcome'} language={language} onLanguageChange={setLanguage} t={t}>
    {route.page === 'hub' && <CourseHub tas={{ allSteps, progress: tasProgress, continueStep }} trb={trb} t={t} />}
    {product === 'tas' && route.page === 'welcome' && <LandingPage allSteps={allSteps} completed={completed} started={tasProgress.started} continueStep={continueStep} product="tas" t={t} />}
    {product === 'tas' && route.page === 'course' && <CourseMapPage parts={filteredParts} allSteps={allSteps} completed={completed} started={tasProgress.started} lastLesson={tasProgress.lastLesson} continueStep={continueStep} onReset={reset} query={query} setQuery={setQuery} product="tas" t={t} />}
    {product === 'tas' && route.page === 'lesson' && activeStep && <TutorialStep step={activeStep} index={activeIndex} total={allSteps.length} isComplete={completed.has(activeStep.id)} selectedChecks={tasProgress.checklists[activeStep.id] || []} onCheck={toggleCheck} onToggle={toggleComplete} previous={allSteps[activeIndex - 1]} next={allSteps[activeIndex + 1]} product="tas" t={t} />}
    {product === 'trb' && route.page === 'welcome' && <LandingPage product="trb" scaffold={trb} t={t} />}
    {product === 'trb' && (route.page === 'course' || route.page === 'lesson') && <TrbCourseMap course={trb} t={t} />}
  </TutorialLayout>
}
