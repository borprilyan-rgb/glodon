import { TriangleAlert } from 'lucide-react'
export default function WarningCallout({ children, t }) { return <aside className="callout callout--warning"><TriangleAlert /><div><strong>{t.warning}</strong><p>{children}</p></div></aside> }
