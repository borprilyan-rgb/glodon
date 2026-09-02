import { Clock3 } from 'lucide-react'
import ActionStepViewer from './ActionStepViewer'
import TechnicalNote from './TechnicalNote'
import WarningCallout from './WarningCallout'
import CompletionChecklist from './CompletionChecklist'
import StepNavigation from './StepNavigation'
import OfficialText from './OfficialText'

export default function TutorialStep({ step, index, total, isComplete, onToggle, previous, next, t }) {
  return <article className="tutorial-step">
    <header className="step-header"><div className="step-header__meta"><span>{t.part} {step.partNumber} · {t.step} {step.stepNumber} {t.of} {step.partStepCount}</span><span><Clock3 size={15} /> {step.duration}</span></div><h1>{step.title}</h1><p><OfficialText>{step.intro}</OfficialText></p><div className="step-position"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div></header>
    <ActionStepViewer key={step.id} actions={step.actions} t={t} />
    {step.note && <TechnicalNote t={t}><OfficialText>{step.note}</OfficialText></TechnicalNote>}
    {step.warning && <WarningCallout t={t}><OfficialText>{step.warning}</OfficialText></WarningCallout>}
    <CompletionChecklist checks={step.checks} isComplete={isComplete} onToggle={onToggle} t={t} />
    <StepNavigation previous={previous} next={next} t={t} />
  </article>
}
