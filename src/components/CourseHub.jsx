import { ArrowRight, Clock3 } from 'lucide-react'
import { getStepPath } from '../data/tutorialUtils'
import ProgressBar from './ProgressBar'
import CourseScores from './CourseScores'

function ProductMark({ product }) {
  const productLabel = product === 'tme' ? 'TME-C' : product.toUpperCase()
  const name = `Cubicost ${productLabel}`
  return <span className="product-mark">
    <img src={`/branding/cubicost-${product}-logo.png`} alt={name} onError={(event) => {
      event.currentTarget.hidden = true
      event.currentTarget.nextElementSibling.hidden = false
    }} />
    <span className="product-mark__fallback" hidden>{productLabel}</span>
  </span>
}

function CourseCard({ product, data, description, t, scores, language, profile }) {
  const productLabel = product === 'tme' ? 'TME-C' : product.toUpperCase()
  const complete = data.allSteps.length > 0 && data.allSteps.every((step) => data.progress.completed.has(step.id))
  const started = data.progress.started.size > 0 || data.progress.completed.size > 0
  const status = complete ? t.completed : started ? t.inProgress : t.notStarted
  const primary = complete ? t.reviewCourse : started ? t.continueCourse : t.startCourse
  return <div className="hub-course-group">
    <article className="hub-course-card">
    <div className="hub-course-card__top"><ProductMark product={product} /><span className="status-badge"><Clock3 size={13} />{status}</span></div>
    <h2>Cubicost {productLabel}</h2><p>{description}</p>
    <div className="hub-course-card__progress"><ProgressBar completed={data.progress.completed.size} total={data.allSteps.length} t={t} /></div>
    <div className="hub-course-card__actions"><a className="primary-button" href={getStepPath(data.continueStep, product)}>{primary}<ArrowRight size={16} /></a><a className="text-link" href={`/${product}`}>{t.viewCourse}</a></div>
    </article>
    <CourseScores profile={profile} product={product} scores={scores.filter(({ exercise }) => exercise.product === product)} language={language} />
  </div>
}

export default function CourseHub({ tas, trb, tme, t, scores = [], language, profile }) {
  return <div className="course-hub"><header className="course-hub__intro"><span className="eyebrow">{t.chooseCourse}</span><h1>{t.hubTitle}</h1><p>{t.hubDescription}</p></header>
    <section className="hub-course-grid" aria-label={t.allCourses}>
    <CourseCard profile={profile} product="tas" data={tas} scores={scores} language={language} description={t.tasCardDescription} t={t} />
    <CourseCard profile={profile} product="trb" data={trb} scores={scores} language={language} description={t.trbCardDescription} t={t} />
    <CourseCard profile={profile} product="tme" data={tme} scores={scores} language={language} description={t.tmeCardDescription} t={t} />
  </section><a className="hub-contact-link" href="/contact">{t.stillNeedHelp} <strong>{t.contactUs}</strong></a></div>
}
