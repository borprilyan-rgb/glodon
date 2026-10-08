import { useState } from 'react'
import { ArrowLeft, LayoutGrid } from 'lucide-react'
import CourseScores from './CourseScores'
import ParticipantCard from './ParticipantCard'
import { getSectionExercise } from '../data/sectionExercises'
import { scoreStatus, saveTestScore } from '../data/testScores'
import '../styles/exercise.css'
import { submissionStore } from '../firebase/submissionStore'

export default function TestPage({ product, parts, scores, profile, participantEditUntil, language, onEditParticipant }) {
  const en = language === 'en'
  const courseName = `Cubicost ${product === 'tme' ? 'TME-C' : product.toUpperCase()}`
  const [retryFailed, setRetryFailed] = useState(false)
  function retry(exercise, state) {
    try {
      saveTestScore(exercise, state.answers)
      localStorage.setItem(exercise.storageKey, JSON.stringify({ started: true, submitted: false, index: 0, answers: {} }))
      submissionStore.startNew(exercise)
      window.location.assign(exercise.path)
    } catch { setRetryFailed(true) }
  }
  const sections = [1, 2, 3].map(section => getSectionExercise(product, section)).filter(Boolean)
  return <article className="section-exercise test-page">
    <header className="exercise-header"><span className="eyebrow">Cubicost {product === 'tme' ? 'TME-C' : product.toUpperCase()}</span><h1>{en ? `${courseName} Knowledge Exercise` : `Latihan Pemahaman ${courseName}`}</h1><p>{en ? 'Do a section exercise, review your results, and download your score card.' : 'Kerjakan latihan per bagian, tinjau hasil, dan unduh kartu nilai Anda.'}</p></header>
    {sections.length ? <>
      <ParticipantCard profile={profile} language={language} editUntil={participantEditUntil} onEdit={onEditParticipant} />
      {retryFailed && <p role="alert">{en ? 'Unable to start a new attempt. Open the result and try again there.' : 'Tidak dapat memulai percobaan baru. Buka hasil dan coba lagi dari sana.'}</p>}
      <div className="test-page__layout"><section className="test-list" aria-label={en ? 'Section exercises' : 'Latihan per bagian'}>{sections.map(exercise => {
        const state = exercise.load()
        const result = scores.find(score => score.exercise.path === exercise.path)?.result
        const inProgress = state.started && !state.submitted
        return <article className="exercise-card" key={exercise.path}>
          <span className="eyebrow">{en ? 'Section' : 'Bagian'} {exercise.section}</span><h2>{product === 'tme' ? exercise.copy[language].title : parts[exercise.section - 1].title}</h2>
          <p>{exercise.copy[language].duration}</p><p>{inProgress ? (en ? 'In progress' : 'Sedang dikerjakan') : scoreStatus(result, language)}</p>
          <div className="test-actions"><a className="primary-button" href={exercise.path}>{inProgress ? (en ? 'Continue Exercise' : 'Lanjutkan Latihan') : state.submitted ? (en ? 'View Result' : 'Lihat Hasil') : (en ? 'Start Exercise' : 'Mulai Latihan')}</a>
          {state.submitted && <button className="secondary-button" type="button" onClick={() => retry(exercise, state)}>{en ? 'Retry Exercise' : 'Coba Lagi'}</button>}</div>
        </article>
      })}</section><CourseScores product={product} scores={scores} profile={profile} language={language} /></div>
    </> : <section className="exercise-card"><p>{en ? 'Exercises are not available for this course yet.' : 'Latihan untuk kursus ini belum tersedia.'}</p></section>}
    <div className="exercise-bottom"><a className="outline-nav-button" href={`/${product}/course`}><ArrowLeft size={16} aria-hidden="true" />{en ? 'Back To Learning Module' : 'Kembali Ke Modul Belajar'}</a><a className="outline-nav-button" href="/exercises"><LayoutGrid size={16} aria-hidden="true" />{en ? 'All Exercises' : 'Semua Latihan'}</a></div>
  </article>
}
