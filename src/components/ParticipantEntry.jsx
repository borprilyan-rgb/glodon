import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { hasParticipant, participantFields, participantLabels } from '../data/participant'
import '../styles/exercise.css'

export default function ParticipantEntry({ profile, language, onContinue, product }) {
  const [draft, setDraft] = useState(profile)
  const en = language === 'en'
  return <section className="participant-entry section-exercise">
    <header className="exercise-header"><span className="eyebrow">{product.toUpperCase()} · {en ? 'Exercise' : 'Latihan'}</span><h1>{en ? 'Enter your details' : 'Isi data diri Anda'}</h1><p>{en ? 'Complete these details before accessing the exercise.' : 'Lengkapi data berikut sebelum mengakses latihan.'}</p></header>
    <form className="exercise-card" onSubmit={event => {
      event.preventDefault()
      const profile = Object.fromEntries(participantFields.map(field => [field, draft[field].trim()]))
      if (hasParticipant(profile)) onContinue(profile)
    }}>
      <p>{en ? 'Employee IDs are self-reported. Submitted attempts are sent to central storage using automatic anonymous sign-in; no account registration is needed.' : 'Nomor karyawan diisi sendiri. Hasil tes dikirim ke penyimpanan pusat dengan login anonim otomatis; tidak perlu membuat akun.'}</p>
      {participantFields.map(field => <label className="exercise-field" key={field} htmlFor={`participant-${field}`}>{participantLabels[language][field]}
        <input id={`participant-${field}`} name={field} type="text" inputMode={field === 'employeeId' ? 'numeric' : undefined} required pattern={field === 'employeeId' ? '[0-9]{6}' : '.*\\S.*'} minLength={field === 'employeeId' ? 6 : undefined} maxLength={field === 'employeeId' ? 6 : 100} autoComplete={field === 'name' ? 'name' : field === 'jobTitle' ? 'organization-title' : 'off'} value={draft[field]} onChange={event => setDraft(current => ({ ...current, [field]: field === 'employeeId' ? event.target.value.replace(/\D/g, '').slice(0, 6) : event.target.value }))} />
        {field === 'employeeId' && draft.employeeId.length > 0 && draft.employeeId.length < 6 && <small className="participant-field-hint">{en ? 'Employee ID must contain exactly 6 digits.' : 'No. karyawan terdiri atas 6 angka.'}</small>}
      </label>)}
      <button className="primary-button" type="submit">{en ? 'Continue To Exercise' : 'Lanjut Ke Latihan'}</button>
    </form>
    <div className="exercise-bottom"><a className="outline-nav-button" href={`/${product}/course`}><ArrowLeft size={16} aria-hidden="true" />{en ? 'Back To Course' : 'Kembali Ke Materi'}</a></div>
  </section>
}
