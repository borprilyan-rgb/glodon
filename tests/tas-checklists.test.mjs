import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { getTasData } from '../src/data/tas/index.js'
import { getReportLessons } from '../src/data/tas/tasReports.js'

const course = language => [...getTasData(language).allSteps, ...getReportLessons(language)]

test('all 23 TAS lessons have distinct bilingual checklists with the existing three saved positions', () => {
  const idLessons = course('id')
  const enLessons = course('en')
  assert.equal(idLessons.length, 23)
  for (const [index, lesson] of idLessons.entries()) {
    const english = enLessons[index]
    assert.equal(lesson.id, english.id)
    assert.equal(lesson.checks.length, 3)
    assert.equal(english.checks.length, 3)
    assert.equal(new Set(lesson.checks).size, 3)
    assert.equal(new Set(english.checks).size, 3)
    assert(lesson.checks.every(check => check.startsWith('Saya dapat ')))
    assert(english.checks.every(check => check.startsWith('I can ')))
    assert(!lesson.checks.join(' ').includes('Tindakan utama telah diselesaikan'))
    assert(!english.checks.join(' ').includes('The main actions are complete'))
  }
  assert.equal(new Set(idLessons.map(lesson => lesson.checks.join('\n'))).size, 23)
  assert.equal(new Set(enLessons.map(lesson => lesson.checks.join('\n'))).size, 23)
})

test('revised checklists cover the actual Wall, Door/Window, Finish and Calculation actions and retained report columns', () => {
  for (const language of ['id', 'en']) {
    const lessons = course(language)
    for (const [id, commands] of [
      ['identify-architectural-walls', ['Pick Masonry Wall Sideline', 'Auto-Identify', 'Draw']],
      ['identify-openings', ['Element Schedule', 'Auto-Identify', 'Point']],
      ['apply-finishes', ['Finish Schedule', 'Point', 'Material Texture', 'Regenerate Finish Entity']],
      ['calculate-verify-quantity', ['Calculate', 'All Floors', 'View Expression', 'View Quantity by Category', 'Set Classification and Quantity', 'Export to Excel']],
    ]) {
      const lesson = lessons.find(lesson => lesson.id === id)
      const content = lesson.actions.map(action => action.description).join('\n')
      for (const command of commands) {
        assert(content.includes(command), `${id}: command is in the actual lesson`)
        assert(lesson.checks.some(check => check.includes(command)), `${id}: command is covered by a check`)
      }
    }
    for (const lesson of lessons.filter(lesson => lesson.partId === 'part-3')) {
      const content = lesson.actions.map(action => action.description).join('\n')
      // Every exact English Quantity header cited in a checklist must still be
      // taught in that lesson after the requested report-column removals.
      for (const check of lesson.checks) {
        for (const header of check.match(/\b(?:Volume|Area|Number|Weight|Girth|Net length|Length)[A-Za-z ]*\((?:m3|m2|m|kg|pc)\)/g) || []) assert(content.includes(header), `${lesson.id}: ${header}`)
      }
      assert(!lesson.checks.join('\n').includes('Classification Condition'))
      if (['beam-report', 'wall-report', 'slab-report'].includes(lesson.id)) assert(!lesson.checks.join('\n').includes('Number(pc)'))
    }
  }
})

test('lesson completion renders the related checklist and retains selected checks and completion gating', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  try {
    const { default: Lesson } = await server.ssrLoadModule('/src/components/TutorialStep.jsx')
    const { uiText } = await server.ssrLoadModule('/src/data/uiText.js')
    for (const language of ['id', 'en']) {
      const lessons = course(language)
      for (const [index, step] of lessons.entries()) {
        const props = { step, index, total: lessons.length, isComplete: false, selectedChecks: [0, 2], next: lessons[index + 1], product: 'tas', t: uiText[language] }
        const html = renderToStaticMarkup(React.createElement(Lesson, props))
        const completion = html.slice(html.indexOf('id="lesson-completion"'), html.indexOf('class="step-navigation"'))
        for (const check of step.checks) assert(completion.includes(renderToStaticMarkup(React.createElement('span', null, check))))
        assert.equal((completion.match(/type="checkbox"/g) || []).length, 3)
        assert.equal((completion.match(/checked=""/g) || []).length, 2)
        assert(completion.includes('disabled=""'))
        const ready = renderToStaticMarkup(React.createElement(Lesson, { ...props, selectedChecks: [0, 1, 2] }))
        assert(!ready.match(/class="complete-button"[^>]*disabled/))
      }
    }
  } finally { await server.close() }
})
