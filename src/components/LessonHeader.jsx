import { ArrowLeft } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import ProgressBar from './ProgressBar'

export default function LessonHeader({ activeStep, completed, total, showProgress, language, onLanguageChange, t }) {
  return <header className="lesson-topbar">
    <a className="lesson-brand" href="#/"><span className="brand__mark"><img src="/branding/company-logo.png" alt="Glodon company logo" /></span><span><strong>Cubicost TAS</strong><small>{t.tutorialSubtitle}</small></span></a>
    {activeStep && <div className="lesson-topbar__context"><small>{t.part} {activeStep.partNumber}</small><strong>{activeStep.title}</strong></div>}
    <div className="lesson-topbar__tools">{showProgress && <ProgressBar completed={completed.size} total={total} t={t} compact />}<LanguageSwitcher language={language} onChange={onLanguageChange} t={t} />{activeStep && <a className="course-map-button" href="#/course" aria-label={t.backToCourseMap}><ArrowLeft size={16} /><span>{t.courseMapLabel}</span></a>}</div>
  </header>
}
