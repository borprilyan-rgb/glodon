import Sidebar from './Sidebar'
import MobileNavigation from './MobileNavigation'

export default function TutorialLayout({ children, ...sidebarProps }) {
  const total = sidebarProps.parts.reduce((n, part) => n + part.steps.length, 0)
  return <div className="app-shell"><Sidebar {...sidebarProps} /><MobileNavigation onOpen={sidebarProps.openMobile} completed={sidebarProps.completed.size} total={total} t={sidebarProps.t} language={sidebarProps.language} onLanguageChange={sidebarProps.onLanguageChange} /><button className={`sidebar-backdrop ${sidebarProps.mobileOpen ? 'is-visible' : ''}`} onClick={sidebarProps.closeMobile} aria-label={sidebarProps.t.closeMenu} /><main className="main-content">{children}<footer>{sidebarProps.t.footer}</footer></main></div>
}
