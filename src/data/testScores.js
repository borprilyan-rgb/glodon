import { getSectionExercise } from './sectionExercises'

export const scoreLabel = (language) => language === 'en' ? 'Score' : 'Nilai'
export const scoreStatus = (result, language) => !result
  ? (language === 'en' ? 'Test not done yet' : 'Tes belum dikerjakan')
  : language === 'en' ? (result.passed ? 'Passed' : 'Not passed') : (result.passed ? 'Lulus' : 'Belum lulus')

export function readTestScores() {
  return ['tas', 'trb'].flatMap((product) => [1, 2, 3].flatMap((section) => {
    const exercise = getSectionExercise(product, section)
    const current = exercise.load()
    let saved
    try { saved = JSON.parse(localStorage.getItem(`${exercise.storageKey}:result`)) } catch { /* Use current submission when storage is unavailable. */ }
    const answers = current.submitted ? current.answers : saved?.answers
    if (!answers || !exercise.copy.en.questions.every((_, index) => exercise.answered(index, answers))) return []
    return [{ exercise, result: exercise.score(answers) }]
  }))
}

export function saveTestScore(exercise, answers) {
  localStorage.setItem(`${exercise.storageKey}:result`, JSON.stringify({ answers }))
}
