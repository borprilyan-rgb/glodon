import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { getTasData } from '../src/data/tas/index.js'
import { getTrbData } from '../src/data/trb/index.js'
import { getTmeData } from '../src/data/tme/index.js'
import { getReportLessons, emptyReportProgress, reportProgressKey, saveReportProgress } from '../src/data/tas/tasReports.js'
import { getCourseCompletion } from '../src/data/courseCompletion.js'

const courses = language => ({
  tas: [...getTasData(language).allSteps, ...getReportLessons(language)],
  trb: getTrbData(language).allSteps,
  tme: getTmeData(language).allSteps,
})

test('completion requires every defined lesson, regardless of visit order or stale stored IDs', () => {
  for (const lessons of Object.values(courses('en'))) {
    for (const partId of new Set(lessons.map(step => step.partId))) {
      const part = lessons.filter(step => step.partId === partId)
      const step = part.at(-1)
      const completed = new Set([step.id, 'retired-lesson'])
      assert.equal(getCourseCompletion(step, lessons, completed).courseComplete, false)
      assert.equal(getCourseCompletion(step, lessons, completed).partComplete, part.length === 1)
      part.forEach(step => completed.add(step.id))
      assert.equal(getCourseCompletion(step, lessons, completed).partComplete, true)
      assert.equal(getCourseCompletion(step, lessons, completed).courseComplete, false)
      lessons.forEach(step => completed.add(step.id))
      assert.deepEqual(getCourseCompletion(step, lessons, completed), { courseComplete: true, partComplete: true })
      completed.delete(step.id)
      assert.deepEqual(getCourseCompletion(step, lessons, completed), { courseComplete: false, partComplete: false })
    }
  }
  assert.deepEqual(getCourseCompletion(null, [], new Set()), { courseComplete: false, partComplete: false })
})

test('all products render truthful part/course completion and bilingual invalid-route fallbacks without rewriting saved progress', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  const previousWindow = globalThis.window
  const previousStorage = globalThis.localStorage
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const { uiText } = await server.ssrLoadModule('/src/data/uiText.js')
    for (const language of ['en', 'id']) for (const [product, lessons] of Object.entries(courses(language))) {
      const t = uiText[language]
      const values = new Map([
        ['cubicost-tas-tutorial-language-v1', language],
        ['cubicost:tutorial:tas:migrated-v1', '1'],
        ['cubicost:tutorial:tas:curriculum-v2-migrated', '1'],
      ])
      globalThis.localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
      const render = id => {
        globalThis.window = { location: { pathname: `/${product}/lesson/${id}`, search: '', hash: '' } }
        return renderToStaticMarkup(React.createElement(App))
      }
      const seed = ids => {
        const reportIds = new Set(product === 'tas' ? getReportLessons().map(step => step.id) : [])
        values.set(`cubicost:tutorial:${product}:progress`, JSON.stringify({ completed: ids.filter(id => !reportIds.has(id)), started: ids, checklists: {} }))
        if (product === 'tas') values.set(reportProgressKey, JSON.stringify(Object.fromEntries(getReportLessons().map(step => [step.id, { completed: ids.includes(step.id), checks: [] }]))))
      }
      const last = lessons.at(-1)
      seed([last.id])
      let html = render(last.id)
      assert(html.includes(`<h2>${t.lessonCompleted}</h2>`))
      assert(!html.includes(t.completedCourse(product.toUpperCase())))
      const lastPart = lessons.filter(step => step.partId === last.partId)
      seed(lastPart.map(step => step.id))
      html = render(last.id)
      assert(html.includes(`<h2>${t.partCompleted(last.partNumber)}</h2>`))
      assert(!html.includes(`<h2>${t.courseCompleted}</h2>`))
      seed(lessons.map(step => step.id))
      html = render(last.id)
      assert(html.includes(`<h2>${t.courseCompleted}</h2>`))
      const firstPart = lessons.filter(step => step.partId === lessons[0].partId)
      const boundary = firstPart.at(-1)
      seed([boundary.id])
      assert(render(boundary.id).includes(`<h2>${t.lessonCompleted}</h2>`))
      seed(firstPart.map(step => step.id))
      assert(render(boundary.id).includes(`<h2>${t.partCompleted(boundary.partNumber)}</h2>`))
      const before = [...values]
      const invalid = render('not-a-real-lesson')
      assert(invalid.includes(`<h1>${t.lessonNotFound}</h1>`))
      assert(invalid.includes(`class="primary-button" href="/${product}/"`))
      assert(invalid.includes('lesson-topbar'))
      assert(invalid.includes('<footer>'))
      assert.deepEqual([...values], before)
      assert(!render(lessons[0].id).includes(`<h1>${t.lessonNotFound}</h1>`))
      if (product === 'tas') {
        assert(render('column-report').includes('<h1>Beam – Column</h1>'))
        assert(render('quantity-reports').includes('class="action-viewer"'))
      }
    }
  } finally {
    globalThis.window = previousWindow
    globalThis.localStorage = previousStorage
    await server.close()
  }
})

test('report storage rejection preserves the in-memory change and prior record; recovery saves the latest progress', () => {
  const progress = emptyReportProgress()
  const previous = JSON.stringify(progress)
  const records = new Map([[reportProgressKey, previous]])
  const denied = { setItem() { throw new DOMException('Full', 'QuotaExceededError') } }
  progress['pile-cap-report'] = { completed: true, checks: [0, 1, 2] }
  const snapshot = structuredClone(progress)
  assert.equal(saveReportProgress(progress, denied), false)
  assert.deepEqual(progress, snapshot)
  assert.equal(records.get(reportProgressKey), previous)
  assert.equal(saveReportProgress(progress, { setItem: (key, value) => records.set(key, value) }), true)
  assert.deepEqual(JSON.parse(records.get(reportProgressKey)), progress)
})
