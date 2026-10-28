import { getStepPath } from './tutorialUtils.js'
import { getProductLabel } from './productConfig.js'

const normalize = (text = '') => text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()

function normalizeWithMap(text) {
  const characters = []
  const offsets = []
  for (let offset = 0; offset < text.length;) {
    const character = String.fromCodePoint(text.codePointAt(offset))
    const folded = character.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
    for (const foldedCharacter of folded) {
      const value = /[\p{L}\p{N}]/u.test(foldedCharacter) ? foldedCharacter : ' '
      if (value === ' ' && (characters.at(-1) === ' ' || characters.length === 0)) continue
      characters.push(value)
      offsets.push(offset)
    }
    offset += character.length
  }
  if (characters.at(-1) === ' ') {
    characters.pop()
    offsets.pop()
  }
  return { text: characters.join(''), offsets }
}

const POPULAR_LESSON_KEYS = ['tas:measurement-settings', 'tas:measurement-rules', 'trb:beam-schedule', 'trb:beam-support-layout', 'tme:mvac-duct', 'tme:setting-lantai']

const lessonFields = (course, part, lesson, product) => [
  { kind: 'title', text: lesson.title, weight: 120 },
  { kind: 'part', text: [part.title, part.shortTitle, part.number].filter(Boolean).join(' '), weight: 100 },
  { kind: 'course', text: [course.title, `Cubicost ${getProductLabel(product)}`, product].filter(Boolean).join(' '), weight: 80 },
  { kind: 'intro', text: lesson.intro, weight: 55 },
  { kind: 'summary', text: part.summary, weight: 48 },
  { kind: 'note', text: lesson.note, weight: 34 },
  { kind: 'warning', text: lesson.warning, weight: 34 },
  { kind: 'instructions', text: (lesson.instructions || []).join(' '), weight: 38 },
  { kind: 'action-title', text: (lesson.actions || []).map(action => action.title || '').join(' '), weight: 26 },
  { kind: 'action-description', text: (lesson.actions || []).map(action => [action.description, ...(action.comparison || []).map(media => media.description)].filter(Boolean).join(' ')).join(' '), weight: 16 },
].filter(field => field.text?.trim()).map(field => ({ ...field, normalized: normalize(field.text) }))

function localizedLesson(product, course, part, lesson) {
  return {
    key: `${product}:${lesson.id}`,
    product,
    title: lesson.title,
    partTitle: part.title,
    partNumber: part.number,
    href: getStepPath(lesson, product),
  }
}

export function buildSearchCatalog(coursesByLanguage, displayLanguage = 'id') {
  const locales = Object.keys(coursesByLanguage)
  const primaryCourses = coursesByLanguage[displayLanguage] || coursesByLanguage[locales[0]] || {}
  const catalog = []

  for (const [product, course] of Object.entries(primaryCourses)) {
    for (const part of course.tutorialParts || []) {
      for (const lesson of part.steps || []) {
        const translations = {}
        for (const locale of locales) {
          const translatedCourse = coursesByLanguage[locale]?.[product]
          const translatedPart = translatedCourse?.tutorialParts?.find(candidate => candidate.id === part.id)
          const translatedLesson = translatedPart?.steps?.find(candidate => candidate.id === lesson.id)
          if (translatedCourse && translatedPart && translatedLesson) {
            translations[locale] = {
              locale,
              ...localizedLesson(product, translatedCourse, translatedPart, translatedLesson),
              fields: lessonFields(translatedCourse, translatedPart, translatedLesson, product),
            }
          }
        }
        const display = translations[displayLanguage] || translations[locales[0]]
        if (!display) continue
        catalog.push({ ...display, translations })
      }
    }
  }
  return catalog
}

function bestMatch(lesson, words) {
  let score = 0
  let bestField = null
  for (const translation of Object.values(lesson.translations)) {
    for (const field of translation.fields) {
      const matches = words.filter(word => field.normalized.includes(word)).length
      if (!matches) continue
      const candidateScore = matches * field.weight + (matches === words.length ? 15 : 0)
      if (candidateScore > score || (candidateScore === score && field.weight > (bestField?.weight || 0))) {
        score = candidateScore
        bestField = field
      }
    }
  }
  if (words.some(word => !Object.values(lesson.translations).some(translation => translation.fields.some(field => field.normalized.includes(word))))) return null
  return { score, field: bestField }
}

function getExcerpt(text, query, maxLength = 150) {
  const mappedText = normalizeWithMap(text)
  const words = normalize(query).split(' ').filter(Boolean)
  const positions = words.map(word => mappedText.text.indexOf(word)).filter(position => position >= 0)
  const first = positions.length ? Math.min(...positions) : 0
  // Keep the visible source text and punctuation while locating matches in normalized text.
  const startAt = mappedText.offsets[Math.min(first, mappedText.offsets.length - 1)] || 0
  const start = Math.max(0, startAt - Math.floor(maxLength / 3))
  const end = Math.min(text.length, start + maxLength)
  const excerpt = `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
  return excerpt
}

export function searchLessons(catalog, query) {
  const words = normalize(query).split(' ').filter(Boolean)
  if (!words.length) return []
  return catalog.map(lesson => {
    const match = bestMatch(lesson, words)
    if (!match) return null
    const matchingTranslation = Object.values(lesson.translations).find(translation => translation.fields.includes(match.field))
    return { ...lesson, score: match.score, excerpt: getExcerpt(match.field.text, query), excerptLocale: matchingTranslation?.locale }
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
}

export function popularLessons(catalog) {
  return POPULAR_LESSON_KEYS.map(key => catalog.find(lesson => lesson.key === key)).filter(Boolean)
}

export function highlightRanges(text, query) {
  const { text: normalized, offsets: normalizedMap } = normalizeWithMap(text)
  const spans = []
  for (const word of normalize(query).split(' ').filter(Boolean)) {
    let from = 0
    while (from < normalized.length) {
      const index = normalized.indexOf(word, from)
      if (index < 0) break
      const start = normalizedMap[index]
      const end = (normalizedMap[index + word.length - 1] ?? start) + String.fromCodePoint(text.codePointAt(normalizedMap[index]) || 0).length
      spans.push([start, end])
      from = index + word.length
    }
  }
  return spans.sort((a, b) => a[0] - b[0]).reduce((merged, span) => {
    const last = merged.at(-1)
    if (last && span[0] <= last[1]) last[1] = Math.max(last[1], span[1])
    else merged.push(span)
    return merged
  }, [])
}
