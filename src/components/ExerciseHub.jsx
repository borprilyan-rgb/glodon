import { ArrowLeft } from 'lucide-react'
import ParticipantCard from './ParticipantCard'
import ExerciseSectionList from './ExerciseSectionList'
import ParticipantEntry from './ParticipantEntry'
import { hasParticipant } from '../data/participant'

export default function ExerciseHub({ language, profile, scores, editingParticipant, participantEditUntil, onEditParticipant, onSaveParticipant }) {
  const en = language === 'en'
  const products = ['tas', 'trb', 'tme']
  const label = product => product === 'tme' ? 'TME-C' : product.toUpperCase()
  return <div className="course-hub exercise-hub">
    <header className="course-hub__intro"><span className="eyebrow">{en ? 'Assessment' : 'Evaluasi'}</span><h1>{en ? 'Cubicost Exercises' : 'Latihan Cubicost'}</h1></header>
    {hasParticipant(profile) && !editingParticipant ? <ParticipantCard profile={profile} language={language} editUntil={participantEditUntil} onEdit={onEditParticipant} /> : <ParticipantEntry profile={profile} language={language} onContinue={onSaveParticipant} />}
    <section className="hub-course-grid" aria-label={en ? 'Choose an exercise' : 'Pilih latihan'}>{products.map(product => {
      const completed = scores.filter(score => score.exercise.product === product).length
      return <article className={`hub-course-card exercise-hub__card hub-course-card--${product}`} key={product}>
        <span className="product-mark"><img src={`/branding/cubicost-${product}-logo.png`} alt={`Cubicost ${label(product)}`} /></span>
        <h2>Cubicost {label(product)}</h2>
        <p>{en ? `${completed} of 3 section exercises completed` : `${completed} dari 3 latihan bagian selesai`}</p>
        <ExerciseSectionList product={product} language={language} scores={scores} />
      </article>
    })}</section>
    <a className="outline-nav-button" href="/"><ArrowLeft size={16} aria-hidden="true" />{en ? 'Back To Learning' : 'Kembali Ke Pembelajaran'}</a>
  </div>
}
