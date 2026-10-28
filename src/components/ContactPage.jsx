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
      <article className="contact-card contact-card--directory">
        <section className="contact-directory__group">
          <h2>{t.hotlineService}</h2>
          <ContactMethod kind="phone" value="08158800091" href="https://wa.me/628158800091" t={t} />
        </section>
        <section className="contact-directory__group">
          <h3>{t.quantitySurveyorCsa}</h3>
          <ContactMethod name="Boris Prilyan Sidabutar" kind="email" value="boris.sidabutar@agungsedayu.com" href="mailto:boris.sidabutar@agungsedayu.com" t={t} />
          <ContactMethod name="Muhammad Faiq Sani Nugraha" kind="phone" value="08979990622" href="https://wa.me/628979990622" t={t} />
        </section>
        <section className="contact-directory__group">
          <h3>{t.quantitySurveyorMep}</h3>
          <ContactMethod name="Erwan Wijaya" kind="email" value="erwan.wijaya@agungsedayu.com" href="mailto:erwan.wijaya@agungsedayu.com" t={t} />
          <ContactMethod name="Moch Abdul Karim" kind="phone" value="081328202668" href="https://wa.me/6281328202668" t={t} />
        </section>
      </article>
    </section>
  </div>
}
