import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, List, Maximize, Minimize, X } from 'lucide-react'
import { presentationCopy } from '../data/presentation'
import { getProductLabel } from '../data/productConfig'
import '../styles/presentation.css'
import ImageLightbox from './ImageLightbox'
import { uiText } from '../data/uiText'
import usePresentationDrawing from './usePresentationDrawing'
import DrawingCanvas from './DrawingCanvas'
import DrawingToolbar from './DrawingToolbar'
import PresentationMap from './PresentationMap'
import PresentationHome from './PresentationHome'
import ThemeToggle from './ThemeToggle'
import SiteFooter from './SiteFooter'
import MobileBottomNavigation from './MobileBottomNavigation'

const DEMO_KEY = 'cubicost:presentation:return'

export function PresentationEntry({ language }) {
  const c = presentationCopy[language]
  const [returnPath, setReturnPath] = useState(() => {
    try { const path = sessionStorage.getItem(DEMO_KEY); return path?.startsWith('/present?') ? path : null } catch { return null }
  })
  if (!returnPath) return null
  return <div className="presentation-entry">
    {returnPath && <div className="presentation-return"><a href={returnPath}>{c.back}</a><button type="button" aria-label={c.dismiss} onClick={() => { try { sessionStorage.removeItem(DEMO_KEY) } catch { /* Storage may be unavailable. */ } setReturnPath(null) }}><X size={16} /></button></div>}
  </div>
}

export default function Presentation({ courses, language, onLanguageChange, theme, onThemeToggle }) {
  const c = presentationCopy[language]
  const params = new URLSearchParams(window.location.search)
  const initialProduct = Object.hasOwn(courses, params.get('product')) ? params.get('product') : 'tas'
  const requestedLesson = params.get('lesson')
  const initialLesson = courses[initialProduct].lessonAliases?.[requestedLesson] || requestedLesson
  const selectedLesson = courses[initialProduct].allSteps.find((step) => step.id === initialLesson)
  const [product, setProduct] = useState(initialProduct)
  const [lessonId, setLessonId] = useState(selectedLesson?.id || courses[initialProduct].allSteps[0].id)
  const [walkthrough, setWalkthrough] = useState(Boolean(selectedLesson))
  const [index, setIndex] = useState(() => Math.max(0, Math.min(Number.parseInt(params.get('slide'), 10) || 0, (selectedLesson?.actions.length || 1) - 1)))
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [notice, setNotice] = useState('')
  const [failedImage, setFailedImage] = useState(null)
  const [expandedImage, setExpandedImage] = useState(null)
  const [mapOpen, setMapOpen] = useState(false)
  const root = useRef(null)
  const t = uiText[language]
  const lesson = courses[product].allSteps.find((step) => step.id === lessonId) || courses[product].allSteps[0]
  const lessons = courses[product].allSteps
  const lessonIndex = lessons.findIndex((step) => step.id === lesson.id)
  const slidesBeforeLesson = lessons.slice(0, lessonIndex).reduce((total, step) => total + step.actions.length, 0)
  const expandedSlides = lessons.flatMap((step) => step.actions.map((slide, actionIndex) => {
    const media = slide.mediaLayout === 'comparison' ? slide.comparison[0] : slide
    return {
      image: media.presenterImage || media.image,
      alt: media.imageAlt || media.alt || media.title,
      caption: media.title || slide.title,
      description: media.description || slide.description,
      instructionFormat: media.instructionFormat || slide.instructionFormat,
      crop: media.crop || slide.crop,
      lessonId: step.id,
      actionIndex,
    }
  }))
  const previousLesson = walkthrough ? lessons[lessonIndex - 1] : null
  const nextLesson = walkthrough ? lessons[lessonIndex + 1] : null
  const count = walkthrough ? lesson.actions.length : 1
  const action = walkthrough ? lesson.actions[index] : null
  const image = action?.presenterImage || action?.image
  const crop = action?.crop
  const cropButtonStyle = crop ? { aspectRatio: `${crop.imageWidth / crop.imageHeight * crop.width / crop.height}`, maxHeight: '55vh' } : undefined
  const cropImageStyle = crop ? { position: 'absolute', left: `${-100 * crop.x / crop.width}%`, top: `${-100 * crop.y / crop.height}%`, width: `${100 / crop.width}%`, height: `${100 / crop.height}%`, maxWidth: 'none', objectFit: 'fill' } : undefined
  const revisedLayout = walkthrough && lesson.showInstructionsBelowImage
  const drawing = usePresentationDrawing(walkthrough ? `${product}:${lesson.id}:${action.id}` : 'home')
  const currentPath = walkthrough ? `/present?${new URLSearchParams({ product, lesson: lesson.id, slide: String(index) })}` : '/present'
  function startCourse(id) {
    startLesson(id, courses[id].allSteps[0].id)
  }

  function startLesson(id, stepId) {
    setProduct(id)
    setLessonId(stepId)
    setIndex(0)
    setWalkthrough(true)
    setMapOpen(false)
    root.current?.querySelector('.presentation-stage')?.focus()
  }

  const navigate = useCallback((direction) => {
    if (direction > 0 && index === count - 1 && nextLesson) {
      setLessonId(nextLesson.id)
      setIndex(0)
    } else if (direction < 0 && index === 0 && previousLesson) {
      setLessonId(previousLesson.id)
      setIndex(previousLesson.actions.length - 1)
    } else {
      setIndex((current) => Math.max(0, Math.min(count - 1, current + direction)))
    }
  }, [index, count, nextLesson, previousLesson])

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await root.current.requestFullscreen()
      setNotice('')
    } catch { setNotice(c.fullscreenError) }
  }

  useEffect(() => { window.history.replaceState({}, '', currentPath) }, [currentPath])
  useEffect(() => {
    const changed = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', changed)
    return () => document.removeEventListener('fullscreenchange', changed)
  }, [])
  useEffect(() => {
    const keydown = (event) => {
      if (expandedImage) return
      if (event.target.closest('.presentation-map')) return
      // Let the focused instructions use native scrolling keys. ArrowLeft and
      // ArrowRight still navigate slides, and F still toggles fullscreen.
      if (event.target.closest('.presentation-instructions') && ['PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) return
      if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, select, textarea, [contenteditable]') || (event.key === ' ' && event.target.closest('button, a, summary'))) return
      if (walkthrough && ['ArrowRight', 'PageDown', 'ArrowLeft', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
        event.preventDefault()
        if (event.key === 'Home') setIndex(0)
        else if (event.key === 'End') setIndex(count - 1)
        else navigate(['ArrowRight', 'PageDown', ' '].includes(event.key) ? 1 : -1)
      }
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        const operation = document.fullscreenElement ? document.exitFullscreen() : root.current.requestFullscreen?.()
        if (operation) operation.catch(() => setNotice(c.fullscreenError))
        else setNotice(c.fullscreenError)
      }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [count, c.fullscreenError, navigate, expandedImage, walkthrough])

  return <div className={`presentation${walkthrough ? '' : ' presentation--home'}`} ref={root}>
    <div className="presentation-content" inert={expandedImage ? true : undefined} aria-hidden={expandedImage ? true : undefined}>
    <header className="presentation-toolbar">
      <a href="/" className="presentation-brand"><img src="/branding/company-logo.png" alt="Glodon" /><span>Cubicost Learning Centre</span></a>
      <div><ThemeToggle theme={theme} onToggle={onThemeToggle} language={language} /><button type="button" aria-expanded={mapOpen} aria-controls="presentation-map" aria-label="List" title="List" onClick={() => setMapOpen(open => !open)}><List size={18} /><span>List</span></button><button type="button" onClick={() => onLanguageChange(language === 'en' ? 'id' : 'en')} aria-label={language === 'en' ? 'Switch to Indonesian' : 'Ganti ke bahasa Inggris'}>{language.toUpperCase()}</button>{walkthrough && <DrawingToolbar drawing={drawing} language={language} mode="toggle" />}<button type="button" onClick={toggleFullscreen}>{fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}<span>{fullscreen ? c.leaveFullscreen : c.fullscreen}</span></button>{!fullscreen && <a className={`presentation-close${walkthrough ? '' : ' presentation-close--home'}`} href={walkthrough ? '/present' : '/'} aria-label={language === 'en' ? 'Close' : 'Tutup'}>{walkthrough ? (language === 'en' ? 'Close' : 'Tutup') : <X size={20} aria-hidden="true" />}</a>}</div>
    </header>
    <div hidden={!mapOpen}><PresentationMap key={product} courses={courses} product={product} lessonId={lesson.id} index={index} walkthrough={walkthrough} language={language} onClose={() => {
      setMapOpen(false)
      root.current?.querySelector('[aria-controls="presentation-map"]')?.focus()
    }} onSelect={(id, stepId, slide) => {
      setProduct(id)
      setLessonId(stepId)
      setIndex(slide)
      setWalkthrough(true)
      setMapOpen(false)
      root.current?.querySelector('.presentation-stage')?.focus()
    }} /></div>
    {walkthrough && <DrawingToolbar drawing={drawing} language={language} mode="tools" />}
    <main tabIndex={-1} className={`presentation-stage ${walkthrough ? 'presentation-stage--lesson' : 'presentation-stage--home'}`} aria-label={walkthrough ? c.actions : c.home.label}>
      {walkthrough ? <div className="presentation-heading"><span className="presentation-eyebrow">{`${getProductLabel(product)} · ${revisedLayout ? action.title : lesson.title}`}</span><h1>{revisedLayout ? lesson.title : action.title}</h1></div> : <h1 className="sr-only">{c.home.label}</h1>}
      {walkthrough && action.mediaLayout === 'comparison' ? <div className="presentation-comparison">{action.comparison.map((media) => <section key={media.image}>
        <button type="button" className="presentation-image-button" aria-label={`${t.enlargeImage}: ${media.alt}`} onClick={(event) => setExpandedImage({ image: media.image, alt: media.alt, caption: media.label, description: media.description, instructionFormat: media.instructionFormat, slideIndex: slidesBeforeLesson + index, opener: event.currentTarget })}><img src={media.image} alt={media.alt} /></button>
        <h2>{media.label}</h2><div className="presentation-instructions"><p>{media.description}</p></div>
      </section>)}</div> : walkthrough ? <div className={`presentation-action${revisedLayout ? ' presentation-action--revised' : ''}`}>
        <div className="presentation-image">
          {failedImage === image ? <p>{c.missing}</p> : <button type="button" className="presentation-image-button" style={cropButtonStyle} aria-label={t.enlargeImage} onClick={(event) => setExpandedImage({ image, alt: action.imageAlt || action.alt || action.title, caption: action.title, description: action.description, instructionFormat: action.instructionFormat, crop, slideIndex: slidesBeforeLesson + index, opener: event.currentTarget })}>
            <img key={image} src={image} alt={action.imageAlt || action.alt || action.title} style={cropImageStyle} onError={() => setFailedImage(image)} />
          </button>}
          {!expandedImage && failedImage !== image && <DrawingCanvas drawing={drawing} image={image} label={language === 'en' ? 'Image annotations' : 'Coretan gambar'} />}
        </div>
        {!action.hideInstructions && <div key={`${product}:${lesson.id}:${action.id}`} className="presentation-instructions" role="region" aria-label={language === 'en' ? 'Slide instructions' : 'Instruksi slide'} tabIndex={0}><p>{action.description || lesson.intro}</p></div>}
      </div> : <PresentationHome courses={courses} initialProduct={product} language={language} t={t} c={c} onStart={startLesson} />}
    </main>
    {walkthrough && <><footer className="presentation-controls">
      <button type="button" onClick={() => navigate(-1)} disabled={index === 0 && !previousLesson} aria-label={index === 0 && previousLesson ? c.previousLesson : c.previous} title={index === 0 && previousLesson ? previousLesson.title : c.previous}><ArrowLeft size={22} /></button>
      <span className="presentation-page" aria-live="polite">{c.lessonLabel} {lessonIndex + 1} / {lessons.length} &middot; {c.slide} {index + 1} / {count}</span>
      <button className="presentation-next" type="button" onClick={() => navigate(1)} disabled={index === count - 1 && !nextLesson} aria-label={index === count - 1 && nextLesson ? c.nextLesson : c.next} title={index === count - 1 && nextLesson ? nextLesson.title : c.next}><ArrowRight size={22} /></button>
    </footer>
    <nav className="presentation-course-nav" aria-label={c.course}>{Object.keys(courses).map((id) => <button key={id} type="button" aria-label={getProductLabel(id)} title={getProductLabel(id)} aria-pressed={walkthrough && product === id} onClick={() => startCourse(id)}><img src={`/branding/cubicost-${id}-logo.png`} alt="" /></button>)}</nav></>}
    <SiteFooter text={t.footer} />
    {notice && <p role="status" className="presentation-notice">{notice}</p>}
    <MobileBottomNavigation page="presentation" product={walkthrough ? product : null} t={t} />
    </div>
    {expandedImage && <ImageLightbox items={expandedSlides.map((slide, slideIndex) => slideIndex === expandedImage.slideIndex ? expandedImage : slide)} index={expandedImage.slideIndex} onIndexChange={(slideIndex) => {
      const slide = expandedSlides[slideIndex]
      setLessonId(slide.lessonId)
      setIndex(slide.actionIndex)
      setExpandedImage((current) => ({ ...slide, slideIndex, opener: current.opener }))
    }} onClose={() => setExpandedImage(null)} t={t} opener={expandedImage.opener} drawing={drawing} language={language} hideDrawingToggle collapsibleCaption />}
  </div>
}
