import { useState } from 'react'
import { getSectionExercise } from '../data/sectionExercises'
import { saveTestScore } from '../data/testScores'

export default function ExerciseSectionList({ product, language, scores = [] }) {
  const en = language === 'en'
  const [retryFailed, setRetryFailed] = useState(false)
  const sections = [1, 2, 3].map(section => getSectionExercise(product, section)).filter(Boolean)
  function retry(exercise, state) {
    try {
      saveTestScore(exercise, state.answers)
      localStorage.setItem(exercise.storageKey, JSON.stringify({ started: true, submitted: false, index: 0, answers: {} }))
      window.location.assign(exercise.path)
    } catch { setRetryFailed(true) }
  }
  return <section className="exercise-sections" aria-label={`${product === 'tme' ? 'TME-C' : product.toUpperCase()} · ${en ? 'Section exercises' : 'Latihan per bagian'}`}>
    {retryFailed && <p role="alert">{en ? 'Unable to start a new attempt. Open the result and try again there.' : 'Tidak dapat memulai percobaan baru. Buka hasil dan coba lagi dari sana.'}</p>}
    {sections.map(exercise => {
      const state = exercise.load()
      const result = scores.find(score => score.exercise.path === exercise.path)?.result
      const inProgress = state.started && !state.submitted
      return <article className="exercise-sections__item" key={exercise.path}>
        <span className="eyebrow">{en ? 'Section' : 'Bagian'} {exercise.section}</span>
        <h3>{product === 'tme' ? exercise.copy[language].title : exercise.copy[language].sectionTitle}</h3>
        {inProgress && <p>{en ? 'In progress' : 'Sedang dikerjakan'}</p>}
        <div className="test-actions"><div className="exercise-sections__buttons">
          <a className="primary-button" href={exercise.path}>{inProgress ? (en ? 'Continue Exercise' : 'Lanjutkan Latihan') : state.submitted ? (en ? 'View Result' : 'Lihat Hasil') : (en ? 'Start Exercise' : 'Mulai Latihan')}</a>
          {state.submitted && <button className="secondary-button" type="button" onClick={() => retry(exercise, state)}>{en ? 'Retry Exercise' : 'Coba Lagi'}</button>}
        </div>{result && <strong className="exercise-sections__score" aria-label={`${en ? 'Score' : 'Nilai'}: ${result.total}/100`}>{result.total}/100</strong>}</div>
      </article>
    })}
  </section>
}
