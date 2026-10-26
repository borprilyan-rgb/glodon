import { ArrowRight, BookOpen, CheckCircle2, Clock3, Play, ClipboardCheck } from 'lucide-react'
import { getStepPath } from '../data/tutorialUtils'
import ProgressBar from './ProgressBar'

function ProductMark({ product }) {
  const label = product === 'tme' ? 'TME-C' : product.toUpperCase()
  return <span className="product-mark"><img src={'/branding/cubicost-' + product + '-logo.png'} alt={'Cubicost ' + label} onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.nextElementSibling.hidden = false }} /><span className="product-mark__fallback" hidden>{label}</span></span>
}

function CourseCard({ product, data, description, t, language, index }) {
  const label = product === 'tme' ? 'TME-C' : product.toUpperCase()
  const complete = data.allSteps.length > 0 && data.allSteps.every((step) => data.progress.completed.has(step.id))
  const started = data.progress.started.size > 0 || data.progress.completed.size > 0
  const status = complete ? t.completed : started ? t.inProgress : t.notStarted
  const primary = complete ? t.reviewCourse : started ? t.continueCourse : t.startCourse
  const disciplines = language === 'en' ? { tas: 'Architecture & structure', trb: 'Reinforcement detailing', tme: 'Mechanical, electrical & plumbing' } : { tas: 'Arsitektur & struktur', trb: 'Detail penulangan', tme: 'Mekanikal, elektrikal & perpipaan' }
  const StatusIcon = complete ? CheckCircle2 : Clock3
  return <article className={'hub-course-card hub-course-card--' + product}>
    <div className="hub-course-card__top"><ProductMark product={product} /><span className={'status-badge' + (complete ? ' status-badge--complete' : '')}><StatusIcon size={13} />{status}</span></div>
    <div className="hub-course-card__discipline"><span>0{index}</span>{disciplines[product]}</div>
    <h2>Cubicost {label}</h2><p>{description}</p>
    <div className="hub-course-card__lesson-count"><BookOpen size={15} />{data.allSteps.length} {language === 'en' ? 'lessons' : 'pelajaran'}<span>·</span>{language === 'en' ? 'Self-paced' : 'Belajar mandiri'}</div>
    <div className="hub-course-card__progress"><ProgressBar completed={data.progress.completed.size} total={data.allSteps.length} t={t} /></div>
    <div className="hub-course-card__actions"><a className="primary-button" href={'/' + product}>{language === 'en' ? 'Course overview' : 'Ringkasan kursus'}<ArrowRight size={17} aria-hidden="true" /></a><a className="outline-nav-button" href={getStepPath(data.continueStep, product)}>{primary}<ArrowRight size={15} aria-hidden="true" /></a></div>
  </article>
}

export default function CourseHub({ tas, trb, tme, t, language }) {
  const en = language === 'en'
  return <div className="course-hub course-hub--learning">
    <h1 className="sr-only">{t.hubTitle}</h1>
    <section id="learning-courses" tabIndex={-1} className="hub-course-grid" aria-label={t.allCourses}><CourseCard product="tas" data={tas} language={language} description={t.tasCardDescription} t={t} index={1} /><CourseCard product="trb" data={trb} language={language} description={t.trbCardDescription} t={t} index={2} /><CourseCard product="tme" data={tme} language={language} description={t.tmeCardDescription} t={t} index={3} /></section>
    <section className="hub-tools" aria-label={en ? 'Learning tools' : 'Alat pembelajaran'}><a href="/exercises"><span className="hub-tool-icon"><ClipboardCheck size={23} /></span><div><strong>{en ? 'Start exercise' : 'Mulai latihan'}</strong></div><ArrowRight size={20} /></a><a href="/present"><span className="hub-tool-icon"><Play size={23} /></span><div><strong>{en ? 'Start presenting' : 'Mulai presentasi'}</strong></div><ArrowRight size={20} /></a></section>
  </div>
}
