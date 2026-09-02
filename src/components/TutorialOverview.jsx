import { ArrowDown, Box, FileCheck2, Ruler } from 'lucide-react'
import ProgressBar from './ProgressBar'
import TutorialSection from './TutorialSection'

export default function TutorialOverview({ parts, completed, total }) {
  return <div className="overview"><section className="hero"><div className="hero__copy"><span className="eyebrow">BEGINNER · SELF-PACED · PRACTICAL</span><h1>Cubicost TAS<br /><em>Technical Tutorial</em></h1><p>From drawing setup to defensible quantities—a structured field guide for building reliable TAS models and reports.</p><a href="#/part-1/create-project" className="primary-button">Start the tutorial <ArrowDown size={18} /></a></div><div className="hero__panel"><span className="hero__panel-label">COURSE PROGRESS</span><strong>{completed.size}<small> / {total}</small></strong><ProgressBar completed={completed.size} total={total} /><div className="hero__stats"><span><b>3</b> practical parts</span><span><b>18</b> guided steps</span></div></div></section>
    <section className="principles"><article><Ruler /><div><strong>Prepare accurately</strong><p>Floors, drawings, and scale first.</p></div></article><article><Box /><div><strong>Model in sequence</strong><p>Respect element dependencies.</p></div></article><article><FileCheck2 /><div><strong>Verify quantities</strong><p>Trace every result before reporting.</p></div></article></section>
    <header className="section-heading"><span className="eyebrow">COURSE MAP</span><h2>Three parts. One reliable workflow.</h2><p>Complete the lessons in order, or jump directly to the procedure you need.</p></header>
    <div className="part-list">{parts.map((part) => <TutorialSection key={part.id} part={part} completed={completed} />)}</div>
  </div>
}
