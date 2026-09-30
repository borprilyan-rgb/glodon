import { ChevronDown } from 'lucide-react'
import { getSectionExercise } from '../data/sectionExercises'
import { scoreLabel } from '../data/testScores'
import { getTasData } from '../data/tas'
import { getTrbData } from '../data/trb'

export default function CourseScores({ product, scores, language, studentName = '' }) {
  const en = language === 'en'
  const parts = (product === 'tas' ? getTasData(language) : product === 'trb' ? getTrbData(language) : null)?.tutorialParts || []
  const sections = [1, 2, 3].map(section => getSectionExercise(product, section)).filter(Boolean)
  return <details className="course-scores" open={new URLSearchParams(window.location.search).get('scores') === product || undefined}>
    <summary>{scoreLabel(language)}<ChevronDown size={18} aria-hidden="true" /></summary>
    <div className="course-scores__content">
      {studentName && <p className="course-scores__student"><span>{en ? 'Name' : 'Nama'}</span><strong>{studentName}</strong></p>}
      {sections.length ? <>
      <p>{en ? 'Section test scores' : 'Nilai tes setiap bagian'}</p>
      <ul>{sections.map(exercise => {
        const result = scores.find(score => score.exercise.path === exercise.path)?.result
        return <li key={exercise.path}>
        <div className="course-scores__row"><a href={exercise.path}>{en ? 'Section' : 'Bagian'} {exercise.section}: {parts[exercise.section - 1].title}</a><strong>{result?.total ?? 0}/100</strong></div>
        <span className={!result ? 'course-scores__pending' : result.passed ? 'course-scores__passed' : 'course-scores__review'}>{!result ? (en ? 'Test not done yet' : 'Tes belum dikerjakan') : en ? (result.passed ? 'Passed' : 'Not passed') : (result.passed ? 'Lulus' : 'Belum lulus')}</span>
        {result && !result.criticalPassed && <p>{exercise.copy[language].critical}</p>}
      </li>
      })}</ul>
      <small>{en ? 'Saved only in this browser.' : 'Hanya tersimpan di browser ini.'}</small>
      </> : <p>{en ? 'Tests are not available for this course yet.' : 'Tes untuk kursus ini belum tersedia.'}</p>}
    </div>
  </details>
}
