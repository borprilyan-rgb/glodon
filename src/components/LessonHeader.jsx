import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ClipboardCheck, Home, Maximize, Menu, Minimize, Play, X } from 'lucide-react'
import { presentationCopy } from '../data/presentation'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import ProgressBar from './ProgressBar'
import { getProductLabel } from '../data/productConfig'
import { getHeaderNavigation } from '../data/headerNavigation'

export default function LessonHeader({ page, product, activeStep, completed, total, showProgress, language, onLanguageChange, t, headerActions, theme, onThemeToggle, mobileLessonFullscreen }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [fullscreenNotice, setFullscreenNotice] = useState('')
  const menuButtonRef = useRef(null)
  const closeButtonRef = useRef(null)
  const drawerRef = useRef(null)
  useEffect(() => {
    if (!menuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const menuButton = menuButtonRef.current
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const handleMenuKeyDown = (event) => {
      if (event.key === 'Escape') { setMenuOpen(false); return }
      if (event.key !== 'Tab') return
      const controls = [...(drawerRef.current?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]') || [])]
      if (!controls.length) return
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && (document.activeElement === first || !drawerRef.current?.contains(document.activeElement))) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !drawerRef.current?.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleMenuKeyDown)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleMenuKeyDown); menuButton?.focus() }
  }, [menuOpen])
  useEffect(() => {
    const changed = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', changed)
    return () => document.removeEventListener('fullscreenchange', changed)
  }, [])
  async function toggleFullscreen() {
    try {
      const shell = document.querySelector('.app-shell')
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (shell?.requestFullscreen) await shell.requestFullscreen()
      else throw new Error('Fullscreen unavailable')
      setFullscreenNotice('')
    } catch {
      setFullscreenNotice(presentationCopy[language].fullscreenError)
    }
  }
  const productLabel = product ? getProductLabel(product) : null
  const brandImage = product ? `/branding/cubicost-${product}-logo.png` : '/branding/company-logo.png'
  const brandAlt = product ? `Cubicost ${productLabel}` : 'Glodon company logo'
  const isCourseHome = Boolean(product) && ['welcome', 'course'].includes(page) && !activeStep
  const title = page === 'scores' ? (language === 'en' ? 'Exercise scores' : 'Nilai latihan') : page === 'exercises' ? (language === 'en' ? 'Exercise' : 'Latihan') : page === 'settings' ? t.settings : page === 'contact' ? t.contact : activeStep?.title || (product ? `Cubicost ${productLabel}` : t.hubBrand)
  const navigation = getHeaderNavigation({ page, product, activeStep })
  const navigationLabels = { scores: language === 'en' ? 'Scores' : 'Nilai', home: t.home, exercises: language === 'en' ? 'Exercises' : 'Latihan', learningMap: t.courseMapLabel }
  const navigationIcons = { scores: ClipboardCheck, home: Home, exercises: ClipboardCheck, learningMap: ArrowLeft }
  const navigationClasses = { scores: 'all-courses-button', home: 'all-courses-button', exercises: 'all-courses-button', learningMap: 'course-map-button' }
  return <>
    <header className={`lesson-topbar${page === 'admin' ? ' lesson-topbar--admin' : ''}${isCourseHome ? ' lesson-topbar--course-home' : ''}`}>
      <a className="lesson-brand" href="/"><span className="brand__mark"><img src={brandImage} alt={brandAlt} /></span><span><strong>{product ? `Cubicost ${productLabel}` : t.hubBrand}</strong>{!product && <small>{t.tutorialSubtitle}</small>}</span></a>
      {activeStep && <div className="lesson-topbar__context"><small>{t.part} {activeStep.partNumber}</small><strong>{activeStep.title}</strong></div>}
      <div className="lesson-topbar__tools">{showProgress && !isCourseHome && <ProgressBar completed={completed.size} total={total} t={t} compact />}<LanguageSwitcher language={language} onChange={onLanguageChange} t={t} /><ThemeToggle theme={theme} onToggle={onThemeToggle} language={language} />{navigation.map(link => {
        const Icon = navigationIcons[link.id]
        return <a key={link.id} className={navigationClasses[link.id]} href={link.href} aria-label={link.id === 'learningMap' ? t.backToCourseMap : navigationLabels[link.id]}><Icon size={16} /><span>{navigationLabels[link.id]}</span></a>
      })}</div>
      <div className="mobile-header-row">{product && <a className="mobile-header__back" href={activeStep ? `/${product}/course` : '/'} aria-label={activeStep ? t.backToCourseMap : t.home}><ArrowLeft size={20} /></a>}<a className="mobile-header__logo" href="/" aria-label={t.home}><img src={brandImage} alt="" /></a><strong>{title}</strong>{page === 'lesson' && activeStep && mobileLessonFullscreen && <button type="button" className="mobile-fullscreen-toggle" onClick={toggleFullscreen} aria-label={fullscreen ? presentationCopy[language].leaveFullscreen : presentationCopy[language].fullscreen} title={fullscreen ? presentationCopy[language].leaveFullscreen : presentationCopy[language].fullscreen}>{fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}</button>}<button ref={menuButtonRef} type="button" onClick={() => setMenuOpen(true)} aria-label={t.lessons} aria-expanded={menuOpen}><Menu size={21} /></button></div>
      {fullscreenNotice && <p className="mobile-fullscreen-notice" role="status">{fullscreenNotice}</p>}
      {headerActions && <div className="lesson-topbar__actions">{headerActions}</div>}
    </header>
    {menuOpen && <div className="mobile-menu-layer"><button className="mobile-menu-backdrop" type="button" onClick={() => setMenuOpen(false)} aria-label={t.closeMenu} /><aside ref={drawerRef} className="mobile-menu-drawer" role="dialog" aria-modal="true" aria-label={t.lessons}><header><strong>{t.hubBrand}</strong><button ref={closeButtonRef} type="button" onClick={() => setMenuOpen(false)} aria-label={t.closeMenu}><X size={22} /></button></header><nav><a href="/" onClick={() => setMenuOpen(false)}><Home size={18} />{t.home}</a>{product && <a href={`/${product}/course`} onClick={() => setMenuOpen(false)}><ArrowLeft size={18} />{t.courseMapLabel}</a>}{['exercises', 'tests', 'exercise'].includes(page) && <a href="/exercises/score" onClick={() => setMenuOpen(false)}><ClipboardCheck size={18} />{language === 'en' ? 'Scores' : 'Nilai'}</a>}{page !== 'admin' && <a href="/present" onClick={() => setMenuOpen(false)}><Play size={18} />{presentationCopy[language].present}</a>}{!['exercises', 'tests', 'exercise', 'admin'].includes(page) && <a href="/exercises" onClick={() => setMenuOpen(false)}><ClipboardCheck size={18} />{language === 'en' ? 'Exercises' : 'Latihan'}</a>}</nav>{showProgress && <ProgressBar completed={completed.size} total={total} t={t} compact />}</aside></div>}
  </>
}
