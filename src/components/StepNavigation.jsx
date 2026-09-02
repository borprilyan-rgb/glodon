import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getStepHash } from '../data/tutorialData'

export default function StepNavigation({ previous, next }) {
  return <nav className="step-navigation" aria-label="Previous and next tutorial steps">
    {previous ? <a href={getStepHash(previous)} className="step-link"><ArrowLeft /><span><small>Previous</small>{previous.title}</span></a> : <a href="#/" className="step-link"><ArrowLeft /><span><small>Back to</small>Overview</span></a>}
    {next ? <a href={getStepHash(next)} className="step-link step-link--next"><span><small>Next</small>{next.title}</span><ArrowRight /></a> : <a href="#/" className="step-link step-link--next"><span><small>Return to</small>Overview</span><ArrowRight /></a>}
  </nav>
}
