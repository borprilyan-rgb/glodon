import { ArrowRight, Check, Circle, Play } from 'lucide-react'
import { getStepPath } from '../data/tutorialUtils'
import ProgressBar from './ProgressBar'

export default function TrbCourseMap({ course, completed, started, lastLesson, continueStep, t }) {
  const percentage = Math.round((completed.size / course.allSteps.length) * 100)
  return <div className="course-map-page"><section className="course-map-hero"><div><span className="eyebrow">TRB · {t.courseOverview}</span><h1>{course.title}</h1><p>{course.intro}</p><div className="landing-actions"><a className="primary-button" href={getStepPath(continueStep, 'trb')}><Play size={17} />{completed.size ? t.continueLearning : t.startCourse}</a><a className="secondary-button" href="/trb/reference">{t.reference}</a></div></div><aside><span>{t.overallProgress}</span><strong>{percentage}%</strong><ProgressBar completed={completed.size} total={course.allSteps.length} t={t} /><small>{t.stepsProgress(completed.size, course.allSteps.length)}</small></aside></section><div className="course-map-parts">{course.tutorialParts.map((part) => <section className="course-part" key={part.id}><header><span>{part.number}</span><div><small>{t.part} {part.number}</small><h2>{part.title}</h2><p>{part.summary}</p></div></header><div className="course-lessons">{part.steps.map((step) => {
    const state = completed.has(step.id) ? 'completed' : started.has(step.id) ? 'inProgress' : 'notStarted'
    return <a className={`course-lesson is-${state} ${step.id === lastLesson ? 'is-current' : ''}`} href={getStepPath(step, 'trb')} key={step.id}><span className="course-lesson__status">{state === 'completed' ? <Check size={16} /> : state === 'inProgress' ? <Play size={14} /> : <Circle size={14} />}</span><span className="course-lesson__copy"><small>{t.step} {step.stepNumber} · {t.manualPages} {step.manualPages}</small><strong>{step.title}</strong><span>{t[state]}</span></span><span className="course-lesson__action">{state === 'completed' ? t.completed : state === 'inProgress' ? t.resumeLesson : t.startLesson}<ArrowRight size={15} /></span></a>
  })}</div></section>)}</div></div>
}
