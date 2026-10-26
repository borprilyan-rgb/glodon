import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { getTasData } from '../src/data/tas/index.js'
import { applyPartTwoRevision } from '../src/data/tas/partTwoRevision.js'

const targets = {
  'identify-architectural-walls': [1, 2, 3],
  'identify-openings': [4, 5, 6, 7, 8],
  'apply-finishes': [9, 10, 11, 12],
  'calculate-verify-quantity': [13, 14],
}

test('all 14 PDF pages replace exactly Part 2 Steps 5 to 8 while preserving earlier revisions', async () => {
  const expectedOrder = ['identify-pile-caps', 'identify-columns', 'identify-beams', 'identify-slabs', 'identify-architectural-walls', 'identify-openings', 'apply-finishes', 'calculate-verify-quantity']
  for (const language of ['id', 'en']) {
    const course = getTasData(language)
    assert.equal(course.allSteps.length, 16)
    assert.deepEqual(course.tutorialParts[1].steps.map(step => step.id), expectedOrder)
    assert.deepEqual(course.tutorialParts[2].steps.map(step => step.id), [])
    const revisedSteps = course.allSteps.filter(step => targets[step.id])
    assert.deepEqual(revisedSteps.map(step => step.stepNumber), [5, 6, 7, 8])
    assert.deepEqual(revisedSteps.map(step => step.actions.length), [3, 5, 4, 2])
    for (const step of course.allSteps) {
      if (!targets[step.id]) {
        assert.strictEqual(applyPartTwoRevision(step, language), step)
        assert(!step.actions.some(action => action.image.includes('/revision-part-2/')))
        continue
      }
      assert.equal(step.hideIntro, true)
      assert.equal(step.showInstructionsBelowImage, true)
      assert.deepEqual(step.actions.map(action => action.sourcePage), targets[step.id])
      for (const [index, action] of step.actions.entries()) {
        assert.equal(action.number, index + 1)
        assert.equal(action.id, `${step.id}-action-${index + 1}`)
        assert.equal(action.presenterImage, action.image)
        assert.equal(action.caption, '')
        assert(!action.description.includes('TAS > SECTION'))
        assert(!action.description.includes('\ufffd'))
        if (action.sourcePage !== 3) assert(action.description.startsWith('STEP 1:'))
        const png = await readFile(`public${action.image}`)
        assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
      }
    }
  }
})

test('revised lesson pages, every presenter slide, and enlarged images retain instructions', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  const priorWindow = globalThis.window
  const priorDocument = globalThis.document
  const priorStorage = globalThis.localStorage
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const { default: Lightbox } = await server.ssrLoadModule('/src/components/ImageLightbox.jsx')
    const { uiText } = await server.ssrLoadModule('/src/data/uiText.js')
    globalThis.document = { fullscreenElement: null }
    for (const language of ['id', 'en']) {
      const values = new Map([
        ['cubicost-tas-tutorial-language-v1', language],
        ['cubicost:tutorial:tas:migrated-v1', '1'],
        ['cubicost:tutorial:tas:curriculum-v2-migrated', '1'],
      ])
      globalThis.localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
      globalThis.window = { location: { pathname: '/tas/course', hash: '', search: '' } }
      const map = renderToStaticMarkup(React.createElement(App))
      assert(!map.includes('/tas/lesson/identify-structural-walls'))
      assert(!map.includes('/tas/lesson/quantity-reports'))
      assert(map.includes('/tas/lesson/calculate-verify-quantity'))
      for (const id of Object.keys(targets)) {
        const step = getTasData(language).allSteps.find(step => step.id === id)
        globalThis.window = { location: { pathname: `/tas/lesson/${id}`, hash: '', search: '' } }
        const html = renderToStaticMarkup(React.createElement(App))
        const header = html.match(/<header class="step-header">[\s\S]*?<\/header>/)[0]
        assert(!header.includes('<p>'))
        const list = html.slice(html.indexOf('class="action-viewer__list"'), html.indexOf('class="action-viewer__media"'))
        assert(!list.includes('<p>'))
        assert.equal((list.match(/role="listitem"/g) || []).length, step.actions.length)
        const navigation = html.slice(html.indexOf('class="step-navigation"'))
        if (id === 'apply-finishes') assert(navigation.includes('/tas/lesson/calculate-verify-quantity'))
        if (id === 'calculate-verify-quantity') {
          assert(navigation.includes('/tas/lesson/apply-finishes'))
          assert(navigation.includes('/tas/lesson/pile-cap-report'))
        }
        assert(html.indexOf(`<img src="${step.actions[0].image}"`) < html.indexOf('screenshot-media__instruction'))
        for (const [slide, action] of step.actions.entries()) {
          globalThis.window.location = { pathname: '/present', hash: '', search: `?product=tas&lesson=${id}&slide=${slide}` }
          const presenter = renderToStaticMarkup(React.createElement(App))
          assert(presenter.includes(`src="${action.image}"`))
          const enlarged = renderToStaticMarkup(React.createElement(Lightbox, { items: [{ ...action, label: action.title }], index: 0, t: uiText[language] }))
          assert(enlarged.includes(`src="${action.image}"`))
          if (action.description) {
            assert(enlarged.includes('STEP 1:'))
            assert(presenter.includes('STEP 1:'))
          }
        }
      }
      for (const [retired, current] of [['identify-structural-walls', 'identify-architectural-walls'], ['quantity-reports', 'calculate-verify-quantity']]) {
        const step = getTasData(language).allSteps.find(step => step.id === current)
        globalThis.window.location = { pathname: `/tas/lesson/${retired}`, hash: '', search: '' }
        const oldUrl = renderToStaticMarkup(React.createElement(App))
        assert(oldUrl.includes(`<h1>${step.title}</h1>`))
        assert(oldUrl.includes(`src="${step.actions[0].image}"`))
        globalThis.window.location = { pathname: '/present', hash: '', search: `?product=tas&lesson=${retired}&slide=0` }
        assert(renderToStaticMarkup(React.createElement(App)).includes(`src="${step.actions[0].image}"`))
      }
    }
  } finally {
    globalThis.window = priorWindow
    globalThis.document = priorDocument
    globalThis.localStorage = priorStorage
    await server.close()
  }
})
