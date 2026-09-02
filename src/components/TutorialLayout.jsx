import Sidebar from './Sidebar'
import MobileNavigation from './MobileNavigation'

export default function TutorialLayout({ children, ...sidebarProps }) {
  const total = sidebarProps.parts.reduce((n, part) => n + part.steps.length, 0)
  return <div className="app-shell"><Sidebar {...sidebarProps} /><MobileNavigation onOpen={sidebarProps.openMobile} completed={sidebarProps.completed.size} total={total} /><button className={`sidebar-backdrop ${sidebarProps.mobileOpen ? 'is-visible' : ''}`} onClick={sidebarProps.closeMobile} aria-label="Close navigation" /><main className="main-content">{children}<footer>Independent learning resource · Confirm procedures against your Cubicost TAS version and project standard.</footer></main></div>
}
