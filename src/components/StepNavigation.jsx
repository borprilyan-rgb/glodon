import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getStepHash } from '../data/tutorialUtils'

export default function StepNavigation({ previous, next, t }) {
  return <nav className="step-navigation" aria-label={t.previousNextAria}>
    {previous ? <a href={getStepHash(previous)} className="step-link"><ArrowLeft /><span><small>{t.previousLesson}</small>{previous.title}</span></a> : <a href="#/course" className="step-link"><ArrowLeft /><span><small>{t.backToCourseMap}</small>{t.courseMapLabel}</span></a>}
    {next ? <a href={getStepHash(next)} className="step-link step-link--next"><span><small>{t.nextLesson}</small>{next.title}</span><ArrowRight /></a> : <a href="#/course" className="step-link step-link--next"><span><small>{t.backToCourseMap}</small>{t.courseMapLabel}</span><ArrowRight /></a>}
  </nav>
}
