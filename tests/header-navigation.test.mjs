import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { getHeaderNavigation } from '../src/data/headerNavigation.js'

test('header uses the two contextual destinations for each page and product', () => {
  for (const product of ['tas', 'trb', 'tme']) {
    const mapPath = `/${product}/`
    const cases = [
      [{ page: 'lesson', activeStep: { id: 'example' } }, ['contact', 'learningMap'], ['/contact', mapPath]],
      [{ page: 'welcome' }, ['exercises', 'home'], [`/${product}/tests`, '/']],
      [{ page: 'course' }, ['exercises', 'home'], [`/${product}/tests`, '/']],
      [{ page: 'tests' }, ['contact', 'learningMap'], ['/contact', mapPath]],
      [{ page: 'exercise' }, ['exercises', 'learningMap'], [`/${product}/tests`, mapPath]],
    ]
    for (const [context, ids, paths] of cases) {
      const links = getHeaderNavigation({ ...context, product })
      assert.deepEqual(links.map(link => link.id), ids)
      assert.deepEqual(links.map(link => link.href), paths)
      assert.equal(new Set(links.map(link => link.href)).size, 2)
    }
  }
  assert.deepEqual(getHeaderNavigation({ page: 'hub' }).map(link => link.href), ['/contact'])
  assert.deepEqual(getHeaderNavigation({ page: 'contact' }).map(link => link.href), ['/', '/exercises'])
  assert.deepEqual(getHeaderNavigation({ page: 'exercises' }).map(link => link.href), ['/contact', '/exercises/score'])
  assert.deepEqual(getHeaderNavigation({ page: 'scores' }).map(link => link.href), ['/exercises', '/'])
  assert.deepEqual(getHeaderNavigation({ page: 'admin' }).map(link => link.href), ['/contact', '/'])
})

test('rendered headers retain language, progress, mobile controls and admin actions with only two primary links', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  try {
    const { default: LessonHeader } = await server.ssrLoadModule('/src/components/LessonHeader.jsx')
    const { uiText } = await server.ssrLoadModule('/src/data/uiText.js')
    for (const language of ['id', 'en']) {
      for (const product of ['tas', 'trb', 'tme', undefined]) {
        for (const page of ['hub', 'lesson', 'course', 'welcome', 'tests', 'exercise', 'exercises', 'scores', 'contact', 'admin']) {
          const activeStep = page === 'lesson' && product ? { id: 'example', title: 'Example lesson', partNumber: '01' } : null
          const html = renderToStaticMarkup(React.createElement(LessonHeader, {
            page, product, activeStep, completed: new Set(['example']), total: 8,
            showProgress: Boolean(product), language, t: uiText[language],
            headerActions: page === 'admin' ? React.createElement('button', { className: 'admin-signout' }, 'Sign out') : null,
          }))
          const tools = html.slice(html.indexOf('class="lesson-topbar__tools"'), html.indexOf('class="mobile-header-row"'))
          const expected = getHeaderNavigation({ page, product, activeStep })
          assert.equal((tools.match(/<a /g) || []).length, expected.length, `${language}/${product}/${page}`)
          for (const link of expected) assert(tools.includes(`href="${link.href}"`))
          assert(tools.includes('class="language-switcher"'))
          if (product && ['welcome', 'course'].includes(page)) assert(!tools.includes('progress--compact'))
          else if (product) assert(tools.includes('progress--compact'))
          assert(html.includes('class="mobile-header-row"'))
          assert(html.includes('aria-expanded="false"'))
          assert(!html.includes('undefined/course'))
          if (page === 'admin') assert(html.includes('class="admin-signout"'))
        }
      }
    }
  } finally { await server.close() }
})
