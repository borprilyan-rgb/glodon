import { useCallback, useEffect, useMemo, useState } from 'react'
import ActionStepList from './ActionStepList'
import ScreenshotViewer from './ScreenshotViewer'
import ScreenshotNavigation from './ScreenshotNavigation'
import ImageLightbox from './ImageLightbox'

export default function ActionStepViewer({ actions, t }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [opener, setOpener] = useState(null)

  const mediaItems = useMemo(() => actions.flatMap((action, actionIndex) => action.mediaLayout === 'comparison'
    ? action.comparison.map((media) => ({ ...media, actionIndex }))
    : [{ image: action.image, caption: action.caption, alt: action.alt, actionIndex }]), [actions])

  useEffect(() => {
    const neighbors = [actions[activeIndex - 1], actions[activeIndex + 1]].filter(Boolean)
    neighbors.forEach((action) => {
      if (action.pending) return
      const sources = action.mediaLayout === 'comparison' ? action.comparison.map((item) => item.image) : [action.image]
      sources.forEach((src) => { const image = new window.Image(); image.src = src })
    })
  }, [actions, activeIndex])

  const openLightbox = (mediaOffset, opener) => {
    const index = mediaItems.findIndex((item, itemIndex) => item.actionIndex === activeIndex && (mediaOffset === 0 || mediaItems[itemIndex - 1]?.actionIndex === activeIndex))
    const actionStart = mediaItems.findIndex((item) => item.actionIndex === activeIndex)
    setOpener(opener)
    setLightboxIndex((actionStart >= 0 ? actionStart : index) + mediaOffset)
  }
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const navigateLightbox = useCallback((index) => { setLightboxIndex(index); setActiveIndex(mediaItems[index].actionIndex) }, [mediaItems])

  return <section className="action-viewer" onKeyDown={(event) => { if (lightboxIndex === null && event.key === 'ArrowLeft' && activeIndex > 0) setActiveIndex(activeIndex - 1); if (lightboxIndex === null && event.key === 'ArrowRight' && activeIndex < actions.length - 1) setActiveIndex(activeIndex + 1) }}>
    <div className="action-viewer__list"><span className="eyebrow">{t.action.toUpperCase()}</span><ActionStepList actions={actions} activeIndex={activeIndex} onSelect={setActiveIndex} t={t} /></div>
    <div className="action-viewer__media"><ScreenshotViewer action={actions[activeIndex]} onEnlarge={openLightbox} t={t} /><ScreenshotNavigation current={activeIndex} total={actions.length} onPrevious={() => setActiveIndex(activeIndex - 1)} onNext={() => setActiveIndex(activeIndex + 1)} t={t} /></div>
    {lightboxIndex !== null && <ImageLightbox items={mediaItems} index={lightboxIndex} onIndexChange={navigateLightbox} onClose={closeLightbox} t={t} opener={opener} />}
  </section>
}
