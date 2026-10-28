import { Clipboard, Search, Settings, Trophy } from 'lucide-react'

function HomeIcon({ size = 24, strokeWidth = 2, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 10 12 2l9 8v11h-6v-6a3 3 0 0 0-6 0v6H3Z" />
  </svg>
}

const destinations = [
  { id: 'course', href: (product) => product ? `/${product}/` : '/', icon: HomeIcon },
  { id: 'assessment', href: () => '/exercises', icon: Clipboard },
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
        : ['search', 'settings', 'contact'].includes(page)
          ? page === 'contact' ? 'settings' : page
          : null

  return <nav className="mobile-bottom-nav" aria-label={t.mobilePrimaryNavigation}>
    {destinations.map(({ id, href, icon: Icon }) => <a key={id} href={href(product)} aria-label={t[`mobile${id[0].toUpperCase()}${id.slice(1)}`] || t[id]} aria-current={current === id ? 'page' : undefined} className={current === id ? 'is-current' : undefined}>
      <Icon size={24} strokeWidth={current === id ? 2.2 : 1.8} aria-hidden="true" />
    </a>)}
  </nav>
}
