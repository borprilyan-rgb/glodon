import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ScreenshotNavigation({ current, total, onPrevious, onNext, t, compact = false }) {
  return <div className={`screenshot-navigation ${compact ? 'screenshot-navigation--compact' : ''}`} aria-label={t.screenshotNavigation}>
    <button type="button" onClick={onPrevious} disabled={current === 0} aria-label={t.previousImage}><ChevronLeft size={18} /><span>{t.previousImage}</span></button>
    <strong aria-live="polite">{t.imageCount(current + 1, total)}</strong>
    <button type="button" onClick={onNext} disabled={current === total - 1} aria-label={t.nextImage}><span>{t.nextImage}</span><ChevronRight size={18} /></button>
  </div>
}
