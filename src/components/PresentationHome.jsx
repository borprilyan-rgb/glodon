import { useState } from 'react'
import { ArrowRight, ChevronDown, Play } from 'lucide-react'
import { getProductLabel } from '../data/productConfig'

export default function PresentationHome({ courses, initialProduct, language, t, c, onStart }) {
  const [product, setProduct] = useState(initialProduct)
  const [openPart, setOpenPart] = useState(null)
  const course = courses[product]
  const en = language === 'en'
  return <div className="presentation-home">
    <nav className="presentation-applications" aria-label={en ? 'Applications' : 'Aplikasi'}>
      {Object.keys(courses).map(id => <button key={id} type="button" aria-pressed={product === id} className={`presentation-application presentation-application--${id}`} onClick={() => {
        if (id === product) return
        setProduct(id)
        setOpenPart(null)
      }}><img src={`/branding/cubicost-${id}-logo.png`} alt="" /><strong>{getProductLabel(id)}</strong></button>)}
    </nav>
    <section className={`presentation-outline presentation-outline--${product}`} aria-labelledby="presentation-outline-title">
      <header className="presentation-outline__heading">
        <div><h2 id="presentation-outline-title">Cubicost {getProductLabel(product)}</h2><p>{course.tutorialParts.length} {en ? 'parts' : 'bagian'} · {course.allSteps.length} {en ? 'steps' : 'langkah'}</p></div>
        <button className="presentation-outline__start" type="button" aria-label={`${c.home.start} ${getProductLabel(product)}`} onClick={() => onStart(product, course.allSteps[0].id)}>{c.home.start}<ArrowRight size={17} aria-hidden="true" /></button>
      </header>
      {course.tutorialParts.map(part => {
        const steps = part.steps.map(raw => course.allSteps.find(step => step.id === raw.id)).filter(Boolean)
        const expanded = openPart === part.id
        const panelId = `presentation-home-${product}-${part.id}`
        return <section className="presentation-home-part" key={`${product}:${part.id}`}>
          <h3><button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setOpenPart(expanded ? null : part.id)}>
            <span className="presentation-home-part__number">{t.part} {part.number}</span><span className="presentation-home-part__title">{part.title}</span><small>{steps.length} {en ? 'steps' : 'langkah'}</small><ChevronDown size={18} aria-hidden="true" />
          </button></h3>
          <ol className="presentation-home-steps" id={panelId} hidden={!expanded}>{steps.map(step => <li key={step.id}>
            <a href={`/present?${new URLSearchParams({ product, lesson: step.id, slide: '0' })}`} onClick={event => {
              if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
              event.preventDefault()
              onStart(product, step.id)
            }}><small>{t.step} {step.stepNumber}</small><span>{step.title}</span><Play size={16} aria-hidden="true" /></a>
          </li>)}</ol>
        </section>
      })}
    </section>
  </div>
}
