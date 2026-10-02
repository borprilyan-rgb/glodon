import { ArrowLeft, ArrowRight, ClipboardCheck } from 'lucide-react'
import CourseScores from './CourseScores'

export default function ExerciseHub({ language, profile, scores }) {
  const en = language === 'en'
  const products = ['tas', 'trb', 'tme']
  const label = product => product === 'tme' ? 'TME-C' : product.toUpperCase()
  return <div className="course-hub exercise-hub">
    <header className="course-hub__intro"><span className="eyebrow">{en ? 'Assessment' : 'Evaluasi'}</span><h1>{en ? 'Cubicost Exercises' : 'Latihan Cubicost'}</h1><p>{en ? 'Choose an application to take a test, then review your scores below.' : 'Pilih aplikasi untuk mengerjakan tes, lalu tinjau nilai Anda di bawah.'}</p></header>
    <section className="hub-course-grid" aria-label={en ? 'Choose a test' : 'Pilih tes'}>{products.map(product => {
      const completed = scores.filter(score => score.exercise.product === product).length
      return <article className="hub-course-card exercise-hub__card" key={product}>
        <span className="product-mark"><img src={`/branding/cubicost-${product}-logo.png`} alt={`Cubicost ${label(product)}`} /></span>
        <h2>Cubicost {label(product)}</h2>
        <p>{product === 'tme' ? (en ? 'Tests are not available yet.' : 'Tes belum tersedia.') : (en ? `${completed} of 3 section tests completed` : `${completed} dari 3 tes bagian selesai`)}</p>
        <a className="primary-button" href={`/${product}/tests`}><ClipboardCheck size={17} aria-hidden="true" />{product === 'tme' ? (en ? 'View Availability' : 'Lihat Ketersediaan') : (en ? 'Open Tests' : 'Buka Tes')}<ArrowRight size={16} aria-hidden="true" /></a>
      </article>
    })}</section>
    <section className="exercise-hub__scores" aria-labelledby="test-score-overview"><h2 id="test-score-overview">{en ? 'Test score overview' : 'Ringkasan nilai tes'}</h2>
      <div className="hub-course-grid">{products.map(product => <div key={product}><h3>Cubicost {label(product)}</h3><CourseScores product={product} language={language} profile={profile} scores={scores.filter(score => score.exercise.product === product)} /></div>)}</div>
    </section>
    <a className="outline-nav-button" href="/"><ArrowLeft size={16} aria-hidden="true" />{en ? 'Back to learning' : 'Kembali ke pembelajaran'}</a>
  </div>
}
