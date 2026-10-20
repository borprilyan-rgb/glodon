import TutorialStep from './TutorialStep'

// Reuse the existing lesson layout and all shared action/image controls.
export default function TasReportLesson({ step, progress, onCheck, onToggle, previous, next, t }) {
  return <TutorialStep step={step} index={step.stepNumber - 1} total={8}
    isComplete={progress.completed} selectedChecks={progress.checks}
    onCheck={onCheck} onToggle={onToggle} previous={previous} next={next}
    product="tas" t={t} />
}
