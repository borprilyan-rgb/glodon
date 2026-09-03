import { Clock3 } from 'lucide-react'
import ActionStepViewer from './ActionStepViewer'
import WarningCallout from './WarningCallout'
import CompletionChecklist from './CompletionChecklist'
import StepNavigation from './StepNavigation'
import OfficialText from './OfficialText'
import { getLessonDestination } from '../data/lessonNavigation'

export default function TutorialStep({ step, index, total, isComplete, selectedChecks, onCheck, onToggle, previous, next, product = 'tas', t }) {
  const destination = getLessonDestination({ step, next, product })
  return <article className="tutorial-step">
    <header className="step-header"><div className="step-header__meta"><span>{t.part} {step.partNumber} · {t.step} {step.stepNumber} {t.of} {step.partStepCount}</span><span><Clock3 size={15} /> {step.duration}</span></div><h1>{step.title}</h1><p><OfficialText>{step.intro}</OfficialText></p><div className="step-position"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div></header>
    <ActionStepViewer key={step.id} actions={step.actions} isComplete={isComplete} destination={destination} t={t} />
    {(step.note || step.warning) && <WarningCallout t={t}><OfficialText>{[step.note, step.warning].filter(Boolean).join(' ')}</OfficialText></WarningCallout>}
    <CompletionChecklist checks={step.checks} selectedChecks={selectedChecks} isComplete={isComplete} onCheck={onCheck} onToggle={onToggle} step={step} destination={destination} t={t} />
    <StepNavigation previous={previous} next={next} product={product} t={t} />
  </article>
}
