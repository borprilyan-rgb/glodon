import { BookOpen, ClipboardCheck, Search, Settings, Trophy } from 'lucide-react'

const destinations = [
  { id: 'course', href: (product) => product ? `/${product}/` : '/', icon: BookOpen },
  { id: 'assessment', href: () => '/exercises', icon: ClipboardCheck },
  { id: 'scores', href: () => '/exercises/score', icon: Trophy },
  { id: 'search', href: () => '/search', icon: Search },
  { id: 'settings', href: () => '/settings', icon: Settings },
]

export default function MobileBottomNavigation({ page, product, t }) {
  const current = ['hub', 'welcome', 'course', 'lesson'].includes(page)
    ? 'course'
    : ['exercises', 'exercise', 'tests'].includes(page)
      ? 'assessment'
      : page === 'scores'
        ? 'scores'
        : ['search', 'settings'].includes(page)
          ? page
          : null

  return <nav className="mobile-bottom-nav" aria-label={t.mobilePrimaryNavigation}>
    {destinations.map(({ id, href, icon: Icon }) => <a key={id} href={href(product)} aria-label={t[`mobile${id[0].toUpperCase()}${id.slice(1)}`] || t[id]} aria-current={current === id ? 'page' : undefined} className={current === id ? 'is-current' : undefined}>
      <Icon size={24} strokeWidth={current === id ? 2.6 : 1.8} aria-hidden="true" />
    </a>)}
  </nav>
}
