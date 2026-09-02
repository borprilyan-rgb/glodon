import { Lightbulb } from 'lucide-react'
export default function TechnicalNote({ children, t }) { return <aside className="callout callout--note"><Lightbulb /><div><strong>{t.technicalNote}</strong><p>{children}</p></div></aside> }
