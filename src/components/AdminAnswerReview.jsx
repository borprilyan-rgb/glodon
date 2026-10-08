import { reviewAssessment } from '../data/assessmentReview.js'

const copy = {
  en: { title: 'Answer review', expected: 'Expected answer', points: 'points', stored: 'Stored answers' },
  id: { title: 'Tinjauan jawaban', expected: 'Jawaban yang diharapkan', points: 'poin', stored: 'Jawaban tersimpan' },
}

function AnswerList({ items }) {
  return <dl className="admin-answer-fields">{items.map(item => <div key={item.label}><dt>{item.label}:</dt><dd>{item.value}</dd></div>)}</dl>
}

export default function AdminAnswerReview({ record, language }) {
  const c = copy[language]
  const review = reviewAssessment(record, language)
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
