const emailSubject = '[Cubicost Support] Pertanyaan TAS/TRB/TME-C'
const emailBody = `Nama / Name:
Departemen / Department:
Proyek / Project:
Produk / Product: TAS / TRB / TME-C
Versi Aplikasi / Application Version:
Pelajaran Terkait / Related Lesson:

Pertanyaan / Question:

Yang Sudah Dicoba / What I Have Tried:`
const whatsappMessage = `Halo, saya memerlukan bantuan terkait tutorial Cubicost.

Nama:
Departemen:
Produk: TAS / TRB / TME-C
Pelajaran terkait:
Pertanyaan:`

const containsPlaceholder = (value) => /YOUR_EMAIL|X{2,}/i.test(value)

export const isValidEmail = (email) => !containsPlaceholder(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const isValidWhatsapp = (number, display = number) => !containsPlaceholder(number) && !containsPlaceholder(display) && /^[1-9]\d{7,14}$/.test(number)

export function buildContactLinks({ email, whatsappNumber, whatsappDisplay }) {
  return {
    emailHref: isValidEmail(email) ? `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}` : null,
    whatsappHref: isValidWhatsapp(whatsappNumber, whatsappDisplay) ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}` : null,
  }
}
