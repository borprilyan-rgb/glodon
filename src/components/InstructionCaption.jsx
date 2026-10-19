import OfficialText from './OfficialText'

export default function InstructionCaption({ description, format }) {
  if (!description) return null
  if (format === 'verbatim') return <p className="screenshot-media__instruction" style={{ whiteSpace: 'pre-line' }}><OfficialText>{description}</OfficialText></p>
  const segments = (description.includes('\n') ? description.split(/\n+/) : description.split(/(?<=\.)\s+(?=[A-ZÀ-Ý])/u)).filter(Boolean)
  if (segments.length < 2) return <p className="screenshot-media__instruction"><OfficialText>{description}</OfficialText></p>
  return <ol className="screenshot-media__instructions">{segments.map((segment) => <li key={segment}><OfficialText>{segment}</OfficialText></li>)}</ol>
}
