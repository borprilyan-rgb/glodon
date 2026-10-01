import { useState } from 'react'
import { ArrowLeft, LayoutGrid } from 'lucide-react'
import CourseScores from './CourseScores'
import ParticipantDetails from './ParticipantDetails'
import { getSectionExercise } from '../data/sectionExercises'
import { scoreStatus, saveTestScore } from '../data/testScores'
import '../styles/exercise.css'

export default function TestPage({ product, parts, scores, profile, language, onEditParticipant }) {
  const en = language === 'en'
  const courseName = `Cubicost ${product === 'tme' ? 'TME-C' : product.toUpperCase()}`
  const [retryFailed, setRetryFailed] = useState(false)
  function retry(exercise, state) {
    try {
      saveTestScore(exercise, state.answers)
      localStorage.setItem(exercise.storageKey, JSON.stringify({ started: true, submitted: false, index: 0, answers: {} }))
      window.location.assign(exercise.path)
    } catch { setRetryFailed(true) }
  }
  const sections = [1, 2, 3].map(section => getSectionExercise(product, section)).filter(Boolean)
  return <article className="section-exercise test-page">
    <header className="exercise-header"><span className="eyebrow">Cubicost {product === 'tme' ? 'TME-C' : product.toUpperCase()}</span><h1>{en ? `${courseName} Knowledge Test` : `Tes Pemahaman ${courseName}`}</h1><p>{en ? 'Take a section test, review your results, and download your score card.' : 'Kerjakan tes per bagian, tinjau hasil, dan unduh kartu nilai Anda.'}</p></header>
    {sections.length ? <>
      <section className="exercise-card test-profile"><ParticipantDetails profile={profile} language={language} /><button className="text-link" type="button" onClick={onEditParticipant}>{en ? 'Edit details' : 'Ubah data diri'}</button></section>
      {retryFailed && <p role="alert">{en ? 'Unable to start a new attempt. Open the result and try again there.' : 'Tidak dapat memulai percobaan baru. Buka hasil dan coba lagi dari sana.'}</p>}
      <div className="test-page__layout"><section className="test-list" aria-label={en ? 'Section tests' : 'Tes per bagian'}>{sections.map(exercise => {
        const state = exercise.load()
        const result = scores.find(score => score.exercise.path === exercise.path)?.result
        const inProgress = state.started && !state.submitted
        return <article className="exercise-card" key={exercise.path}>
          <span className="eyebrow">{en ? 'Section' : 'Bagian'} {exercise.section}</span><h2>{parts[exercise.section - 1].title}</h2>
          <p>{exercise.copy[language].duration}</p><p>{inProgress ? (en ? 'In progress' : 'Sedang dikerjakan') : scoreStatus(result, language)}</p>
          <div className="test-actions"><a className="primary-button" href={exercise.path}>{inProgress ? (en ? 'Continue test' : 'Lanjutkan tes') : state.submitted ? (en ? 'View result' : 'Lihat hasil') : (en ? 'Start test' : 'Mulai tes')}</a>
          {state.submitted && <button className="secondary-button" type="button" onClick={() => retry(exercise, state)}>{en ? 'Retry test' : 'Coba lagi'}</button>}</div>
        </article>
      })}</section><CourseScores product={product} scores={scores} profile={profile} language={language} /></div>
    </> : <section className="exercise-card"><p>{en ? 'Tests are not available for this course yet.' : 'Tes untuk kursus ini belum tersedia.'}</p></section>}
    <div className="exercise-bottom"><a className="outline-nav-button" href={`/${product}/course`}><ArrowLeft size={16} aria-hidden="true" />{en ? 'Back to learning module' : 'Kembali ke modul belajar'}</a><a className="outline-nav-button" href="/exercises"><LayoutGrid size={16} aria-hidden="true" />{en ? 'All tests' : 'Semua tes'}</a></div>
  </article>
}
