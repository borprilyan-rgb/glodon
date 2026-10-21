import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { getCurrentAssessment } from '../functions/src/assessments/registry.js'

test('all nine local assessments preserve grading, drafts, results and routes without initializing Firebase', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  const previousWindow = globalThis.window
  const previousStorage = globalThis.localStorage
  try {
    const values = new Map([
      ['cubicost-tas-tutorial-language-v1', 'en'],
      ['cubicost:participant', JSON.stringify({ name: 'Local learner', jobTitle: 'Engineer', employeeId: '000012' })],
      ['cubicost:tutorial:tas:migrated-v1', '1'],
      ['cubicost:tutorial:tas:curriculum-v2-migrated', '1'],
    ])
    globalThis.localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
    const { getSectionExercise } = await server.ssrLoadModule('/src/data/sectionExercises.js')
    const { readTestScores, saveTestScore } = await server.ssrLoadModule('/src/data/testScores.js')
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const { getServices } = await server.ssrLoadModule('/src/firebase/client.js')
    const { employeeAuthEnabled } = await server.ssrLoadModule('/src/firebase/employeeAccounts.js')
    const { getApps } = await import('firebase/app')
    assert.equal(employeeAuthEnabled, false)
    for (const role of ['participant', 'employee', 'admin']) assert.throws(() => getServices(role), /temporarily disabled/)
    assert.equal(getApps().length, 0)
    const render = pathname => {
      globalThis.window = { location: { pathname, hash: '', search: '' } }
      return renderToStaticMarkup(React.createElement(App))
    }
    for (const product of ['tas', 'trb', 'tme']) for (const section of [1, 2, 3]) {
      const exercise = getSectionExercise(product, section)
      const backend = getCurrentAssessment(product, section)
      assert.deepEqual(exercise.copy.en.questions.map(q => q.title), backend.copy.en.questions.map(q => q.title))
      assert.equal(exercise.storageKey, backend.storageKey)
      const correct = backend.expectedAnswers
      // Exhaust all 3^5 answer combinations, covering every score and pass boundary.
      for (let combination = 0; combination < 3 ** 5; combination++) {
        let selection = combination
        const answers = Object.fromEntries(exercise.copy.en.questions.map(question => {
          const value = question.options[selection % 3][0]
          selection = Math.floor(selection / 3)
          return [question.id, value]
        }))
        assert.deepEqual(exercise.score(answers), backend.score(answers))
      }
      const entry = render(exercise.path)
      assert(entry.includes('class="section-exercise"'))
      assert(!entry.includes('Employee assessments are not enabled yet'))
      assert(!entry.includes('central-submissions'))
      values.set(exercise.storageKey, JSON.stringify({ started: true, submitted: false, index: 2, answers: correct }))
      assert.equal(exercise.load().index, 2)
      assert(render(exercise.path).includes('exercise-question'))
      values.set(exercise.storageKey, JSON.stringify({ started: true, submitted: true, index: 4, answers: correct }))
      saveTestScore(exercise, correct)
      assert(exercise.load().submitted)
      assert.equal(readTestScores().find(score => score.exercise.path === exercise.path).result.total, 100)
      assert(render(exercise.path).includes('exercise-result is-passed'))
      // Retrying clears the draft while preserving the previous score card.
      values.set(exercise.storageKey, JSON.stringify({ started: true, submitted: false, index: 0, answers: {} }))
      assert.equal(exercise.load().submitted, false)
      assert.equal(readTestScores().find(score => score.exercise.path === exercise.path).result.total, 100)
      assert.equal((render(`/${product}/tests`).match(/class="exercise-card"/g) || []).length, 3)
    }
    assert.equal(readTestScores().length, 9)
    assert(render('/exercises').includes('exercise-hub__scores'))
    assert(render('/admin/results').includes('Central results temporarily disconnected'))
    assert(![...values.keys()].some(key => key.startsWith('cubicost:firebase:attempt:')))
    values.delete('cubicost:participant')
    assert(render('/tas/tests').includes('Enter your details'))
    assert(render('/tas/tests/section-1').includes('No account or internet connection is required'))
    assert.equal(getApps().length, 0)
  } finally {
    globalThis.window = previousWindow
    globalThis.localStorage = previousStorage
    await server.close()
  }
})
