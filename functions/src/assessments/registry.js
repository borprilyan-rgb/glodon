import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { getSectionExercise, getLegacySectionExercise } from './definitions/sectionExercises.js'

const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const manifest = JSON.parse(readFileSync(new URL('./manifest.json', import.meta.url)))
const forms = JSON.parse(readFileSync(new URL('./forms.json', import.meta.url)))
function freeze(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value) } return value }
const sourceHashes = Object.fromEntries(Object.keys(manifest.sourceHashes).map(path => [path, hash(readFileSync(new URL('./definitions/' + path, import.meta.url), 'utf8').replace(/\r\n/g, '\n'))]))
if (JSON.stringify(sourceHashes) !== JSON.stringify(manifest.sourceHashes)) throw new Error('Immutable grading sources changed; publish a new paired release.')
const graderHash = hash(JSON.stringify(sourceHashes))
const registry = new Map()
for (const entry of manifest.entries) {
  const form = forms.find(f => f.versionId === entry.versionId)
  if (!form || hash(JSON.stringify(form)) !== entry.formHash || graderHash !== entry.graderHash) throw new Error('Invalid assessment release pairing.')
  const exercise = (entry.current ? getSectionExercise : getLegacySectionExercise)(entry.course, entry.section)
  if (!exercise || exercise.storageKey.match(/:(v\d+)$/)?.[1] !== entry.assessmentVersion) throw new Error('Unknown grading version.')
  registry.set(entry.versionId, freeze({ ...exercise, ...entry, form: freeze(form) }))
}
export const assessmentManifest = freeze(manifest)
export function resolveAssessment(course, section, version) {
  if (!['tas', 'trb', 'tme'].includes(course) || !Number.isInteger(section) || section < 1 || section > 3 || typeof version !== 'string') return null
  return registry.get(course + '-' + section + '-' + version) || null
}
export function getCurrentAssessment(course, section) {
  const entry = manifest.entries.find(e => e.course === course && e.section === section && e.current)
  return entry ? resolveAssessment(course, section, entry.assessmentVersion) : null
}
export function getHistoricalAssessment(course, section) {
  const entry = manifest.entries.find(e => e.course === course && e.section === section && !e.current)
  return entry ? resolveAssessment(course, section, entry.assessmentVersion) : getCurrentAssessment(course, section)
}
