import { Languages } from 'lucide-react'

export default function LanguageSwitcher({ language, onChange, t }) {
  return <div className="language-switcher" aria-label={t.language}>
    <Languages size={15} aria-hidden="true" />
    <button className={language === 'id' ? 'is-active' : ''} onClick={() => onChange('id')} lang="id">{t.indonesian}</button>
    <span aria-hidden="true">/</span>
    <button className={language === 'en' ? 'is-active' : ''} onClick={() => onChange('en')} lang="en">{t.english}</button>
  </div>
}
