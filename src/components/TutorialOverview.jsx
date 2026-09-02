import { ArrowDown, Box, FileCheck2, Ruler } from 'lucide-react'
import ProgressBar from './ProgressBar'
import TutorialSection from './TutorialSection'

export default function TutorialOverview({ parts, completed, total, t }) {
  return <div className="overview"><section className="hero"><div className="hero__copy"><span className="eyebrow">{t.heroEyebrow}</span><h1>{t.heroProduct}<br /><em>{t.heroTitle}</em></h1><p>{t.heroIntro}</p><a href="#/part-1/create-project" className="primary-button">{t.start} <ArrowDown size={18} /></a></div><div className="hero__panel"><span className="hero__panel-label">{t.courseProgress}</span><strong>{completed.size}<small> / {total}</small></strong><ProgressBar completed={completed.size} total={total} t={t} /><div className="hero__stats"><span><b>3</b> {t.practicalParts}</span><span><b>18</b> {t.guidedSteps}</span></div></div></section>
    <section className="principles"><article><Ruler /><div><strong>{t.principle1}</strong><p>{t.principle1Text}</p></div></article><article><Box /><div><strong>{t.principle2}</strong><p>{t.principle2Text}</p></div></article><article><FileCheck2 /><div><strong>{t.principle3}</strong><p>{t.principle3Text}</p></div></article></section>
    <header className="section-heading"><span className="eyebrow">{t.courseMap}</span><h2>{t.mapTitle}</h2><p>{t.mapText}</p></header>
    <div className="part-list">{parts.map((part) => <TutorialSection key={part.id} part={part} completed={completed} t={t} />)}</div>
  </div>
}
