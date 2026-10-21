import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { getTasData } from '../src/data/tas/index.js'
import { getTrbData } from '../src/data/trb/index.js'
import { getTmeData } from '../src/data/tme/index.js'
import { getReportLessons, reportProgressKey } from '../src/data/tas/tasReports.js'

test('TAS home, overview, map and lesson progress use the same 23 current lessons in both languages', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  const previousWindow = globalThis.window
  const previousStorage = globalThis.localStorage
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const legacy = getTasData('en').allSteps
    const current = [...legacy.filter(step => step.partId !== 'part-3'), ...getReportLessons('en')]
    const combinedTotal = current.length + getTrbData('en').allSteps.length + getTmeData('en').allSteps.length
    assert.equal(current.length, 23)
    for (const language of ['id', 'en']) {
      const values = new Map([
        ['cubicost-tas-tutorial-language-v1', language],
        ['cubicost:tutorial:tas:migrated-v1', '1'],
        ['cubicost:tutorial:tas:curriculum-v2-migrated', '1'],
      ])
      globalThis.localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
      const render = pathname => {
        globalThis.window = { location: { pathname, hash: '', search: '' } }
        return renderToStaticMarkup(React.createElement(App))
      }
      const card = html => html.match(/<article class="hub-course-card hub-course-card--tas">[\s\S]*?<\/article>/)[0]
      const emptyHome = render('/')
      assert(card(emptyHome).includes(`23 ${language === 'en' ? 'lessons' : 'pelajaran'}`))
      assert(emptyHome.includes(` / ${combinedTotal}</span>`))
      assert(render('/tas').includes(`${language === 'en' ? '3 parts' : '3 bagian'} · 23`))

      // Retired Part 3 completion must not inflate the current course's progress.
      values.set('cubicost:tutorial:tas:progress', JSON.stringify({ completed: legacy.map(step => step.id), started: legacy.map(step => step.id) }))
      values.set(reportProgressKey, JSON.stringify({ 'pile-cap-report': { completed: true, checks: [0, 1, 2] } }))
      values.set('cubicost:tutorial:tas:lastLesson', 'beam-report')
      const home = card(render('/'))
      assert(home.includes('aria-valuenow="74"'), '17 of 23 completed, excluding two retired lessons')
      assert(home.includes('href="/tas/lesson/beam-report"'), 'Resume the last visited report')
      const overview = render('/tas')
      assert(overview.includes('href="/tas/lesson/beam-report"'))
      assert(!overview.includes(language === 'en' ? 'Review Learning' : 'Tinjau Kembali Pembelajaran'))
      for (const path of ['/tas/course', '/tas/lesson/create-project', '/tas/lesson/beam-report']) {
        const html = render(path)
        assert(html.includes('aria-valuenow="74"'), path)
        assert(!html.includes('aria-valuenow="100"'), path)
      }
      const removed = render('/tas/lesson/staircase-report')
      assert(removed.includes('class="course-map-hero"'))
      const map = render('/tas/course')
      assert.equal((map.match(/class="course-lesson /g) || []).length, 23)
      assert(!map.includes('/tas/lesson/quantity-reports'))
      assert(!map.includes('/tas/lesson/staircase-report'))
      const firstReport = render('/tas/lesson/pile-cap-report')
      assert(firstReport.includes('class="step-position"><span style="width:73.91304347826086%"'))
      const lastReport = render('/tas/lesson/finishes-report')
      assert(lastReport.includes('class="step-position"><span style="width:100%"'))

      values.set(reportProgressKey, JSON.stringify(Object.fromEntries(getReportLessons().map(step => [step.id, { completed: true, checks: [0, 1, 2] }]))))
      const completeHome = card(render('/'))
      assert(completeHome.includes('aria-valuenow="100"'))
      assert(render('/tas').includes(language === 'en' ? 'Review Learning' : 'Tinjau Kembali Pembelajaran'))
      // The other products retain their own curriculum totals.
      for (const [product, data] of [['trb', getTrbData(language)], ['tme', getTmeData(language)]]) {
        assert(render(`/${product}`).includes(`· ${data.allSteps.length} ${language === 'en' ? 'lessons' : 'pelajaran'}`))
      }
    }
  } finally {
    globalThis.window = previousWindow
    globalThis.localStorage = previousStorage
    await server.close()
  }
})
