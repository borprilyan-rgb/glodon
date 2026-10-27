import OfficialText from './OfficialText'

export default function InstructionCaption({ description, format, plainText = false }) {
  if (!description) return null
  const renderText = (text) => plainText ? text : <OfficialText>{text}</OfficialText>
  if (format === 'verbatim') return <p className="screenshot-media__instruction" style={{ whiteSpace: 'pre-line' }}>{renderText(description)}</p>
  const segments = (description.includes('\n') ? description.split(/\n+/) : description.split(/(?<=\.)\s+(?=[A-ZÀ-Ý])/u)).filter(Boolean)
  if (segments.length < 2) return <p className="screenshot-media__instruction">{renderText(description)}</p>
  return <ol className="screenshot-media__instructions">{segments.map((segment) => <li key={segment}>{renderText(format === 'numbered' ? segment.replace(/^Step\s+\d+:\s*/i, '') : segment)}</li>)}</ol>
}
