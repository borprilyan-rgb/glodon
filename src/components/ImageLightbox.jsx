import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'

export default function ImageLightbox({ items, index, onIndexChange, onClose, t, opener }) {
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const imageWrapRef = useRef(null)
  const dragRef = useRef(null)
  const [zoomState, setZoomState] = useState({ index, value: 1 })
  const item = items[index]
  const zoom = zoomState.index === index ? zoomState.value : 1

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

  useEffect(() => {
    const wrap = imageWrapRef.current
    if (!wrap) return undefined
    const frame = window.requestAnimationFrame(() => {
      wrap.scrollLeft = Math.max(0, (wrap.scrollWidth - wrap.clientWidth) / 2)
      wrap.scrollTop = Math.max(0, (wrap.scrollHeight - wrap.clientHeight) / 2)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [index, zoom])

  const startPan = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const wrap = imageWrapRef.current
    dragRef.current = { startX: event.clientX, startY: event.clientY, scrollLeft: wrap.scrollLeft, scrollTop: wrap.scrollTop }
    wrap.setPointerCapture(event.pointerId)
    wrap.classList.add('is-panning')
  }
  const pan = (event) => {
    const drag = dragRef.current
    if (!drag) return
    const wrap = imageWrapRef.current
    wrap.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX)
    wrap.scrollTop = drag.scrollTop - (event.clientY - drag.startY)
  }
  const stopPan = (event) => {
    if (!dragRef.current) return
    const wrap = imageWrapRef.current
    dragRef.current = null
    wrap.classList.remove('is-panning')
    if (wrap.hasPointerCapture(event.pointerId)) wrap.releasePointerCapture(event.pointerId)
  }

  return <div className="lightbox" role="dialog" aria-modal="true" aria-label={t.lightboxLabel} onMouseDown={(event) => { if (!event.target.closest('.lightbox__image-wrap, .lightbox__caption, button')) onClose() }}>
    <div className="lightbox__panel" ref={panelRef}>
      <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label={t.closeImage}><X /><span>{t.closeImage}</span></button>
      <div className="lightbox__zoom" aria-label="Image zoom controls"><button type="button" onClick={() => setZoomState((current) => ({ index, value: Math.max(1, (current.index === index ? current.value : 1) - 0.5) }))} disabled={zoom === 1} aria-label="Zoom out"><ZoomOut size={17} /></button><span>{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoomState((current) => ({ index, value: Math.min(4, (current.index === index ? current.value : 1) + 0.5) }))} disabled={zoom === 4} aria-label="Zoom in"><ZoomIn size={17} /></button></div>
      <div className="lightbox__image-wrap" ref={imageWrapRef} onPointerDown={startPan} onPointerMove={pan} onPointerUp={stopPan} onPointerCancel={stopPan}><img src={item.image} alt={item.alt} draggable="false" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }} /></div>
      <div className="lightbox__caption"><div>{item.label && <strong>{item.label}</strong>}<p>{item.caption}</p></div><span>{t.imageCount(index + 1, items.length)}</span></div>
      <button type="button" className="lightbox__arrow lightbox__arrow--previous" onClick={() => onIndexChange(index - 1)} disabled={index === 0} aria-label={t.previousImage}><ChevronLeft /></button>
      <button type="button" className="lightbox__arrow lightbox__arrow--next" onClick={() => onIndexChange(index + 1)} disabled={index === items.length - 1} aria-label={t.nextImage}><ChevronRight /></button>
    </div>
  </div>
}
