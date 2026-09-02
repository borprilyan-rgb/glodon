import { Menu } from 'lucide-react'
import ProgressBar from './ProgressBar'

export default function MobileNavigation({ onOpen, completed, total, t, language, onLanguageChange }) {
  return <header className="mobile-nav"><button className="mobile-nav__menu" onClick={onOpen}><Menu size={21} /><span>{t.lessons}</span></button><div className="mobile-language" aria-label={t.language}><button className={language === 'id' ? 'is-active' : ''} onClick={() => onLanguageChange('id')}>ID</button><button className={language === 'en' ? 'is-active' : ''} onClick={() => onLanguageChange('en')}>EN</button></div><ProgressBar completed={completed} total={total} t={t} compact /></header>
}
