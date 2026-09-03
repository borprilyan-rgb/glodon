import { ArrowLeft, LayoutGrid } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import ProgressBar from './ProgressBar'

export default function LessonHeader({ product, activeStep, completed, total, showProgress, language, onLanguageChange, t }) {
  return <header className="lesson-topbar">
    <a className="lesson-brand" href="/"><span className="brand__mark"><img src="/branding/company-logo.png" alt="Glodon company logo" /></span><span><strong>{product ? `Cubicost ${product.toUpperCase()}` : t.hubBrand}</strong><small>{t.tutorialSubtitle}</small></span>{product && <span className="header-product-mark">{product.toUpperCase()}</span>}</a>
    {activeStep && <div className="lesson-topbar__context"><small>{t.part} {activeStep.partNumber}</small><strong>{activeStep.title}</strong></div>}
    <div className="lesson-topbar__tools">{showProgress && <ProgressBar completed={completed.size} total={total} t={t} compact />}<LanguageSwitcher language={language} onChange={onLanguageChange} t={t} />{product && <a className="all-courses-button" href="/" aria-label={t.backToAllCourses}><LayoutGrid size={16} /><span>{t.allCourses}</span></a>}{activeStep && <a className="course-map-button" href={`/${product}/course`} aria-label={t.backToCourseMap}><ArrowLeft size={16} /><span>{t.courseMapLabel}</span></a>}</div>
  </header>
}
