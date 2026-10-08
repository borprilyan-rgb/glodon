import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { observeAdmin, isAuthorizedAdmin, signOutAdmin, fetchResults } from '../firebase/client'
import { downloadResultsCsv } from '../firebase/resultsCsv'
import TutorialLayout from './TutorialLayout'
import AdminAuthentication from './AdminAuthentication'
import AdminAnswerReview from './AdminAnswerReview'
import { uiText } from '../data/uiText'
import '../styles/exercise.css'
import '../styles/admin.css'

const emptyFilters = { employeeId: '', course: '', section: '', from: '', until: '' }
const copy = {
  en: {
    title: 'Test Results', home: 'Back to Home', logout: 'Sign Out',
    checking: 'Checking admin access…',
    denied: 'This account is not authorized. Ask the Firebase project owner to authorize this UID, then refresh.',
    filters: 'Result filters', employeeId: 'Employee ID', course: 'Course', section: 'Section', allCourses: 'All courses', allSections: 'All sections',
    from: 'From date', until: 'To date', apply: 'Apply Filters', export: 'Export CSV', loading: 'Loading results…',
    count: count => `${count} attempts loaded`, table: 'Test results table', name: 'Name', score: 'Score', status: 'Pass status', submitted: 'Submitted (Asia/Jakarta)',
    passed: 'Passed', notPassed: 'Not passed', details: 'Details', detailsFor: name => `Details for ${name}`,
    jobTitle: 'Job title', more: 'Load More',
    empty: 'Apply filters to load results. If no attempts match, adjust your filters.',
  },
  id: {
    title: 'Hasil Tes', home: 'Kembali ke Beranda', logout: 'Keluar',
    checking: 'Memeriksa akses admin…',
    denied: 'Akun ini belum diizinkan. Minta pemilik proyek Firebase mengizinkan UID ini, lalu muat ulang halaman.',
    filters: 'Filter hasil', employeeId: 'No. Karyawan', course: 'Kursus', section: 'Bagian', allCourses: 'Semua kursus', allSections: 'Semua bagian',
    from: 'Tanggal mulai', until: 'Tanggal akhir', apply: 'Terapkan Filter', export: 'Ekspor CSV', loading: 'Memuat hasil…',
    count: count => `${count} percobaan dimuat`, table: 'Tabel hasil tes', name: 'Nama', score: 'Nilai', status: 'Status kelulusan', submitted: 'Dikirim (Asia/Jakarta)',
    passed: 'Lulus', notPassed: 'Belum lulus', details: 'Detail', detailsFor: name => `Detail untuk ${name}`,
    jobTitle: 'Jabatan', more: 'Muat Lagi',
    empty: 'Terapkan filter untuk memuat hasil. Jika tidak ada percobaan yang cocok, sesuaikan filter.',
  },
}

export default function AdminResults({ language = 'id', onLanguageChange }) {
  const c = copy[language]
  const [expanded, setExpanded] = useState(new Set())
  const [identity, setIdentity] = useState({ user: null, authorized: false, checking: true })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)
  const [results, setResults] = useState({ rows: [], cursor: null, hasMore: false })
  const request = useRef(0)
  const table = useRef(null)
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
  const field = (name, label, type = 'text') => <label htmlFor={`admin-${name}`}>{label}<input id={`admin-${name}`} name={name} type={type} value={filters[name]} pattern={name === 'employeeId' ? '[0-9]{6}' : undefined} onChange={event => setFilters(current => ({ ...current, [name]: event.target.value }))} /></label>
  function toggleDetails(id) {
    if (!expanded.has(id) && table.current) table.current.scrollLeft = 0
    setExpanded(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next })
  }
  return <TutorialLayout page="admin" language={language} onLanguageChange={onLanguageChange} t={uiText[language]} headerActions={<>
    <span className="admin-label">Admin</span>
    {identity.user && <><span className="admin-email" title={identity.user.email}>{identity.user.email}</span><button type="button" className="admin-signout" onClick={logout}>{c.logout}</button></>}
  </>}>
    <section className="admin-results section-exercise">
      <div className="admin-heading"><h1>{c.title}</h1><a href="/">{c.home}</a></div>
    {error && <p className="admin-alert" role="alert">{error}</p>}
    {identity.checking ? <p role="status">{c.checking}</p> : !identity.user ? <AdminAuthentication language={language} /> : !identity.authorized ? <p className="admin-alert" role="alert">{c.denied}</p> : <>
      <form className="exercise-card admin-filters" aria-label={c.filters} onSubmit={load}>
        {field('employeeId', c.employeeId)}
        <label htmlFor="admin-course">{c.course}<select id="admin-course" aria-label={c.course} value={filters.course} onChange={event => setFilters(current => ({ ...current, course: event.target.value }))}><option value="">{c.allCourses}</option><option value="tas">TAS</option><option value="trb">TRB</option><option value="tme">TME-C</option></select></label>
        <label htmlFor="admin-section">{c.section}<select id="admin-section" aria-label={c.section} value={filters.section} onChange={event => setFilters(current => ({ ...current, section: event.target.value }))}><option value="">{c.allSections}</option>{[1, 2, 3].map(section => <option key={section} value={section}>{section}</option>)}</select></label>
        {field('from', c.from, 'date')}{field('until', c.until, 'date')}
        <button className="primary-button" disabled={busy}>{c.apply}</button>
      </form>
      <div className="admin-results-toolbar">
        <p role="status">{busy ? c.loading : c.count(results.rows.length)}</p>
        <button type="button" className="secondary-button" disabled={busy} onClick={exportCsv}>{c.export}</button>
      </div>
      <div ref={table} className="admin-table" role="region" aria-label={c.table} tabIndex={0}>
        <table><thead><tr>{[c.name, c.employeeId, c.course, c.section, c.score, c.status, c.submitted, c.details].map(title => <th scope="col" key={title}>{title}</th>)}</tr></thead>
          <tbody>{results.rows.map(row => <Fragment key={row.attemptId}>
            <tr className="admin-result-row">
              <td>{row.name}</td><td>{row.employeeId}</td><td>{row.course === 'tme' ? 'TME-C' : row.course.toUpperCase()}</td><td>{row.section}</td><td className="admin-score">{row.score}/{row.maximumScore}</td><td>{row.passed ? c.passed : c.notPassed}</td>
              <td><time dateTime={row.submittedAt}>{new Date(row.submittedAt).toLocaleString(language === 'en' ? 'en-GB' : 'id-ID', { timeZone: 'Asia/Jakarta' })}</time></td>
              <td><button type="button" className="admin-details-toggle" aria-label={c.detailsFor(row.name)} aria-expanded={expanded.has(row.attemptId)} aria-controls={`details-${row.attemptId}`} onClick={() => toggleDetails(row.attemptId)}>{c.details}</button></td>
            </tr>
            <tr id={`details-${row.attemptId}`} className="admin-row-details" hidden={!expanded.has(row.attemptId)}><td colSpan={8}>
              <dl className="admin-job-title"><div><dt>{c.jobTitle}</dt><dd>{row.jobTitle}</dd></div></dl>
              {expanded.has(row.attemptId) && <AdminAnswerReview record={row} language={language} />}
            </td></tr>
          </Fragment>)}</tbody>
        </table>
        {!results.rows.length && <p className="admin-empty">{c.empty}</p>}
      </div>
      {results.hasMore && <button className="secondary-button" type="button" disabled={busy} onClick={event => load(event, true)}>{c.more}</button>}
    </>}
    </section>
  </TutorialLayout>
}
