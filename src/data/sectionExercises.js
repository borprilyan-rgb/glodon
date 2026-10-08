import { createTrbSectionThreeExercise } from './trb/sectionThreeExercise.js'
import { createTrbSectionTwoExercise } from './trb/sectionTwoExercise.js'
import { createTrbSectionOneExercise } from './trb/sectionOneExercise.js'
import { createTmeSectionExercise } from './tme/sectionExercises.js'
import { createSectionThreeExercise } from './tas/sectionThreeExercise.js'
import { createSectionTwoExercise } from './tas/sectionTwoExercise.js'
import * as first from './tas/sectionOneExercise.js'
import { getTasData } from './tas/index.js'
import { getTmeData } from './tme/index.js'
import { getTrbData } from './trb/index.js'

const courses = { tas: getTasData, tme: getTmeData, trb: getTrbData }
const definitions = new Map()
export function getSectionExercise(product, section) {
  const key = `${product}-${section}`
  if (definitions.has(key)) return definitions.get(key)
  if (key === 'tas-1') {
    const definition = { product, section, path: '/tas/tests/section-1', copy: first.exerciseCopy, storageKey: first.exerciseStorageKey, load: first.loadExercise, issues: first.questionIssues, answered: first.questionAnswered, points: first.questionPoints, score: first.scoreExercise, expectedAnswers: first.expectedAnswers, officePlan: true }
    definitions.set(key, definition)
    return definition
  }
  if (product === 'tme' && section >= 1 && section <= 3) {
    const definition = createTmeSectionExercise(section)
    definitions.set(key, definition)
    return definition
  }
  if (key === 'tas-2') {
    const definition = createSectionTwoExercise(getTasData)
    definitions.set(key, definition)
    return definition
  }
  if (key === 'tas-3') {
    const definition = createSectionThreeExercise(getTasData)
    definitions.set(key, definition)
    return definition
  }
  if (key === 'trb-1') {
    const definition = createTrbSectionOneExercise(getTrbData)
    definitions.set(key, definition)
    return definition
  }
  if (key === 'trb-2') {
    const definition = createTrbSectionTwoExercise(getTrbData)
    definitions.set(key, definition)
    return definition
  }
  if (key === 'trb-3') {
    const definition = createTrbSectionThreeExercise(getTrbData)
    definitions.set(key, definition)
    return definition
  }
  return null
}

export function exerciseForLastLesson(product, lessonId) {
  const course = courses[product]?.('en')
  const index = course?.tutorialParts.findIndex((part) => part.steps.at(-1)?.id === lessonId)
  if (index < 0) return null
  const section = product === 'tme' ? (index === 0 ? 1 : index <= 4 ? 2 : 3) : index + 1
  return getSectionExercise(product, section)
}
