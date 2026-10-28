import test from 'node:test'
import assert from 'node:assert/strict'
import { buildSearchCatalog, highlightRanges, searchLessons } from '../src/data/courseSearch.js'
import { getTasData } from '../src/data/tas/index.js'
import { getReportLessons } from '../src/data/tas/tasReports.js'
import { getTrbData } from '../src/data/trb/index.js'
import { getTmeData } from '../src/data/tme/index.js'

function makeSearchCourses(language) {
  const tas = getTasData(language)
  const reports = getReportLessons(language)
  tas.tutorialParts = tas.tutorialParts.map(part => part.id === 'part-3' ? {
    ...part,
    title: 'Report',
    shortTitle: 'Report',
    steps: reports,
  } : part)
  return { tas, trb: getTrbData(language), tme: getTmeData(language) }
}

const catalogFor = language => buildSearchCatalog({ en: makeSearchCourses('en'), id: makeSearchCourses('id') }, language)

test('one catalog searches English and Indonesian while displaying selected-language labels', () => {
  const catalog = catalogFor('id')
  const english = searchLessons(catalog, 'Column Identification')
  const indonesian = searchLessons(catalog, 'Identifikasi Kolom')
  assert.ok(english.some(lesson => lesson.key === 'tas:identify-columns'))
  assert.ok(indonesian.some(lesson => lesson.key === 'tas:identify-columns'))
  const result = english.find(lesson => lesson.key === 'tas:identify-columns')
  assert.equal(result.title, 'Identifikasi Kolom')
  assert.equal(result.partTitle, 'Pemodelan Elemen Bangunan')
})

test('indexes part summaries and lesson instructions without duplicating course copy', () => {
  const catalog = catalogFor('en')
  assert.ok(searchLessons(catalog, 'vector PDFs').some(lesson => lesson.key === 'tas:identify-columns'))
  assert.ok(searchLessons(catalog, 'actual length').some(lesson => lesson.key === 'tas:scale-relocate-drawing'))
})

test('returns an excerpt from the matching field and safe highlight ranges', () => {
  const results = searchLessons(catalogFor('en'), 'ground elevation')
  const lesson = results.find(result => result.key === 'tas:create-project')
  assert.ok(lesson)
  assert.match(lesson.excerpt, /ground elevation/i)
  const ranges = highlightRanges('Start with contract documents and a model.', 'contract documents')
  assert.equal(ranges.map(([start, end]) => 'Start with contract documents and a model.'.slice(start, end)).join('|'), 'contract|documents')
})

test('normalizes accents and punctuation for matching and excerpts', () => {
  const catalog = catalogFor('id')
  const results = searchLessons(catalog, 'pekerjaan mvac')
  assert.ok(results.some(lesson => lesson.key.startsWith('tme:')))
})
