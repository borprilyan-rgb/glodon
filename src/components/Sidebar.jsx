import { Check, RotateCcw, Search, X } from 'lucide-react'
import { getStepHash } from '../data/tutorialUtils'
import ProgressBar from './ProgressBar'
import LanguageSwitcher from './LanguageSwitcher'

export default function Sidebar({ parts, steps, activeStep, completed, query, setQuery, onReset, onNavigate, mobileOpen, closeMobile, language, onLanguageChange, t }) {
  const visibleIds = new Set(steps.map((step) => step.id))
  return <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
    <div className="sidebar__top">
      <a className="brand" href="#/" onClick={closeMobile}><span className="brand__mark"><img src="/branding/company-logo.png" alt="Cubicost TAS company logo" /></span><span><strong>Glodon Tutorial</strong><small>{t.tutorialSubtitle}</small></span></a>
      <button className="icon-button sidebar__close" onClick={closeMobile} aria-label={t.closeMenu}><X /></button>
    </div>
    <LanguageSwitcher language={language} onChange={onLanguageChange} t={t} />
    <ProgressBar completed={completed.size} total={parts.reduce((n, part) => n + part.steps.length, 0)} t={t} compact />
    <label className="search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} aria-label={t.searchAria} /></label>
    <nav className="sidebar__nav" aria-label="Tutorial steps">
      {parts.map((part) => {
        const visible = part.steps.filter((step) => visibleIds.has(step.id))
        if (!visible.length) return null
        return <div className="nav-part" key={part.id}>
          <div className="nav-part__heading"><span>{part.number}</span><p>{part.shortTitle}</p></div>
          {visible.map((step) => <a key={step.id} href={getStepHash({ ...step, partId: part.id })} onClick={() => { onNavigate(); closeMobile() }} className={`nav-step ${activeStep?.id === step.id ? 'is-active' : ''} ${completed.has(step.id) ? 'is-complete' : ''}`}><span className="nav-step__status">{completed.has(step.id) ? <Check size={13} /> : part.steps.indexOf(step) + 1}</span><span>{step.title}</span></a>)}
        </div>
      })}
      {!steps.length && <p className="empty-search">{t.noResults(query)}</p>}
    </nav>
    <button className="reset-button" onClick={onReset}><RotateCcw size={16} /> {t.reset}</button>
  </aside>
}
