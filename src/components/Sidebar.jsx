import { BookOpen, Check, RotateCcw, Search, X } from 'lucide-react'
import { getStepHash } from '../data/tutorialData'
import ProgressBar from './ProgressBar'

export default function Sidebar({ parts, steps, activeStep, completed, query, setQuery, onReset, onNavigate, mobileOpen, closeMobile }) {
  const visibleIds = new Set(steps.map((step) => step.id))
  return <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
    <div className="sidebar__top">
      <a className="brand" href="#/" onClick={closeMobile}><span className="brand__mark"><BookOpen size={22} /></span><span><strong>Cubicost TAS</strong><small>Technical Tutorial</small></span></a>
      <button className="icon-button sidebar__close" onClick={closeMobile} aria-label="Close tutorial menu"><X /></button>
    </div>
    <ProgressBar completed={completed.size} total={parts.reduce((n, part) => n + part.steps.length, 0)} compact />
    <label className="search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tutorial steps" aria-label="Search tutorial steps" /></label>
    <nav className="sidebar__nav" aria-label="Tutorial steps">
      {parts.map((part) => {
        const visible = part.steps.filter((step) => visibleIds.has(step.id))
        if (!visible.length) return null
        return <div className="nav-part" key={part.id}>
          <div className="nav-part__heading"><span>{part.number}</span><p>{part.shortTitle}</p></div>
          {visible.map((step) => <a key={step.id} href={getStepHash({ ...step, partId: part.id })} onClick={() => { onNavigate(); closeMobile() }} className={`nav-step ${activeStep?.id === step.id ? 'is-active' : ''} ${completed.has(step.id) ? 'is-complete' : ''}`}><span className="nav-step__status">{completed.has(step.id) ? <Check size={13} /> : part.steps.indexOf(step) + 1}</span><span>{step.title}</span></a>)}
        </div>
      })}
      {!steps.length && <p className="empty-search">No steps match “{query}”.</p>}
    </nav>
    <button className="reset-button" onClick={onReset}><RotateCcw size={16} /> Reset progress</button>
  </aside>
}
