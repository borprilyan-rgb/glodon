import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function ImageLightbox({ items, index, onIndexChange, onClose, t, opener }) {
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const item = items[index]

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => { document.body.style.overflow = previousOverflow; opener?.focus() }
  }, [opener])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && index > 0) onIndexChange(index - 1)
      if (event.key === 'ArrowRight' && index < items.length - 1) onIndexChange(index + 1)
      if (event.key === 'Tab') {
        const controls = [...panelRef.current.querySelectorAll('button:not(:disabled)')]
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [index, items.length, onClose, onIndexChange])

  return <div className="lightbox" role="dialog" aria-modal="true" aria-label={t.lightboxLabel} onMouseDown={(event) => { if (!event.target.closest('.lightbox__image-wrap, .lightbox__caption, button')) onClose() }}>
    <div className="lightbox__panel" ref={panelRef}>
      <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label={t.closeImage}><X /><span>{t.closeImage}</span></button>
      <div className="lightbox__image-wrap"><img src={item.image} alt={item.alt} /></div>
      <div className="lightbox__caption"><div>{item.label && <strong>{item.label}</strong>}<p>{item.caption}</p></div><span>{t.imageCount(index + 1, items.length)}</span></div>
      <button type="button" className="lightbox__arrow lightbox__arrow--previous" onClick={() => onIndexChange(index - 1)} disabled={index === 0} aria-label={t.previousImage}><ChevronLeft /></button>
      <button type="button" className="lightbox__arrow lightbox__arrow--next" onClick={() => onIndexChange(index + 1)} disabled={index === items.length - 1} aria-label={t.nextImage}><ChevronRight /></button>
    </div>
  </div>
}
