import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, RotateCcw } from 'lucide-react'
import { getSectionExercise } from '../data/sectionExercises'
import '../styles/exercise.css'

function OfficePlan({ c, value, onSelect }) {
  return <div className="exercise-plan">
    <svg viewBox="0 0 600 350" role="img" aria-label={c.diagram}>
      <rect x="140" y="70" width="320" height="190" fill="#eaf3ff" stroke="#153d61" strokeWidth="6" />
      <path d="M 140 45 V 285 M 460 45 V 285 M 115 70 H 500 M 115 260 H 500" stroke="#5481a2" strokeDasharray="6 5" fill="none" />
      <path d="M 140 299 V 314 M 460 299 V 314 M 140 307 H 460 M 85 70 H 100 M 85 260 H 100 M 92 70 V 260" fill="none" stroke="#5481a2" />
      <g fill="#163453" fontFamily="sans-serif" fontSize="22" textAnchor="middle"><text x="140" y="30">A</text><text x="460" y="30">B</text><text x="520" y="78">2</text><text x="520" y="268">1</text><text x="300" y="337">6,000 mm</text><text x="58" y="165" transform="rotate(-90 58 165)">4,000 mm</text></g>
      {!onSelect && <circle cx="140" cy="260" r="9" fill="#147ed0" />}
    </svg>
    {onSelect && <div role="group" aria-label={c.grid}>{[['A/1', 140, 260], ['A/2', 140, 70], ['B/1', 460, 260], ['B/2', 460, 70]].map(([point, x, y]) => <button key={point} type="button" className="exercise-grid-point" style={{ left: `${x / 6}%`, top: `${y / 3.5}%` }} aria-label={point} aria-pressed={value === point} onClick={() => onSelect(point)}><span aria-hidden="true">{value === point ? '✓' : '+'}</span></button>)}</div>}
  </div>
}

function Options({ field, legend, options, answers, onAnswer }) {
  return <fieldset className="exercise-options"><legend>{legend}</legend>{options.map(([value, text]) => <label key={value} className={answers[field] === value ? 'is-selected' : ''}><input type="radio" name={field} value={value} checked={answers[field] === value} onChange={() => onAnswer(field, value)} /><span>{text}</span></label>)}</fieldset>
}

export default function SectionExercise({ language, exercise = getSectionExercise('tas', 1) }) {
  const { copy, storageKey: exerciseStorageKey, load: loadExercise, issues: questionIssues, answered: questionAnswered, points: questionPoints, score: scoreExercise, product } = exercise
  const c = copy[language]
  const questionCount = c.questions.length
  const [state, setState] = useState(loadExercise)
  const [error, setError] = useState(false)
  const [saveFailed, setSaveFailed] = useState(false)
  const heading = useRef(null)
  const { index, answers, started, submitted } = state
  const question = c.questions[index]
  const issues = error ? questionIssues(index, answers) : []
  const labels = { projectName: c.project, ground: c.ground, ruleSet: c.ruleSet, height1: c.floor1, height2: c.floor2, grade: c.grade, copy: c.copy, length: c.actualLength, verify: c.verify, grid: c.grid, alignmentCheck: c.alignmentCheck }
  const validation = useRef(null)
  useEffect(() => { if (error) validation.current?.focus() }, [error, index])
  function navigate(nextIndex) {
    setState((current) => ({ ...current, index: nextIndex }))
    setError(false)
  }
  const result = submitted ? scoreExercise(answers) : null

  useEffect(() => {
    try { localStorage.setItem(exerciseStorageKey, JSON.stringify(state)) } catch { setSaveFailed(true) }
  }, [state, exerciseStorageKey])
  useEffect(() => { if (started) heading.current?.focus() }, [index, submitted, started])

  function answer(field, value) {
    setState((current) => ({ ...current, answers: { ...current.answers, [field]: value } }))
  }
  function advance(event) {
    event.preventDefault()
    if (!questionAnswered(index, answers)) { setError(true); return }
    if (index < questionCount - 1) { setState((current) => ({ ...current, index: current.index + 1 })); setError(false); return }
    const missing = c.questions.findIndex((_, questionIndex) => !questionAnswered(questionIndex, answers))
    if (missing !== -1) { setState((current) => ({ ...current, index: missing })); setError(true); return }
    setState((current) => ({ ...current, submitted: true }))
    setError(false)
  }
  function input(field, label, numeric = false) {
    return <label className="exercise-field">{label}<input name={field} value={answers[field] || ''} onChange={(event) => answer(field, event.target.value)} inputMode={numeric ? 'decimal' : undefined} maxLength={80} autoComplete="off" aria-invalid={issues.some((issue) => issue.field === field)} aria-required="true" /></label>
  }
  function select(field, label, options) {
    return <label className="exercise-field" htmlFor={`exercise-${field}`}>{label}<select id={`exercise-${field}`} aria-label={label} name={field} value={answers[field] || ''} onChange={(event) => answer(field, event.target.value)} aria-invalid={issues.some((issue) => issue.field === field)} aria-required="true"><option value="">{c.select}</option>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
  }

  const brief = exercise.officePlan ? <aside className="exercise-brief"><h2>{c.brief}</h2><dl><dt>{c.project}</dt><dd>ASG Training</dd><dt>{c.ground}</dt><dd>-0.5 m</dd><dt>{c.ruleSet}</dt><dd>SMPI</dd></dl><p>{c.briefFloors}</p><p>{c.briefDrawing}</p><p>{c.briefAlignment}</p><p>{c.briefSettings}</p><small>{c.ruleNote}</small><OfficePlan c={c} /><small>{c.reference}</small></aside> : <aside className="exercise-brief"><h2>{c.brief}</h2><p>{c.guide}</p><p className="exercise-pass-rule">{c.passRule}</p><p>{c.scope}</p></aside>

  return <article className="section-exercise">
    <header className="exercise-header"><span className="eyebrow">{c.badge}</span><h1>{c.title}</h1><p>{c.duration}</p></header>
    {!started ? <div className="exercise-layout"><section className="exercise-card"><ClipboardCheck size={34} /><h2>{c.entry}</h2><p>{c.intro}</p><p className="exercise-pass-rule">{c.passRule}</p><p>{c.scope}</p><button className="primary-button" type="button" onClick={() => setState((current) => ({ ...current, started: true }))}>{c.start}<ArrowRight size={18} /></button></section>{brief}</div> : submitted ? <>
      <section className={`exercise-card exercise-result ${result.passed ? 'is-passed' : ''}`}><span>{c.result}</span><h2 ref={heading} tabIndex={-1}>{result.passed ? c.passed : c.notPassed}</h2><strong className="exercise-score">{result.total}<small>/100</small></strong><p>{c.passRule}</p>{!result.criticalPassed && <p className="exercise-critical">{c.critical}</p>}<p>{c.scope}</p><button className="primary-button" type="button" onClick={() => { setState({ started: true, submitted: false, index: 0, answers: {} }); setError(false) }}><RotateCcw size={17} />{c.retry}</button></section>
      <section className="exercise-results" aria-label={c.summary}>{c.questions.map((item, itemIndex) => {
        const correct = result.scores[itemIndex] === questionPoints[itemIndex]
        return <article key={item.id} className="exercise-card"><div className="exercise-result-heading"><h3>{item.topic}</h3><strong>{result.scores[itemIndex]} / {questionPoints[itemIndex]}</strong></div><span className={correct ? 'exercise-correct' : 'exercise-review'}>{correct && <CheckCircle2 size={16} />}{correct ? c.correct : c.review}</span><p>{item.explanation}</p><a href={`/${product}/lesson/${item.lesson}`} target="_blank" rel="noopener noreferrer" aria-label={`${c.reviewLesson}: ${item.topic} (${c.newTab})`}>{c.reviewLesson} <span aria-hidden="true">↗</span></a></article>
      })}</section>
    </> : <div className="exercise-layout"><form className="exercise-card exercise-question" onSubmit={advance} noValidate>
      <div className="exercise-question-meta"><span>{c.question} {index + 1} / {questionCount}</span><span>{questionPoints[index]} {c.points}</span></div><progress value={index + 1} max={questionCount} aria-label={c.question} />
      <nav className="exercise-numbers" aria-label={language === 'en' ? 'Question navigation' : 'Navigasi pertanyaan'}>{c.questions.map((item, questionIndex) => {
        const complete = questionAnswered(questionIndex, answers)
        return <button type="button" key={item.id} aria-current={index === questionIndex ? 'step' : undefined} className={complete ? 'is-answered' : ''} aria-label={`${c.question} ${questionIndex + 1}: ${item.topic} (${language === 'en' ? (complete ? 'Answered' : 'Unanswered') : (complete ? 'Sudah dijawab' : 'Belum dijawab')})`} onClick={() => navigate(questionIndex)}>{questionIndex + 1}{complete && <CheckCircle2 size={12} aria-hidden="true" />}</button>
      })}</nav>
      <p className="exercise-topic">{question.topic}</p><h2 ref={heading} tabIndex={-1}>{question.title}</h2>
      {question.type === 'choice' && <Options field={question.id} legend={c.select} options={question.options} answers={answers} onAnswer={answer} />}
      {question.type === 'project' && <div className="exercise-fields">{input('projectName', c.project)}{input('ground', c.ground, true)}{select('ruleSet', c.ruleSet, [['SMPI', 'SMPI'], ['SMM', 'SMM'], ['NRM2', 'NRM2']])}</div>}
      {question.type === 'floors' && <><div className="exercise-fields">{input('height1', c.floor1, true)}{input('height2', c.floor2, true)}{select('grade', c.grade, [['K-250', 'K-250'], ['K-300', 'K-300'], ['K-350', 'K-350']])}</div><Options field="copy" legend={c.copy} options={[["yes", c.yes], ["no", c.no]]} answers={answers} onAnswer={answer} /></>}
      {question.type === 'scale' && <>{input('length', c.actualLength, true)}<small>{language === 'en' ? 'Millimetres: 6000, 6,000 or 6.000 are accepted.' : 'Milimeter: 6000, 6.000 atau 6,000 dapat digunakan.'}</small><Options field="verify" legend={c.verify} options={question.options} answers={answers} onAnswer={answer} /></>}
      {question.type === 'grid' && <><p>{c.grid}</p><OfficePlan c={c} value={answers.grid} onSelect={(value) => answer('grid', value)} /><p aria-live="polite">{answers.grid || '—'}</p><Options field="alignmentCheck" legend={c.alignmentCheck} options={question.options} answers={answers} onAnswer={answer} /></>}
      {issues.length > 0 && <div ref={validation} tabIndex={-1} role="alert" className="exercise-error"><strong>{language === 'en' ? 'Please check these answers:' : 'Periksa jawaban berikut:'}</strong><ul>{issues.map(({ field, reason }) => <li key={field}>{labels[field] || c.select}: {reason === 'number' ? (language === 'en' ? 'Enter a number, such as 3.5 or 3,5.' : 'Masukkan angka, misalnya 3,5 atau 3.5.') : (language === 'en' ? 'An answer is still needed.' : 'Jawaban belum diisi.')}</li>)}</ul></div>}
      <div className="exercise-navigation"><button className="secondary-button" type="button" disabled={index === 0} onClick={() => { setState((current) => ({ ...current, index: current.index - 1 })); setError(false) }}><ArrowLeft size={17} />{c.previous}</button><button className="primary-button" type="submit">{index === questionCount - 1 ? c.submit : c.next}<ArrowRight size={17} /></button></div>
    </form>{brief}</div>}
    <div className="exercise-bottom"><a href={`/${product}/course`}>{c.course}</a><small role="status">{saveFailed ? c.noStorage : c.saved}</small></div>
  </article>
}
