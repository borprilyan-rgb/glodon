import LessonHeader from './LessonHeader'
import SiteFooter from './SiteFooter'
import MobileBottomNavigation from './MobileBottomNavigation'

export default function TutorialLayout({ children, page, product, activeStep, completed, total, showProgress, language, onLanguageChange, t, headerActions, theme, onThemeToggle, searchReturnHref }) {
  return <div className="app-shell app-shell--focused"><LessonHeader theme={theme} onThemeToggle={onThemeToggle} page={page} product={product} activeStep={activeStep} completed={completed} total={total} showProgress={showProgress} language={language} onLanguageChange={onLanguageChange} t={t} headerActions={headerActions} searchReturnHref={searchReturnHref} /><main className="main-content main-content--focused has-mobile-bottom-nav">{children}<SiteFooter text={t.footer} /></main><MobileBottomNavigation page={page} product={product} t={t} /></div>
}
