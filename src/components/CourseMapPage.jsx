import { ArrowRight, Check, Circle, Play } from 'lucide-react'
import { getStepPath } from '../data/tutorialUtils'
import ProgressBar from './ProgressBar'
import { useState } from 'react'
import { getProductConfig } from '../data/productConfig'

export default function CourseMapPage({ parts, allSteps, completed, started, lastLesson, continueStep, onReset, query, setQuery, product = 'tas', course, t }) {
  const config = getProductConfig(product, t, course)
  const percentage = Math.round((completed.size / allSteps.length) * 100)
  const getState = (step) => completed.has(step.id) ? 'completed' : started.has(step.id) ? 'inProgress' : 'notStarted'
  const currentPart = parts.find((part) => part.steps.some((step) => step.id === lastLesson))?.id || parts[0]?.id
  const [openPart, setOpenPart] = useState(currentPart)
  return <div className="course-map-page" data-product={product}>
    <section className="course-map-hero"><div><span className="eyebrow">{product.toUpperCase()} · {t.courseOverview}</span><h1>{config.courseTitle}</h1><p>{config.courseIntro}</p><a className="primary-button" href={getStepPath(continueStep, product)}><Play size={17} />{completed.size ? t.continueLearning : t.startCourse}</a></div><aside><span>{t.overallProgress}</span><strong>{percentage}%</strong><ProgressBar completed={completed.size} total={allSteps.length} t={t} /><small>{t.stepsProgress(completed.size, allSteps.length)}</small></aside></section>
    <div className="course-map-toolbar"><label><span className="sr-only">{t.searchAria}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label><button type="button" onClick={onReset}>{t.reset}</button></div>
    <div className="course-map-parts">{parts.map((part) => <section className={`course-part ${openPart === part.id ? 'is-open' : ''}`} key={part.id}><header><span>{part.number}</span><div><small>{t.part} {part.number}</small><h2>{part.title}</h2><p>{part.summary}</p></div><button className="course-part__toggle" type="button" onClick={() => setOpenPart(openPart === part.id ? null : part.id)} aria-expanded={openPart === part.id} aria-label={`${t.part} ${part.number}: ${part.title}`}>⌄</button></header><div className="course-lessons">{part.steps.map((rawStep) => {
      const step = allSteps.find((item) => item.id === rawStep.id)
      if (!step) return null
      const state = getState(step)
      const isCurrent = step.id === lastLesson
      return <a className={`course-lesson is-${state} ${isCurrent ? 'is-current' : ''}`} href={getStepPath(step, product)} key={step.id} aria-current={isCurrent ? 'page' : undefined}><span className="course-lesson__status">{state === 'completed' ? <Check size={16} /> : state === 'inProgress' ? <Play size={14} /> : <Circle size={14} />}</span><span className="course-lesson__copy"><small>{t.step} {step.stepNumber}</small><strong>{step.title}</strong><span>{t[state]}</span></span><span className="course-lesson__action">{state === 'completed' ? t.completed : state === 'inProgress' ? t.resumeLesson : t.startLesson}<ArrowRight size={15} /></span></a>
    })}</div></section>)}</div>
  </div>
}
