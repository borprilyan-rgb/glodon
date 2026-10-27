import { useState } from 'react'
import { downloadScoreCard } from '../data/downloadScoreCard'
import ParticipantDetails from './ParticipantDetails'
import { Download } from 'lucide-react'
import { getSectionExercise } from '../data/sectionExercises'
import { scoreLabel, scoreStatus } from '../data/testScores'
import { getTasData } from '../data/tas'
import { getTmeData } from '../data/tme'
import { getTrbData } from '../data/trb'

export default function CourseScores({ product, scores, language, profile }) {
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
    started: exercise.load().started,
    title: sectionTitle(exercise),
  }))
  const completed = rows.filter(row => row.result).length
  const progress = { completed, total: rows.length }
  const progressLabel = en ? 'Course assessment progress' : 'Progres asesmen kursus'
  const completionLabel = en
    ? `${completed} of ${rows.length} assessments completed`
    : `${completed} dari ${rows.length} asesmen selesai`
  async function download() {
    setDownloading(true)
    setDownloadFailed(false)
    try {
      await downloadScoreCard({ product, profile, language, progress, rows: rows.map(({ exercise, result, started, title }) => ({
        section: exercise.section,
        title,
        result,
        started,
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
      <div className="course-scores__progress" aria-label={`${progressLabel}: ${completionLabel}`}>
        <div><strong>{progressLabel}</strong><span>{completionLabel}</span></div>
        <progress value={completed} max={rows.length} aria-label={progressLabel}>{completed}/{rows.length}</progress>
      </div>
      <ul>{rows.map(({ exercise, result, started, title }) => {
        return <li key={exercise.path}>
          <div className="course-scores__row"><a href={exercise.path}>{en ? 'Section' : 'Bagian'} {exercise.section}: {title}</a><strong>{result?.total ?? 0}/100</strong></div>
        <span className={result ? (result.passed ? 'course-scores__passed' : 'course-scores__review') : 'course-scores__pending'}>{result ? scoreStatus(result, language) : started ? en ? 'In progress' : 'Sedang dikerjakan' : en ? 'Not started' : 'Belum dikerjakan'}</span>
        {result && !result.criticalPassed && <p>{exercise.copy[language].critical}</p>}
      </li>
      })}</ul>
      <button type="button" className="score-download" disabled={!scores.length || downloading} onClick={download}><Download size={16} aria-hidden="true" />{downloading ? (en ? 'Preparing Image?' : 'Menyiapkan Gambar?') : (en ? 'Download Score Card' : 'Unduh Kartu Nilai')}</button>
      {downloadFailed && <p role="alert">{en ? 'The image could not be downloaded. Please try again.' : 'Gambar tidak dapat diunduh. Silakan coba lagi.'}</p>}
      </> : <p>{en ? 'Exercises are not available for this course yet.' : 'Latihan untuk kursus ini belum tersedia.'}</p>}
    </div>
  </section>
}
