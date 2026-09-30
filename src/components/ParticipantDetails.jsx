import { participantFields, participantLabels } from '../data/participant'

export default function ParticipantDetails({ profile, language }) {
  return <dl className="participant-details">{participantFields.filter(field => profile?.[field]?.trim()).map(field => <div key={field}><dt>{participantLabels[language][field]}</dt><dd>{profile[field].trim()}</dd></div>)}</dl>
}
