import { useEffect, useMemo, useState } from 'react'
import * as indonesianData from './data/tutorialData.id'
import * as englishData from './data/tutorialData.en'
import { uiText } from './data/uiText'
import TutorialLayout from './components/TutorialLayout'
import LandingPage from './components/LandingPage'
import CourseMapPage from './components/CourseMapPage'
import TutorialStep from './components/TutorialStep'

const STORAGE_KEY = 'cubicost-tas-tutorial-progress-v1'
const LANGUAGE_KEY = 'cubicost-tas-tutorial-language-v1'

function routeFromHash() {
  const [partId, stepId] = window.location.hash.replace(/^#\/?/, '').split('/')
  if (!partId) return { page: 'landing' }
  if (partId === 'course') return { page: 'course' }
  return { page: 'lesson', partId, stepId }
}

function loadProgress(initialStepId) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const completed = new Set(Array.isArray(saved) ? saved : saved.completed || [])
    const checklists = Array.isArray(saved) ? {} : saved.checklists || {}
    const started = new Set(Array.isArray(saved) ? saved : saved.started || [...completed, ...Object.keys(checklists)])
    if (initialStepId) started.add(initialStepId)
    return { completed, checklists, started, lastLesson: initialStepId || (Array.isArray(saved) ? null : saved.lastLesson || null) }
  } catch { return { completed: new Set(), checklists: {}, started: new Set(initialStepId ? [initialStepId] : []), lastLesson: initialStepId || null } }
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash)
  const [language, setLanguage] = useState(() => localStorage.getItem(LANGUAGE_KEY) === 'id' ? 'id' : 'en')
  const [progress, setProgress] = useState(() => loadProgress(routeFromHash().stepId))
  const [query, setQuery] = useState('')
  const { tutorialParts, allSteps } = language === 'id' ? indonesianData : englishData
  const t = uiText[language]
  const completed = progress.completed

  useEffect(() => {
    const onHash = () => {
      const nextRoute = routeFromHash()
      setRoute(nextRoute)
      if (nextRoute.stepId) setProgress((current) => {
        const started = new Set(current.started)
        started.add(nextRoute.stepId)
        return { ...current, started, lastLesson: nextRoute.stepId }
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: [...progress.completed], checklists: progress.checklists, started: [...progress.started], lastLesson: progress.lastLesson })) }, [progress])
  useEffect(() => { localStorage.setItem(LANGUAGE_KEY, language); document.documentElement.lang = language }, [language])

  const activeIndex = allSteps.findIndex((step) => step.partId === route.partId && step.id === route.stepId)
  const activeStep = activeIndex >= 0 ? { ...allSteps[activeIndex], partStepCount: tutorialParts.find((part) => part.id === route.partId).steps.length } : null
  const term = query.trim().toLocaleLowerCase(language)
  const filteredParts = useMemo(() => tutorialParts.map((part) => ({ ...part, steps: term ? part.steps.filter((step) => `${step.title} ${step.intro} ${step.instructions.join(' ')}`.toLocaleLowerCase(language).includes(term)) : part.steps })).filter((part) => part.steps.length), [language, term, tutorialParts])
  const lastIncomplete = progress.lastLesson && !completed.has(progress.lastLesson) ? allSteps.find((step) => step.id === progress.lastLesson) : null
  const continueStep = lastIncomplete || allSteps.find((step) => !completed.has(step.id)) || allSteps[0]

  const toggleCheck = (checkIndex) => setProgress((current) => {
    const selected = new Set(current.completed.has(activeStep.id) ? activeStep.checks.map((_, index) => index) : current.checklists[activeStep.id] || [])
    selected.has(checkIndex) ? selected.delete(checkIndex) : selected.add(checkIndex)
    const nextCompleted = new Set(current.completed)
    if (selected.size < activeStep.checks.length) nextCompleted.delete(activeStep.id)
    return { ...current, completed: nextCompleted, checklists: { ...current.checklists, [activeStep.id]: [...selected] } }
  })
  const toggleComplete = () => setProgress((current) => {
    const nextCompleted = new Set(current.completed)
    nextCompleted.has(activeStep.id) ? nextCompleted.delete(activeStep.id) : nextCompleted.add(activeStep.id)
    return { ...current, completed: nextCompleted }
  })
  const reset = () => { if (window.confirm(t.resetConfirm)) setProgress({ completed: new Set(), checklists: {}, started: new Set(), lastLesson: null }) }

  return <TutorialLayout activeStep={activeStep} completed={completed} total={allSteps.length} showProgress={route.page !== 'landing'} language={language} onLanguageChange={setLanguage} t={t}>
    {route.page === 'landing'
      ? <LandingPage allSteps={allSteps} completed={completed} started={progress.started} continueStep={continueStep} t={t} />
      : activeStep
        ? <TutorialStep step={activeStep} index={activeIndex} total={allSteps.length} isComplete={completed.has(activeStep.id)} selectedChecks={progress.checklists[activeStep.id] || []} onCheck={toggleCheck} onToggle={toggleComplete} previous={allSteps[activeIndex - 1]} next={allSteps[activeIndex + 1]} t={t} />
        : <CourseMapPage parts={filteredParts} allSteps={allSteps} completed={completed} started={progress.started} lastLesson={progress.lastLesson} continueStep={continueStep} onReset={reset} query={query} setQuery={setQuery} t={t} />}
  </TutorialLayout>
}
