import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('presenter map links every slide in all three bilingual courses and marks the current slide', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  try {
    const { default: Map } = await server.ssrLoadModule('/src/components/PresentationMap.jsx')
    const { getTasData } = await server.ssrLoadModule('/src/data/tas/index.js')
    const { getReportLessons } = await server.ssrLoadModule('/src/data/tas/tasReports.js')
    const { getTrbData } = await server.ssrLoadModule('/src/data/trb/index.js')
    const { getTmeData } = await server.ssrLoadModule('/src/data/tme/index.js')
    for (const language of ['id', 'en']) {
      const tas = getTasData(language)
      const reports = getReportLessons(language)
      tas.allSteps = [...tas.allSteps.filter(step => step.partId !== 'part-3'), ...reports]
      tas.tutorialParts = tas.tutorialParts.map(part => part.id === 'part-3' ? { ...part, steps: reports } : part)
      const courses = { tas, trb: getTrbData(language), tme: getTmeData(language) }
      for (const [product, course] of Object.entries(courses)) {
        const lesson = course.allSteps.at(-1)
        const html = renderToStaticMarkup(React.createElement(Map, { courses, product, lessonId: lesson.id, index: 0, walkthrough: true, language, onSelect() {} }))
        assert(html.includes(language === 'en' ? 'Presentation learning map' : 'Peta belajar presentasi'))
        assert.equal((html.match(/aria-current="step"/g) || []).length, 1)
        for (const step of course.allSteps) {
          for (const slide of step.actions.keys()) {
            const url = `/present?${new URLSearchParams({ product, lesson: step.id, slide: String(slide) })}`.replaceAll('&', '&amp;')
            assert(html.includes(`href="${url}"`), `Missing ${product}/${step.id}/${slide}`)
          }
        }
      }
    }
  } finally { await server.close() }
})
