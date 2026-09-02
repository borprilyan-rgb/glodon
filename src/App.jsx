import { useEffect, useMemo, useState } from 'react'
import * as indonesianData from './data/tutorialData.id'
import * as englishData from './data/tutorialData.en'
import { uiText } from './data/uiText'
import TutorialLayout from './components/TutorialLayout'
import TutorialOverview from './components/TutorialOverview'
import TutorialStep from './components/TutorialStep'

const STORAGE_KEY = 'cubicost-tas-tutorial-progress-v1'
const LANGUAGE_KEY = 'cubicost-tas-tutorial-language-v1'

function routeFromHash() {
  const [partId, stepId] = window.location.hash.replace(/^#\/?/, '').split('/')
  return { partId, stepId }
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash)
  const [language, setLanguage] = useState(() => localStorage.getItem(LANGUAGE_KEY) === 'id' ? 'id' : 'en')
  const [progress, setProgress] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      return Array.isArray(saved) ? { completed: new Set(saved), checklists: {} } : { completed: new Set(saved.completed || []), checklists: saved.checklists || {} }
    } catch { return { completed: new Set(), checklists: {} } }
  })
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { tutorialParts, allSteps } = language === 'id' ? indonesianData : englishData
  const t = uiText[language]
  const completed = progress.completed

  useEffect(() => { const onHash = () => { setRoute(routeFromHash()); window.scrollTo({ top: 0, behavior: 'smooth' }) }; window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash) }, [])
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: [...progress.completed], checklists: progress.checklists })) }, [progress])
  useEffect(() => { localStorage.setItem(LANGUAGE_KEY, language); document.documentElement.lang = language }, [language])

  const filteredSteps = useMemo(() => { const term = query.trim().toLocaleLowerCase(language); return term ? allSteps.filter((step) => `${step.title} ${step.intro} ${step.partTitle} ${step.instructions.join(' ')}`.toLocaleLowerCase(language).includes(term)) : allSteps }, [allSteps, language, query])
  const activeIndex = allSteps.findIndex((step) => step.partId === route.partId && step.id === route.stepId)
  const activeStep = activeIndex >= 0 ? { ...allSteps[activeIndex], partStepCount: tutorialParts.find((part) => part.id === route.partId).steps.length } : null

  const toggleCheck = (checkIndex) => setProgress((current) => {
    const selected = new Set(current.completed.has(activeStep.id) ? activeStep.checks.map((_, index) => index) : current.checklists[activeStep.id] || [])
    selected.has(checkIndex) ? selected.delete(checkIndex) : selected.add(checkIndex)
    const nextCompleted = new Set(current.completed)
    if (selected.size < activeStep.checks.length) nextCompleted.delete(activeStep.id)
    return { completed: nextCompleted, checklists: { ...current.checklists, [activeStep.id]: [...selected] } }
  })
  const toggleComplete = () => setProgress((current) => {
    const nextCompleted = new Set(current.completed)
    nextCompleted.has(activeStep.id) ? nextCompleted.delete(activeStep.id) : nextCompleted.add(activeStep.id)
    return { completed: nextCompleted, checklists: current.checklists }
  })
  const reset = () => { if (window.confirm(t.resetConfirm)) setProgress({ completed: new Set(), checklists: {} }) }

  return <TutorialLayout parts={tutorialParts} steps={filteredSteps} activeStep={activeStep} completed={completed} query={query} setQuery={setQuery} onReset={reset} onNavigate={() => setQuery('')} mobileOpen={mobileOpen} openMobile={() => setMobileOpen(true)} closeMobile={() => setMobileOpen(false)} language={language} onLanguageChange={setLanguage} t={t}>
    {activeStep ? <TutorialStep step={activeStep} index={activeIndex} total={allSteps.length} isComplete={completed.has(activeStep.id)} selectedChecks={progress.checklists[activeStep.id] || []} onCheck={toggleCheck} onToggle={toggleComplete} previous={allSteps[activeIndex - 1]} next={allSteps[activeIndex + 1]} t={t} /> : <TutorialOverview parts={tutorialParts} completed={completed} total={allSteps.length} t={t} />}
  </TutorialLayout>
}
