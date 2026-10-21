import TutorialStep from './TutorialStep'

// Reuse the existing lesson layout and all shared action/image controls.
export default function TasReportLesson({ step, progress, onCheck, onToggle, previous, next, index = step.stepNumber - 1, total = step.partStepCount, t }) {
  return <TutorialStep step={step} index={index} total={total}
    isComplete={progress.completed} selectedChecks={progress.checks}
    onCheck={onCheck} onToggle={onToggle} previous={previous} next={next}
    product="tas" t={t} />
}
