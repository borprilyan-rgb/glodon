import { ArrowLeft } from 'lucide-react'
import CourseScores from './CourseScores'

export default function ExerciseScoresPage({ language, profile, scores, courseProgress }) {
  const en = language === 'en'
  const title = en ? 'Exercise score overview' : 'Ringkasan nilai latihan'
  return <div className="course-hub exercise-hub exercise-score-page">
    <header className="course-hub__intro"><h1>{title}</h1></header>
    <section className="exercise-hub__scores" aria-label={title}>
      <div className="hub-course-grid">{['tas', 'trb', 'tme'].map(product => <div key={product}>
        <CourseScores product={product} language={language} profile={profile} scores={scores.filter(score => score.exercise.product === product)} courseProgress={courseProgress[product]} />
      </div>)}</div>
    </section>
    <a className="outline-nav-button" href="/exercises"><ArrowLeft size={16} aria-hidden="true" />{en ? 'Back To Exercises' : 'Kembali Ke Latihan'}</a>
  </div>
}
