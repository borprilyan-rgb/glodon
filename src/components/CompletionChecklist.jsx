import { Check } from 'lucide-react'

export default function CompletionChecklist({ checks, isComplete, onToggle }) {
  return <section className="completion-card"><div><span className="eyebrow">STEP CHECK</span><h2>Ready to move on?</h2><ul>{checks.map((check) => <li key={check}><Check size={15} />{check}</li>)}</ul></div><button className={`complete-button ${isComplete ? 'is-complete' : ''}`} onClick={onToggle}><span>{isComplete ? <Check size={20} /> : null}</span>{isComplete ? 'Step completed' : 'Mark step complete'}</button></section>
}
