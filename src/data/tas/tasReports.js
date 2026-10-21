import source from './tasReports.source.json' with { type: 'json' }

const uses = {
  'Volume(m3)': 'Digunakan untuk volume elemen.',
  'Area of formwork(m2)': 'Digunakan untuk luas bekisting.',
  'Number(pc)': 'Digunakan untuk jumlah elemen.',
  'Weight of rebar(kg)': 'Digunakan untuk berat tulangan.',
  'Girth(m)': 'Digunakan untuk keliling elemen.',
  'Area(m2)': 'Digunakan untuk luas elemen.',
  'Net length of wall(m)': 'Digunakan untuk panjang bersih dinding.',
  'Original thickness of wall(m)': 'Digunakan untuk ketebalan awal dinding.',
  'Original height of wall(m)': 'Digunakan untuk tinggi awal dinding.',
  'Original length of wall(m)': 'Digunakan untuk panjang awal dinding.',
  'Area of opening(m2)': 'Digunakan untuk luas opening.',
  'Area of frame(m2)': 'Digunakan untuk luas frame.',
  'Width of opening(m)': 'Digunakan untuk lebar opening.',
  'Height of opening(m)': 'Digunakan untuk tinggi opening.',
  'Girth of opening(m)': 'Digunakan untuk keliling opening.',
  'Length of edge and break of opening(m)': 'Digunakan untuk panjang tepi dan bagian terputus pada opening.',
  'Area of smallest enclosing rectangle for opening(m2)': 'Digunakan untuk luas persegi panjang terkecil yang melingkupi opening.',
  'Area of door opening(m2)': 'Digunakan untuk luas opening pintu.',
  'Area of window opening(m2)': 'Digunakan untuk luas opening jendela.',
  'Width of door opening(m)': 'Digunakan untuk lebar opening pintu.',
  'Width of window opening(m)': 'Digunakan untuk lebar opening jendela.',
  'Height of door opening(m)': 'Digunakan untuk tinggi opening pintu.',
  'Height of window opening(m)': 'Digunakan untuk tinggi opening jendela.',
  'Area of door frame(m2)': 'Digunakan untuk luas frame pintu.',
  'Area of window frame(m2)': 'Digunakan untuk luas frame jendela.',
  'Area of formwork to side of beam(m2)': 'Digunakan untuk luas bekisting sisi samping balok.',
  'Area of formwork to soffit of beam(m2)': 'Digunakan untuk luas bekisting sisi bawah balok.',
  'Girth of section(m)': 'Digunakan untuk keliling penampang.',
  'Net length(m)': 'Digunakan untuk panjang bersih elemen.',
  'Length of axis(m)': 'Digunakan untuk panjang garis sumbu elemen.',
  'Area of formwork to soffit(m2)': 'Digunakan untuk luas bekisting sisi bawah.',
  'Area of formwork to edge and break of slab(m2)': 'Digunakan untuk luas bekisting tepi dan bagian terputus pada slab.',
  'Projected area(m2)': 'Digunakan untuk luas proyeksi elemen.',
  'Volume of concrete of flight(m3)': 'Digunakan untuk volume beton badan tangga.',
  'Volume of concrete of landing beam(m3)': 'Digunakan untuk volume beton balok bordes.',
  'Volume of concrete of landing slab(m3)': 'Digunakan untuk volume beton pelat bordes.',
  'Area of formwork to flight(m2)': 'Digunakan untuk luas bekisting badan tangga.',
  'Area of formwork to landing beam(m2)': 'Digunakan untuk luas bekisting balok bordes.',
  'Area of formwork to landing slab(m2)': 'Digunakan untuk luas bekisting pelat bordes.',
  'Area of open string(m2)': 'Digunakan untuk luas sisi terbuka tangga.',
  'Area of riser(m2)': 'Digunakan untuk luas sisi tegak anak tangga.',
  'Area of tread(m2)': 'Digunakan untuk luas pijakan anak tangga.',
  'Length of nosing(m)': 'Digunakan untuk panjang nosing anak tangga.',
  'Length of handrail(m)': 'Digunakan untuk panjang handrail tangga.',
  'Area of finish to floor finish(m2)': 'Digunakan untuk luas finishing lantai.',
  'Length of finish to skirting(m)': 'Digunakan untuk panjang finishing skirting.',
  'Area of finish to skirting(m2)': 'Digunakan untuk luas finishing skirting.',
  'Area of finish to wall finish(m2)': 'Digunakan untuk luas finishing dinding.',
  'Area of custom finish to wall finish(m2)': 'Digunakan untuk luas custom finish pada finishing dinding.',
  'Area of suspended ceiling(m2)': 'Digunakan untuk luas suspended ceiling.',
  'Area of waterproof to flat surface(m2)': 'Digunakan untuk luas waterproof pada permukaan datar.',
  'Area of waterproof to vertical surface(m2)': 'Digunakan untuk luas waterproof pada permukaan vertikal.',
  'Area of finish to vertical surface of floor finish(m2)': 'Digunakan untuk luas finishing pada permukaan vertikal lantai.',
  'Area of finish to brick surface(m2)': 'Digunakan untuk luas finishing pada permukaan bata.',
  'Area of custom finish to brick surface(m2)': 'Digunakan untuk luas custom finish pada permukaan bata.',
  'Area of finish to concrete surface(m2)': 'Digunakan untuk luas finishing pada permukaan beton.',
  'Area of custom finish to concrete surface(m2)': 'Digunakan untuk luas custom finish pada permukaan beton.',
  'Area of soffit(m2)': 'Digunakan untuk luas sisi bawah elemen.',
  'Area of side(m2)': 'Digunakan untuk luas sisi samping elemen.',
  'Area of top(m2)': 'Digunakan untuk luas sisi atas elemen.',
  'Volume of excavating(m3)': 'Digunakan untuk volume galian.',
  'Length(m)': 'Digunakan untuk panjang elemen.',
  'Area of section(m2)': 'Digunakan untuk luas penampang.',
}

const groups = [
  ['pile-cap-report', 'Pile Cap', ['pile-cap']],
  ['slab-report', 'In-Situ Slab', ['in-situ-slab']],
  ['beam-report', 'Beam', ['beam']],
  ['column-report', 'Column', ['column']],
  ['wall-report', 'Wall', ['wall']],
  ['openings-report', 'Door – Window', ['door', 'window']],
  ['finishes-report', 'Room – Floor Finish – Waterproof – Skirting – Wall Finish – Suspended Ceiling', ['room', 'floor-finish', 'waterproof', 'skirting', 'wall-finish', 'suspended-ceiling']],
]

const usesEn = {
  'Volume(m3)': 'Used for element volume.',
  'Area of formwork(m2)': 'Used for formwork area.',
  'Number(pc)': 'Used for the number of elements.',
  'Weight of rebar(kg)': 'Used for rebar weight.',
  'Girth(m)': 'Used for the element perimeter.',
  'Area(m2)': 'Used for element area.',
  'Net length of wall(m)': 'Used for net wall length.',
  'Original thickness of wall(m)': 'Used for the original wall thickness.',
  'Original height of wall(m)': 'Used for the original wall height.',
  'Original length of wall(m)': 'Used for the original wall length.',
  'Area of opening(m2)': 'Used for opening area.',
  'Area of frame(m2)': 'Used for frame area.',
  'Width of opening(m)': 'Used for opening width.',
  'Height of opening(m)': 'Used for opening height.',
  'Girth of opening(m)': 'Used for the opening perimeter.',
  'Length of edge and break of opening(m)': 'Used for the length of opening edges and breaks.',
  'Area of smallest enclosing rectangle for opening(m2)': 'Used for the area of the smallest rectangle enclosing the opening.',
  'Area of door opening(m2)': 'Used for door opening area.',
  'Area of window opening(m2)': 'Used for window opening area.',
  'Width of door opening(m)': 'Used for door opening width.',
  'Width of window opening(m)': 'Used for window opening width.',
  'Height of door opening(m)': 'Used for door opening height.',
  'Height of window opening(m)': 'Used for window opening height.',
  'Area of door frame(m2)': 'Used for door frame area.',
  'Area of window frame(m2)': 'Used for window frame area.',
  'Area of formwork to side of beam(m2)': 'Used for formwork area at beam sides.',
  'Area of formwork to soffit of beam(m2)': 'Used for formwork area at the beam soffit.',
  'Girth of section(m)': 'Used for the section perimeter.',
  'Net length(m)': 'Used for net element length.',
  'Length of axis(m)': 'Used for the element axis length.',
  'Area of formwork to soffit(m2)': 'Used for formwork area at the soffit.',
  'Area of formwork to edge and break of slab(m2)': 'Used for formwork area at slab edges and breaks.',
  'Projected area(m2)': 'Used for the projected element area.',
  'Volume of concrete of flight(m3)': 'Used for concrete volume in the stair flight.',
  'Volume of concrete of landing beam(m3)': 'Used for concrete volume in the landing beam.',
  'Volume of concrete of landing slab(m3)': 'Used for concrete volume in the landing slab.',
  'Area of formwork to flight(m2)': 'Used for stair flight formwork area.',
  'Area of formwork to landing beam(m2)': 'Used for landing beam formwork area.',
  'Area of formwork to landing slab(m2)': 'Used for landing slab formwork area.',
  'Area of open string(m2)': 'Used for the area of the open stair string.',
  'Area of riser(m2)': 'Used for stair riser area.',
  'Area of tread(m2)': 'Used for stair tread area.',
  'Length of nosing(m)': 'Used for stair nosing length.',
  'Length of handrail(m)': 'Used for stair handrail length.',
  'Area of finish to floor finish(m2)': 'Used for floor finish area.',
  'Length of finish to skirting(m)': 'Used for skirting finish length.',
  'Area of finish to skirting(m2)': 'Used for skirting finish area.',
  'Area of finish to wall finish(m2)': 'Used for wall finish area.',
  'Area of custom finish to wall finish(m2)': 'Used for custom finish area on wall finishes.',
  'Area of suspended ceiling(m2)': 'Used for suspended ceiling area.',
  'Area of waterproof to flat surface(m2)': 'Used for waterproofing area on flat surfaces.',
  'Area of waterproof to vertical surface(m2)': 'Used for waterproofing area on vertical surfaces.',
  'Area of finish to vertical surface of floor finish(m2)': 'Used for finish area on vertical surfaces of floor finishes.',
  'Area of finish to brick surface(m2)': 'Used for finish area on brick surfaces.',
  'Area of custom finish to brick surface(m2)': 'Used for custom finish area on brick surfaces.',
  'Area of finish to concrete surface(m2)': 'Used for finish area on concrete surfaces.',
  'Area of custom finish to concrete surface(m2)': 'Used for custom finish area on concrete surfaces.',
  'Area of soffit(m2)': 'Used for the area of the element underside.',
  'Area of side(m2)': 'Used for the area of the element sides.',
  'Area of top(m2)': 'Used for the area of the element top.',
  'Volume of excavating(m3)': 'Used for excavation volume.',
  'Length(m)': 'Used for element length.',
  'Area of section(m2)': 'Used for section area.',
}

export function getReportLessons(language = 'id') {
  const isEn = language === 'en'
  const descriptions = isEn ? usesEn : uses
  return groups.map(([id, title, elements], stepIndex) => ({
  id, title, partId: 'part-3', partTitle: 'Report', partNumber: '03', stepNumber: stepIndex + 1, partStepCount: groups.length,
  hideIntro: true, showInstructionsBelowImage: true, duration: `${elements.length * 5} ${isEn ? 'min' : 'menit'}`,
  checks: isEn ? ['I can identify the Quantity columns in the report', 'I can read column names and their units', 'I can explain what each Quantity column is used for'] : ['Dapat mengenali kolom Quantity pada report', 'Dapat membaca nama kolom dan satuannya', 'Dapat menjelaskan kegunaan kolom Quantity'],
  actions: elements.flatMap(slug => {
    const report = source.reports[slug]
    return (report.segments || [report.display || report]).map(segment => {
    const actionTitle = segment.id ? `${report.title} – ${isEn ? segment.titleEn : segment.titleId}` : report.title
    const description = segment.quantityColumns.map(({ header }, columnIndex) => {
      let usage = descriptions[header]
      if (!usage) throw new Error(`Missing Quantity explanation: ${report.sheet} / ${header}`)
      if (header === 'Volume(m3)' && ['pile-cap', 'pile', 'in-situ-slab', 'beam', 'column'].includes(slug)) usage = isEn ? 'Used for concrete volume.' : 'Digunakan untuk volume beton.'
      if (header === 'Number(pc)') usage = isEn ? `Used for the number of ${report.title} elements.` : `Digunakan untuk jumlah ${report.title}.`
      return `${columnIndex + 1}. ${header}: ${usage}`
    }).join('\n')
    return { id: `${id}-${slug}${segment.id ? `-${segment.id}` : ''}`, title: actionTitle, description, image: segment.image,
      alt: isEn ? `${actionTitle} report with numbered callouts on the Quantity columns` : `Report ${actionTitle} dengan callout bernomor pada kolom Quantity`, caption: '', pending: false, instructionFormat: 'verbatim', sourceSheet: report.sheet }
    })
  }).map((action, index) => ({ ...action, number: index + 1 })),
}))
}

export const reportLessons = getReportLessons('id')

export const reportProgressKey = 'cubicost:tas:reports:progress:v2'
export const getReportLesson = (id, language = 'id') => getReportLessons(language).find(lesson => lesson.id === id)
export const emptyReportProgress = () => Object.fromEntries(reportLessons.map(lesson => [lesson.id, { completed: false, checks: [] }]))

export function loadReportProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(reportProgressKey) || '{}')
    return Object.fromEntries(reportLessons.map(lesson => {
      const record = saved[lesson.id] || {}
      return [lesson.id, { completed: record.completed === true, checks: [...new Set((Array.isArray(record.checks) ? record.checks : []).filter(index => Number.isInteger(index) && index >= 0 && index < lesson.checks.length))] }]
    }))
  } catch { return emptyReportProgress() }
}
