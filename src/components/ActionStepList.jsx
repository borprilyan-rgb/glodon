import OfficialText from './OfficialText'
import { TriangleAlert } from 'lucide-react'

export default function ActionStepList({ actions, activeIndex, onSelect, t }) {
  const activeAction = actions[activeIndex]
  const hasDescription = (action) => action.description?.trim() && action.description.trim().toLocaleLowerCase() !== action.title.trim().toLocaleLowerCase()
  return <><div className="action-list" role="list" aria-label={t.action}>
    {actions.map((action, index) => <button type="button" role="listitem" key={action.id} className={`action-list__item ${index === activeIndex ? 'is-active' : ''}`} onClick={() => onSelect(index)} aria-current={index === activeIndex ? 'step' : undefined} aria-label={t.selectAction(action.number)}>
      <span className="action-list__number">{String(action.number).padStart(2, '0')}</span>
      <span className="action-list__copy"><strong><OfficialText>{action.title}</OfficialText></strong>{index === activeIndex && hasDescription(action) && <p><OfficialText>{action.description}</OfficialText></p>}{index === activeIndex && action.callout && <span className="action-inline-warning"><TriangleAlert size={16} /><span><strong>{action.callout.title}</strong><span>{action.callout.text}</span></span></span>}</span>
    </button>)}</div>
    <div className="action-list__mobile-detail"><strong><OfficialText>{activeAction.title}</OfficialText></strong>{hasDescription(activeAction) && <p><OfficialText>{activeAction.description}</OfficialText></p>}{activeAction.callout && <span className="action-inline-warning"><TriangleAlert size={16} /><span><strong>{activeAction.callout.title}</strong><span>{activeAction.callout.text}</span></span></span>}</div>
  </>
}
