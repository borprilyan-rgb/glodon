import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { hasParticipant, participantFields, participantLabels } from '../data/participant'
import '../styles/exercise.css'

export default function ParticipantEntry({ profile, language, onContinue, product }) {
  const [draft, setDraft] = useState(profile)
  const en = language === 'en'
  const Heading = product ? 'h1' : 'h2'
  return <section className="participant-entry section-exercise">
    <header className="exercise-header"><Heading>{product ? (en ? 'Enter your details' : 'Isi data diri Anda') : (en ? 'Personal Details' : 'Data Diri')}</Heading></header>
    <form className="exercise-card" onSubmit={event => {
      event.preventDefault()
      const profile = Object.fromEntries(participantFields.map(field => [field, draft[field].trim()]))
      if (hasParticipant(profile)) onContinue(profile)
    }}>

      {participantFields.map(field => <label className="exercise-field" key={field} htmlFor={`participant-${field}`}>{participantLabels[language][field]}
        <input id={`participant-${field}`} name={field} type="text" inputMode={field === 'employeeId' ? 'numeric' : undefined} required pattern={field === 'employeeId' ? '[0-9]{6}' : '.*\\S.*'} minLength={field === 'employeeId' ? 6 : undefined} maxLength={field === 'employeeId' ? 6 : 100} autoComplete={field === 'name' ? 'name' : field === 'jobTitle' ? 'organization-title' : 'off'} value={draft[field]} onChange={event => setDraft(current => ({ ...current, [field]: field === 'employeeId' ? event.target.value.replace(/\D/g, '').slice(0, 6) : event.target.value }))} />
        {field === 'employeeId' && draft.employeeId.length > 0 && draft.employeeId.length < 6 && <small className="participant-field-hint">{en ? 'Employee ID must contain exactly 6 digits.' : 'No. karyawan terdiri atas 6 angka.'}</small>}
      </label>)}
      <button className="primary-button" type="submit">{product ? (en ? 'Continue To Exercise' : 'Lanjut Ke Latihan') : (en ? 'Save Details' : 'Simpan Data Diri')}</button>
    </form>
    {product && <div className="exercise-bottom"><a className="outline-nav-button" href={`/${product}/course`}><ArrowLeft size={16} aria-hidden="true" />{en ? 'Back To Course' : 'Kembali Ke Materi'}</a></div>}
  </section>
}
