import { ArrowRight, BookOpen, CheckCircle2, Clock3, Layers3, Play, ClipboardCheck } from 'lucide-react'
import { getStepPath } from '../data/tutorialUtils'
import ProgressBar from './ProgressBar'

function BuildingIllustration() {
  return <svg className="hub-building" viewBox="0 0 460 330" fill="none" aria-hidden="true">
    <defs><pattern id="hub-grid" width="32" height="18" patternUnits="userSpaceOnUse" patternTransform="skewY(-30)"><path d="M32 0H0V18" stroke="currentColor" strokeOpacity=".12" /></pattern></defs>
    <path fill="url(#hub-grid)" d="M0 0h460v330H0z" />
    <g stroke="#7392bd" strokeWidth="1.3" strokeLinejoin="round">
      <path d="m64 237 168-97 167 97-168 97z" fill="#1c3459" />
      <path d="m110 213 122-70 120 70-121 70z" fill="#4c709d" />
      <path d="M110 213V103l122-70v110z" fill="#35577e" />
      <path d="M232 33 352 103v110l-120-70z" fill="#162f50" />
      <path d="m110 103 122-70 120 70-121 70z" fill="#acc4e7" />
      <path d="m137 102 95-54 92 54-94 55z" fill="#5d83b2" />
      <path d="M110 139 232 69l120 70M110 175l122-70 120 70M140 85v110M171 68v110M201 51v110M262 51v110M292 68v110M322 85v110" />
      <path d="M231 173v110M110 213l121 70 121-70M110 175l121 70 121-70M110 139l121 70 121-70" />
      <path d="M140 121v110M171 139v110M201 156v110M262 156v110M292 139v110M322 121v110" stroke="#c4d8f3" />
      <path d="m80 246 150 87M382 238l-150 87" stroke="#91c8ee" strokeDasharray="4 6" />
      <path d="m64 237 0-35M399 237v-35M232 33V9" strokeDasharray="3 5" />
    </g><g fill="#8dccf7"><circle cx="232" cy="33" r="4"/><circle cx="110" cy="213" r="4"/><circle cx="352" cy="213" r="4"/></g>
  </svg>
}

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
    <div className="hub-course-card__actions"><a className="primary-button" href={getStepPath(data.continueStep, product)}>{primary}<ArrowRight size={17} /></a><a className="outline-nav-button" href={'/' + product}>{language === 'en' ? 'Course overview' : 'Ringkasan kursus'}<ArrowRight size={15} aria-hidden="true" /></a></div>
  </article>
}

export default function CourseHub({ tas, trb, tme, t, language }) {
  const en = language === 'en'
  const courses = [tas, trb, tme]
  const total = courses.reduce((sum, data) => sum + data.allSteps.length, 0)
  const completed = courses.reduce((sum, data) => sum + data.allSteps.filter(step => data.progress.completed.has(step.id)).length, 0)
  return <div className="course-hub course-hub--learning">
    <header className="course-hub__intro"><div className="course-hub__hero-copy"><span className="eyebrow"><span className="hub-live-dot" />{en ? 'YOUR CUBICOST LEARNING SPACE' : 'RUANG BELAJAR CUBICOST ANDA'}</span><h1>{t.hubTitle}</h1><p>{en ? 'Build your skills. Bring every detail into focus.' : 'Bangun keahlian Anda. Kuasai setiap detail.'}</p><button className="hub-hero-cta" type="button" onClick={() => { const courses = document.getElementById('learning-courses'); courses?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); courses?.focus({ preventScroll: true }) }}>{en ? 'Explore courses' : 'Jelajahi kursus'}<ArrowRight size={17} aria-hidden="true" /></button><div className="hub-hero-tags"><span><Layers3 size={15} />TAS · TRB · TME-C</span><span><BookOpen size={15} />{en ? 'Learn at your own pace' : 'Belajar sesuai ritme Anda'}</span></div></div><div className="hub-hero-art"><BuildingIllustration /><span className="hub-art-caption">{en ? 'FROM DRAWING TO DETAIL' : 'DARI GAMBAR KE DETAIL'}<span>01 / CUBICOST</span></span></div></header>
    <div className="hub-section-heading"><div><span className="eyebrow">{en ? 'THE LEARNING COLLECTION' : 'KOLEKSI PEMBELAJARAN'}</span><h2>{en ? 'Choose your next chapter' : 'Pilih langkah belajar Anda'}</h2></div><div className="hub-overall-progress"><span className="hub-overall-progress__icon"><BookOpen size={19} /></span><div><strong>{completed}<span> / {total}</span></strong><small>{en ? 'lessons completed' : 'pelajaran selesai'}</small></div></div></div>
    <section id="learning-courses" tabIndex={-1} className="hub-course-grid" aria-label={t.allCourses}><CourseCard product="tas" data={tas} language={language} description={t.tasCardDescription} t={t} index={1} /><CourseCard product="trb" data={trb} language={language} description={t.trbCardDescription} t={t} index={2} /><CourseCard product="tme" data={tme} language={language} description={t.tmeCardDescription} t={t} index={3} /></section>
    <section className="hub-tools" aria-label={en ? 'Learning tools' : 'Alat pembelajaran'}><a href="/exercises"><span className="hub-tool-icon"><ClipboardCheck size={23} /></span><div><strong>{en ? 'Put your knowledge to work' : 'Uji pemahaman Anda'}</strong><p>{en ? 'Practise the workflows with section assessments.' : 'Latih pemahaman melalui evaluasi setiap bagian.'}</p></div><ArrowRight size={20} /></a><a href="/present"><span className="hub-tool-icon"><Play size={23} /></span><div><strong>{en ? 'Walk through it together' : 'Belajar bersama, langkah demi langkah'}</strong><p>{en ? 'Open presentation mode for a guided session.' : 'Buka mode presentasi untuk sesi pembelajaran.'}</p></div><ArrowRight size={20} /></a></section>
  </div>
}
