import { measurementReferences } from './measurementReference.js'

// Complete settings from the supplied document, one action per original screenshot.
const sections = [
  { id: 'plumbing-measurement-settings', title: 'Plumbing & Sanitary', image: 'plumbing.png' },
  { id: 'fire-measurement-settings', title: 'Fire Service', image: 'fire-service.png' },
  { id: 'mvac-measurement-settings', title: 'MVAC', image: 'mvac.png' },
]

function description(section, language) {
  const reference = measurementReferences[section.id]
  const isEnglish = language === 'en'
  return `${isEnglish ? 'Open' : 'Buka'} Project Settings > Measurement Settings > ${reference.tab}. ${isEnglish ? 'Review the settings shown in the reference image.' : 'Periksa pengaturan sesuai gambar referensi.'}`
}

export const measurementSetupLessons = [{
  id: 'measurement-settings', title: 'Measurement Settings',
  purpose: 'Meninjau pengaturan pengukuran Plumbing & Sanitary, Fire Service, dan MVAC sebelum pengaturan lantai dan gambar.',
  goal: 'Memahami nilai pada gambar referensi dan mencocokkannya dengan kebutuhan perhitungan proyek.',
  actions: sections.map((section) => ({
    title: section.title,
    description: description(section, 'id'),
    image: `/tutorial/tme/measurement-settings/${section.image}`,
  })),
}]

export const measurementLessonsEn = {
  'measurement-settings': [
    'Measurement Settings',
    'Review Plumbing & Sanitary, Fire Service, and MVAC measurement settings before setting up floors and drawings.',
    'Understand the values in the reference image and compare them with the project measurement requirements.',
    sections.map((section) => [section.title, description(section, 'en')]),
  ],
}
