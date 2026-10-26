import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { getTasData } from '../src/data/tas/index.js'
import { getTrbData } from '../src/data/trb/index.js'
import { getTmeData } from '../src/data/tme/index.js'
import { getReportLessons, reportProgressKey } from '../src/data/tas/tasReports.js'

test('TAS home, overview, map and lesson progress use the same 22 current lessons in both languages', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  const previousWindow = globalThis.window
  const previousStorage = globalThis.localStorage
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const legacy = getTasData('en').allSteps
    const current = [...legacy.filter(step => step.partId !== 'part-3'), ...getReportLessons('en')]
    assert.equal(current.length, 22)
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
      assert(card(emptyHome).includes(language === 'en' ? '0 of 22 steps' : '0 dari 22 langkah'))
      assert(!emptyHome.includes('hub-course-card__lesson-count'))
      assert(!emptyHome.includes('hub-overall-progress'))
      assert(!emptyHome.includes('hub-section-heading'))
      assert(render('/tas').includes(`${language === 'en' ? '3 parts' : '3 bagian'} · 22`))

      // Replaced wall/report lessons must not inflate current course progress.
      values.set('cubicost:tutorial:tas:progress', JSON.stringify({ completed: [...legacy.map(step => step.id), 'identify-structural-walls', 'quantity-reports'], started: legacy.map(step => step.id) }))
      values.set(reportProgressKey, JSON.stringify({ 'pile-cap-report': { completed: true, checks: [0, 1, 2] } }))
      values.set('cubicost:tutorial:tas:lastLesson', 'column-report')
      const home = card(render('/'))
      assert(home.includes('aria-valuenow="77"'), '17 of 22 completed, excluding two retired lessons')
      assert(home.includes('href="/tas/lesson/beam-report"'), 'Resume the last visited report')
      const overview = render('/tas')
      assert(overview.includes('href="/tas/lesson/beam-report"'))
      assert(!overview.includes(language === 'en' ? 'Review Learning' : 'Tinjau Kembali Pembelajaran'))
      for (const path of ['/tas/course', '/tas/lesson/create-project', '/tas/lesson/beam-report']) {
        const html = render(path)
        if (path === '/tas/course') {
          assert.equal((html.match(/class="course-part__progress"/g) || []).length, 3)
          assert(html.includes('aria-valuenow="17"'), 'one of six Part 3 lessons completed')
        } else {
          assert(html.includes('aria-valuenow="77"'), path)
          assert(!html.includes('aria-valuenow="100"'), path)
        }
      }
      const removed = render('/tas/lesson/staircase-report')
      assert(removed.includes('class="course-home"'))
      const map = render('/tas/course')
      assert.equal((map.match(/class="course-lesson /g) || []).length, 22)
      assert(!map.includes('/tas/lesson/quantity-reports'))
      assert(!map.includes('/tas/lesson/column-report'))
      const oldColumn = render('/tas/lesson/column-report')
      assert(oldColumn.includes('<h1>Beam – Column</h1>'))
      assert.equal((oldColumn.match(/role="listitem"/g) || []).length, 4)
      assert(!map.includes('/tas/lesson/staircase-report'))
      const firstReport = render('/tas/lesson/pile-cap-report')
      assert(firstReport.includes('class="step-position"><span style="width:77.27272727272727%"'))
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
