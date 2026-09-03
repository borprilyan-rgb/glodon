import { Image, Maximize2 } from 'lucide-react'
import { useState } from 'react'

function ScreenshotMedia({ media, onEnlarge, t, eager = false }) {
  const [failed, setFailed] = useState(false)
  const filename = media.image.split('/').pop()
  return <div className="screenshot-media">
    {!failed && !media.pending ? <button type="button" className="screenshot-media__image" onClick={onEnlarge} aria-label={`${t.enlargeImage}: ${media.alt}`}><img src={media.image} alt={media.alt} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} /><span><Maximize2 size={16} /> {t.enlargeImage}</span></button> : <div className="screenshot-media__placeholder" role="status"><span className="screenshot-placeholder__icon"><Image size={27} /></span><div><small>{media.pending ? t.screenshotPending : t.screenshotUnavailable}</small><h3>{media.label || media.alt}</h3><code>{filename}</code><p><strong>{t.requiredFile}:</strong> {media.requiredDescription || media.caption}</p></div></div>}
    <div className="screenshot-media__caption">{media.label && <strong>{media.label}</strong>}<p>{media.caption}</p></div>
  </div>
}

export default function ScreenshotViewer({ action, onEnlarge, t }) {
  if (action.mediaLayout === 'comparison') return <div className="screenshot-viewer screenshot-viewer--comparison">{action.comparison.map((media, index) => <ScreenshotMedia key={media.image} media={{ ...media, requiredDescription: media.caption }} onEnlarge={(event) => onEnlarge(index, event.currentTarget)} t={t} eager />)}</div>
  return <div className="screenshot-viewer"><ScreenshotMedia key={action.image} media={action} onEnlarge={(event) => onEnlarge(0, event.currentTarget)} t={t} eager /></div>
}
