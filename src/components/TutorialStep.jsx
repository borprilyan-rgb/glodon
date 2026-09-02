import { Clock3 } from 'lucide-react'
import ScreenshotFrame from './ScreenshotFrame'
import TechnicalNote from './TechnicalNote'
import WarningCallout from './WarningCallout'
import CompletionChecklist from './CompletionChecklist'
import StepNavigation from './StepNavigation'

export default function TutorialStep({ step, index, total, isComplete, onToggle, previous, next }) {
  return <article className="tutorial-step">
    <header className="step-header"><div className="step-header__meta"><span>PART {step.partNumber} · STEP {step.stepNumber} OF {step.partStepCount}</span><span><Clock3 size={15} /> {step.duration}</span></div><h1>{step.title}</h1><p>{step.intro}</p><div className="step-position"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div></header>
    <div className="lesson-grid"><section className="instruction-card"><span className="eyebrow">PROCEDURE</span><h2>Follow these steps</h2><ol>{step.instructions.map((instruction, itemIndex) => <li key={instruction}><span>{String(itemIndex + 1).padStart(2, '0')}</span><p>{instruction}</p></li>)}</ol></section><ScreenshotFrame screenshot={step.screenshot} partId={step.partId} /></div>
    {step.note && <TechnicalNote>{step.note}</TechnicalNote>}
    {step.warning && <WarningCallout>{step.warning}</WarningCallout>}
    <CompletionChecklist checks={step.checks} isComplete={isComplete} onToggle={onToggle} />
    <StepNavigation previous={previous} next={next} />
  </article>
}
