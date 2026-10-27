import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'

export default function SettingsPage({ language, onLanguageChange, theme, onThemeToggle, t }) {
  return <section className="settings-page" aria-labelledby="settings-page-title">
    <header className="settings-page__header">
      <span className="eyebrow">{t.settings}</span>
      <h1 id="settings-page-title">{t.settingsTitle}</h1>
      <p>{t.settingsDescription}</p>
    </header>
    <section className="settings-page__card" aria-labelledby="settings-language-title">
      <div>
        <h2 id="settings-language-title">{t.language}</h2>
        <p>{t.settingsLanguageDescription}</p>
      </div>
      <LanguageSwitcher language={language} onChange={onLanguageChange} t={t} />
    </section>
    <section className="settings-page__card" aria-labelledby="settings-appearance-title">
      <div>
        <h2 id="settings-appearance-title">{t.settingsAppearance}</h2>
        <p>{t.settingsThemeDescription}</p>
      </div>
      <ThemeToggle theme={theme} onToggle={onThemeToggle} language={language} />
    </section>
  </section>
}
