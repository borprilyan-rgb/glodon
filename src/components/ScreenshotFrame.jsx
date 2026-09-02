import { Image, Maximize2 } from 'lucide-react'

export default function ScreenshotFrame({ screenshot, partId, t }) {
  if (!screenshot) return null
  const src = `/tutorial/tas/${partId}/${screenshot.file}`
  return <figure className="screenshot-frame">
    <img src={src} alt={screenshot.title} onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.nextElementSibling.hidden = false }} />
    <div className="screenshot-placeholder" hidden><span className="screenshot-placeholder__icon"><Image size={27} /></span><div><small>{t.screenshotRequired}</small><h3>{screenshot.title}</h3><code>{screenshot.file}</code><p>{screenshot.description}</p></div></div>
    <figcaption><span>{t.referenceScreen}</span><a href={src} target="_blank" rel="noreferrer"><Maximize2 size={14} /> {t.openImage}</a></figcaption>
  </figure>
}
