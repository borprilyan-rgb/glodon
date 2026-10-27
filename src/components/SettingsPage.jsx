import { useState } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'

const settingDefinitions = ['language', 'appearance', 'fullscreen']

export default function SettingsPage({ language, onLanguageChange, theme, onThemeToggle, mobileLessonFullscreen, onMobileLessonFullscreenToggle, t }) {
  const [openSetting, setOpenSetting] = useState(null)
  const settings = {
    language: {
      title: t.language,
      value: language === 'id' ? 'ID' : 'EN',
      options: [
        { value: 'id', label: t.settingsIndonesian, ariaLabel: 'Bahasa Indonesia' },
        { value: 'en', label: t.settingsEnglish, ariaLabel: 'English' },
      ],
      selected: language,
      choose: onLanguageChange,
    },
    appearance: {
      title: t.settingsAppearance,
      value: theme === 'dark' ? t.nightMode : t.lightMode,
      options: [
        { value: 'light', label: t.lightMode },
        { value: 'dark', label: t.nightMode },
      ],
      selected: theme,
      choose: (value) => { if (value !== theme) onThemeToggle() },
    },
    fullscreen: {
      title: t.fullScreenMode,
      value: mobileLessonFullscreen ? t.enabled : t.disabled,
      options: [
        { value: 'on', label: t.enabled },
        { value: 'off', label: t.disabled },
      ],
      selected: mobileLessonFullscreen ? 'on' : 'off',
      choose: (value) => { if ((value === 'on') !== mobileLessonFullscreen) onMobileLessonFullscreenToggle() },
    },
  }

  const active = openSetting ? settings[openSetting] : null

  return <section className="settings-page" aria-label={t.settingsTitle}>
    <h1 className="sr-only">{t.settingsTitle}</h1>
    {!active ? <div className="settings-page__list">
      {settingDefinitions.map((key) => {
        const setting = settings[key]
        return <div key={key} className={`settings-page__card${key === 'fullscreen' ? ' settings-page__card--mobile-only' : ''}`}>
          <button type="button" className="settings-row" onClick={() => setOpenSetting(key)} aria-label={`${setting.title}: ${setting.value}`}>
            <span className="settings-row__title">{setting.title}</span>
            <span className="settings-row__trailing"><span className="settings-row__value">{setting.value}</span><ChevronRight size={20} aria-hidden="true" /></span>
          </button>
        </div>
      })}
    </div> : <section className="settings-subpage" aria-labelledby="settings-subpage-title">
      <header className="settings-subpage__header">
        <button type="button" className="settings-subpage__back" onClick={() => setOpenSetting(null)} aria-label={t.backToSettings}>
          <ArrowLeft size={21} aria-hidden="true" />
        </button>
        <h2 id="settings-subpage-title">{active.title}</h2>
      </header>
      <div className="settings-radio-group" role="radiogroup" aria-labelledby="settings-subpage-title">
        {active.options.map((option) => <label key={option.value} className="settings-radio-option">
          <span>{option.label}</span>
          <input type="radio" name={`settings-${openSetting}`} value={option.value} checked={active.selected === option.value} aria-label={option.ariaLabel || option.label} onChange={() => active.choose(option.value)} />
        </label>)}
      </div>
    </section>}
  </section>
}
