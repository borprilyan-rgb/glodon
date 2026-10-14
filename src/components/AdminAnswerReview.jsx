import { useEffect, useState } from 'react'
import { fetchAdminAssessmentReview } from '../firebase/adminAssessmentReview.js'

const copy = {
  en: { title: 'Answer review', expected: 'Expected answer', points: 'points', stored: 'Stored answers' },
  id: { title: 'Tinjauan jawaban', expected: 'Jawaban yang diharapkan', points: 'poin', stored: 'Jawaban tersimpan' },
}

function AnswerList({ items }) {
  return <dl className="admin-answer-fields">{items.map(item => <div key={item.label}><dt>{item.label}:</dt><dd>{item.value}</dd></div>)}</dl>
}

export default function AdminAnswerReview({ record, language }) {
  const c = copy[language]
  const [response, setResponse] = useState(null)
  useEffect(() => {
    let alive = true
    fetchAdminAssessmentReview(record.attemptId, language)
      .then(review => { if (alive) setResponse({ attemptId: record.attemptId, language, review }) })
      .catch(() => { if (alive) setResponse({ attemptId: record.attemptId, language, error: true }) })
    return () => { alive = false }
  }, [record.attemptId, language])
  if (!response || response.attemptId !== record.attemptId || response.language !== language) return <p role="status">{language === 'en' ? 'Loading answer review…' : 'Memuat tinjauan jawaban…'}</p>
  if (response.error) return <p role="alert">{language === 'en' ? 'Unable to load answer review. Close and reopen the details to retry.' : 'Tinjauan jawaban belum dapat dimuat. Tutup dan buka kembali detail untuk mencoba lagi.'}</p>
  const { review } = response
  return <section className="admin-answer-review" aria-label={c.title}>
    <h2>{c.title}</h2>
    {review.available ? <ol>{review.questions.map(question => <li key={question.id} className="admin-answer-question">
      <h3>{question.title}</h3>
      <p className={`admin-answer-status is-${question.status}`}>{question.statusLabel} <span>{question.earned} / {question.maximum} {c.points}</span></p>
      <AnswerList items={question.answers} />
      {question.expected.length > 0 && <div className="admin-answer-expected"><h4>{c.expected}</h4><AnswerList items={question.expected} /></div>}
      {question.explanation && <p className="admin-answer-explanation">{question.explanation}</p>}
    </li>)}</ol> : <><p className="admin-answer-fallback" role="status">{review.message}</p>{review.stored.length > 0 && <><h3>{c.stored}</h3><AnswerList items={review.stored} /></>}</>}
  </section>
}
