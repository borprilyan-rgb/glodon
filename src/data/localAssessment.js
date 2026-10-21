import grading from '../assessments/localGrading.json'

// Temporary browser-only practice grading. No centrally verified result or upload.
export function localAssessment(form) {
  if (!form) return null
  const rules = grading[form.versionId]
  if (!rules) throw new Error(`Missing local grading rules: ${form.versionId}`)
  const questions = form.copy.en.questions
  const issues = (index, answers) => questions[index]?.options.some(([value]) => value === answers[questions[index].id])
    ? [] : [{ field: questions[index]?.id, reason: 'missing' }]
  const answered = (index, answers) => issues(index, answers).length === 0
  const score = answers => {
    const scores = questions.map((question, index) => answers[question.id] === rules.answers[question.id] ? rules.points[index] : 0)
    const total = scores.reduce((sum, value) => sum + value, 0)
    return { scores, total, criticalPassed: true, passed: total >= rules.minimum }
  }
  const load = () => {
    const empty = { started: false, submitted: false, index: 0, answers: {} }
    try {
      const saved = JSON.parse(localStorage.getItem(form.storageKey))
      if (!saved || typeof saved !== 'object') return empty
      const answers = Object.fromEntries(questions.filter(question => question.options.some(([value]) => value === saved.answers?.[question.id])).map(question => [question.id, saved.answers[question.id]]))
      return {
        started: Boolean(saved.started),
        submitted: Boolean(saved.started && saved.submitted) && questions.every((_, index) => answered(index, answers)),
        index: Math.max(0, Math.min(questions.length - 1, Number.isInteger(saved.index) ? saved.index : 0)),
        answers,
      }
    } catch { return empty }
  }
  return { ...form, points: rules.points, issues, answered, score, load }
}
