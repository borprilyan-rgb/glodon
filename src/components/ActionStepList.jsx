import OfficialText from './OfficialText'

export default function ActionStepList({ actions, activeIndex, onSelect, t }) {
  const activeAction = actions[activeIndex]
  return <><div className="action-list" role="list" aria-label={t.action}>
    {actions.map((action, index) => <button type="button" role="listitem" key={action.id} className={`action-list__item ${index === activeIndex ? 'is-active' : ''}`} onClick={() => onSelect(index)} aria-current={index === activeIndex ? 'step' : undefined} aria-label={t.selectAction(action.number)}>
      <span className="action-list__number">{String(action.number).padStart(2, '0')}</span>
      <span className="action-list__copy"><small>{t.action} {action.number}</small><strong><OfficialText>{action.title}</OfficialText></strong>{index === activeIndex && <p><OfficialText>{action.description}</OfficialText></p>}</span>
    </button>)}</div>
    <div className="action-list__mobile-detail"><small>{t.action} {activeAction.number}</small><strong><OfficialText>{activeAction.title}</OfficialText></strong><p><OfficialText>{activeAction.description}</OfficialText></p></div>
  </>
}
