import { Lightbulb } from 'lucide-react'
export default function TechnicalNote({ children }) { return <aside className="callout callout--note"><Lightbulb /><div><strong>Technical note</strong><p>{children}</p></div></aside> }
