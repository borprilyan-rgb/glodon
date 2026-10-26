import { useState } from 'react'
import { X } from 'lucide-react'
import { getProductLabel } from '../data/productConfig'

export default function PresentationMap({ courses, product, lessonId, index, walkthrough, language, onSelect, onClose }) {
  const [mapProduct, setMapProduct] = useState(product)
  const en = language === 'en'
  const course = courses[mapProduct]
  return <nav id="presentation-map" className="presentation-map" aria-label={en ? 'Presentation learning map' : 'Peta belajar presentasi'}>
    <button type="button" className="presentation-map__close" onClick={onClose} aria-label={en ? 'Close list' : 'Tutup daftar'} title={en ? 'Close list' : 'Tutup daftar'}><X size={16} /></button>
    <div className="presentation-map__products">{Object.keys(courses).map(id => <button type="button" key={id} aria-pressed={mapProduct === id} onClick={() => setMapProduct(id)}>{getProductLabel(id)}</button>)}</div>
    <div className="presentation-map__parts">{course.tutorialParts.map(part => <details key={`${mapProduct}:${part.id}`} open={!walkthrough || (mapProduct === product && part.steps.some(step => step.id === lessonId))}>
      <summary>{en ? 'Part' : 'Bagian'} {part.number} · {part.title}</summary>
      {part.steps.map(rawStep => {
        const step = course.allSteps.find(item => item.id === rawStep.id)
        if (!step) return null
        const active = walkthrough && mapProduct === product && lessonId === step.id
        return <details className="presentation-map__lesson" key={step.id} open={active}>
          <summary>{en ? 'Step' : 'Langkah'} {step.stepNumber} · {step.title}</summary>
          <ol>{step.actions.map((action, slide) => <li key={action.id}><a href={`/present?${new URLSearchParams({ product: mapProduct, lesson: step.id, slide: String(slide) })}`} aria-current={active && index === slide ? 'step' : undefined} onClick={event => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
            event.preventDefault()
            onSelect(mapProduct, step.id, slide)
          }}>{slide + 1}. {action.title}</a></li>)}</ol>
        </details>
      })}
    </details>)}</div>
  </nav>
}
