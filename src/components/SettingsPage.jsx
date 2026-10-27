import { useEffect, useState } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'

const settingDefinitions = ['language', 'appearance', 'fullscreen']

export default function SettingsPage({ language, onLanguageChange, theme, onThemeToggle, t }) {
  const [openSetting, setOpenSetting] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(document.fullscreenElement))
  const [fullscreenError, setFullscreenError] = useState('')
  useEffect(() => {
    const updateFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', updateFullscreen)
    return () => document.removeEventListener('fullscreenchange', updateFullscreen)
  }, [])

  async function toggleFullscreen() {
    try {
      const app = document.querySelector('.app-shell')
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (app?.requestFullscreen) await app.requestFullscreen()
      else throw new Error('Fullscreen unavailable')
      setFullscreenError('')
    } catch {
      setFullscreenError(t.fullscreenUnavailable)
    }
  }

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
      value: isFullscreen ? t.enabled : t.disabled,
    },
  }

  const active = openSetting ? settings[openSetting] : null

  return <section className="settings-page" aria-label={t.settingsTitle}>
    <h1 className="sr-only">{t.settingsTitle}</h1>
    {!active ? <div className="settings-page__list">
      {settingDefinitions.map((key) => {
        const setting = settings[key]
        return <div key={key} className={`settings-page__card${key === 'fullscreen' ? ' settings-page__card--mobile-only' : ''}`}>
          <button type="button" className="settings-row" onClick={() => key === 'fullscreen' ? toggleFullscreen() : setOpenSetting(key)} aria-label={key === 'fullscreen' ? `${setting.title}: ${setting.value}. ${isFullscreen ? t.exitFullscreen : t.enterFullscreen}` : `${setting.title}: ${setting.value}`} aria-pressed={key === 'fullscreen' ? isFullscreen : undefined}>
            <span className="settings-row__copy"><span className="settings-row__title">{setting.title}</span>{key === 'fullscreen' && <span className="settings-row__description">{t.fullscreenCompatibilityShort}</span>}</span>
            <span className="settings-row__trailing"><span className="settings-row__value">{setting.value}</span><ChevronRight size={20} aria-hidden="true" /></span>
          </button>
          {key === 'fullscreen' && fullscreenError && <p className="settings-fullscreen-error" role="status">{fullscreenError}</p>}
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
