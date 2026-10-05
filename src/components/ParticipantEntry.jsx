import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { participantFields, participantLabels } from '../data/participant'
import '../styles/exercise.css'

export default function ParticipantEntry({ profile, language, onContinue, product }) {
  const [draft, setDraft] = useState(profile)
  const en = language === 'en'
  return <section className="participant-entry section-exercise">
    <header className="exercise-header"><span className="eyebrow">{product.toUpperCase()} · {en ? 'Exercise' : 'Latihan'}</span><h1>{en ? 'Enter your details' : 'Isi data diri Anda'}</h1><p>{en ? 'Complete these details before accessing the exercise.' : 'Lengkapi data berikut sebelum mengakses latihan.'}</p></header>
    <form className="exercise-card" onSubmit={event => {
      event.preventDefault()
      onContinue(Object.fromEntries(participantFields.map(field => [field, draft[field].trim()])))
    }}>
      {participantFields.map(field => <label className="exercise-field" key={field} htmlFor={`participant-${field}`}>{participantLabels[language][field]}
        <input id={`participant-${field}`} name={field} type="text" required pattern=".*\S.*" maxLength={100} autoComplete={field === 'name' ? 'name' : field === 'jobTitle' ? 'organization-title' : 'off'} value={draft[field]} onChange={event => setDraft(current => ({ ...current, [field]: event.target.value }))} />
      </label>)}
      <button className="primary-button" type="submit">{en ? 'Continue To Exercise' : 'Lanjut Ke Latihan'}</button>
    </form>
    <div className="exercise-bottom"><a className="outline-nav-button" href={`/${product}/course`}><ArrowLeft size={16} aria-hidden="true" />{en ? 'Back To Course' : 'Kembali Ke Materi'}</a></div>
  </section>
}
