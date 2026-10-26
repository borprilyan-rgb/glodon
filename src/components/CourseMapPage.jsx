import { ArrowRight, Check, ChevronDown, Circle, Play } from 'lucide-react'
import { getStepPath } from '../data/tutorialUtils'
import ProgressBar from './ProgressBar'
import { useState } from 'react'
import { getProductConfig, getProductLabel } from '../data/productConfig'

export default function CourseMapPage({ parts, allSteps, completed, started, lastLesson, continueStep, onReset, query, setQuery, product = 'tas', course, embedded = false, t }) {
  const config = getProductConfig(product, t, course)
  const percentage = Math.round((completed.size / allSteps.length) * 100)
  const getState = (step) => completed.has(step.id) ? 'completed' : started.has(step.id) ? 'inProgress' : 'notStarted'
  const currentPart = parts.find((part) => part.steps.some((step) => step.id === lastLesson))?.id || parts[0]?.id
  const [openPart, setOpenPart] = useState(currentPart)
  const [closedParts, setClosedParts] = useState(() => new Set())
  const isEmbeddedMap = embedded
  function togglePart(id) {
    if (!isEmbeddedMap) { setOpenPart(openPart === id ? null : id); return }
    setClosedParts(current => {
      const next = new Set(current)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  return <div className="course-map-page" data-product={product}>
    {!embedded && <section className="course-map-hero"><div><span className="eyebrow">{getProductLabel(product)} · {t.courseOverview}</span><h1>{config.courseTitle}</h1><p>{config.courseIntro}</p><a className="primary-button" href={getStepPath(continueStep, product)}><Play size={17} />{completed.size ? t.continueLearning : t.startCourse}</a></div><aside><span>{t.overallProgress}</span><strong>{percentage}%</strong><ProgressBar completed={completed.size} total={allSteps.length} t={t} /><small>{t.stepsProgress(completed.size, allSteps.length)}</small></aside></section>}
    <div className="course-map-toolbar"><label><span className="sr-only">{t.searchAria}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label><button type="button" onClick={onReset}>{t.reset}</button></div>
    <div className="course-map-parts">{parts.map((part) => {
      const expanded = isEmbeddedMap ? !closedParts.has(part.id) : openPart === part.id
      const partSteps = allSteps.filter(step => step.partId === part.id)
      const partCompleted = partSteps.filter(step => completed.has(step.id)).length
      return <section className={`course-part ${expanded ? 'is-open' : ''}`} key={part.id}><header><span>{part.number}</span><div><small>{t.part} {part.number}</small><h2>{part.title}</h2>{!isEmbeddedMap && <p>{part.summary}</p>}</div>{isEmbeddedMap && <div className="course-part__progress" aria-label={`${t.part} ${part.number}: ${t.courseProgress}`}><ProgressBar completed={partCompleted} total={partSteps.length} t={t} compact /></div>}<button className="course-part__toggle" type="button" onClick={() => togglePart(part.id)} aria-controls={`lessons-${part.id}`} aria-expanded={expanded} aria-label={`${t.part} ${part.number}: ${part.title}`}><ChevronDown size={20} /></button></header><div id={`lessons-${part.id}`} className="course-lessons" hidden={isEmbeddedMap && !expanded}>{part.steps.map((rawStep) => {
      const step = allSteps.find((item) => item.id === rawStep.id)
      if (!step) return null
      const state = getState(step)
      const isCurrent = step.id === lastLesson
      return <a className={`course-lesson is-${state} ${isCurrent ? 'is-current' : ''}`} href={getStepPath(step, product)} key={step.id} aria-current={isCurrent ? 'page' : undefined}><span className="course-lesson__status">{state === 'completed' ? <Check size={16} /> : state === 'inProgress' ? <Play size={14} /> : <Circle size={14} />}</span><span className="course-lesson__copy"><small>{t.step} {step.stepNumber}</small><strong>{step.title}</strong><span>{t[state]}</span></span><span className="course-lesson__action">{state === 'completed' ? t.completed : state === 'inProgress' ? t.resumeLesson : t.startLesson}<ArrowRight size={15} /></span></a>
    })}</div></section>})}</div>
  </div>
}
