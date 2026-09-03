import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getStepPath } from '../data/tutorialUtils'

export default function StepNavigation({ previous, next, product = 'tas', t }) {
  return <nav className="step-navigation" aria-label={t.previousNextAria}>
    {previous ? <a href={getStepPath(previous, product)} className="step-link"><ArrowLeft /><span><small>{t.previousLesson}</small>{previous.title}</span></a> : <a href={`/${product}/course`} className="step-link"><ArrowLeft /><span><small>{t.backToCourseMap}</small>{t.courseMapLabel}</span></a>}
    {next ? <a href={getStepPath(next, product)} className="step-link step-link--next"><span><small>{t.nextLesson}</small>{next.title}</span><ArrowRight /></a> : <a href={`/${product}/course`} className="step-link step-link--next"><span><small>{t.backToCourseMap}</small>{t.courseMapLabel}</span><ArrowRight /></a>}
  </nav>
}
