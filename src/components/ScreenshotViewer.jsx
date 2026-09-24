import { Image, Maximize2 } from 'lucide-react'
import { useState } from 'react'
import OfficialText from './OfficialText'

function InstructionCaption({ description }) {
  const segments = (description?.includes('\n') ? description.split(/\n+/) : description?.split(/(?<=\.)\s+(?=[A-ZÀ-Ý])/u))?.filter(Boolean) || []
  if (segments.length < 2) return description ? <p className="screenshot-media__instruction"><OfficialText>{description}</OfficialText></p> : null
  return <ol className="screenshot-media__instructions">{segments.map((segment) => <li key={segment}><OfficialText>{segment}</OfficialText></li>)}</ol>
}

function ScreenshotMedia({ media, onEnlarge, showInstruction = false, t, eager = false }) {
  const [failed, setFailed] = useState(false)
  const filename = media.image.split('/').pop()
  return <div className="screenshot-media">
    {!failed && !media.pending ? <button type="button" className="screenshot-media__image" onClick={onEnlarge} aria-label={`${t.enlargeImage}: ${media.alt}`}><img src={media.image} alt={media.alt} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} /><span><Maximize2 size={16} /> {t.enlargeImage}</span></button> : <div className="screenshot-media__placeholder" role="status"><span className="screenshot-placeholder__icon"><Image size={27} /></span><div><small>{media.pending ? t.screenshotPending : t.screenshotUnavailable}</small><h3>{media.label || media.alt}</h3><code>{filename}</code><p><strong>{t.requiredFile}:</strong> {media.requiredDescription || media.caption}</p></div></div>}
    <div className="screenshot-media__caption">{media.label && <strong>{media.label}</strong>}<p>{media.caption}</p>{showInstruction && <InstructionCaption description={media.description} />}</div>
  </div>
}

export default function ScreenshotViewer({ action, onEnlarge, showInstruction = false, t }) {
  if (action.mediaLayout === 'comparison') return <div className="screenshot-viewer screenshot-viewer--comparison">{action.comparison.map((media, index) => <ScreenshotMedia key={media.image} media={{ ...media, requiredDescription: media.caption }} onEnlarge={(event) => onEnlarge(index, event.currentTarget)} showInstruction={showInstruction} t={t} eager />)}</div>
  return <div className="screenshot-viewer"><ScreenshotMedia key={action.image} media={action} onEnlarge={(event) => onEnlarge(0, event.currentTarget)} showInstruction={showInstruction} t={t} eager /></div>
}
