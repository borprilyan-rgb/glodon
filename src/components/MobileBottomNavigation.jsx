import { BookOpen, ClipboardCheck, Settings, Trophy } from 'lucide-react'

const destinations = [
  { id: 'course', href: (product) => product ? `/${product}/` : '/', icon: BookOpen },
  { id: 'assessment', href: () => '/exercises', icon: ClipboardCheck },
  { id: 'scores', href: () => '/exercises/score', icon: Trophy },
  { id: 'settings', href: () => '/settings', icon: Settings },
]

export default function MobileBottomNavigation({ page, product, t }) {
  const current = ['hub', 'welcome', 'course', 'lesson'].includes(page)
    ? 'course'
    : ['exercises', 'exercise', 'tests'].includes(page)
      ? 'assessment'
      : page === 'scores'
        ? 'scores'
        : page === 'settings'
          ? 'settings'
          : null

  return <nav className="mobile-bottom-nav" aria-label={t.mobilePrimaryNavigation}>
    {destinations.map(({ id, href, icon: Icon }) => <a key={id} href={href(product)} aria-current={current === id ? 'page' : undefined} className={current === id ? 'is-current' : undefined}>
      <Icon size={21} strokeWidth={current === id ? 2.4 : 1.9} aria-hidden="true" />
      <span>{t[`mobile${id[0].toUpperCase()}${id.slice(1)}`] || t[id]}</span>
    </a>)}
  </nav>
}
