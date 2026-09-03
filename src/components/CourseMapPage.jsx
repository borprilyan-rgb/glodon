import { ArrowRight, Check, Circle, Play } from 'lucide-react'
import { getStepHash } from '../data/tutorialUtils'
import ProgressBar from './ProgressBar'

export default function CourseMapPage({ parts, allSteps, completed, started, lastLesson, continueStep, onReset, query, setQuery, t }) {
  const percentage = Math.round((completed.size / allSteps.length) * 100)
  const getState = (step) => completed.has(step.id) ? 'completed' : started.has(step.id) ? 'inProgress' : 'notStarted'
  return <div className="course-map-page">
    <section className="course-map-hero"><div><span className="eyebrow">{t.courseOverview}</span><h1>{t.heroProduct} <em>{t.heroTitle}</em></h1><p>{t.heroIntro}</p><a className="primary-button" href={getStepHash(continueStep)}><Play size={17} />{t.continueLearning}</a></div><aside><span>{t.overallProgress}</span><strong>{percentage}%</strong><ProgressBar completed={completed.size} total={allSteps.length} t={t} /><small>{t.stepsProgress(completed.size, allSteps.length)}</small></aside></section>
    <div className="course-map-toolbar"><label><span className="sr-only">{t.searchAria}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label><button type="button" onClick={onReset}>{t.reset}</button></div>
    <div className="course-map-parts">{parts.map((part) => <section className="course-part" key={part.id}><header><span>{part.number}</span><div><small>{t.part} {part.number}</small><h2>{part.title}</h2><p>{part.summary}</p></div></header><div className="course-lessons">{part.steps.map((rawStep) => {
      const step = allSteps.find((item) => item.id === rawStep.id)
      if (!step) return null
      const state = getState(step)
      const isCurrent = step.id === lastLesson
      return <a className={`course-lesson is-${state} ${isCurrent ? 'is-current' : ''}`} href={getStepHash(step)} key={step.id} aria-current={isCurrent ? 'page' : undefined}><span className="course-lesson__status">{state === 'completed' ? <Check size={16} /> : state === 'inProgress' ? <Play size={14} /> : <Circle size={14} />}</span><span className="course-lesson__copy"><small>{t.step} {step.stepNumber}</small><strong>{step.title}</strong><span>{t[state]}</span></span><span className="course-lesson__action">{state === 'completed' ? t.completed : state === 'inProgress' ? t.resumeLesson : t.startLesson}<ArrowRight size={15} /></span></a>
    })}</div></section>)}</div>
  </div>
}
