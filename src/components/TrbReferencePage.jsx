import { BookOpen, CircleHelp, Keyboard, Lightbulb, RefreshCw } from 'lucide-react'

export default function TrbReferencePage({ t }) {
  const items = [{ icon: Keyboard, title: t.shortcutKeys, text: t.shortcutKeysText }, { icon: Lightbulb, title: t.functionTips, text: t.functionTipsText }, { icon: BookOpen, title: t.stepTips, text: t.stepTipsText }, { icon: BookOpen, title: t.learningCenter, text: t.learningCenterText }, { icon: CircleHelp, title: t.helpCenter, text: t.helpCenterText }, { icon: RefreshCw, title: t.softwareUpdates, text: t.softwareUpdatesText }]
  return <div className="reference-page"><header><span className="eyebrow">TRB · {t.reference}</span><h1>{t.trbReferenceTitle}</h1><p>{t.trbReferenceIntro}</p><small>{t.referenceNotProgress}</small></header><div className="reference-grid">{items.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={21} /><h2>{title}</h2><p>{text}</p></article>)}</div></div>
}
