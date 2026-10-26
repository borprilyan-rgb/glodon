import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { getTrbData } from '../src/data/trb/index.js'
import { getTmeData } from '../src/data/tme/index.js'

test('TRB and TME use the approved combined layout with original lessons, progress and resume destinations', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  const priorWindow = globalThis.window
  const priorStorage = globalThis.localStorage
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    for (const [product, getCourse] of [['trb', getTrbData], ['tme', getTmeData]]) for (const language of ['id', 'en']) {
      const course = getCourse(language)
      const first = course.allSteps[0]
      const second = course.allSteps[1]
      const values = new Map([
        ['cubicost-tas-tutorial-language-v1', language],
        ['cubicost:tutorial:tas:migrated-v1', '1'],
        ['cubicost:tutorial:tas:curriculum-v2-migrated', '1'],
      ])
      globalThis.localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
      const render = path => {
        const redirects = []
        globalThis.window = { location: { pathname: path, hash: '', search: '' }, history: { replaceState: (...args) => redirects.push(args[2]) } }
        return { html: renderToStaticMarkup(React.createElement(App)), redirects }
      }
      for (const path of [`/${product}/`, `/${product}`, `/${product}/course`]) {
        const { html, redirects } = render(path)
        assert(html.includes(`class="course-home" data-product="${product}"`))
        assert(html.includes(`src="/tutorial/${product}/welcome-preview.webp"`))
        assert(html.indexOf('landing-hero__copy') < html.indexOf('class="landing-preview"'))
        assert(!html.includes('id="landing-title"'))
        assert(!html.includes('class="secondary-button"'))
        assert(!html.includes('class="course-map-hero"'))
        assert.equal((html.match(/class="course-lesson /g) || []).length, course.allSteps.length)
        assert.equal((html.match(/class="course-part__progress"/g) || []).length, course.tutorialParts.length)
        assert.equal((html.match(/aria-expanded="true"/g) || []).length, course.tutorialParts.length)
        for (const step of course.allSteps) assert(html.includes(`href="/${product}/lesson/${step.id}"`))
        for (const header of html.matchAll(/<section class="course-part [\s\S]*?<header>([\s\S]*?)<\/header>/g)) assert(!header[1].includes('<p>'))
        if (path !== `/${product}/`) assert.deepEqual(redirects, [`/${product}/`])
      }
      values.set(`cubicost:tutorial:${product}:progress`, JSON.stringify({ completed: [first.id], started: [first.id, second.id] }))
      values.set(`cubicost:tutorial:${product}:lastLesson`, second.id)
      const returning = render(`/${product}/`).html
      const start = returning.match(/<div class="course-start">[\s\S]*?<\/div>/)[0]
      assert(start.includes(`href="/${product}/lesson/${second.id}"`))
      assert(start.includes(language === 'en' ? 'Continue Learning' : 'Lanjutkan Materi'))
      const firstPart = course.tutorialParts.find(part => part.id === first.partId)
      assert(returning.includes(`aria-valuenow="${Math.round(100 / firstPart.steps.length)}"`))
      const lesson = render(`/${product}/lesson/${first.id}`).html
      assert(lesson.includes(`<h1>${first.title}</h1>`))
      assert(lesson.includes('completion-success'))
      assert(lesson.includes(`href="/${product}/"`), 'Header learning-map link uses the combined page')
    }
  } finally {
    globalThis.window = priorWindow
    globalThis.localStorage = priorStorage
    await server.close()
  }
})
