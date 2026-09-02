import { useEffect, useMemo, useState } from 'react'
import { allSteps, tutorialParts } from './data/tutorialData'
import TutorialLayout from './components/TutorialLayout'
import TutorialOverview from './components/TutorialOverview'
import TutorialStep from './components/TutorialStep'

const STORAGE_KEY = 'cubicost-tas-tutorial-progress-v1'

function routeFromHash() {
  const [partId, stepId] = window.location.hash.replace(/^#\/?/, '').split('/')
  return { partId, stepId }
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash)
  const [completed, setCompleted] = useState(() => { try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')) } catch { return new Set() } })
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { const onHash = () => { setRoute(routeFromHash()); window.scrollTo({ top: 0, behavior: 'smooth' }) }; window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash) }, [])
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])) }, [completed])

  const filteredSteps = useMemo(() => { const term = query.trim().toLowerCase(); return term ? allSteps.filter((step) => `${step.title} ${step.intro} ${step.partTitle} ${step.instructions.join(' ')}`.toLowerCase().includes(term)) : allSteps }, [query])
  const activeIndex = allSteps.findIndex((step) => step.partId === route.partId && step.id === route.stepId)
  const activeStep = activeIndex >= 0 ? { ...allSteps[activeIndex], partStepCount: tutorialParts.find((part) => part.id === route.partId).steps.length } : null

  const toggleComplete = () => setCompleted((current) => { const next = new Set(current); next.has(activeStep.id) ? next.delete(activeStep.id) : next.add(activeStep.id); return next })
  const reset = () => { if (window.confirm('Reset all tutorial progress? This cannot be undone.')) setCompleted(new Set()) }

  return <TutorialLayout parts={tutorialParts} steps={filteredSteps} activeStep={activeStep} completed={completed} query={query} setQuery={setQuery} onReset={reset} onNavigate={() => setQuery('')} mobileOpen={mobileOpen} openMobile={() => setMobileOpen(true)} closeMobile={() => setMobileOpen(false)}>
    {activeStep ? <TutorialStep step={activeStep} index={activeIndex} total={allSteps.length} isComplete={completed.has(activeStep.id)} onToggle={toggleComplete} previous={allSteps[activeIndex - 1]} next={allSteps[activeIndex + 1]} /> : <TutorialOverview parts={tutorialParts} completed={completed} total={allSteps.length} />}
  </TutorialLayout>
}
