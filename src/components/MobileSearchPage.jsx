import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { buildSearchCatalog, highlightRanges, popularLessons, searchLessons } from '../data/courseSearch.js'
import { getProductLabel } from '../data/productConfig.js'

function HighlightedExcerpt({ text, query }) {
  const ranges = highlightRanges(text, query)
  if (!ranges.length) return <>{text}</>
  const parts = []
  let cursor = 0
  for (const [start, end] of ranges) {
    if (start > cursor) parts.push(text.slice(cursor, start))
    parts.push(<mark key={`${start}-${end}`}>{text.slice(start, end)}</mark>)
    cursor = end
  }
  if (cursor < text.length) parts.push(text.slice(cursor))
  return <>{parts}</>
}

function LessonLink({ lesson, t, query }) {
  return <li><a href={lesson.href}>
    <span className="mobile-search-result__copy">
      <small>{getProductLabel(lesson.product)} · {t.part} {lesson.partNumber} · {lesson.partTitle}</small>
      <strong>{lesson.title}</strong>
      {lesson.excerpt && <span className="mobile-search-result__excerpt"><HighlightedExcerpt text={lesson.excerpt} query={query} /></span>}
    </span>
    <ArrowUpRight size={19} aria-hidden="true" />
  </a></li>
}

export default function MobileSearchPage({ coursesByLanguage, language = 'id', t }) {
  const [query, setQuery] = useState('')
  const input = useRef(null)
  const catalog = useMemo(() => buildSearchCatalog(coursesByLanguage, language), [coursesByLanguage, language])
  const hasQuery = Boolean(query.trim())
  const results = useMemo(() => searchLessons(catalog, query), [catalog, query])
  const topics = useMemo(() => popularLessons(catalog), [catalog])

  useEffect(() => { input.current?.focus() }, [])

  const clearSearch = () => {
    setQuery('')
    input.current?.focus()
  }

  return <section className="mobile-search-page" aria-labelledby="mobile-search-title">
    <h1 id="mobile-search-title" className="sr-only">{t.mobileSearch}</h1>
    <div className="mobile-search-field" role="search">
      <Search size={20} aria-hidden="true" />
      <label className="sr-only" htmlFor="mobile-course-search">{t.searchAria}</label>
      <input ref={input} id="mobile-course-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.searchAllCourses} autoComplete="off" enterKeyHint="search" />
      {hasQuery && <button type="button" aria-label={t.clearSearch} onClick={clearSearch}><X size={20} aria-hidden="true" /></button>}
    </div>
    <h2>{hasQuery ? t.searchResults : t.popularTopics}</h2>
    <p className="mobile-search-status" role="status">
      {hasQuery ? results.length ? t.searchResultCount(results.length) : t.noResults(query.trim()) : ''}
    </p>
    {hasQuery && !results.length && <div className="mobile-search-recovery">
      <button type="button" className="mobile-search-clear" onClick={clearSearch}>{t.clearSearchAction}</button>
      <h3>{t.searchSuggestions}</h3>
      <ul className="mobile-search-topics mobile-search-topics--recovery">
        {topics.slice(0, 3).map(lesson => <LessonLink key={lesson.key} lesson={lesson} t={t} />)}
      </ul>
    </div>}
    {!hasQuery && <ul className="mobile-search-topics">
      {topics.map(lesson => <LessonLink key={lesson.key} lesson={lesson} t={t} />)}
    </ul>}
    {hasQuery && results.length > 0 && <ul className="mobile-search-results">
      {results.map(lesson => <LessonLink key={lesson.key} lesson={lesson} t={t} query={query} />)}
    </ul>}
  </section>
}
