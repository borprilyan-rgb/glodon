import { Check } from 'lucide-react'

export default function CompletionChecklist({ checks, isComplete, onToggle, t }) {
  return <section className="completion-card"><div><span className="eyebrow">{t.stepCheck}</span><h2>{t.ready}</h2><ul>{checks.map((check) => <li key={check}><Check size={15} />{check}</li>)}</ul></div><button className={`complete-button ${isComplete ? 'is-complete' : ''}`} onClick={onToggle}><span>{isComplete ? <Check size={20} /> : null}</span>{isComplete ? t.completed : t.markComplete}</button></section>
}
