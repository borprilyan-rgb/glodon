export function jakartaDateRange(from, until) {
  const parse = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) throw new Error('Enter a valid date.')
    const date = new Date(`${value}T00:00:00+07:00`)
    if (!Number.isFinite(date.getTime())) throw new Error('Enter a valid date.')
    if (new Date(date.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10) !== value) throw new Error('Enter a valid date.')
    return date
  }
  const start = from ? parse(from) : null
  const end = until ? new Date(parse(until).getTime() + 86400000) : null
  if (start && end && start >= end) throw new Error('The end date must be on or after the start date.')
  return { from: start, until: end }
}

export function resultsCsv(rows) {
  const fields = ['attemptId', 'uid', 'name', 'jobTitle', 'employeeId', 'course', 'section', 'score', 'maximumScore', 'passed', 'scoreVerified', 'assessmentVersion', 'submittedAt', 'answers']
  const escape = value => {
    let text = String(value ?? '')
    // Quoting alone does not prevent spreadsheet formula execution.
    if (/^[\s]*[=+@-]/.test(text) || /^\d{6}$/.test(text)) text = `'${text}`
    return `"${text.replace(/"/g, '""')}"`
  }
  return '\uFEFF' + [fields.map(escape).join(','), ...rows.map(row => fields.map(field => escape(field === 'answers' ? JSON.stringify(row.answers) : row[field])).join(','))].join('\r\n')
}

export function downloadResultsCsv(rows) {
  const url = URL.createObjectURL(new Blob([resultsCsv(rows)], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'cubicost-test-results.csv'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
