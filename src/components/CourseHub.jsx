import { ArrowRight, BookOpen, Clock3 } from 'lucide-react'
import { getStepPath } from '../data/tutorialUtils'
import ProgressBar from './ProgressBar'

export default function CourseHub({ tas, t }) {
  const tasComplete = tas.allSteps.length > 0 && tas.allSteps.every((step) => tas.progress.completed.has(step.id))
  const tasStarted = tas.progress.started.size > 0 || tas.progress.completed.size > 0
  const tasStatus = tasComplete ? t.completed : tasStarted ? t.inProgress : t.notStarted
  const tasPrimary = tasComplete ? t.reviewCourse : tasStarted ? t.continueCourse : t.startCourse
  return <div className="course-hub"><header className="course-hub__intro"><span className="eyebrow">{t.chooseCourse}</span><h1>{t.hubTitle}</h1><p>{t.hubDescription}</p></header><section className="hub-course-grid" aria-label={t.allCourses}>
    <article className="hub-course-card"><div className="hub-course-card__top"><span className="product-mark">TAS</span><span className="status-badge">{tasStatus}</span></div><h2>Cubicost TAS</h2><p>{t.tasCardDescription}</p><div className="hub-course-card__progress"><ProgressBar completed={tas.progress.completed.size} total={tas.allSteps.length} t={t} /></div><div className="hub-course-card__actions"><a className="primary-button" href={getStepPath(tas.continueStep, 'tas')}>{tasPrimary}<ArrowRight size={16} /></a><a className="text-link" href="/tas">{t.viewCourse}</a></div></article>
    <article className="hub-course-card"><div className="hub-course-card__top"><span className="product-mark">TRB</span><span className="status-badge status-badge--preparation"><Clock3 size={13} />{t.contentInPreparation}</span></div><h2>Cubicost TRB</h2><p>{t.trbCardDescription}</p><div className="hub-course-card__pending"><BookOpen size={17} /><span>{t.availableSoon}</span></div><div className="hub-course-card__actions"><a className="primary-button" href="/trb">{t.openCourse}<ArrowRight size={16} /></a><a className="text-link" href="/trb/course">{t.viewCourse}</a></div></article>
  </section></div>
}
