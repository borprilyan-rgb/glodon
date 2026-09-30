import { useState } from 'react'
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

function CourseCard({ product, data, description, t, scores, language, studentName }) {
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
    <CourseScores studentName={studentName} product={product} scores={scores.filter(({ exercise }) => exercise.product === product)} language={language} />
  </div>
}

const STUDENT_NAME_KEY = 'cubicost:student-name'

export default function CourseHub({ tas, trb, tme, t, scores = [], language }) {
  const [studentName, setStudentName] = useState(() => {
    try { return (localStorage.getItem(STUDENT_NAME_KEY) || '').slice(0, 100) } catch { return '' }
  })
  const [nameSaveFailed, setNameSaveFailed] = useState(false)
  const en = language === 'en'
  function updateStudentName(event) {
    const name = event.target.value
    setStudentName(name)
    try {
      localStorage.setItem(STUDENT_NAME_KEY, name)
      setNameSaveFailed(false)
    } catch { setNameSaveFailed(true) }
  }
  return <div className="course-hub"><header className="course-hub__intro"><span className="eyebrow">{t.chooseCourse}</span><h1>{t.hubTitle}</h1><p>{t.hubDescription}</p></header>
    <div className="student-details">
      <label htmlFor="student-name">{en ? 'Name' : 'Nama'}</label>
      <input id="student-name" name="studentName" autoComplete="name" maxLength={100} value={studentName} onChange={updateStudentName} placeholder={en ? 'Enter your full name' : 'Masukkan nama lengkap Anda'} aria-describedby={nameSaveFailed ? 'student-name-help' : undefined} />
      {nameSaveFailed && <small id="student-name-help" role="status">{en ? 'Your name is shown, but could not be saved in this browser.' : 'Nama ditampilkan, tetapi tidak dapat disimpan di browser ini.'}</small>}
    </div>
    <section className="hub-course-grid" aria-label={t.allCourses}>
    <CourseCard studentName={studentName.trim()} product="tas" data={tas} scores={scores} language={language} description={t.tasCardDescription} t={t} />
    <CourseCard studentName={studentName.trim()} product="trb" data={trb} scores={scores} language={language} description={t.trbCardDescription} t={t} />
    <CourseCard studentName={studentName.trim()} product="tme" data={tme} scores={scores} language={language} description={t.tmeCardDescription} t={t} />
  </section><a className="hub-contact-link" href="/contact">{t.stillNeedHelp} <strong>{t.contactUs}</strong></a></div>
}
