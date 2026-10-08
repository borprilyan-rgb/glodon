import { useCallback, useEffect, useRef, useState } from 'react'
import { observeAdmin, isAuthorizedAdmin, signInAdmin, signOutAdmin, fetchResults } from '../firebase/client'
import { downloadResultsCsv } from '../firebase/resultsCsv'
import '../styles/exercise.css'
import '../styles/admin.css'

const emptyFilters = { employeeId: '', course: '', section: '', from: '', until: '' }

export default function AdminResults() {
  const [identity, setIdentity] = useState({ user: null, authorized: false, checking: true })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [results, setResults] = useState({ rows: [], cursor: null, hasMore: false })
  const request = useRef(0)
  const invalidateRequests = useCallback(() => { request.current++ }, [])
  useEffect(() => {
    let alive = true
    let generation = 0
    let unsubscribe
    try {
      unsubscribe = observeAdmin(async user => {
        const current = ++generation
        request.current++
        setBusy(false)
        setResults({ rows: [], cursor: null, hasMore: false })
        setIdentity({ user, authorized: false, checking: Boolean(user) })
        setError('')
        if (!user) return
        try {
          const authorized = await isAuthorizedAdmin(user)
          if (alive && current === generation) setIdentity({ user, authorized, checking: false })
        } catch (error) {
          if (alive && current === generation) { setIdentity({ user, authorized: false, checking: false }); setError(error.message) }
        }
      })
    } catch (error) { queueMicrotask(() => { if (alive) { setError(error.message); setIdentity({ user: null, authorized: false, checking: false }) } }) }
    return () => { alive = false; generation++; invalidateRequests(); unsubscribe?.() }
  }, [invalidateRequests])

  async function login() {
    setError('')
    try { await signInAdmin() } catch (error) { setError(error.message) }
  }
  async function logout() {
    request.current++
    setBusy(false)
    setResults({ rows: [], cursor: null, hasMore: false })
    try { await signOutAdmin() } catch (error) { setError(error.message) }
  }
  async function load(event, more = false) {
    event?.preventDefault()
    if (!identity.authorized || busy) return
    const current = ++request.current
    const selected = more ? applied : { ...filters }
    setBusy(true)
    setError('')
    if (!more) { setApplied(selected); setResults({ rows: [], cursor: null, hasMore: false }) }
    try {
      const page = await fetchResults(selected, more ? results.cursor : null)
      if (current === request.current) setResults(previous => ({ ...page, rows: more ? [...previous.rows, ...page.rows] : page.rows }))
    } catch (error) { if (current === request.current) setError(error.message) }
    finally { if (current === request.current) setBusy(false) }
  }
  async function exportCsv() {
    if (!identity.authorized || busy) return
    const current = ++request.current
    setBusy(true)
    setError('')
    try {
      const rows = []
      let cursor = null
      let more = true
      while (more && current === request.current) {
        const page = await fetchResults(applied, cursor)
        rows.push(...page.rows)
        cursor = page.cursor
        more = page.hasMore
      }
      if (current === request.current) downloadResultsCsv(rows)
    } catch (error) { if (current === request.current) setError(error.message) }
    finally { if (current === request.current) setBusy(false) }
  }
  const field = (name, label, type = 'text') => <label>{label}<input name={name} type={type} value={filters[name]} pattern={name === 'employeeId' ? '[0-9]{6}' : undefined} onChange={event => setFilters(current => ({ ...current, [name]: event.target.value }))} /></label>
  return <article className="admin-results section-exercise">
    <header className="exercise-header"><h1>Admin Results</h1><p>Central test attempts · Dates in Asia/Jakarta</p></header>
    {error && <p role="alert">{error}</p>}
    {identity.checking ? <p role="status">Checking admin access…</p> : !identity.user ? <section className="exercise-card"><p>Sign in with an authorized Google account to read results.</p><button className="primary-button" onClick={login}>Sign In With Google</button></section> : <>
      <section className="exercise-card"><p>Signed in as {identity.user.email}</p><p>Your admin UID: <code>{identity.user.uid}</code></p><button className="secondary-button" onClick={logout}>Sign Out</button>
      {!identity.authorized && <p role="alert">This account is not authorized. Ask the Firebase project owner to authorize this UID, then refresh.</p>}</section>
      {identity.authorized && <>
        <p>Employee IDs are self-reported. All scores are calculated by the client and unverified.</p>
        <form className="exercise-card admin-filters" onSubmit={load}>
          {field('employeeId', 'Employee ID')}
          <label htmlFor="admin-course">Course<select id="admin-course" aria-label="Course" value={filters.course} onChange={event => setFilters(current => ({ ...current, course: event.target.value }))}><option value="">All courses</option><option value="tas">TAS</option><option value="trb">TRB</option><option value="tme">TME-C</option></select></label>
          <label htmlFor="admin-section">Section<select id="admin-section" aria-label="Section" value={filters.section} onChange={event => setFilters(current => ({ ...current, section: event.target.value }))}><option value="">All sections</option>{[1, 2, 3].map(section => <option key={section} value={section}>{section}</option>)}</select></label>
          {field('from', 'From date', 'date')}{field('until', 'Through date', 'date')}
          <button className="primary-button" disabled={busy}>Load Results</button>
        </form>
        <p role="status">{busy ? 'Loading results…' : `${results.rows.length} attempts loaded.`}</p>
        <button type="button" className="secondary-button" disabled={busy} onClick={exportCsv}>Export All Matching Results to CSV</button>
        <p>Export uses the last applied filters and includes every matching page.</p>
        <div className="admin-table"><table><thead><tr>{['Submitted (Asia/Jakarta)', 'Employee ID', 'Name', 'Job title', 'Course', 'Section', 'Score', 'Status', 'Version', 'Answers'].map(title => <th key={title}>{title}</th>)}</tr></thead><tbody>{results.rows.map(row => <tr key={row.attemptId}>
          <td>{new Date(row.submittedAt).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' })}</td><td>{row.employeeId}</td><td>{row.name}</td><td>{row.jobTitle}</td><td>{row.course === 'tme' ? 'TME-C' : row.course.toUpperCase()}</td><td>{row.section}</td><td>{row.score}/{row.maximumScore} (unverified)</td><td>{row.passed ? 'Passed' : 'Not passed'}</td><td>{row.assessmentVersion}</td><td><details><summary>View answers</summary><pre>{JSON.stringify(row.answers, null, 2)}</pre><small>Attempt: {row.attemptId}</small></details></td>
        </tr>)}</tbody></table></div>
        {results.hasMore && <button className="secondary-button" type="button" disabled={busy} onClick={event => load(event, true)}>Load More</button>}
      </>}
    </>}
    <a className="outline-nav-button" href="/">Back To Learning</a>
  </article>
}
