import { Check } from 'lucide-react'

export default function CompletionChecklist({ checks, selectedChecks, isComplete, onCheck, onToggle, t }) {
  const selected = new Set(isComplete ? checks.map((_, index) => index) : selectedChecks)
  const allSelected = selected.size === checks.length
  return <section className="completion-card"><h2>{t.ready}</h2><div className="completion-card__checks">{checks.map((check, index) => <label key={check}><input type="checkbox" checked={selected.has(index)} onChange={() => onCheck(index)} /><span>{check}</span></label>)}</div><button className={`complete-button ${isComplete ? 'is-complete' : ''}`} onClick={onToggle} disabled={!allSelected}><span>{isComplete ? <Check size={18} /> : null}</span>{isComplete ? t.completed : t.markComplete}</button></section>
}
