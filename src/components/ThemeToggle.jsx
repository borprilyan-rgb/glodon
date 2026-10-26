import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle({ theme = 'light', onToggle, language }) {
  const dark = theme === 'dark'
  const en = language === 'en'
  return <button type="button" className="theme-toggle" onClick={onToggle} aria-pressed={dark} aria-label={en ? 'Night mode' : 'Mode malam'} title={dark ? (en ? 'Switch to light mode' : 'Gunakan mode terang') : (en ? 'Switch to night mode' : 'Gunakan mode malam')}>
    {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
  </button>
}
