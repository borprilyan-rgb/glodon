import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getSectionExercise } from '../../src/data/sectionExercises.js'
import { reviewAssessment, resolveAssessment } from '../../src/data/assessmentReview.js'

function recordFor(course, section, answers) {
  const exercise = getSectionExercise(course, section)
  return { course, section, assessmentVersion: exercise.storageKey.match(/:(v\d+)$/)[1], answers: answers || { ...exercise.expectedAnswers } }
}

for (const course of ['tas', 'trb', 'tme']) for (const section of [1, 2, 3]) {
  test(`${course}/${section}: bilingual ordered questions, option labels and points match participant review`, () => {
    const exercise = getSectionExercise(course, section)
    assert.equal(exercise.score(exercise.expectedAnswers).total, 100, 'Expected answer metadata must earn full marks under the actual scorer')
    for (const language of ['en', 'id']) {
      const record = recordFor(course, section)
      // Storage map order must never control the displayed question order.
      record.answers = Object.fromEntries(Object.entries(record.answers).reverse())
      const review = reviewAssessment(record, language)
      assert.equal(review.available, true)
      assert.deepEqual(review.questions.map(question => question.title), exercise.copy[language].questions.map(question => question.title))
      assert.deepEqual(review.questions.map(question => question.earned), exercise.score(record.answers).scores)
      assert.deepEqual(review.questions.map(question => question.maximum), exercise.points)
      assert.ok(review.questions.every(question => question.status === 'correct' && question.expected.length === 0))
      const choice = exercise.copy[language].questions.find(question => question.type === 'choice')
      const index = exercise.copy[language].questions.indexOf(choice)
      const expectedKey = record.answers[choice.id]
      assert.equal(review.questions[index].answers[0].value, choice.options.find(([key]) => key === expectedKey)[1])
      const wrong = { ...record.answers, [choice.id]: choice.options.find(([key]) => key !== expectedKey)[0] }
      const wrongReview = reviewAssessment({ ...record, answers: wrong }, language)
      assert.equal(wrongReview.questions[index].status, 'incorrect')
      assert.equal(wrongReview.questions[index].earned, 0)
      assert.equal(wrongReview.questions[index].expected[0].value, choice.options.find(([key]) => key === expectedKey)[1])
      assert.equal(wrongReview.questions[index].explanation, choice.explanation)
      assert.deepEqual(wrongReview.questions.map(question => question.earned), exercise.score(wrong).scores)
    }
  })
}

test('zero choice indexes and zero numeric answers remain visible; slab partial credit and units are exact', () => {
  const tme = reviewAssessment(recordFor('tme', 1))
  assert.equal(tme.questions[0].status, 'correct')
  assert.match(tme.questions[0].answers[0].value, /perubahan desain/i)
  const record = recordFor('tas', 2)
  record.answers.slabThickness = '0'
  for (const language of ['en', 'id']) {
    const question = reviewAssessment(record, language).questions[3]
    assert.equal(question.status, 'partial')
    assert.equal(question.earned, 10)
    assert.equal(question.maximum, 20)
    assert.deepEqual(question.answers[0], { label: language === 'en' ? 'Slab thickness' : 'Ketebalan pelat', value: '0 mm' })
    assert.equal(question.expected[0].value, '150 mm')
    assert.equal(question.explanation, getSectionExercise('tas', 2).copy[language].questions[3].explanation)
  }
})

test('compound office setup and reinforcement quantities use the original labels, units and partial scoring', () => {
  const office = recordFor('tas', 1)
  office.answers.ground = '0'
  const project = reviewAssessment(office, 'en').questions[2]
  assert.equal(project.status, 'partial')
  assert.equal(project.earned, 7)
  assert.deepEqual(project.answers[1], { label: 'Ground elevation', value: '0 m' })
  assert.equal(project.expected[1].value, '-0.5 m')
  const slab = recordFor('tas', 2)
  slab.answers.slabThickness = '150 mm'
  assert.equal(reviewAssessment(slab, 'en').questions[3].answers[0].value, '150 mm')
  const volume = recordFor('tas', 3)
  volume.answers.beamVolume = '0,70 m3'
  assert.equal(reviewAssessment(volume, 'en').questions[2].answers[0].value, '0,70 m³')
  assert.equal(reviewAssessment(volume, 'en').questions[2].status, 'correct')
  const rebar = reviewAssessment(recordFor('trb', 3), 'en')
  assert.equal(rebar.questions[2].answers[0].value, '24 m')
  assert.equal(rebar.questions[2].answers[1].value, '59.28 kg')
  assert.equal(rebar.questions[4].answers[0].value, '2.5 t')
})

test('old, unknown or missing versions never inherit current definitions or scoring', () => {
  for (const language of ['en', 'id']) for (const assessmentVersion of ['v1', 'v99', undefined]) {
    assert.equal(resolveAssessment('tas', 2, assessmentVersion), null)
    const review = reviewAssessment({ ...recordFor('tas', 2), assessmentVersion, answers: { q1: '0', slabThickness: '150' } }, language)
    assert.equal(review.available, false)
    assert.equal(review.questions, undefined)
    assert.deepEqual(review.stored, [{ label: 'q1', value: '0' }, { label: 'slabThickness', value: '150' }])
    assert.match(review.message, language === 'en' ? /unavailable/ : /tidak tersedia/)
  }
  assert.equal(resolveAssessment('unknown', 1, 'v1'), null)
})

test('malformed data does not crash; missing and unknown choices are not presented as known options', () => {
  for (const answers of [null, [], { q1: {} }, { q1: 0 }]) {
    const review = reviewAssessment({ ...recordFor('tme', 1), answers }, 'en')
    assert.equal(review.available, false)
    assert.equal(review.questions, undefined)
  }
  const record = recordFor('tme', 1)
  record.answers.q1 = '99'
  delete record.answers.q2
  const review = reviewAssessment(record, 'en')
  assert.equal(review.questions[0].answers[0].value, 'Unknown option: 99')
  assert.equal(review.questions[0].status, 'incorrect')
  assert.equal(review.questions[1].answers[0].value, 'Not answered')
})
