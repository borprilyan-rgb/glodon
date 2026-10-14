import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ClipboardCheck, Home, Mail, Menu, Play, X } from 'lucide-react'
import { presentationCopy } from '../data/presentation'
import LanguageSwitcher from './LanguageSwitcher'
import ProgressBar from './ProgressBar'
import { getProductLabel } from '../data/productConfig'

export default function LessonHeader({ page, product, activeStep, completed, total, showProgress, language, onLanguageChange, t, headerActions }) {
  const [menuOpen, setMenuOpen] = useState(false)
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
  const productLabel = product ? getProductLabel(product) : null
  const title = page === 'exercises' ? (language === 'en' ? 'Exercise' : 'Latihan') : page === 'contact' ? t.contact : activeStep?.title || (product ? `Cubicost ${productLabel}` : t.hubBrand)
  return <>
    <header className={`lesson-topbar${page === 'admin' ? ' lesson-topbar--admin' : ''}`}>
      <a className="lesson-brand" href="/"><span className="brand__mark"><img src="/branding/company-logo.png" alt="Glodon company logo" /></span><span><strong>{product ? `Cubicost ${productLabel}` : t.hubBrand}</strong><small>{t.tutorialSubtitle}</small></span>{product && <span className="header-product-mark">{productLabel}</span>}</a>
      {activeStep && <div className="lesson-topbar__context"><small>{t.part} {activeStep.partNumber}</small><strong>{activeStep.title}</strong></div>}
      <div className="lesson-topbar__tools">{showProgress && <ProgressBar completed={completed.size} total={total} t={t} compact />}<LanguageSwitcher language={language} onChange={onLanguageChange} t={t} />{page !== 'contact' && <a className="contact-nav-button" href="/contact"><Mail size={16} /><span>{t.contact}</span></a>}{!['exercises', 'tests', 'exercise', 'admin'].includes(page) && <a className="all-courses-button" href={product ? '/' + product + '/tests' : '/exercises'}><ClipboardCheck size={16} /><span>{language === 'en' ? 'Exercises' : 'Latihan'}</span></a>}{(product || page === 'contact' || page === 'exercises' || page === 'admin') && <a className="all-courses-button" href="/" aria-label={t.home}><Home size={16} /><span>{t.home}</span></a>}{activeStep && <a className="course-map-button" href={`/${product}/course`} aria-label={t.backToCourseMap}><ArrowLeft size={16} /><span>{t.courseMapLabel}</span></a>}</div>
      <div className="mobile-header-row">{product && <a className="mobile-header__back" href={activeStep ? `/${product}/course` : '/'} aria-label={activeStep ? t.backToCourseMap : t.home}><ArrowLeft size={20} /></a>}<a className="mobile-header__logo" href="/" aria-label={t.home}><img src="/branding/company-logo.png" alt="" /></a><strong>{title}</strong><button className="mobile-header-language" type="button" onClick={() => onLanguageChange(language === 'id' ? 'en' : 'id')} aria-label={`${t.language}: ${language.toUpperCase()}`}>{language.toUpperCase()}</button><button ref={menuButtonRef} type="button" onClick={() => setMenuOpen(true)} aria-label={t.lessons} aria-expanded={menuOpen}><Menu size={21} /></button></div>
      {headerActions && <div className="lesson-topbar__actions">{headerActions}</div>}
    </header>
    {menuOpen && <div className="mobile-menu-layer"><button className="mobile-menu-backdrop" type="button" onClick={() => setMenuOpen(false)} aria-label={t.closeMenu} /><aside ref={drawerRef} className="mobile-menu-drawer" role="dialog" aria-modal="true" aria-label={t.lessons}><header><strong>{t.hubBrand}</strong><button ref={closeButtonRef} type="button" onClick={() => setMenuOpen(false)} aria-label={t.closeMenu}><X size={22} /></button></header><nav><a href="/" onClick={() => setMenuOpen(false)}><Home size={18} />{t.home}</a>{product && <a href={`/${product}/course`} onClick={() => setMenuOpen(false)}><ArrowLeft size={18} />{t.courseMapLabel}</a>}{page !== 'contact' && <a href="/contact" onClick={() => setMenuOpen(false)}><Mail size={18} />{t.contact}</a>}{page !== 'admin' && <a href="/present" onClick={() => setMenuOpen(false)}><Play size={18} />{presentationCopy[language].present}</a>}{!['exercises', 'tests', 'exercise', 'admin'].includes(page) && <a href={product ? '/' + product + '/tests' : '/exercises'} onClick={() => setMenuOpen(false)}><ClipboardCheck size={18} />{language === 'en' ? 'Exercises' : 'Latihan'}</a>}</nav>{showProgress && <ProgressBar completed={completed.size} total={total} t={t} compact />}</aside></div>}
  </>
}
