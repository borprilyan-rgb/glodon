import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getStepPath } from '../data/tutorialUtils'

function addSearchContext(href, searchQuery) {
  if (searchQuery == null) return href
  const params = new URLSearchParams({ fromSearch: '1' })
  if (searchQuery) params.set('q', searchQuery)
  return `${href}?${params.toString()}`
}

export default function StepNavigation({ previous, next, product = 'tas', t, searchQuery }) {
  return <nav className="step-navigation" aria-label={t.previousNextAria}>
    {previous ? <a href={addSearchContext(getStepPath(previous, product), searchQuery)} className="step-link"><ArrowLeft /><span><small>{t.previousLesson}</small>{previous.title}</span></a> : <a href={`/${product}/course`} className="step-link"><ArrowLeft /><span><small>{t.backToCourseMap}</small>{t.courseMapLabel}</span></a>}
    {next ? <a href={addSearchContext(getStepPath(next, product), searchQuery)} className="step-link step-link--next"><span><small>{t.nextLesson}</small>{next.title}</span><ArrowRight /></a> : <a href={`/${product}/course`} className="step-link step-link--next"><span><small>{t.backToCourseMap}</small>{t.courseMapLabel}</span><ArrowRight /></a>}
  </nav>
}
