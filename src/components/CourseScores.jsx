import { useState } from 'react'
import { downloadScoreCard } from '../data/downloadScoreCard'
import ParticipantDetails from './ParticipantDetails'
import { Download } from 'lucide-react'
import { getSectionExercise } from '../data/sectionExercises'
import { scoreLabel, scoreStatus } from '../data/testScores'
import { getTasData } from '../data/tas'
import { getTrbData } from '../data/trb'

export default function CourseScores({ product, scores, language, profile }) {
  const en = language === 'en'
  const [downloading, setDownloading] = useState(false)
  const [downloadFailed, setDownloadFailed] = useState(false)
  const parts = (product === 'tas' ? getTasData(language) : product === 'trb' ? getTrbData(language) : null)?.tutorialParts || []
  const sections = [1, 2, 3].map(section => getSectionExercise(product, section)).filter(Boolean)
  async function download() {
    setDownloading(true)
    setDownloadFailed(false)
    try {
      await downloadScoreCard({ product, profile, language, rows: sections.map(exercise => ({
        section: exercise.section,
        title: parts[exercise.section - 1].title,
        result: scores.find(score => score.exercise.path === exercise.path)?.result,
        critical: exercise.copy[language].critical,
      })) })
    } catch { setDownloadFailed(true) }
    finally { setDownloading(false) }
  }
  return <section className="course-scores" aria-labelledby={`score-heading-${product}`}>
    <h2 className="course-scores__heading" id={`score-heading-${product}`}>{scoreLabel(language)}</h2>
    <div className="course-scores__content">
      <ParticipantDetails profile={profile} language={language} />
      {sections.length ? <>
      <ul>{sections.map(exercise => {
        const result = scores.find(score => score.exercise.path === exercise.path)?.result
        return <li key={exercise.path}>
        <div className="course-scores__row"><a href={exercise.path}>{en ? 'Section' : 'Bagian'} {exercise.section}: {parts[exercise.section - 1].title}</a><strong>{result?.total ?? 0}/100</strong></div>
        <span className={!result ? 'course-scores__pending' : result.passed ? 'course-scores__passed' : 'course-scores__review'}>{scoreStatus(result, language)}</span>
        {result && !result.criticalPassed && <p>{exercise.copy[language].critical}</p>}
      </li>
      })}</ul>
      <button type="button" className="score-download" disabled={!scores.length || downloading} onClick={download}><Download size={16} aria-hidden="true" />{downloading ? (en ? 'Preparing Image?' : 'Menyiapkan Gambar?') : (en ? 'Download Score Card' : 'Unduh Kartu Nilai')}</button>
      {downloadFailed && <p role="alert">{en ? 'The image could not be downloaded. Please try again.' : 'Gambar tidak dapat diunduh. Silakan coba lagi.'}</p>}
      </> : <p>{en ? 'Exercises are not available for this course yet.' : 'Latihan untuk kursus ini belum tersedia.'}</p>}
    </div>
  </section>
}
