import { useEffect, useState } from 'react'
import { Accessibility, ArrowLeft, CircleHelp, ChevronRight, Languages, Maximize, SunMoon } from 'lucide-react'

const settingDefinitions = ['language', 'appearance', 'accessibility', 'help', 'fullscreen']

export default function SettingsPage({ language, onLanguageChange, theme, onThemeToggle, accessibility, onAccessibilityChange, t }) {
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
      const app = document.documentElement
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
      icon: Languages,
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
      icon: SunMoon,
      value: theme === 'dark' ? t.settingsOn : t.settingsOff,
      options: [
        { value: 'light', label: t.settingsOff },
        { value: 'dark', label: t.settingsOn },
      ],
      selected: theme,
      choose: (value) => { if (value !== theme) onThemeToggle() },
    },
    accessibility: {
      title: t.accessibility,
      icon: Accessibility,
    },
    help: {
      title: t.help,
      icon: CircleHelp,
    },
    textSize: {
      title: t.textSize,
      selected: accessibility.textSize,
      options: [
        { value: 'default', label: t.textSizeDefault },
        { value: 'large', label: t.textSizeLarge },
        { value: 'largest', label: t.textSizeLargest },
      ],
      choose: (value) => onAccessibilityChange('textSize', value),
    },
    reducedMotion: {
      title: t.reducedMotion,
      selected: accessibility.reducedMotion,
      options: [
        { value: 'system', label: t.followDeviceSetting },
        { value: 'reduce', label: t.reduceMotionOption },
      ],
      choose: (value) => onAccessibilityChange('reducedMotion', value),
    },
    fullscreen: {
      title: t.fullScreenMode,
      icon: Maximize,
      value: isFullscreen ? t.settingsOn : t.settingsOff,
    },
  }

  const active = openSetting && openSetting !== 'accessibility' ? settings[openSetting] : null
  const nestedAccessibilitySetting = ['textSize', 'reducedMotion'].includes(openSetting)
  const backToAccessibility = nestedAccessibilitySetting

  return <section className="settings-page" aria-label={t.settingsTitle}>
    <h1 className="sr-only">{t.settingsTitle}</h1>
    {openSetting === null ? <div className="settings-page__list">
      {settingDefinitions.map((key) => {
        const setting = settings[key]
        const Icon = setting.icon
        return <div key={key} className={`settings-page__card${key === 'fullscreen' ? ' settings-page__card--mobile-only' : ''}`}>
          {key === 'help' ? <a className="settings-row" href="/contact" aria-label={setting.title}>
            <span className="settings-row__icon"><Icon size={20} aria-hidden="true" /></span>
            <span className="settings-row__copy"><span className="settings-row__title">{setting.title}</span></span>
            <span className="settings-row__trailing"><ChevronRight size={20} aria-hidden="true" /></span>
          </a> : <button type="button" className="settings-row" onClick={() => key === 'fullscreen' ? toggleFullscreen() : setOpenSetting(key)} aria-label={key === 'fullscreen' ? `${setting.title}: ${setting.value}. ${isFullscreen ? t.exitFullscreen : t.enterFullscreen}` : setting.value ? `${setting.title}: ${setting.value}` : setting.title} aria-pressed={key === 'fullscreen' ? isFullscreen : undefined}>
            <span className="settings-row__icon"><Icon size={20} aria-hidden="true" /></span>
            <span className="settings-row__copy"><span className="settings-row__title">{setting.title}</span></span>
            <span className="settings-row__trailing">{setting.value && <span className="settings-row__value">{setting.value}</span>}<ChevronRight size={20} aria-hidden="true" /></span>
          </button>}
          {key === 'fullscreen' && fullscreenError && <p className="settings-fullscreen-error" role="status">{fullscreenError}</p>}
        </div>
      })}
    </div> : openSetting === 'accessibility' ? <section className="settings-subpage" aria-labelledby="settings-subpage-title">
      <header className="settings-subpage__header">
        <button type="button" className="settings-subpage__back" onClick={() => setOpenSetting(null)} aria-label={t.backToSettings}>
          <ArrowLeft size={21} aria-hidden="true" />
        </button>
        <h2 id="settings-subpage-title">{settings.accessibility.title}</h2>
      </header>
      <div className="settings-page__list settings-accessibility-list">
        {['textSize', 'reducedMotion'].map((key) => <div key={key} className="settings-page__card">
          <button type="button" className="settings-row" onClick={() => setOpenSetting(key)}>
            <span className="settings-row__title">{settings[key].title}</span>
            <span className="settings-row__trailing"><ChevronRight size={20} aria-hidden="true" /></span>
          </button>
        </div>)}
      </div>
    </section> : <section className="settings-subpage" aria-labelledby="settings-subpage-title">
      <header className="settings-subpage__header">
        <button type="button" className="settings-subpage__back" onClick={() => setOpenSetting(backToAccessibility ? 'accessibility' : null)} aria-label={backToAccessibility ? t.backToAccessibility : t.backToSettings}>
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
