import { Clock3 } from 'lucide-react'
import ScreenshotFrame from './ScreenshotFrame'
import TechnicalNote from './TechnicalNote'
import WarningCallout from './WarningCallout'
import CompletionChecklist from './CompletionChecklist'
import StepNavigation from './StepNavigation'
import OfficialText from './OfficialText'

export default function TutorialStep({ step, index, total, isComplete, onToggle, previous, next, t }) {
  return <article className="tutorial-step">
    <header className="step-header"><div className="step-header__meta"><span>{t.part} {step.partNumber} · {t.step} {step.stepNumber} {t.of} {step.partStepCount}</span><span><Clock3 size={15} /> {step.duration}</span></div><h1>{step.title}</h1><p><OfficialText>{step.intro}</OfficialText></p><div className="step-position"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div></header>
    <div className="lesson-grid"><section className="instruction-card"><span className="eyebrow">{t.procedure}</span><h2>{t.followSteps}</h2><ol>{step.instructions.map((instruction, itemIndex) => <li key={instruction}><span>{String(itemIndex + 1).padStart(2, '0')}</span><p><OfficialText>{instruction}</OfficialText></p></li>)}</ol></section><ScreenshotFrame screenshot={step.screenshot} partId={step.partId} t={t} /></div>
    {step.note && <TechnicalNote t={t}><OfficialText>{step.note}</OfficialText></TechnicalNote>}
    {step.warning && <WarningCallout t={t}><OfficialText>{step.warning}</OfficialText></WarningCallout>}
    <CompletionChecklist checks={step.checks} isComplete={isComplete} onToggle={onToggle} t={t} />
    <StepNavigation previous={previous} next={next} t={t} />
  </article>
}
