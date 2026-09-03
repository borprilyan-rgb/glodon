import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Clipboard, Mail, MessageCircle, ShieldCheck } from 'lucide-react'
import { contactConfig } from '../config/contact'
import { buildContactLinks, isValidEmail, isValidWhatsapp } from '../data/contactLinks'

const emailIsValid = isValidEmail(contactConfig.email)
const whatsappIsValid = isValidWhatsapp(contactConfig.whatsappNumber, contactConfig.whatsappDisplay)
const { emailHref, whatsappHref } = buildContactLinks(contactConfig)

function CopyButton({ value, valid, label, t }) {
  const [status, setStatus] = useState('idle')
  const timerRef = useRef(null)
  useEffect(() => () => window.clearTimeout(timerRef.current), [])
  const copy = async () => {
    try {
      if (!valid || !navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(value)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setStatus('idle'), 2200)
  }
  const visibleLabel = status === 'copied' ? t.copied : status === 'failed' ? t.copyUnavailable : label
  return <button type="button" className="contact-copy" onClick={copy} disabled={!valid}><Clipboard size={17} aria-hidden="true" />{visibleLabel}<span className="sr-only" role="status" aria-live="polite">{status === 'copied' ? t.copied : status === 'failed' ? t.copyUnavailable : ''}</span></button>
}

function ContactAction({ href, children, external = false }) {
  if (!href) return <button type="button" className="primary-button" disabled>{children}</button>
  return <a className="primary-button" href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{children}</a>
}

export default function ContactPage({ t }) {
  const configured = emailIsValid && whatsappIsValid
  return <div className="contact-page">
    <header className="contact-intro">
      <span className="eyebrow">{t.contact}</span>
      <h1>{t.contactTitle}</h1>
      <p>{t.contactIntro}</p>
      <p className="contact-guidance">{t.contactGuidance}</p>
      {!configured && <div className="contact-unconfigured" role="status"><AlertCircle size={17} aria-hidden="true" />{t.contactNotConfigured}</div>}
    </header>
    <section className="contact-grid" aria-label={t.contactMethods}>
      <article className="contact-card">
        <span className="contact-card__icon"><Mail size={23} aria-hidden="true" /></span>
        <h2>Email</h2>
        <p className="contact-value">{contactConfig.email}</p>
        <div className="contact-card__actions"><ContactAction href={emailHref}><Mail size={17} aria-hidden="true" />{t.sendEmail}</ContactAction><CopyButton value={contactConfig.email} valid={emailIsValid} label={t.copyEmail} t={t} /></div>
      </article>
      <article className="contact-card">
        <span className="contact-card__icon"><MessageCircle size={23} aria-hidden="true" /></span>
        <h2>WhatsApp</h2>
        <p className="contact-value">{contactConfig.whatsappDisplay}</p>
        <div className="contact-card__actions"><ContactAction href={whatsappHref} external><MessageCircle size={17} aria-hidden="true" />{t.openWhatsApp}</ContactAction><CopyButton value={contactConfig.whatsappDisplay} valid={whatsappIsValid} label={t.copyNumber} t={t} /></div>
      </article>
    </section>
    <aside className="contact-privacy"><ShieldCheck size={18} aria-hidden="true" /><p>{t.privacyReminder}</p></aside>
  </div>
}
