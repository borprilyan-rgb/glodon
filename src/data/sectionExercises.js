import catalog from '../assessments/catalog.json'
import forms from '../assessments/forms.json'
import { getTasData } from './tas/index.js'
import { getTrbData } from './trb/index.js'
import { getTmeData } from './tme/index.js'
import { localAssessment } from './localAssessment.js'

function freeze(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value) } return value }
freeze(forms)
freeze(catalog)
export function resolvePublicAssessment(product, section, version) {
  return forms.find(form => form.product === product && form.section === section && form.assessmentVersion === version) || null
}
const localDefinitions = new Map()
export function getSectionExercise(product, section) {
  const key = `${product}-${section}`
  if (!localDefinitions.has(key)) localDefinitions.set(key, localAssessment(resolvePublicAssessment(product, section, catalog.find(entry => entry.course === product && entry.section === section)?.assessmentVersion)))
  return localDefinitions.get(key)
}
export function getLegacySectionExercise(product, section) {
  return resolvePublicAssessment(product, section, product === 'tas' && section === 1 ? 'v1' : product === 'tme' ? 'v1' : 'v2')
}
export function exerciseForLastLesson(product, lessonId) {
  const course = ({ tas: getTasData, trb: getTrbData, tme: getTmeData })[product]?.('en')
  const index = course?.tutorialParts.findIndex(part => part.steps.at(-1)?.id === lessonId)
  if (index === undefined || index < 0) return null
  return getSectionExercise(product, product === 'tme' ? (index === 0 ? 1 : index <= 4 ? 2 : 3) : index + 1)
}
