import { getSectionExercise } from './sectionExercises.js'

const copy = {
  en: { answer: 'Answer', missing: 'Not answered', unknown: 'Unknown option', unavailable: 'The question definitions for this saved assessment are unavailable. Stored answers are shown without interpretation or correctness.', malformed: 'This saved answer data cannot be reviewed.', correct: 'Correct', incorrect: 'Incorrect', partial: 'Partially correct' },
  id: { answer: 'Jawaban', missing: 'Belum dijawab', unknown: 'Pilihan tidak dikenal', unavailable: 'Definisi pertanyaan untuk penilaian tersimpan ini tidak tersedia. Jawaban tersimpan ditampilkan tanpa penafsiran atau penilaian benar/salah.', malformed: 'Data jawaban tersimpan ini tidak dapat ditinjau.', correct: 'Benar', incorrect: 'Salah', partial: 'Sebagian benar' },
}

// Use only the definition whose persisted version matches. Older definitions
// are not retained in this checkout; never apply current questions to them.
export function resolveAssessment(course, section, version) {
  const exercise = getSectionExercise(course, section)
  return exercise && exercise.storageKey.match(/:(v\d+)$/)?.[1] === version ? exercise : null
}

function answerFields(question, c, reviewCopy) {
  const field = (name, label, options) => ({ name, label, options })
  const choice = (name = question.id, label = reviewCopy.answer) => field(name, label, question.options)
  switch (question.type) {
    case 'choice': return [choice()]
    case 'dimensions':
    case 'quantity': return [...question.fields, choice()]
    case 'project': return [field('projectName', c.project), field('ground', c.ground), field('ruleSet', c.ruleSet)]
    case 'floors': return [field('height1', c.floor1), field('height2', c.floor2), field('grade', c.grade), field('copy', c.copy, [['yes', c.yes], ['no', c.no]])]
    case 'scale': return [field('length', c.actualLength), choice('verify', c.verify)]
    case 'grid': return [field('grid', c.grid), choice('alignmentCheck', c.alignmentCheck)]
    default: return []
  }
}

function formatAnswer(field, value, c) {
  if (value === undefined || value === null || String(value).trim() === '') return { label: field.label, value: c.missing }
  const text = String(value)
  if (field.options) return { label: field.label, value: field.options.find(([key]) => String(key) === text)?.[1] ?? `${c.unknown}: ${text}` }
  const unit = field.label.match(/\s*\((mm|m|m³|kg|t)\)$/)?.[1]
  return unit
    ? { label: field.label.replace(/\s*\([^()]+\)$/, ''), value: `${text.trim().replace(unit === 'm³' ? /\s*m(?:³|3|\^3)$/i : new RegExp(`\\s*${unit}$`, 'i'), '').trim()} ${unit}` }
    : { label: field.label, value: text }
}

export function reviewAssessment(record, language = 'id') {
  const c = copy[language]
  const exercise = resolveAssessment(record.course, record.section, record.assessmentVersion)
  const answers = record.answers
  const valid = answers && typeof answers === 'object' && !Array.isArray(answers) && Object.values(answers).every(value => typeof value === 'string')
  if (!exercise || !valid) return {
    available: false, message: exercise ? c.malformed : c.unavailable,
    stored: valid ? Object.entries(answers).map(([label, value]) => ({ label, value })) : [],
  }
  const definition = exercise.copy[language]
  // Exactly the scorer used by the participant's result review, including
  // partial credit, unit parsing and critical-question point allocations.
  const result = exercise.score(answers)
  return { available: true, questions: definition.questions.map((question, index) => {
    const fields = answerFields(question, definition, c)
    const earned = result.scores[index]
    const maximum = exercise.points[index]
    const status = earned === maximum ? 'correct' : earned > 0 ? 'partial' : 'incorrect'
    return {
      id: question.id, title: question.title, earned, maximum, status, statusLabel: c[status],
      answers: fields.map(field => formatAnswer(field, answers[field.name], c)),
      expected: status === 'correct' ? [] : fields.filter(field => exercise.expectedAnswers?.[field.name] !== undefined).map(field => formatAnswer(field, exercise.expectedAnswers[field.name], c)),
      explanation: status === 'correct' ? null : question.explanation,
    }
  }) }
}
