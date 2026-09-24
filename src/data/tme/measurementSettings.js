import { measurementReferences } from './measurementReference.js'

// Reference: MEASUREMENT SETTING UNTUK PLUMBING.docx, supplied by the user.
// Values describe the supplied screenshots rather than universal project defaults.
const imageRoot = '/tutorial/tme/measurement-settings'
const referenceGoalId = 'Memahami nilai pada gambar referensi dan mencocokkannya dengan kebutuhan perhitungan proyek.'
const referenceGoalEn = 'Understand the values in the reference image and compare them with the project measurement requirements.'

const entries = [
  {
    id: 'mvac-measurement-settings', image: 'mvac.png',
    titleId: 'Pengaturan Pengukuran MVAC', titleEn: 'MVAC Measurement Settings',
    purposeId: 'Meninjau aturan pengukuran duct, fitting, pipa refrigerant, dan support pada tab Air Conditioning & Mechanical Ventilation.',
    purposeEn: 'Review duct, fitting, refrigerant-pipe, and support measurement rules in the Air Conditioning & Mechanical Ventilation tab.',
    actions: [
      ['Periksa pengukuran duct', 'Buka Project Settings → Measurement Settings → Air Conditioning & Mechanical Ventilation. Pada referensi, fitting duct dihitung termasuk area yang ditempati fitting (Yes and include the area occupied by fittings). Panjang reducer termasuk dalam panjang duct (The length of the reducer is included), dan End Cap of Air Duct dihitung (Yes).',
        'Review duct measurement', 'Open Project Settings → Measurement Settings → Air Conditioning & Mechanical Ventilation. The reference includes duct fittings and the area occupied by fittings (Yes and include the area occupied by fittings). Duct length includes the reducer length (The length of the reducer is included), and End Cap of Air Duct is calculated (Yes).'],
      ['Periksa konektor dan fitting pipa', 'Nilai pada referensi: jarak konektor pipa 12000 mm. Irregular tee/cross dihitung sebagai tee/cross yang lebih besar dan reducer (As a bigger tee/cross and a reducer), dengan diameter minimum fitting yang dipisahkan 70 mm. Irregular elbow dihitung sebagai elbow reguler yang lebih besar dan reducer (As a bigger regular elbow and a reducer).',
        'Review pipe connectors and fittings', 'Reference values: pipe connector distance is 12000 mm. Irregular tees/crosses are calculated as a bigger tee/cross and a reducer, with a minimum divided-fitting diameter of 70 mm. Irregular elbows are calculated as a bigger regular elbow and a reducer.'],
      ['Periksa cadangan panjang dan support', 'Nilai pada referensi: Length reserved for water pipe = 0%. Diameter minimum untuk perhitungan Refrigerant Pipe Elbows = 26 mm. Calculation of support number = Round Off. Cocokkan pengaturan ini dengan kebutuhan perhitungan proyek.',
        'Review reserved length and supports', 'Reference values: Length reserved for water pipe = 0%. The minimum diameter for calculation of Refrigerant Pipe Elbows = 26 mm. Calculation of support number = Round Off. Compare these settings with the project measurement requirements.'],
    ],
  },
  {
    id: 'fire-measurement-settings', image: 'fire-service.png',
    titleId: 'Pengaturan Pengukuran Fire Service', titleEn: 'Fire Service Measurement Settings',
    purposeId: 'Meninjau aturan pengukuran Fire Extinguishing System dan Fire Alarm System pada tab Fire Service.',
    purposeEn: 'Review Fire Extinguishing System and Fire Alarm System measurement rules in the Fire Service tab.',
    actions: [
      ['Periksa support dan mechanical tee/cross', 'Buka Project Settings → Measurement Settings → Fire Service. Pada Fire Extinguishing System, referensi menunjukkan Calculation of support number = Round Off. Setting for mechanical tee and cross = Not Calculated. Pipe size setting for mechanical tee and cross = Pipe Size Setting.',
        'Review supports and mechanical tees/crosses', 'Open Project Settings → Measurement Settings → Fire Service. Under Fire Extinguishing System, the reference shows Calculation of support number = Round Off. Setting for mechanical tee and cross = Not Calculated. Pipe size setting for mechanical tee and cross = Pipe Size Setting.'],
      ['Periksa fitting dan jarak konektor', 'Pada referensi, irregular tee/cross dihitung sebagai tee/cross yang lebih besar dan reducer, dengan diameter minimum fitting yang dipisahkan 70 mm. Jarak konektor pipa = 6000 mm. Length reserved for water pipe = 0%. Irregular elbow dihitung sebagai elbow reguler yang lebih besar dan reducer.',
        'Review fittings and connector distance', 'The reference calculates irregular tees/crosses as a bigger tee/cross and a reducer, with a minimum divided-fitting diameter of 70 mm. Pipe connector distance = 6000 mm. Length reserved for water pipe = 0%. Irregular elbows are calculated as a bigger regular elbow and a reducer.'],
      ['Periksa cadangan panjang kabel fire alarm', 'Pada Fire Alarm System → Cable, cadangan panjang untuk sag, konfigurasi S, dan intersection = 0%; untuk koneksi signal cable dan telephone terminal box = 150 mm; untuk connecting cable end = 0 mm. Pada Electric Wire, cadangan panjang untuk koneksi signal wire dan telephone terminal box = 150 mm. Nilai ini mengikuti gambar referensi.',
        'Review fire-alarm cable allowances', 'Under Fire Alarm System → Cable, reserved length for sag, S-shaped configuration, and intersection = 0%; for connecting signal cable and telephone terminal box = 150 mm; and for connecting cable end = 0 mm. Under Electric Wire, reserved length for connecting signal wire and telephone terminal box = 150 mm. These values follow the reference image.'],
    ],
  },
  {
    id: 'plumbing-measurement-settings', image: 'plumbing.png',
    titleId: 'Pengaturan Pengukuran Plumbing', titleEn: 'Plumbing Measurement Settings',
    purposeId: 'Meninjau aturan tinggi pipa cabang, support, konektor, dan fitting pada tab Plumbing & Sanitary.',
    purposeEn: 'Review branch-pipe height, support, connector, and fitting rules in the Plumbing & Sanitary tab.',
    actions: [
      ['Periksa tinggi pipa cabang vertikal', 'Buka Project Settings → Measurement Settings → Plumbing & Sanitary. Pada referensi, tinggi pipa cabang supply dan drainage dihitung berdasarkan selisih elevasi pipa horizontal dan sanitary ware. Baris Based on normal installation height menampilkan Set calculated value; baris Based on height of sanitary ware above floor menampilkan 300 mm. Kedua baris tersebut tampak nonaktif pada metode yang dipilih.',
        'Review vertical branch-pipe height', 'Open Project Settings → Measurement Settings → Plumbing & Sanitary. In the reference, supply and drainage branch-pipe heights are based on the elevation difference between the horizontal pipe and sanitary ware. Based on normal installation height displays Set calculated value; Based on height of sanitary ware above floor displays 300 mm. Both rows appear inactive under the selected method.'],
      ['Periksa support dan konektor pipa', 'Nilai pada referensi: Calculation of support number = Round Off dan Setting for pipe connector distance = 12000 mm. Periksa kedua nilai tersebut pada tab Plumbing & Sanitary dan cocokkan dengan kebutuhan perhitungan proyek.',
        'Review supports and pipe connectors', 'Reference values: Calculation of support number = Round Off and Setting for pipe connector distance = 12000 mm. Review both values in the Plumbing & Sanitary tab and compare them with the project measurement requirements.'],
      ['Periksa fitting dan cadangan panjang', 'Pada referensi, irregular tee/cross dihitung sebagai tee/cross yang lebih besar dan reducer (As a bigger tee/cross and a reducer). Diameter minimum fitting yang dipisahkan = 70 mm. Irregular elbow dihitung sebagai elbow reguler yang lebih besar dan reducer. Length reserved for water pipe = 0%.',
        'Review fittings and reserved length', 'In the reference, irregular tees/crosses are calculated as a bigger tee/cross and a reducer. The minimum divided-fitting diameter = 70 mm. Irregular elbows are calculated as a bigger regular elbow and a reducer. Length reserved for water pipe = 0%.'],
    ],
  },
]

// Keep the complete source values in the normal action descriptions, without a separate table.
const rowGroups = {
  'plumbing-measurement-settings': [[0, 1, 2, 3, 4, 5], [6, 7], [8, 9, 10, 11]],
  'fire-measurement-settings': [[0, 1, 2], [3, 4, 5, 6, 7], [8, 9, 10, 11]],
  'mvac-measurement-settings': [[0, 1, 3], [2, 4, 5, 6], [7, 8, 9]],
}

function fullDescription(entry, actionIndex, language) {
  const reference = measurementReferences[entry.id]
  const isEnglish = language === 'en'
  const intro = actionIndex === 0
    ? `${isEnglish ? 'Open' : 'Buka'} Project Settings ? Measurement Settings ? ${reference.tab}.`
    : isEnglish ? 'Values shown in the reference:' : 'Nilai yang ditampilkan pada referensi:'
  const lines = rowGroups[entry.id][actionIndex].map((index) => {
    const [group, label, unit, value, inactive] = reference.rows[index]
    const status = inactive ? ` (${isEnglish ? 'inactive in the reference' : 'nonaktif pada referensi'})` : ''
    return `${group ? `${group} ? ` : ''}${label}: ${value}${unit ? ` ${unit}` : ''}${status}`
  })
  return [intro, ...lines].join('\n\n')
}

const setupEntries = ['plumbing-measurement-settings', 'fire-measurement-settings', 'mvac-measurement-settings'].map((id) => entries.find((entry) => entry.id === id))

export const measurementSetupLessons = setupEntries.map((entry) => ({
  id: entry.id, title: entry.titleId, purpose: entry.purposeId, goal: referenceGoalId,
  actions: entry.actions.map(([title], index) => ({ title, description: fullDescription(entry, index, 'id'), image: `${imageRoot}/${entry.image}` })),
}))

export const measurementLessonsEn = Object.fromEntries(entries.map((entry) => [entry.id, [
  entry.titleEn, entry.purposeEn, referenceGoalEn,
  entry.actions.map(([, , title], index) => [title, fullDescription(entry, index, 'en')]),
]]))
