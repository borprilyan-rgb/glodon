import { useEffect, useRef, useState } from 'react'
import DrawingCanvas from './DrawingCanvas'
import DrawingToolbar from './DrawingToolbar'
import InstructionCaption from './InstructionCaption'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X, ZoomIn, ZoomOut } from 'lucide-react'

export default function ImageLightbox({ items, index, onIndexChange, onClose, t, opener, drawing, language, hideDrawingToggle = false, collapsibleCaption = false }) {
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const imageWrapRef = useRef(null)
  const dragRef = useRef(null)
  const [zoomState, setZoomState] = useState({ index, value: 1 })
  const [captionExpanded, setCaptionExpanded] = useState(false)
  const item = items[index]
  const zoom = zoomState.index === index ? zoomState.value : 1
  const crop = item.crop
  const repeatedText = item.description?.trim() && [item.label, item.caption].some((text) => text?.trim() === item.description.trim())
  const instructionDescription = repeatedText ? '' : item.description
  const hasCaption = Boolean(item.label || item.caption || instructionDescription)
  const cropAspect = crop ? crop.imageWidth / crop.imageHeight * crop.width / crop.height : null
  const cropFrameStyle = crop ? { width: `${zoom * 100}%`, aspectRatio: `${cropAspect}` } : undefined
  const cropImageStyle = crop ? {
    position: 'absolute',
    left: `${-100 * crop.x / crop.width}%`,
    top: `${-100 * crop.y / crop.height}%`,
    width: `${100 / crop.width}%`,
    height: `${100 / crop.height}%`,
  } : undefined

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => { document.body.style.overflow = previousOverflow; opener?.focus() }
  }, [opener])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { if (drawing?.enabled) drawing.toggle(); else onClose() }
      if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); onIndexChange(index - 1) }
      if (event.key === 'ArrowRight' && index < items.length - 1) { event.preventDefault(); onIndexChange(index + 1) }
      if (event.key === 'Tab') {
        const controls = [...panelRef.current.querySelectorAll('button:not(:disabled), select:not(:disabled)')]
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [index, items.length, onClose, onIndexChange, drawing])

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
    if (drawing?.enabled || event.pointerType !== 'mouse' || event.button !== 0) return
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

  return <div className="lightbox" role="dialog" aria-modal="true" aria-label={t.lightboxLabel} onMouseDown={(event) => { if (!event.target.closest('.lightbox__image-wrap, .lightbox__caption, .lightbox__drawing-tools, button')) onClose() }}>
    <div className="lightbox__panel" ref={panelRef}>
      <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label={t.closeImage}><X /><span>{t.closeImage}</span></button>
      <div className="lightbox__zoom" aria-label={t.imageZoomControls}><button type="button" onClick={() => setZoomState((current) => ({ index, value: Math.max(1, (current.index === index ? current.value : 1) - 0.5) }))} disabled={zoom === 1} aria-label={t.zoomOut}><ZoomOut size={17} /></button><span>{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoomState((current) => ({ index, value: Math.min(4, (current.index === index ? current.value : 1) + 0.5) }))} disabled={zoom === 4} aria-label={t.zoomIn}><ZoomIn size={17} /></button></div>
      <div className="lightbox__image-wrap" ref={imageWrapRef} onPointerDown={startPan} onPointerMove={pan} onPointerUp={stopPan} onPointerCancel={stopPan}>{crop ? <div className="lightbox__crop" style={cropFrameStyle}>{drawing ? <div className="lightbox__annotated-image" style={cropImageStyle}><img src={item.image} alt={item.alt} draggable="false" /><DrawingCanvas drawing={drawing} image={item.image} label={language === 'en' ? 'Image annotations' : 'Coretan gambar'} /></div> : <img src={item.image} alt={item.alt} draggable="false" style={cropImageStyle} />}</div> : drawing ? <div className="lightbox__annotated-image" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}><img src={item.image} alt={item.alt} draggable="false" /><DrawingCanvas drawing={drawing} image={item.image} label={language === 'en' ? 'Image annotations' : 'Coretan gambar'} /></div> : <img src={item.image} alt={item.alt} draggable="false" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }} />}</div>
      {drawing && <div className="lightbox__drawing-tools"><DrawingToolbar drawing={drawing} language={language} mode={hideDrawingToggle ? 'tools' : 'all'} /></div>}
      {collapsibleCaption && hasCaption && <button type="button" className="lightbox__caption-toggle" aria-expanded={captionExpanded} aria-label={language === 'en' ? (captionExpanded ? 'Hide slide text' : 'Show slide text') : (captionExpanded ? 'Sembunyikan teks slide' : 'Tampilkan teks slide')} onClick={() => setCaptionExpanded((expanded) => !expanded)}>{captionExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}<span>{t.imageCount(index + 1, items.length)}</span></button>}
      {(!collapsibleCaption || captionExpanded) && <div className={`lightbox__caption${instructionDescription ? ' lightbox__caption--instructions' : ''}`}><div>{item.label && <strong>{item.label}</strong>}{item.caption && <p>{item.caption}</p>}<InstructionCaption description={instructionDescription} format={item.instructionFormat} plainText /></div>{!collapsibleCaption && <span>{t.imageCount(index + 1, items.length)}</span>}</div>}
      <button type="button" className="lightbox__arrow lightbox__arrow--previous" onClick={() => onIndexChange(index - 1)} disabled={index === 0} aria-label={t.previousImage}><ChevronLeft /></button>
      <button type="button" className="lightbox__arrow lightbox__arrow--next" onClick={() => onIndexChange(index + 1)} disabled={index === items.length - 1} aria-label={t.nextImage}><ChevronRight /></button>
    </div>
  </div>
}
