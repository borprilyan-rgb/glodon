import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('30 TAS/TRB questions and choices use English copy while immutable definitions, IDs, storage keys and Indonesian copy remain unchanged', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  const oldStorage = globalThis.localStorage
  try {
    const { getSectionExercise, resolvePublicAssessment } = await server.ssrLoadModule('/src/data/sectionExercises.js')
    const { default: Exercise } = await server.ssrLoadModule('/src/components/SectionExercise.jsx')
    const forms = JSON.parse(await readFile(new URL('../src/assessments/forms.json', import.meta.url)))
    const expectedFirst = {
      'tas-1-v3': 'What is the main purpose of Floor Settings in TAS?',
      'tas-2-v3': 'If a pile cap is 1 metre below the current floor elevation, which Top Elevation setting is correct?',
      'tas-3-v3': 'If the quantities remain unchanged after a modelling revision, what should you do?',
      'trb-1-v3': 'If structural modelling starts in TAS and reinforcement modelling will continue in TRB, which process should be used?',
      'trb-2-v3': 'Which of the following elements cannot yet be modelled in TRB?',
      'trb-3-v3': 'What is the main purpose of Rebar Data Check?',
    }
    let translated = 0
    for (const original of forms) {
      const localized = resolvePublicAssessment(original.product, original.section, original.assessmentVersion)
      if (!expectedFirst[original.versionId]) { assert.deepEqual(localized, original); continue }
      assert.equal(localized.copy.en.questions[0].title, expectedFirst[original.versionId])
      assert.deepEqual(localized.copy.id, original.copy.id)
      const withoutQuestions = copy => ({ ...copy, copy: { ...copy.copy, en: { ...copy.copy.en, questions: [] } } })
      assert.deepEqual(withoutQuestions(localized), withoutQuestions(original))
      const exercise = getSectionExercise(original.product, original.section)
      for (const [index, question] of localized.copy.en.questions.entries()) {
        translated++
        const before = original.copy.en.questions[index]
        assert.notEqual(question.title, before.title)
        const restoreDisplay = { ...question, title: before.title, options: question.options.map(([key], option) => [key, before.options[option][1]]) }
        assert.deepEqual(restoreDisplay, before, 'Only English display strings can change')
        globalThis.localStorage = { getItem: () => JSON.stringify({ started: true, submitted: false, index, answers: {} }) }
        for (const language of ['en', 'id']) {
          const html = renderToStaticMarkup(React.createElement(Exercise, { exercise, language, profile: { name: 'Learner', jobTitle: 'Engineer', employeeId: '000012' } }))
          const visible = renderToStaticMarkup(React.createElement('h2', { tabIndex: -1 }, exercise.copy[language].questions[index].title))
          assert(html.includes(visible))
        }
      }
    }
    assert.equal(translated, 30)
    const tas = getSectionExercise('tas', 1)
    assert.equal(tas.copy.en.questions[1].options[1][1], 'Use Zone in Floor Settings')
    assert.equal(tas.copy.id.questions[1].options[1][1], 'Gunakan Zona di Floor Settings')
  } finally { globalThis.localStorage = oldStorage; await server.close() }
})

test('image zoom accessibility labels follow the active locale', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  try {
    const { default: Lightbox } = await server.ssrLoadModule('/src/components/ImageLightbox.jsx')
    const { uiText } = await server.ssrLoadModule('/src/data/uiText.js')
    for (const language of ['en', 'id']) {
      const t = uiText[language]
      const html = renderToStaticMarkup(React.createElement(Lightbox, { items: [{ image: '/test.png', alt: 'Test' }], index: 0, t, language }))
      for (const label of [t.zoomIn, t.zoomOut, t.imageZoomControls]) assert(html.includes(`aria-label="${label}"`))
    }
  } finally { await server.close() }
})
