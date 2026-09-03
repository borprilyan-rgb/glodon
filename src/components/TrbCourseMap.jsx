import { Clock3 } from 'lucide-react'

export default function TrbCourseMap({ course, t }) {
  return <div className="trb-course-map"><header><span className="eyebrow">TRB · {t.courseMapLabel}</span><h1>{course.title}</h1><p>{course.intro}</p><span className="status-badge status-badge--preparation"><Clock3 size={13} />{t.contentInPreparation}</span></header><div className="trb-parts">{course.parts.map((part) => <section className="trb-part" key={part.number}><div className="trb-part__heading"><span>{part.number}</span><div><small>{t.part} {part.number}</small><h2>{part.title}</h2></div></div><ul>{part.topics.map((topic) => <li key={topic}><span>{topic}</span><small>{t.contentInPreparation}</small></li>)}</ul></section>)}</div></div>
}
