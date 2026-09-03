import { useState } from 'react'
import { ArrowRight, BookOpen, CheckCircle2, FileCheck2, Image, Layers3, Maximize2 } from 'lucide-react'
import { getStepHash } from '../data/tutorialUtils'
import ImageLightbox from './ImageLightbox'
import ProgressBar from './ProgressBar'

const PREVIEW_IMAGE = '/tutorial/tas/welcome-preview.webp'

export default function LandingPage({ allSteps, completed, started, continueStep, t }) {
  const [imageAvailable, setImageAvailable] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxOpener, setLightboxOpener] = useState(null)
  const isComplete = allSteps.length > 0 && completed.size === allSteps.length
  const isReturning = !isComplete && (started.size > 0 || completed.size > 0)
  const state = isComplete ? 'complete' : isReturning ? 'returning' : 'new'
  const heading = t.landingHeading[state]
  const primaryLabel = t.landingPrimary[state]
  const progressLesson = isComplete ? allSteps[0] : continueStep
  const previewItem = { image: PREVIEW_IMAGE, alt: t.previewAlt, label: t.previewLabel, caption: t.previewCaption }
  const outcomes = [
    { icon: BookOpen, title: t.outcome1Title, description: t.outcome1Text },
    { icon: Layers3, title: t.outcome2Title, description: t.outcome2Text },
    { icon: FileCheck2, title: t.outcome3Title, description: t.outcome3Text },
  ]

  return <div className="landing-page">
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-hero__copy">
        <span className="eyebrow">{t.landingEyebrow}</span>
        <h1 id="landing-title">{heading}</h1>
        <p>{t.landingIntro}</p>
        <div className="landing-actions">
          <a className="primary-button" href={getStepHash(progressLesson)}>{primaryLabel}<ArrowRight size={17} /></a>
          <a className="secondary-button" href="#/course">{t.viewCourseMap}</a>
        </div>
        <p className="landing-course-info">{t.landingCourseInfo}</p>
        {state === 'returning' && <aside className="landing-progress" aria-label={t.overallProgress}>
          <ProgressBar completed={completed.size} total={allSteps.length} t={t} />
          <p><span>{t.currentOrNextLesson}</span><strong>{continueStep.title}</strong></p>
        </aside>}
      </div>
      <div className="landing-preview">
        {imageAvailable ? <button className="landing-preview__image" type="button" onClick={(event) => { setLightboxOpener(event.currentTarget); setLightboxOpen(true) }} aria-label={t.enlargePreview}>
          <img src={PREVIEW_IMAGE} alt={t.previewAlt} onError={() => setImageAvailable(false)} />
          <span><Maximize2 size={16} />{t.enlargeImage}</span>
        </button> : <div className="landing-preview__placeholder" role="img" aria-label={t.previewPlaceholderAlt}>
          <span className="landing-preview__placeholder-icon"><Image size={28} /></span>
          <div><strong>Cubicost TAS</strong><p>{t.previewUnavailable}</p><code>welcome-preview.webp</code></div>
        </div>}
        <p className="landing-preview__caption">{t.previewCaption}</p>
      </div>
    </section>
    <section className="learning-outcomes" aria-labelledby="outcomes-title">
      <div className="section-heading"><span className="eyebrow">Cubicost TAS</span><h2 id="outcomes-title">{t.whatYouWillLearn}</h2></div>
      <div className="outcome-grid">{outcomes.map(({ icon: Icon, title, description }) => <article className="outcome-card" key={title}><span><Icon size={20} /></span><div><h3>{title}</h3><p>{description}</p></div><CheckCircle2 className="outcome-card__check" size={17} aria-hidden="true" /></article>)}</div>
    </section>
    {lightboxOpen && <ImageLightbox items={[previewItem]} index={0} onIndexChange={() => {}} onClose={() => setLightboxOpen(false)} t={t} opener={lightboxOpener} />}
  </div>
}
