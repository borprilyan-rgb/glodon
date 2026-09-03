import { useEffect, useRef } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export default function CompletionChecklist({ checks, selectedChecks, isComplete, onCheck, onToggle, step, destination, t }) {
  const selected = new Set(isComplete ? checks.map((_, index) => index) : selectedChecks)
  const allSelected = selected.size === checks.length
  const successRef = useRef(null)
  const wasComplete = useRef(isComplete)

  useEffect(() => {
    if (!wasComplete.current && isComplete) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      successRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
      successRef.current?.focus({ preventScroll: true })
    }
    wasComplete.current = isComplete
  }, [isComplete])

  if (isComplete) {
    const heading = destination.type === 'course' ? t.courseCompleted : destination.type === 'part' ? t.partCompleted(destination.completedPartNumber) : t.lessonCompleted
    const action = destination.type === 'course' ? t.reviewCourseProgress : destination.type === 'part' ? t.startNextPart : t.continueNextLesson
    const nextTitle = destination.type === 'course' ? `Cubicost ${destination.product.toUpperCase()}` : destination.type === 'part' ? t.nextPart(destination.nextPartNumber, destination.nextPart) : destination.nextLesson.title
    return <section className="completion-card completion-success" id="lesson-completion" aria-live="polite" tabIndex="-1" ref={successRef}><span className="completion-success__icon"><Check size={20} /></span><div><h2>{heading}</h2><p>{destination.type === 'course' ? t.completedCourse(destination.product.toUpperCase()) : destination.type === 'part' ? t.completedPart(destination.completedPart) : t.completedLesson(step.title)}</p><small>{t.nextDestination}</small><strong>{nextTitle}</strong></div><a className="primary-button" href={destination.href}>{action}<ArrowRight size={17} /></a></section>
  }

  return <section className="completion-card" id="lesson-completion"><div><h2>{t.ready}</h2><p className="completion-card__intro">{t.completionPrompt}</p></div><div className="completion-card__checks">{checks.map((check, index) => <label key={check}><input type="checkbox" checked={selected.has(index)} onChange={() => onCheck(index)} /><span>{check}</span></label>)}</div><button className="complete-button" onClick={onToggle} disabled={!allSelected}>{t.markComplete}</button></section>
}
