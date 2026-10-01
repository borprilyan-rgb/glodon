import { ArrowRight, Clock3 } from 'lucide-react'
import { getStepPath } from '../data/tutorialUtils'
import ProgressBar from './ProgressBar'

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

function CourseCard({ product, data, description, t }) {
  const productLabel = product === 'tme' ? 'TME-C' : product.toUpperCase()
  const complete = data.allSteps.length > 0 && data.allSteps.every((step) => data.progress.completed.has(step.id))
  const started = data.progress.started.size > 0 || data.progress.completed.size > 0
  const status = complete ? t.completed : started ? t.inProgress : t.notStarted
  const primary = complete ? t.reviewCourse : started ? t.continueCourse : t.startCourse
  return <>
    <article className="hub-course-card">
    <div className="hub-course-card__top"><ProductMark product={product} /><span className="status-badge"><Clock3 size={13} />{status}</span></div>
    <h2>Cubicost {productLabel}</h2><p>{description}</p>
    <div className="hub-course-card__progress"><ProgressBar completed={data.progress.completed.size} total={data.allSteps.length} t={t} /></div>
    <div className="hub-course-card__actions"><a className="primary-button" href={getStepPath(data.continueStep, product)}>{primary}<ArrowRight size={16} /></a><a className="outline-nav-button" href={`/${product}`}>{t.viewCourse}<ArrowRight size={16} aria-hidden="true" /></a></div>
    </article>
  </>
}

export default function CourseHub({ tas, trb, tme, t, language }) {
  return <div className="course-hub"><header className="course-hub__intro"><span className="eyebrow">{language === 'en' ? 'Learning & Assessment' : 'Pembelajaran & Evaluasi'}</span><h1>{t.hubTitle}</h1><p>{language === 'en' ? 'Learn Cubicost, revisit the guides, and test your understanding.' : 'Pelajari Cubicost, tinjau kembali panduan, dan uji pemahaman Anda.'}</p></header>
    <section className="hub-course-grid" aria-label={t.allCourses}>
    <CourseCard product="tas" data={tas} language={language} description={t.tasCardDescription} t={t} />
    <CourseCard product="trb" data={trb} language={language} description={t.trbCardDescription} t={t} />
    <CourseCard product="tme" data={tme} language={language} description={t.tmeCardDescription} t={t} />
  </section></div>
}
