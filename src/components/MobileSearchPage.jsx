import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { buildSearchCatalog, popularLessons, searchLessons } from '../data/courseSearch.js'
import { getProductLabel } from '../data/productConfig.js'

export default function MobileSearchPage({ courses, t }) {
  const [query, setQuery] = useState('')
  const input = useRef(null)
  const catalog = useMemo(() => buildSearchCatalog(courses), [courses])
  const hasQuery = Boolean(query.trim())
  const results = useMemo(() => searchLessons(catalog, query), [catalog, query])
  const lessons = hasQuery ? results : popularLessons(catalog)

  useEffect(() => { input.current?.focus() }, [])

  return <section className="mobile-search-page" aria-labelledby="mobile-search-title">
    <h1 id="mobile-search-title">{t.mobileSearch}</h1>
    <div className="mobile-search-field" role="search">
      <Search size={20} aria-hidden="true" />
      <label className="sr-only" htmlFor="mobile-course-search">{t.searchAria}</label>
      <input ref={input} id="mobile-course-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.searchAllCourses} autoComplete="off" enterKeyHint="search" />
      {query && <button type="button" aria-label={t.clearSearch} onClick={() => { setQuery(''); input.current?.focus() }}><X size={20} aria-hidden="true" /></button>}
    </div>
    <h2>{hasQuery ? t.searchResults : t.popularTopics}</h2>
    <p className="mobile-search-status" role="status">{hasQuery ? (results.length ? t.searchResultCount(results.length) : t.noResults(query.trim())) : ''}</p>
    <ul className="mobile-search-results">
      {lessons.map(lesson => <li key={lesson.key}><a href={lesson.href}>
        <span><small>{getProductLabel(lesson.product)} · {t.part} {lesson.partNumber} · {lesson.partTitle}</small><strong>{lesson.title}</strong></span>
        <ArrowUpRight size={19} aria-hidden="true" />
      </a></li>)}
    </ul>
  </section>
}
