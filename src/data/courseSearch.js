import { getStepPath } from './tutorialUtils.js'
import { getProductLabel } from './productConfig.js'

const normalize = (text = '') => text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()

export function buildSearchCatalog(courses) {
  return Object.entries(courses).flatMap(([product, course]) => course.tutorialParts.flatMap(part => part.steps.map(lesson => ({
    key: `${product}:${lesson.id}`,
    product,
    title: lesson.title,
    partTitle: part.title,
    partNumber: part.number,
    href: getStepPath(lesson, product),
    fields: [
      normalize(lesson.title),
      normalize([part.title, part.shortTitle].filter(Boolean).join(' ')),
      normalize([course.title, `Cubicost ${getProductLabel(product)}`, product].filter(Boolean).join(' ')),
      normalize(lesson.intro),
      normalize((lesson.actions || []).map(action => action.title || '').join(' ')),
      normalize((lesson.actions || []).map(action => [action.description, ...(action.comparison || []).map(media => media.description)].filter(Boolean).join(' ')).join(' ')),
    ],
  }))))
}

export function searchLessons(catalog, query) {
  const words = normalize(query).split(' ').filter(Boolean)
  if (!words.length) return []
  return catalog.map(lesson => ({
    lesson,
    score: words.every(word => lesson.fields.some(field => field.includes(word)))
      ? words.reduce((score, word) => score + Math.max(...lesson.fields.map((field, index) => field.includes(word) ? lesson.fields.length - index : 0)), 0)
      : 0,
  })).filter(result => result.score > 0).sort((a, b) => b.score - a.score).map(result => result.lesson)
}

export function popularLessons(catalog) {
  return ['tas:measurement-settings', 'tas:measurement-rules', 'trb:beam-schedule', 'trb:beam-support-layout', 'tme:mvac-duct', 'tme:setting-lantai']
    .map(key => catalog.find(lesson => lesson.key === key)).filter(Boolean)
}
