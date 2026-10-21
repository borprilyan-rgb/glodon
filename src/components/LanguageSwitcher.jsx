export default function LanguageSwitcher({ language, onChange, t }) {
  return <div className="language-switcher" role="group" aria-label={t.language}>
    <button type="button" className={language === 'id' ? 'is-active' : ''} aria-label="Bahasa Indonesia" aria-pressed={language === 'id'} onClick={() => onChange('id')} lang="id">{t.indonesian}</button>
    <button type="button" className={language === 'en' ? 'is-active' : ''} aria-label="English" aria-pressed={language === 'en'} onClick={() => onChange('en')} lang="en">{t.english}</button>
  </div>
}
