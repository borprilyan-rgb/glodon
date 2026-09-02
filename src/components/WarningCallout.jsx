import { TriangleAlert } from 'lucide-react'
export default function WarningCallout({ children }) { return <aside className="callout callout--warning"><TriangleAlert /><div><strong>Check before continuing</strong><p>{children}</p></div></aside> }
