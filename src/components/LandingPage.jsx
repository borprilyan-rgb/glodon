import { useState } from 'react'
import { ArrowRight, BookOpen, CheckCircle2, FileCheck2, Image, Layers3, Maximize2 } from 'lucide-react'
import { getProductConfig } from '../data/productConfig'
import { getStepPath } from '../data/tutorialUtils'
import ImageLightbox from './ImageLightbox'
import ProgressBar from './ProgressBar'

const outcomeIcons = [BookOpen, Layers3, FileCheck2]

export default function LandingPage({ allSteps = [], completed = new Set(), started = new Set(), continueStep, product = 'tas', course, t }) {
  const [imageAvailable, setImageAvailable] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxOpener, setLightboxOpener] = useState(null)
  const config = getProductConfig(product, t, course)
  const isComplete = allSteps.length > 0 && completed.size === allSteps.length
  const isReturning = !isComplete && (started.size > 0 || completed.size > 0)
  const state = isComplete ? 'complete' : isReturning ? 'returning' : 'new'
  const heading = config.welcomeTitle || t.landingHeading[state]
  const progressLesson = isComplete ? allSteps[0] : continueStep
  const previewItem = { image: config.preview, alt: t.productPreviewAlt(config.name), label: t.previewLabel, caption: t.productPreviewCaption(config.name) }

  return <div className="landing-page" data-product={product}>
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-hero__copy">
        <div className="landing-product-label"><span><img src={config.logo} alt={config.name} onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.nextElementSibling.hidden = false }} /><span className="product-logo-fallback" hidden>{config.shortName}</span></span><span className="eyebrow">{config.welcomeEyebrow}</span></div>
        <h1 id="landing-title">{heading}</h1>
        <p>{config.welcomeText}</p>
        <div className="landing-actions">
          <a className="primary-button" href={getStepPath(progressLesson, product)}>{t.landingPrimary[state]}<ArrowRight size={17} /></a>
          <a className="secondary-button" href={config.courseRoute}>{t.viewCourseMap}</a>
        </div>
        <a className="landing-contact-link" href="/contact">{t.stillNeedHelp} {t.contactUs}</a>
        <p className="landing-course-info">{t.learningSummary(config.partCount, allSteps.length)}</p>
        <aside className="landing-progress" aria-label={t.overallProgress}>
          <ProgressBar completed={completed.size} total={allSteps.length} t={t} />
          <p><span>{t.currentOrNextLesson}</span><strong>{progressLesson?.title}</strong></p>
        </aside>
      </div>
      <div className="landing-preview">
        {imageAvailable ? <button className="landing-preview__image" type="button" onClick={(event) => { setLightboxOpener(event.currentTarget); setLightboxOpen(true) }} aria-label={t.enlargeProductPreview(config.name)}>
          <img src={config.preview} alt={t.productPreviewAlt(config.name)} onError={() => setImageAvailable(false)} />
          <span><Maximize2 size={16} />{t.enlargeImage}</span>
        </button> : <div className="landing-preview__placeholder" role="img" aria-label={t.productPreviewAlt(config.name)}>
          <span className="landing-preview__placeholder-icon"><Image size={28} /></span>
          <div><strong>{config.name}</strong><p>{t.previewUnavailable}</p><code>welcome-preview.webp</code></div>
        </div>}
        <p className="landing-preview__caption">{t.productPreviewCaption(config.name)}</p>
      </div>
    </section>
    <section className="learning-outcomes" aria-labelledby="outcomes-title">
      <div className="section-heading"><span className="eyebrow">{config.name}</span><h2 id="outcomes-title">{t.whatYouWillLearn}</h2></div>
      <div className="outcome-grid">{config.outcomes.map(({ title, description }, index) => {
        const Icon = outcomeIcons[index]
        return <article className="outcome-card" key={title}><span><Icon size={20} /></span><div><h3>{title}</h3><p>{description}</p></div><CheckCircle2 className="outcome-card__check" size={17} aria-hidden="true" /></article>
      })}</div>
    </section>
    {lightboxOpen && <ImageLightbox items={[previewItem]} index={0} onIndexChange={() => {}} onClose={() => setLightboxOpen(false)} t={t} opener={lightboxOpener} />}
  </div>
}
