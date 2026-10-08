import { useEffect, useState } from 'react'
import { canEditParticipant } from '../data/participant'

export default function ParticipantEditButton({ profile, language, onEdit }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  const locked = !canEditParticipant(profile, now)
  const en = language === 'en'
  return <div><button type="button" className="text-link" disabled={locked} onClick={onEdit}>{en ? 'Edit Details' : 'Ubah Data Diri'}</button>{locked && <small>{en ? 'Details can be edited one hour after registration or the last edit.' : 'Data diri dapat diubah satu jam setelah pendaftaran atau perubahan terakhir.'}</small>}</div>
}
