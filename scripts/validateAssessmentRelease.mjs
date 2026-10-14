import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { assessmentManifest, resolveAssessment } from '../functions/src/assessments/registry.js'

const browserForms = JSON.parse(readFileSync(new URL('../src/assessments/forms.json', import.meta.url)))
const backendForms = JSON.parse(readFileSync(new URL('../functions/src/assessments/forms.json', import.meta.url)))
assert.deepEqual(browserForms, backendForms, 'Browser and backend forms must match the immutable release.')
const forbidden = new Set(['expected', 'expectedAnswers', 'answerKeys', 'answer', 'score', 'scores', 'criticalIndices', 'passScore', 'explanation', 'explanations', 'pointsForQuestion'])
function inspect(value) { if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) { assert.ok(!forbidden.has(key), 'Private field in public form: ' + key); inspect(item) } }
inspect(browserForms)
assert.equal(assessmentManifest.entries.filter(e => e.current).length, 9)
assert.equal(new Set(assessmentManifest.entries.map(e => e.versionId)).size, assessmentManifest.entries.length)
for (const entry of assessmentManifest.entries) assert.ok(resolveAssessment(entry.course, entry.section, entry.assessmentVersion))
console.log('15 immutable form/grader pairs verified; nine current assessments; public forms contain no private fields.')

const catalog = JSON.parse(readFileSync(new URL('../src/assessments/catalog.json', import.meta.url)))
assert.deepEqual(catalog, assessmentManifest.entries.filter(e => e.current).map(({ course, section, assessmentVersion, versionId }) => ({ course, section, assessmentVersion, versionId })))
