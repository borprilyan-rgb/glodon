export default function ParticipantName({ profile, language }) {
  const name = profile?.name?.trim()
  if (!name) return null

  return <div className="participant-name">
    <span>{language === 'en' ? 'Name' : 'Nama'}</span>
    <strong>{name}</strong>
  </div>
}
