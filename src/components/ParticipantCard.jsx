import { useEffect, useState } from 'react'
import { Pencil } from 'lucide-react'
import ParticipantDetails from './ParticipantDetails'
import { loadParticipantEditLockUntil } from '../data/participant'

function formatCountdown(milliseconds) {
  const totalSeconds = Math.ceil(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function ParticipantCard({ profile, language, editUntil, onEdit }) {
  const en = language === 'en'
  const [deadline, setDeadline] = useState(() => Math.max(editUntil || 0, loadParticipantEditLockUntil()))
  const [now, setNow] = useState(Date.now())
  const remaining = Math.max(0, deadline - now)

  useEffect(() => {
    const update = () => {
      setNow(Date.now())
      setDeadline(Math.max(editUntil || 0, loadParticipantEditLockUntil()))
    }
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [editUntil])

  return <section className="participant-profile-card exercise-card">
    <div className="participant-profile-card__heading">
      <div><span className="eyebrow">{en ? 'Test participant' : 'Peserta tes'}</span><h2>{en ? 'Personal Details' : 'Data Diri'}</h2></div>
      <button className="secondary-button" type="button" disabled={remaining > 0} onClick={onEdit}>
        <Pencil size={16} aria-hidden="true" />{en ? 'Edit Details' : 'Ubah Data Diri'}
      </button>
    </div>
    <ParticipantDetails profile={profile} language={language} />
    <p className="participant-profile-card__timer" aria-live="off">
      {remaining > 0
        ? (en ? `Details can be changed again in ${formatCountdown(remaining)}.` : `Data diri dapat diubah kembali dalam ${formatCountdown(remaining)}.`)
        : (en ? 'Details are available to edit.' : 'Data diri dapat diubah.')}
    </p>
  </section>
}
