import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, LayoutGrid, Mail, Menu, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import ProgressBar from './ProgressBar'

export default function LessonHeader({ page, product, activeStep, completed, total, showProgress, language, onLanguageChange, t }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const closeButtonRef = useRef(null)
  useEffect(() => {
    if (!menuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const menuButton = menuButtonRef.current
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const closeOnEscape = (event) => { if (event.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', closeOnEscape); menuButton?.focus() }
  }, [menuOpen])
  const title = page === 'contact' ? t.contact : activeStep?.title || (product ? `Cubicost ${product.toUpperCase()}` : t.hubBrand)
  return <>
    <header className="lesson-topbar">
      <a className="lesson-brand" href="/"><span className="brand__mark"><img src="/branding/company-logo.png" alt="Glodon company logo" /></span><span><strong>{product ? `Cubicost ${product.toUpperCase()}` : t.hubBrand}</strong><small>{t.tutorialSubtitle}</small></span>{product && <span className="header-product-mark">{product.toUpperCase()}</span>}</a>
      {activeStep && <div className="lesson-topbar__context"><small>{t.part} {activeStep.partNumber}</small><strong>{activeStep.title}</strong></div>}
      <div className="lesson-topbar__tools">{showProgress && <ProgressBar completed={completed.size} total={total} t={t} compact />}<LanguageSwitcher language={language} onChange={onLanguageChange} t={t} /><a className="contact-nav-button" href="/contact"><Mail size={16} /><span>{t.contact}</span></a>{(product || page === 'contact') && <a className="all-courses-button" href="/" aria-label={t.backToAllCourses}><LayoutGrid size={16} /><span>{t.allCourses}</span></a>}{activeStep && <a className="course-map-button" href={`/${product}/course`} aria-label={t.backToCourseMap}><ArrowLeft size={16} /><span>{t.courseMapLabel}</span></a>}</div>
      <div className="mobile-header-row">{product && <a className="mobile-header__back" href={activeStep ? `/${product}/course` : '/'} aria-label={activeStep ? t.backToCourseMap : t.backToAllCourses}><ArrowLeft size={20} /></a>}<a className="mobile-header__logo" href="/" aria-label={t.backToAllCourses}><img src="/branding/company-logo.png" alt="" /></a><strong>{title}</strong><button className="mobile-header-language" type="button" onClick={() => onLanguageChange(language === 'id' ? 'en' : 'id')} aria-label={`${t.language}: ${language.toUpperCase()}`}>{language.toUpperCase()}</button><button ref={menuButtonRef} type="button" onClick={() => setMenuOpen(true)} aria-label={t.lessons} aria-expanded={menuOpen}><Menu size={21} /></button></div>
    </header>
    {menuOpen && <div className="mobile-menu-layer"><button className="mobile-menu-backdrop" type="button" onClick={() => setMenuOpen(false)} aria-label={t.closeMenu} /><aside className="mobile-menu-drawer" role="dialog" aria-modal="true" aria-label={t.lessons}><header><strong>{t.hubBrand}</strong><button ref={closeButtonRef} type="button" onClick={() => setMenuOpen(false)} aria-label={t.closeMenu}><X size={22} /></button></header><nav><a href="/" onClick={() => setMenuOpen(false)}><LayoutGrid size={18} />{t.allCourses}</a>{product && <a href={`/${product}/course`} onClick={() => setMenuOpen(false)}><ArrowLeft size={18} />{t.courseMapLabel}</a>}{page !== 'contact' && <a href="/contact" onClick={() => setMenuOpen(false)}><Mail size={18} />{t.contact}</a>}</nav>{showProgress && <ProgressBar completed={completed.size} total={total} t={t} compact />}</aside></div>}
  </>
}
