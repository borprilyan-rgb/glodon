import LessonHeader from './LessonHeader'
import SiteFooter from './SiteFooter'
import MobileBottomNavigation from './MobileBottomNavigation'

export default function TutorialLayout({ children, page, product, activeStep, completed, total, showProgress, language, onLanguageChange, t, headerActions, theme, onThemeToggle, mobileLessonFullscreen }) {
  const showMobileBottomNavigation = ['hub', 'welcome', 'course', 'exercises', 'scores', 'settings', 'contact'].includes(page)
  const useMobileFullscreen = page === 'lesson' && Boolean(activeStep) && mobileLessonFullscreen
  return <div className={`app-shell app-shell--focused${useMobileFullscreen ? ' app-shell--mobile-fullscreen' : ''}`}><LessonHeader theme={theme} onThemeToggle={onThemeToggle} page={page} product={product} activeStep={activeStep} completed={completed} total={total} showProgress={showProgress} language={language} onLanguageChange={onLanguageChange} t={t} headerActions={headerActions} /><main className={`main-content main-content--focused${showMobileBottomNavigation ? ' has-mobile-bottom-nav' : ''}`}>{children}<SiteFooter text={t.footer} /></main>{showMobileBottomNavigation && <MobileBottomNavigation page={page} product={product} t={t} />}</div>
}
