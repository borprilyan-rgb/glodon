export default function ProgressBar({ completed, total, compact = false }) {
  const percent = total ? Math.round((completed / total) * 100) : 0
  return <div className={`progress ${compact ? 'progress--compact' : ''}`}>
    <div className="progress__meta"><span>{completed} of {total} steps</span><strong>{percent}%</strong></div>
    <div className="progress__track" role="progressbar" aria-label="Tutorial progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}><span style={{ width: `${percent}%` }} /></div>
  </div>
}
