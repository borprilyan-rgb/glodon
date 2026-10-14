import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { resolveAssessment, getCurrentAssessment, assessmentManifest } from '../../functions/src/assessments/registry.js'
import { reviewAssessment } from '../../functions/src/assessments/review.js'
const baseline = JSON.parse(gunzipSync(readFileSync(new URL('../fixtures/assessment-baseline.json.gz', import.meta.url))))
const publicForms = JSON.parse(readFileSync(new URL('../../src/assessments/forms.json', import.meta.url)))
for (const fixture of baseline) test(fixture.course + '/' + fixture.section + '/' + fixture.version + ': original scoring, validation, questions and bilingual review', () => {
  const exercise = resolveAssessment(fixture.course, fixture.section, fixture.version)
  assert.ok(exercise)
  assert.deepEqual(exercise.copy, fixture.copy)
  assert.deepEqual(exercise.expectedAnswers, fixture.expectedAnswers)
  assert.deepEqual(exercise.points, fixture.points)
  const form = publicForms.find(form => form.versionId === exercise.versionId)
  assert.deepEqual(form, exercise.form)
  for (const language of ['en', 'id']) {
    const original = fixture.copy[language].questions.map(question => Object.fromEntries(Object.entries(question).filter(([key]) => !['expected', 'explanation'].includes(key))))
    assert.deepEqual(form.copy[language].questions, original)
  }
  for (const { answers, score, issues, reviews } of fixture.cases) {
    assert.deepEqual(exercise.score(answers), score)
    assert.deepEqual(exercise.copy.en.questions.map((_, index) => exercise.issues(index, answers)), issues)
    for (const language of ['en', 'id']) assert.deepEqual(reviewAssessment({ course: fixture.course, section: fixture.section, assessmentVersion: fixture.version, answers }, language), reviews[language])
  }
})
test('immutable releases, explicit pairing, unknown versions and stored totals', () => {
  assert.equal(assessmentManifest.entries.filter(e => e.current).length, 9)
  assert.equal(getCurrentAssessment('tas', 2).assessmentVersion, 'v3')
  assert.ok(Object.isFrozen(getCurrentAssessment('tme', 1).form.copy.en.questions))
  for (const version of ['v99', undefined, 'v1']) {
    assert.equal(resolveAssessment('tas', 2, version), null)
    const record = { course: 'tas', section: 2, assessmentVersion: version, answers: { q1: '0' }, score: 17, passed: false }
    const before = structuredClone(record)
    assert.equal(reviewAssessment(record, 'en').available, false)
    assert.deepEqual(record, before)
  }
  const record = { course: 'tas', section: 1, assessmentVersion: 'v3', answers: {}, score: 99, passed: true }
  const before = structuredClone(record); reviewAssessment(record, 'en'); assert.deepEqual(record, before)
})
