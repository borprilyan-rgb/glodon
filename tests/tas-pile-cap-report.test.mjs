import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { pileCapReport as report, reportCell, reportPrototype } from '../src/data/tas/pileCapReport.js'
import { getTasData } from '../src/data/tas/curriculum.js'
import { reportLessons, getReportLessons, loadReportProgress, reportProgressKey } from '../src/data/tas/tasReports.js'
import reportSource from '../src/data/tas/tasReports.source.json' with { type: 'json' }

test('PileCap-def preserves source headers, grouping, merged ranges and blank values', () => {
  assert.equal(Object.keys(report.source.cells).length, 110)
  assert.deepEqual(report.groups.map(group => [group.title, group.count]), [['Classification Condition', 3], ['Quantity', 7]])
  assert.deepEqual(report.columns.map(column => column.header), ['Construction Zone', 'Floor', 'Name', 'Volume(m3)', 'Area of formwork(m2)', 'Area of soffit(m2)', 'Area of side(m2)', 'Area of top(m2)', 'Number(pc)', 'Weight of rebar(kg)'])
  assert.deepEqual(report.source.merges, ['A1:C1', 'D1:J1', 'A11:C11', 'A3:A10', 'B3:B10'])
  assert.equal(reportCell('A', 3), '[Null]')
  assert.equal(reportCell('H', 3), '0.140')
  for (let row = 5; row <= 10; row++) assert.equal(reportCell('H', row), '')
  assert.equal(reportCell('J', 3), '79.200')
  assert.equal(reportCell('D', 11), '110.572')
  assert.equal(reportCell('I', 11), '72')
  assert.equal(reportCell('J', 11), '5528.610')
  assert.equal(Object.values(report.source.cells).filter(cell => cell.formula).length, 0)
  for (const column of report.columns) {
    assert.equal(column.example, report.source.cells[column.exampleCell].display)
    assert(column.definition && column.interpretation)
  }
  assert.equal(reportPrototype.actions.length, 1)
  assert.equal(reportPrototype.stepNumber, 1)
  assert.equal(reportPrototype.partStepCount, 7)
  assert.equal(reportPrototype.hideIntro, true)
  assert.equal(reportPrototype.showInstructionsBelowImage, true)
  assert(reportPrototype.actions.every(action => action.pending === false))
  assert(reportPrototype.actions.every(action => action.caption === ''))
  assert(!reportPrototype.note)
  assert(!reportPrototype.actions.some(action => action.description.includes('Classification Condition')))
  assert.equal(reportPrototype.actions[0].description.split('\n').length, 7)
  for (const column of report.columns.slice(3)) assert(reportPrototype.actions[0].description.includes(column.header))
  const course = getTasData('id')
  assert.equal(course.allSteps.length, 16)
  assert.deepEqual(course.tutorialParts[2].steps.map(step => step.id), [])
  assert(!course.allSteps.some(step => step.id === reportPrototype.id))
})

test('prototype reuses the unchanged lesson interface and never renders an interactive table', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  try {
    const { default: Lesson } = await server.ssrLoadModule('/src/components/PileCapReportLesson.jsx')
    const { default: ScreenshotViewer } = await server.ssrLoadModule('/src/components/ScreenshotViewer.jsx')
    const { uiText } = await server.ssrLoadModule('/src/data/uiText.js')
    const course = getTasData('id')
    const props = { step: reportPrototype, progress: { completed: false, checks: [] }, t: uiText.id,
      previous: course.allSteps.filter(step => step.partId === 'part-2').at(-1),
      next: reportLessons[1] }
    const html = renderToStaticMarkup(React.createElement(Lesson, props))
    for (const className of ['tutorial-step', 'step-header', 'step-position', 'action-viewer', 'action-viewer__list', 'action-viewer__media', 'screenshot-viewer', 'screenshot-navigation', 'completion-card', 'step-navigation']) assert(html.includes(`class="${className}`), className)
    assert(html.includes('role="list"'))
    assert(html.includes('/report/elements/pile-cap-revised.png'))
    assert(!html.includes('WPS_All_Sheets_Landscape_One_Page.pdf'))
    assert(!html.includes('2026-10-20-13-41-04.xlsx'))
    const heading = html.match(/<header class="step-header">[\s\S]*?<\/header>/)[0]
    assert(!heading.includes('<p>'), 'No text below the step title')
    const actionList = html.slice(html.indexOf('class="action-viewer__list"'), html.indexOf('class="action-viewer__media"'))
    assert(!actionList.includes('<p>'), 'No descriptions beneath action names')
    assert(html.indexOf('src="/tutorial/tas/report/elements/pile-cap-revised.png"') < html.indexOf('class="screenshot-media__instruction"'), 'Explanation follows the image')
    for (const action of reportPrototype.actions) {
      const png = await readFile(`public${action.image}`)
      assert.deepEqual([...png.slice(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
      const mediaHtml = renderToStaticMarkup(React.createElement(ScreenshotViewer, { action, showInstruction: true, t: uiText.id }))
      assert(mediaHtml.indexOf('<img ') < mediaHtml.indexOf('class="screenshot-media__instruction"'))
      assert(!mediaHtml.includes('screenshot-media__placeholder'))
    }
    assert(html.includes('id="lesson-completion"'))
    assert.equal((html.match(/type="checkbox"/g) || []).length, 3)
    assert(!html.includes('<table'))
    assert(!html.includes('report-column-panel'))
    assert(!html.includes('report-action-navigation'))
    assert(!html.includes('aria-pressed'))
    assert(html.includes('slab-report'))
    assert(html.includes('calculate-verify-quantity'))
    const done = renderToStaticMarkup(React.createElement(Lesson, { ...props, progress: { completed: true, checks: [0, 1, 2] } }))
    assert(done.includes('completion-success'))
    assert(!done.includes(uiText.id.completedCourse('TAS')))
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const priorWindow = globalThis.window
    const priorStorage = globalThis.localStorage
    const values = new Map([
      ['cubicost:language', 'id'],
      ['cubicost:tutorial:tas:migrated-v1', '1'],
      ['cubicost:tutorial:tas:curriculum-v2-migrated', '1'],
    ])
    globalThis.localStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
    try {
      globalThis.window = { location: { pathname: '/tas/lesson/pile-cap-report', hash: '', search: '' } }
      const appHtml = renderToStaticMarkup(React.createElement(App))
      assert(appHtml.includes('lesson-topbar'))
      assert(appHtml.includes('class="progress'))
      assert(appHtml.includes('class="action-viewer"'))
      assert(appHtml.includes('class="completion-card"'))
      assert(!appHtml.includes('<table'))
      for (const [index, step] of reportLessons.entries()) {
        globalThis.window.location = { pathname: `/tas/lesson/${step.id}`, hash: '', search: '' }
        const reportHtml = renderToStaticMarkup(React.createElement(App))
        assert(reportHtml.includes(`<h1>${step.title}</h1>`))
        assert(reportHtml.includes(step.actions[0].image))
        assert.equal((reportHtml.match(/role="listitem"/g) || []).length, step.actions.length)
        if (index > 0) assert(reportHtml.includes(`/tas/lesson/${reportLessons[index - 1].id}`))
        if (index < reportLessons.length - 1) assert(reportHtml.includes(`/tas/lesson/${reportLessons[index + 1].id}`))
      }
      globalThis.window.location = { pathname: '/tas/course', hash: '', search: '' }
      const mapHtml = renderToStaticMarkup(React.createElement(App))
      assert.equal((mapHtml.match(/class="course-lesson /g) || []).length, 23)
      for (const step of reportLessons) assert(mapHtml.includes(`/tas/lesson/${step.id}`))
      assert(mapHtml.includes('/tas/lesson/calculate-verify-quantity'))
      const previousDocument = globalThis.document
      globalThis.document = { fullscreenElement: null }
      try {
        for (const step of reportLessons) for (const [slide, action] of step.actions.entries()) {
          globalThis.window.location = { pathname: '/present', hash: '', search: `?product=tas&lesson=${step.id}&slide=${slide}` }
          const presenter = renderToStaticMarkup(React.createElement(App))
          assert(presenter.includes(`src="${action.image}"`))
          assert(presenter.includes(`<h1>${step.title}</h1>`))
        }
      } finally { globalThis.document = previousDocument }
      globalThis.window.location = { pathname: '/tas/lesson/create-project', hash: '', search: '' }
      const existing = renderToStaticMarkup(React.createElement(App))
      assert(!existing.includes('/report/elements/pile-cap-revised.png'))
      assert(existing.includes('class="completion-card"'))
      values.set('cubicost-tas-tutorial-language-v1', 'en')
      globalThis.window.location = { pathname: '/tas/lesson/pile-cap-report', hash: '', search: '' }
      const englishLesson = renderToStaticMarkup(React.createElement(App))
      assert(englishLesson.includes('Volume(m3): Used for concrete volume.'))
      assert(!englishLesson.includes('Digunakan untuk'))
    } finally { globalThis.window = priorWindow; globalThis.localStorage = priorStorage }
    for (const path of ['src/components/TutorialStep.jsx', 'src/components/ActionStepViewer.jsx', 'src/components/ScreenshotViewer.jsx']) assert((await readFile(path, 'utf8')).length > 0)
  } finally { await server.close() }
})

test('seven report steps contain only the retained sections and columns', async () => {
  assert.deepEqual(reportLessons.map(step => step.actions.length), [1, 1, 3, 1, 1, 2, 6])
  assert.deepEqual(reportLessons.map(step => step.actions.map(action => action.title)), [
    ['Pile Cap'], ['In-Situ Slab'], ['Beam – Volume Beton', 'Beam – Bekisting', 'Beam – Tulangan'],
    ['Column'], ['Wall'], ['Door', 'Window'],
    ['Room', 'Floor Finish', 'Waterproof', 'Skirting', 'Wall Finish', 'Suspended Ceiling'],
  ])
  const expected = {
    'in-situ-slab': ['Volume(m3)', 'Area(m2)', 'Area of formwork to soffit(m2)', 'Area of formwork to edge and break of slab(m2)', 'Weight of rebar(kg)'],
    beam: ['Volume(m3)', 'Area of formwork(m2)', 'Area of formwork to side of beam(m2)', 'Area of formwork to soffit of beam(m2)', 'Weight of rebar(kg)'],
    wall: ['Area(m2)', 'Net length of wall(m)'],
    door: ['Area of opening(m2)', 'Number(pc)', 'Area of frame(m2)'],
    window: ['Area of opening(m2)', 'Number(pc)', 'Area of frame(m2)'],
  }
  for (const [slug, headers] of Object.entries(expected)) {
    const source = reportSource.reports[slug]
    const displays = source.segments || [source.display]
    assert.deepEqual(displays.flatMap(section => section.quantityColumns.map(column => column.header)), headers)
  }
  for (const removed of ['pile', 'slab-opening', 'curtain-wall', 'door-window', 'staircase']) {
    assert(!reportSource.reports[removed])
  }
  const seen = new Set()
  for (const [stepIndex, step] of reportLessons.entries()) {
    assert.equal(step.stepNumber, stepIndex + 1)
    assert.equal(step.partStepCount, 7)
    for (const [actionIndex, action] of step.actions.entries()) {
      assert.equal(action.number, actionIndex + 1)
      if (step.id !== 'beam-report') assert(!seen.has(action.sourceSheet))
      seen.add(action.sourceSheet)
      const source = Object.values(reportSource.reports).find(report => report.sheet === action.sourceSheet)
      const section = source.segments?.[actionIndex] || source.display
      assert.equal(action.image, section.image)
      assert(section.classificationColumns.every(column => !['Entity Type', 'Material'].includes(column.header)))
      if (step.id === 'wall-report') assert(!section.classificationColumns.some(column => column.header === 'Concrete Grade'))
      const lines = action.description.split('\n')
      assert.equal(lines.length, section.quantityColumns.length)
      section.quantityColumns.forEach((column, index) => assert(lines[index].startsWith(`${index + 1}. ${column.header}: `)))
      assert(!action.description.includes('Classification Condition'))
      assert.equal(action.caption, '')
      const png = await readFile(`public${action.image}`)
      assert.deepEqual([...png.slice(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
    }
  }
  assert.equal(seen.size, 13)
})

test('report completion is isolated and sanitized for each of the seven steps', () => {
  const previous = globalThis.localStorage
  try {
    globalThis.localStorage = { getItem: key => key === reportProgressKey ? JSON.stringify({
      'pile-cap-report': { completed: true, checks: [0, 0, 1, 2, 9, -1] },
      'slab-report': { completed: false, checks: [1] },
      'staircase-report': { completed: true, checks: [0, 1, 2] },
    }) : null }
    const progress = loadReportProgress()
    assert.equal(Object.keys(progress).length, 7)
    assert(!progress['staircase-report'])
    assert.deepEqual(progress['pile-cap-report'], { completed: true, checks: [0, 1, 2] })
    assert.deepEqual(progress['slab-report'], { completed: false, checks: [1] })
    assert.deepEqual(progress['finishes-report'], { completed: false, checks: [] })
  } finally { globalThis.localStorage = previous }
})

test('all report descriptions follow the language while Excel column names and report identities stay unchanged', () => {
  const english = getReportLessons('en')
  const indonesian = getReportLessons('id')
  for (const [stepIndex, step] of english.entries()) {
    assert.equal(step.id, indonesian[stepIndex].id)
    assert(step.checks.every(check => !check.includes('Dapat')))
    for (const [actionIndex, action] of step.actions.entries()) {
      const idAction = indonesian[stepIndex].actions[actionIndex]
      assert.equal(action.id, idAction.id)
      assert.equal(action.image, idAction.image)
      const enLines = action.description.split('\n')
      const idLines = idAction.description.split('\n')
      assert.equal(enLines.length, idLines.length)
      enLines.forEach((line, index) => {
        assert.equal(line.split(': ')[0], idLines[index].split(': ')[0])
        assert(line.includes(': Used for '))
        assert(idLines[index].includes(': Digunakan untuk '))
      })
    }
  }
})
