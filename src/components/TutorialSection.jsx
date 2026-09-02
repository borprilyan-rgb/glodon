import { ArrowRight, Check } from 'lucide-react'
import { getStepHash } from '../data/tutorialData'

export default function TutorialSection({ part, completed }) {
  const done = part.steps.filter((step) => completed.has(step.id)).length
  return <section className="part-card"><div className="part-card__number">{part.number}</div><div className="part-card__body"><div className="part-card__meta"><span>PART {part.number}</span><span>{done}/{part.steps.length} COMPLETE</span></div><h2>{part.title}</h2><p>{part.summary}</p><div className="workflow" aria-label="Recommended workflow">{part.workflow.map((item, index) => <span key={item}>{item}{index < part.workflow.length - 1 && <ArrowRight size={13} />}</span>)}</div><div className="part-card__steps">{part.steps.map((step, index) => <a href={getStepHash({ ...step, partId: part.id })} key={step.id}><span className={completed.has(step.id) ? 'done' : ''}>{completed.has(step.id) ? <Check size={14} /> : index + 1}</span>{step.title}<ArrowRight size={16} /></a>)}</div></div></section>
}
