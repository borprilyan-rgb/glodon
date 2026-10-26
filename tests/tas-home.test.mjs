import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('TAS home combines the training image, learning action, full progress and all 22 lessons', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  const oldWindow = globalThis.window
  const oldStorage = globalThis.localStorage
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    for (const language of ['id', 'en']) {
      const values = new Map([
        ['cubicost-tas-tutorial-language-v1', language],
        ['cubicost:tutorial:tas:migrated-v1', '1'],
        ['cubicost:tutorial:tas:curriculum-v2-migrated', '1'],
      ])
      globalThis.localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
      const render = pathname => {
        const redirects = []
        globalThis.window = { location: { pathname, hash: '', search: '' }, history: { replaceState: (...args) => redirects.push(args[2]) } }
        return { html: renderToStaticMarkup(React.createElement(App)), redirects }
      }
      for (const path of ['/tas/', '/tas', '/tas/course']) {
        const { html, redirects } = render(path)
        assert(html.includes('class="course-home"'))
        assert(html.includes('src="/tutorial/tas/welcome-preview.webp"'))
        assert(html.includes('class="landing-preview__image"'))
        assert(html.includes('class="course-start"'))
        assert(!html.includes('class="tas-header-progress"'))
        assert.equal((html.match(/class="course-part__progress"/g) || []).length, 3)
        assert.equal((html.match(/aria-expanded="true"/g) || []).length, 3)
        assert(!html.includes('class="tas-overall-progress"'))
        assert.equal((html.match(/class="course-lesson /g) || []).length, 22)
        assert.equal((html.match(/role="progressbar"/g) || []).length, 3)
        assert(html.includes('class="landing-hero__copy"'))
        assert(html.indexOf('class="landing-hero__copy"') < html.indexOf('class="landing-preview"'))
        assert(!html.includes('id="landing-title"'))
        assert(!html.includes('class="course-map-hero"'))
        assert(!html.includes('class="secondary-button"'))
        assert(html.includes(language === 'en' ? 'Start Learning' : 'Mulai Belajar'))
        assert(html.indexOf('course-part__progress') > html.indexOf('class="course-map-parts"'))
        assert(html.includes('class="course-map-toolbar"'))
        if (path !== '/tas/') assert.deepEqual(redirects, ['/tas/'])
      }
      values.set('cubicost:tutorial:tas:lastLesson', 'identify-openings')
      values.set('cubicost:tutorial:tas:progress', JSON.stringify({ completed: ['create-project'], started: ['identify-openings'] }))
      const returning = render('/tas/').html
      const action = returning.match(/<div class="course-start">[\s\S]*?<\/div>/)[0]
      assert(action.includes('href="/tas/lesson/identify-openings"'))
      assert(action.includes(language === 'en' ? 'Continue Learning' : 'Lanjutkan Materi'))
      assert(returning.includes('aria-valuenow="13"'))
      for (const product of ['trb', 'tme']) {
        const landing = render(`/${product}`).html
        assert(landing.includes('class="landing-hero__copy"'))
        assert(!landing.includes('class="secondary-button"'))
        assert(landing.includes('class="course-map-parts"'))
        assert(!render(`/${product}/course`).html.includes('class="course-map-hero"'))
      }
    }
  } finally {
    globalThis.window = oldWindow
    globalThis.localStorage = oldStorage
    await server.close()
  }
})
