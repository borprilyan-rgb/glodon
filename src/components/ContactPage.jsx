import { Mail, Phone } from 'lucide-react'

function ContactMethod({ name, kind, value, href, t }) {
  const Icon = kind === 'phone' ? Phone : Mail
  return <div className="contact-person">
    {name && <strong className="contact-person__name">{name}</strong>}
    <a className="contact-person__link" href={href} aria-label={`${name ? `${name}, ` : ''}${kind === 'phone' ? t.phone : t.email}: ${value}`}>
      <Icon size={17} aria-hidden="true" />
      <span>{value}</span>
    </a>
  </div>
}

export default function ContactPage({ t }) {
  return <div className="contact-page">
    <header className="contact-intro">
      <span className="eyebrow">{t.contact}</span>
      <h1>{t.contactTitle}</h1>
    </header>
    <section className="contact-grid" aria-label={t.contactMethods}>
      <article className="contact-card">
        <h2>{t.hotlineService}</h2>
        <ContactMethod kind="phone" value="08158800091" href="tel:+628158800091" t={t} />
      </article>
      <article className="contact-card">
        <h2>{t.quantitySurveyorCsa}</h2>
        <ContactMethod name="Muhammad Faiq Sani Nugraha" kind="phone" value="08979990622" href="tel:+628979990622" t={t} />
        <ContactMethod name="Boris Prilyan Sidabutar" kind="email" value="boris.sidabutar@agungsedayu.com" href="mailto:boris.sidabutar@agungsedayu.com" t={t} />
      </article>
      <article className="contact-card">
        <h2>{t.quantitySurveyorMep}</h2>
        <ContactMethod name="Moch Abdul Karim" kind="phone" value="081328202668" href="tel:+6281328202668" t={t} />
        <ContactMethod name="Erwan Wijaya" kind="email" value="erwan.wijaya@agungsedayu.com" href="mailto:erwan.wijaya@agungsedayu.com" t={t} />
      </article>
    </section>
  </div>
}
