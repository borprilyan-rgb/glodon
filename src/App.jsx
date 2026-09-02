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
  const [language, setLanguage] = useState(() => localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'id')
  const [completed, setCompleted] = useState(() => { try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')) } catch { return new Set() } })
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { tutorialParts, allSteps } = language === 'id' ? indonesianData : englishData
  const t = uiText[language]

  useEffect(() => { const onHash = () => { setRoute(routeFromHash()); window.scrollTo({ top: 0, behavior: 'smooth' }) }; window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash) }, [])
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])) }, [completed])
  useEffect(() => { localStorage.setItem(LANGUAGE_KEY, language); document.documentElement.lang = language }, [language])

  const filteredSteps = useMemo(() => { const term = query.trim().toLocaleLowerCase(language); return term ? allSteps.filter((step) => `${step.title} ${step.intro} ${step.partTitle} ${step.instructions.join(' ')}`.toLocaleLowerCase(language).includes(term)) : allSteps }, [allSteps, language, query])
  const activeIndex = allSteps.findIndex((step) => step.partId === route.partId && step.id === route.stepId)
  const activeStep = activeIndex >= 0 ? { ...allSteps[activeIndex], partStepCount: tutorialParts.find((part) => part.id === route.partId).steps.length } : null

  const toggleComplete = () => setCompleted((current) => { const next = new Set(current); next.has(activeStep.id) ? next.delete(activeStep.id) : next.add(activeStep.id); return next })
  const reset = () => { if (window.confirm(t.resetConfirm)) setCompleted(new Set()) }

  return <TutorialLayout parts={tutorialParts} steps={filteredSteps} activeStep={activeStep} completed={completed} query={query} setQuery={setQuery} onReset={reset} onNavigate={() => setQuery('')} mobileOpen={mobileOpen} openMobile={() => setMobileOpen(true)} closeMobile={() => setMobileOpen(false)} language={language} onLanguageChange={setLanguage} t={t}>
    {activeStep ? <TutorialStep step={activeStep} index={activeIndex} total={allSteps.length} isComplete={completed.has(activeStep.id)} onToggle={toggleComplete} previous={allSteps[activeIndex - 1]} next={allSteps[activeIndex + 1]} t={t} /> : <TutorialOverview parts={tutorialParts} completed={completed} total={allSteps.length} t={t} />}
  </TutorialLayout>
}
