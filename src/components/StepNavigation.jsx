import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getStepHash } from '../data/tutorialUtils'

export default function StepNavigation({ previous, next, t }) {
  return <nav className="step-navigation" aria-label={t.previousNextAria}>
    {previous ? <a href={getStepHash(previous)} className="step-link"><ArrowLeft /><span><small>{t.previous}</small>{previous.title}</span></a> : <a href="#/" className="step-link"><ArrowLeft /><span><small>{t.backTo}</small>{t.overview}</span></a>}
    {next ? <a href={getStepHash(next)} className="step-link step-link--next"><span><small>{t.next}</small>{next.title}</span><ArrowRight /></a> : <a href="#/" className="step-link step-link--next"><span><small>{t.returnTo}</small>{t.overview}</span><ArrowRight /></a>}
  </nav>
}
