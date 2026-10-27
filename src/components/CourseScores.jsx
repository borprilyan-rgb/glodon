import { useState } from 'react'
import { downloadScoreCard } from '../data/downloadScoreCard'
import ParticipantDetails from './ParticipantDetails'
import { Download } from 'lucide-react'
import { getSectionExercise } from '../data/sectionExercises'
import { scoreLabel, scoreStatus } from '../data/testScores'
import { getTasData } from '../data/tas'
import { getTmeData } from '../data/tme'
import { getTrbData } from '../data/trb'

export default function CourseScores({ product, scores, language, profile, courseProgress = { completed: 0, total: 0 } }) {
  const en = language === 'en'
  const [downloading, setDownloading] = useState(false)
  const [downloadFailed, setDownloadFailed] = useState(false)
  const parts = (product === 'tas' ? getTasData(language) : product === 'trb' ? getTrbData(language) : product === 'tme' ? getTmeData(language) : null)?.tutorialParts || []
  const sections = [1, 2, 3].map(section => getSectionExercise(product, section)).filter(Boolean)
  const sectionTitle = exercise => product === 'tas' || product === 'trb'
    ? exercise.copy[language].sectionTitle
    : product === 'tme' ? exercise.copy[language].title : parts[exercise.section - 1].title
  const rows = sections.map(exercise => ({
    exercise,
    result: scores.find(score => score.exercise.path === exercise.path)?.result,
    title: sectionTitle(exercise),
  }))
  const progressLabel = en ? 'Course learning progress' : 'Progres belajar kursus'
  const completionLabel = en
    ? `${courseProgress.completed} of ${courseProgress.total} steps`
    : `${courseProgress.completed} dari ${courseProgress.total} langkah`
  async function download() {
    setDownloading(true)
    setDownloadFailed(false)
    try {
      await downloadScoreCard({ product, profile, language, progress: courseProgress, rows: rows.map(({ exercise, result, title }) => ({
        section: exercise.section,
        title,
        result,
        critical: exercise.copy[language].critical,
      })) })
    } catch { setDownloadFailed(true) }
    finally { setDownloading(false) }
  }
  const productLabel = product === 'tme' ? 'TME-C' : product.toUpperCase()
  return <section className="course-scores" aria-label={`${scoreLabel(language)}: Cubicost ${productLabel}`}>
    <header className="course-scores__identity">
      <img className="course-scores__logo" src={`/branding/cubicost-${product}-logo.png`} alt={`Cubicost ${productLabel}`} />
      <ParticipantDetails profile={profile} language={language} />
    </header>
    <div className="course-scores__content">
      {sections.length ? <>
      <div className="course-scores__progress" aria-label={`${progressLabel}: ${completionLabel}`}>
        <div><strong>{progressLabel}</strong><span>{completionLabel}</span></div>
        <progress value={courseProgress.completed} max={courseProgress.total || 1} aria-label={progressLabel}>{completionLabel}</progress>
      </div>
      <ul>{rows.map(({ exercise, result, title }) => {
        return <li key={exercise.path}>
          <div className="course-scores__row"><a href={exercise.path}>{en ? 'Section' : 'Bagian'} {exercise.section}: {title}</a><strong>{result?.total ?? 0}/100</strong></div>
        {result && <span className={result.passed ? 'course-scores__passed' : 'course-scores__review'}>{scoreStatus(result, language)}</span>}
        {result && !result.criticalPassed && <p>{exercise.copy[language].critical}</p>}
      </li>
      })}</ul>
      <button type="button" className="score-download" disabled={!scores.length || downloading} onClick={download}><Download size={16} aria-hidden="true" />{downloading ? (en ? 'Preparing Image?' : 'Menyiapkan Gambar?') : (en ? 'Download Score Card' : 'Unduh Kartu Nilai')}</button>
      {downloadFailed && <p role="alert">{en ? 'The image could not be downloaded. Please try again.' : 'Gambar tidak dapat diunduh. Silakan coba lagi.'}</p>}
      </> : <p>{en ? 'Exercises are not available for this course yet.' : 'Latihan untuk kursus ini belum tersedia.'}</p>}
    </div>
  </section>
}
