import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Maximize, Minimize, Play, X } from 'lucide-react'
import { presentationCopy } from '../data/presentation'
import { getProductLabel } from '../data/productConfig'
import '../styles/presentation.css'
import ImageLightbox from './ImageLightbox'
import { uiText } from '../data/uiText'

const DEMO_KEY = 'cubicost:presentation:return'

export function PresentationEntry({ language, step }) {
  const c = presentationCopy[language]
  const [returnPath, setReturnPath] = useState(() => {
    try { const path = sessionStorage.getItem(DEMO_KEY); return path?.startsWith('/present?') ? path : null } catch { return null }
  })
  if (step && !returnPath) return null
  return <div className="presentation-entry">
    <>{!step && <a className="secondary-button" href="/present"><Play size={16} />{c.present}</a>}</>
    {returnPath && <div className="presentation-return"><a href={returnPath}>{c.back}</a><button type="button" aria-label={c.dismiss} onClick={() => { try { sessionStorage.removeItem(DEMO_KEY) } catch { /* Storage may be unavailable. */ } setReturnPath(null) }}><X size={16} /></button></div>}
  </div>
}

export default function Presentation({ courses, language, onLanguageChange }) {
  const c = presentationCopy[language]
  const params = new URLSearchParams(window.location.search)
  const initialProduct = Object.hasOwn(courses, params.get('product')) ? params.get('product') : 'tas'
  const selectedLesson = courses[initialProduct].allSteps.find((step) => step.id === params.get('lesson'))
  const [product, setProduct] = useState(initialProduct)
  const [lessonId, setLessonId] = useState(selectedLesson?.id || courses[initialProduct].allSteps[0].id)
  const [walkthrough, setWalkthrough] = useState(Boolean(selectedLesson))
  const [index, setIndex] = useState(() => Math.max(0, Math.min(Number.parseInt(params.get('slide'), 10) || 0, (selectedLesson?.actions.length || 1) - 1)))
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [notice, setNotice] = useState('')
  const [failedImage, setFailedImage] = useState(null)
  const [expandedImage, setExpandedImage] = useState(null)
  const root = useRef(null)
  const t = uiText[language]
  const lesson = courses[product].allSteps.find((step) => step.id === lessonId) || courses[product].allSteps[0]
  const lessons = courses[product].allSteps
  const lessonIndex = lessons.findIndex((step) => step.id === lesson.id)
  const previousLesson = walkthrough ? lessons[lessonIndex - 1] : null
  const nextLesson = walkthrough ? lessons[lessonIndex + 1] : null
  const count = walkthrough ? lesson.actions.length : 1
  const action = walkthrough ? lesson.actions[index] : null
  const currentPath = walkthrough ? `/present?${new URLSearchParams({ product, lesson: lesson.id, slide: String(index) })}` : '/present'
  function startCourse(id) {
    setProduct(id)
    setLessonId(courses[id].allSteps[0].id)
    setIndex(0)
    setWalkthrough(true)
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

  const exitPath = walkthrough ? `/${product}/lesson/${lesson.id}` : '/'
  return <div className="presentation" ref={root}>
    <div className="presentation-content" inert={expandedImage ? true : undefined}>
    <header className="presentation-toolbar">
      <a href={exitPath} className="presentation-brand"><img src="/branding/company-logo.png" alt="Glodon" /><span>Cubicost Learning Centre</span></a>
      <div><button type="button" onClick={() => onLanguageChange(language === 'en' ? 'id' : 'en')} aria-label={language === 'en' ? 'Switch to Indonesian' : 'Ganti ke bahasa Inggris'}>{language.toUpperCase()}</button><button type="button" onClick={toggleFullscreen}>{fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}<span>{fullscreen ? c.leaveFullscreen : c.fullscreen}</span></button><a href={exitPath} aria-label={c.exit}><X size={20} /></a></div>
    </header>
    <main className={`presentation-stage ${walkthrough ? 'presentation-stage--lesson' : 'presentation-stage--home'}`} aria-label={walkthrough ? c.actions : c.home.label}>
      <div className="presentation-heading"><span className="presentation-eyebrow">{walkthrough ? `${getProductLabel(product)} · ${lesson.title}` : c.home.label}</span><h1>{walkthrough ? action.title : c.home.title}</h1>{!walkthrough && <p>{c.home.text}</p>}</div>
      {walkthrough ? <div className="presentation-action"><div className="presentation-image">{failedImage === action.image ? <p>{c.missing}</p> : <button type="button" className="presentation-image-button" aria-label={t.enlargeImage} onClick={(event) => setExpandedImage({ image: action.image, alt: action.imageAlt || action.alt || action.title, caption: action.title, opener: event.currentTarget })}><img src={action.image} alt={action.imageAlt || action.alt || action.title} onError={() => setFailedImage(action.image)} /></button>}</div><div className="presentation-instructions"><p>{action.description || lesson.intro}</p></div></div> : <div className="presentation-products">{Object.keys(courses).map((id) => <button type="button" key={id} aria-label={getProductLabel(id)} onClick={() => startCourse(id)}><img src={`/branding/cubicost-${id}-logo.png`} alt="" /><strong>{getProductLabel(id)}</strong></button>)}</div>}
    </main>
    {walkthrough && <><footer className="presentation-controls">
      <div className="presentation-navigation"><button type="button" onClick={() => navigate(-1)} disabled={index === 0 && !previousLesson} aria-label={index === 0 && previousLesson ? c.previousLesson : c.previous} title={index === 0 && previousLesson ? previousLesson.title : c.previous}><ArrowLeft size={22} /></button><span aria-live="polite">{walkthrough && <>{c.lessonLabel} {lessonIndex + 1} / {lessons.length} &middot; </>}{c.slide} {index + 1} / {count}</span><button type="button" onClick={() => navigate(1)} disabled={index === count - 1 && !nextLesson} aria-label={index === count - 1 && nextLesson ? c.nextLesson : c.next} title={index === count - 1 && nextLesson ? nextLesson.title : c.next}><ArrowRight size={22} /></button></div>
      <small>{c.keyboard}</small>
      <div className="presentation-options"><a href={`/${product}/lesson/${lesson.id}`} onClick={() => { try { sessionStorage.setItem(DEMO_KEY, currentPath) } catch { /* Demo still opens if storage is unavailable. */ } }}>{c.demo}<ArrowRight size={16} /></a></div>
    </footer>
    <nav className="presentation-course-nav" aria-label={c.course}>{Object.keys(courses).map((id) => <button key={id} type="button" aria-label={getProductLabel(id)} title={getProductLabel(id)} aria-pressed={walkthrough && product === id} onClick={() => startCourse(id)}><img src={`/branding/cubicost-${id}-logo.png`} alt="" /></button>)}</nav></>}
    {notice && <p role="status" className="presentation-notice">{notice}</p>}
    </div>
    {expandedImage && <ImageLightbox items={[expandedImage]} index={0} onIndexChange={() => {}} onClose={() => setExpandedImage(null)} t={t} opener={expandedImage.opener} />}
  </div>
}
