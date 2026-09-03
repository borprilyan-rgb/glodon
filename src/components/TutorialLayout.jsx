import LessonHeader from './LessonHeader'

export default function TutorialLayout({ children, page, product, activeStep, completed, total, showProgress, language, onLanguageChange, t }) {
  return <div className="app-shell app-shell--focused"><LessonHeader page={page} product={product} activeStep={activeStep} completed={completed} total={total} showProgress={showProgress} language={language} onLanguageChange={onLanguageChange} t={t} /><main className="main-content main-content--focused">{children}<footer>{t.footer}</footer></main></div>
}
