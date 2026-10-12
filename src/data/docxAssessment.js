import { tasDocxSource, trbDocxSource } from './docxTestSource.js'

const sectionNames = { tas: tasDocxSource, trb: trbDocxSource }
const questionPoints = [20, 20, 20, 20, 20]
const passScore = 70

function interfaceCopy(product, section, source) {
  const productName = product.toUpperCase()
  const sectionTitle = source.sections[section - 1].title
  const shared = {
    title: source.title,
    sectionTitle,
    badge: `${productName} · ${sectionTitle}`,
    entry: sectionTitle,
    intro: '',
    duration: '',
    passRule: product === 'trb' ? (source.passScoreNote || '') : '',
    scope: '',
    brief: '',
    guide: '',
    briefItems: [],
    start: 'Mulai Tes',
    resume: 'Lanjutkan Tes',
    question: 'Pertanyaan',
    points: 'poin',
    previous: 'Sebelumnya',
    next: 'Pertanyaan Berikutnya',
    submit: 'Kirim Jawaban',
    select: 'Pilih jawaban',
    required: 'Pilih satu jawaban.',
    correct: 'Benar',
    review: 'Perlu ditinjau',
    result: 'Hasil Tes',
    passed: 'Lulus',
    notPassed: 'Belum lulus',
    critical: '',
    retry: 'Coba Lagi',
    reviewLesson: 'Tinjau Materi',
    newTab: 'dibuka di tab baru',
    course: 'Kembali ke Kursus',
    noStorage: 'Penyimpanan browser tidak tersedia. Biarkan halaman ini terbuka sampai selesai.',
    summary: 'Hasil per pertanyaan',
    reference: '',
    project: '',
    ground: '',
    ruleSet: '',
    floor1: '',
    floor2: '',
    grade: '',
    copy: '',
    actualLength: '',
    verify: '',
    grid: '',
    alignmentCheck: '',
    dataLabels: {},
  }
  return {
    id: { ...shared },
    // The source document contains Indonesian wording only. Preserve it
    // verbatim in English mode rather than creating unapproved translations.
    en: {
      ...shared,
      start: 'Start Test',
      resume: 'Resume Test',
      question: 'Question',
      points: 'points',
      previous: 'Previous',
      next: 'Next Question',
      submit: 'Submit Answers',
      select: 'Select an answer',
      required: 'Choose one answer.',
      correct: 'Correct',
      review: 'Needs review',
      result: 'Test result',
      passed: 'Passed',
      notPassed: 'Not passed',
      retry: 'Try Again',
      reviewLesson: 'Review Lesson',
      newTab: 'opens in a new tab',
      course: 'Back to Course',
      noStorage: 'Browser saving is unavailable. Keep this page open until you finish.',
      summary: 'Question results',
    },
  }
}

export function createDocxAssessment(product, section) {
  const source = sectionNames[product]
  const sectionSource = source?.sections[section - 1]
  if (!source || !sectionSource) return null
  const storageKey = `cubicost:${product}:section-${section}-exercise:v3`
  const questions = sectionSource.questions.map(([title, ...rest], index) => {
    const answer = rest.pop()
    return {
      id: `q${index + 1}`,
      type: 'choice',
      topic: `${sectionSource.title} · ${index + 1}`,
      title,
      options: rest.map((text, option) => [String.fromCharCode(65 + option), text]),
      explanation: '',
      expected: answer,
    }
  })
  const correct = questions.map(question => question.expected)
  const copy = Object.fromEntries(['en', 'id'].map(language => [language, {
    ...interfaceCopy(product, section, source)[language],
    questions,
    badge: product.toUpperCase(),
    product,
  }]))
  const points = questionPoints.slice(0, questions.length)
  const expectedAnswers = Object.fromEntries(correct.map((answer, index) => [`q${index + 1}`, answer]))
  const issues = (index, answers) => questions[index] && correct[index] && ['A', 'B', 'C'].includes(answers[`q${index + 1}`])
    ? [] : [{ field: `q${index + 1}`, reason: 'missing' }]
  const answered = (index, answers) => issues(index, answers).length === 0
  const score = answers => {
    const scores = correct.map((answer, index) => answers[`q${index + 1}`] === answer ? points[index] : 0)
    const total = scores.reduce((sum, value) => sum + value, 0)
    return { scores, total, criticalPassed: true, passed: total >= passScore }
  }
  const load = () => {
    const empty = { started: false, submitted: false, index: 0, answers: {} }
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey))
      if (!saved || typeof saved !== 'object') return empty
      const answers = Object.fromEntries(correct.map((_, index) => [`q${index + 1}`, saved.answers?.[`q${index + 1}`]]).filter(([, value]) => typeof value === 'string' && ['A', 'B', 'C'].includes(value)))
      return {
        started: Boolean(saved.started),
        submitted: Boolean(saved.started && saved.submitted) && correct.every((_, index) => answered(index, answers)),
        index: Math.max(0, Math.min(questions.length - 1, Number.isInteger(saved.index) ? saved.index : 0)),
        answers,
      }
    } catch { return empty }
  }
  return {
    product,
    section,
    sectionTitle: sectionSource.title,
    path: `/${product}/tests/section-${section}`,
    copy,
    storageKey,
    load,
    issues,
    answered,
    points,
    score,
    expectedAnswers,
    docxSource: true,
  }
}
