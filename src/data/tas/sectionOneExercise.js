export const exercisePath = '/tas/exercise/section-1'
export const exerciseStorageKey = 'cubicost:tas:section-1-exercise:v1'

export const exerciseCopy = {
  en: {
    title: 'Prepare a Small Office Project', badge: 'TAS · Section 1 exercise', entry: 'Check your Section 1 understanding',
    intro: 'Use a fictional two-floor office to practise project setup decisions. Answer eight questions using the drawing and project brief.',
    duration: '10–15 minutes · 8 questions · 100 points', start: 'Start exercise', resume: 'Continue exercise',
    passRule: 'Pass with at least 80/100, plus full marks for both drawing scale and alignment.',
    scope: 'This exercise checks your understanding. It does not assess a completed TAS model.',
    brief: 'Project brief', project: 'Project name', ground: 'Ground elevation (m)', ruleSet: 'Measurement rules',
    ruleNote: 'Use SMPI for this training project.',
    floor1: 'Floor 1 height (m)', floor2: 'Floor 2 height (m)', grade: 'Concrete grade for both floors',
    copy: 'Can the specified grade be copied between these floors?', yes: 'Yes, both specify K-300', no: 'No, never copy grades',
    briefFloors: 'Two floors · 3.50 m each · Concrete K-300 on both floors', briefDrawing: 'Plan dimensions: 6,000 × 4,000 mm',
    briefAlignment: 'Alignment reference: A/1', briefSettings: 'Check wall-finish position and additional height against the project specification.',
    question: 'Question', points: 'points', previous: 'Previous', next: 'Next question', submit: 'Submit answers',
    required: 'Complete every field for this question. Use a valid number where a measurement is requested.',
    actualLength: 'Actual length to enter (mm)', verify: 'How will you verify the scale?', select: 'Select an answer',
    alignmentCheck: 'What should you check after aligning A/1?', grid: 'Choose the matching model-grid intersection',
    diagram: 'Office reference plan: A to B is 6,000 mm; 1 to 2 is 4,000 mm',
    correct: 'Understood', review: 'Needs review', result: 'Your result', passed: 'Section 1 passed', notPassed: 'Review and try again',
    critical: 'Drawing scale and alignment must both be fully correct, even with a score of 80 or higher.',
    retry: 'Try again', reviewLesson: 'Review lesson', newTab: 'opens in a new tab', course: 'Back to course map',
    noStorage: 'Browser saving is unavailable. Keep this page open until you finish.',
    summary: 'Topic results', reference: 'Reference drawing',
    questions: [
      { id: 'settings', topic: 'Measurement Settings', title: 'The imported wall-finish settings differ from the project specification. What should you do?', type: 'choice', lesson: 'measurement-settings', options: [['review', 'Review the wall-finish position and additional-height settings against the specification.'], ['copy', 'Keep all settings copied from the previous project.'], ['guess', 'Choose whichever settings give the lowest quantity.']], explanation: 'Review the relevant settings against this project’s requirements. Settings copied from another project may not apply.' },
      { id: 'rules', topic: 'Measurement Rules', title: 'In a sample model, a beam has an unexpected column deduction. Which investigation sequence is best?', type: 'choice', lesson: 'measurement-rules', options: [['disable', 'Set No Effect immediately, then accept the new quantity.'], ['inspect', 'Inspect View Expression, review the applicable rule and column condition, then recalculate and compare.'], ['report', 'Export the report without reviewing the deduction.']], explanation: 'Trace the deduction before changing a rule, then recalculate and compare. No Effect is a manual example, not an automatic solution.' },
      { id: 'project', topic: 'Create Project', title: 'Enter the project information from the brief.', type: 'project', lesson: 'create-project', explanation: 'Use ASG Training, ground elevation -0.5 m, and SMPI.' },
      { id: 'attributes', topic: 'Public / Private Attributes', title: 'Only one selected entity needs a different attribute. Which should you use?', type: 'choice', lesson: 'tas-interface-attributes', options: [['public', 'Public Attributes, with no entity selected.'], ['private', 'Private Attributes, with the target entity selected.'], ['all', 'Select every entity and apply the change.']], explanation: 'Private Attributes apply to selected entities. Public Attributes can affect entities sharing the same element name.' },
      { id: 'floors', topic: 'Floors and Concrete Grades', title: 'Configure the two floors using the project brief.', type: 'floors', lesson: 'floor-grade-settings', explanation: 'Both floors are 3.50 m high and use K-300. Copying the grade is appropriate here because both floors have the same specified grade.' },
      { id: 'drawing', topic: 'Import and Split Drawings', title: 'One imported sheet contains both floor plans. How should you organize it?', type: 'choice', lesson: 'import-split-drawing', options: [['split', 'Split into separate plans named “Floor 1 – Plan” and “Floor 2 – Plan”.'], ['same', 'Keep both plans together with a generic name.'], ['delete', 'Delete one floor plan and use the other for both floors.']], explanation: 'Split the combined sheet into clearly named, floor-specific drawings so they can be managed independently.' },
      { id: 'scale', topic: 'Drawing Scale', title: 'The line labeled 6,000 mm measures 3,000 mm after import. Calibrate and verify it.', type: 'scale', lesson: 'scale-relocate-drawing', options: [['same', 'Recheck only the same line used for calibration.'], ['independent', 'Measure the independent 4,000 mm dimension and confirm it agrees.'], ['visual', 'Accept the drawing if it looks the right size.']], explanation: 'Enter the actual length of 6,000 mm, not the measured 3,000 mm. Verify with the independent 4,000 mm dimension.' },
      { id: 'alignment', topic: 'Axis Grid and Alignment', title: 'The drawing reference is A/1. Select the matching model point, then choose a verification step.', type: 'grid', lesson: 'axis-grid', options: [['other', 'Check another grid intersection and confirm the grid labels match.'], ['none', 'No further check is needed.'], ['nearest', 'Use whichever intersection is nearest, regardless of its label.']], explanation: 'Match A/1 on the drawing to A/1 on the model. Check another intersection and the labels to confirm the alignment.' },
    ],
  },
  id: {
    title: 'Siapkan Proyek Kantor Kecil', badge: 'TAS · Latihan Bagian 1', entry: 'Periksa pemahaman Bagian 1',
    intro: 'Gunakan contoh kantor dua lantai untuk berlatih menentukan pengaturan proyek. Jawab delapan pertanyaan berdasarkan gambar dan ringkasan proyek.',
    duration: '10–15 menit · 8 pertanyaan · 100 poin', start: 'Mulai latihan', resume: 'Lanjutkan latihan',
    passRule: 'Lulus dengan nilai minimal 80/100 serta nilai penuh untuk skala gambar dan penyelarasan.',
    scope: 'Latihan ini mengukur pemahaman. Hasil model TAS dinilai melalui latihan praktik terpisah.',
    brief: 'Ringkasan proyek', project: 'Nama proyek', ground: 'Elevasi tanah (m)', ruleSet: 'Aturan pengukuran proyek',
    ruleNote: 'Gunakan SMPI untuk proyek latihan ini.',
    floor1: 'Tinggi Lantai 1 (m)', floor2: 'Tinggi Lantai 2 (m)', grade: 'Mutu beton kedua lantai',
    copy: 'Apakah mutu beton ini boleh disalin antar lantai?', yes: 'Ya, keduanya menggunakan K-300', no: 'Tidak, mutu beton tidak boleh disalin',
    briefFloors: 'Dua lantai · Masing-masing 3,50 m · Beton K-300 pada kedua lantai', briefDrawing: 'Dimensi denah: 6.000 × 4.000 mm',
    briefAlignment: 'Titik acuan: A/1', briefSettings: 'Periksa posisi wall finish dan additional height terhadap spesifikasi proyek.',
    question: 'Pertanyaan', points: 'poin', previous: 'Sebelumnya', next: 'Pertanyaan berikutnya', submit: 'Kirim jawaban',
    required: 'Lengkapi seluruh jawaban pertanyaan ini. Gunakan angka yang valid untuk nilai pengukuran.',
    actualLength: 'Panjang aktual yang dimasukkan (mm)', verify: 'Bagaimana cara memverifikasi skala?', select: 'Pilih jawaban',
    alignmentCheck: 'Apa yang diperiksa setelah menyelaraskan A/1?', grid: 'Pilih perpotongan grid model yang sesuai',
    diagram: 'Denah referensi kantor: A ke B adalah 6.000 mm; 1 ke 2 adalah 4.000 mm',
    correct: 'Sudah dipahami', review: 'Perlu ditinjau', result: 'Hasil latihan', passed: 'Lulus Bagian 1', notPassed: 'Tinjau materi dan coba lagi',
    critical: 'Skala gambar dan penyelarasan harus benar seluruhnya, meskipun nilai total sudah mencapai 80.',
    retry: 'Coba lagi', reviewLesson: 'Tinjau materi', newTab: 'dibuka di tab baru', course: 'Kembali ke peta kursus',
    noStorage: 'Penyimpanan browser tidak tersedia. Biarkan halaman ini terbuka sampai selesai.',
    summary: 'Hasil per topik', reference: 'Gambar referensi',
    questions: [
      { id: 'settings', topic: 'Measurement Settings', title: 'Pengaturan wall finish yang diimpor berbeda dengan spesifikasi proyek. Apa yang harus dilakukan?', type: 'choice', lesson: 'measurement-settings', options: [['review', 'Periksa posisi wall finish dan additional height terhadap spesifikasi proyek.'], ['copy', 'Pertahankan semua pengaturan dari proyek sebelumnya.'], ['guess', 'Pilih pengaturan yang menghasilkan kuantitas terkecil.']], explanation: 'Periksa pengaturan terhadap kebutuhan proyek ini. Pengaturan dari proyek lain belum tentu sesuai.' },
      { id: 'rules', topic: 'Measurement Rules', title: 'Pada model contoh, deduction column pada beam tidak sesuai harapan. Urutan pemeriksaan mana yang tepat?', type: 'choice', lesson: 'measurement-rules', options: [['disable', 'Langsung pilih No Effect dan terima hasil kuantitasnya.'], ['inspect', 'Periksa View Expression, tinjau aturan dan kondisi column, lalu hitung ulang dan bandingkan.'], ['report', 'Ekspor laporan tanpa memeriksa deduction.']], explanation: 'Telusuri deduction sebelum mengubah aturan, lalu hitung ulang dan bandingkan. No Effect adalah contoh manual, bukan solusi otomatis.' },
      { id: 'project', topic: 'Membuat Proyek', title: 'Masukkan informasi proyek sesuai ringkasan.', type: 'project', lesson: 'create-project', explanation: 'Gunakan ASG Training, elevasi tanah -0,5 m, dan SMPI.' },
      { id: 'attributes', topic: 'Public / Private Attributes', title: 'Hanya satu entitas terpilih yang memerlukan atribut berbeda. Apa yang digunakan?', type: 'choice', lesson: 'tas-interface-attributes', options: [['public', 'Public Attributes tanpa memilih entitas.'], ['private', 'Private Attributes dengan entitas yang dituju terpilih.'], ['all', 'Pilih semua entitas lalu terapkan perubahan.']], explanation: 'Private Attributes berlaku pada entitas terpilih. Public Attributes dapat memengaruhi entitas dengan nama elemen yang sama.' },
      { id: 'floors', topic: 'Lantai dan Mutu Beton', title: 'Atur kedua lantai sesuai ringkasan proyek.', type: 'floors', lesson: 'floor-grade-settings', explanation: 'Tinggi kedua lantai adalah 3,50 m dan mutu betonnya K-300. Mutu beton boleh disalin karena spesifikasi kedua lantai sama.' },
      { id: 'drawing', topic: 'Impor dan Pemisahan Gambar', title: 'Satu lembar gambar memuat denah kedua lantai. Bagaimana cara mengaturnya?', type: 'choice', lesson: 'import-split-drawing', options: [['split', 'Pisahkan menjadi “Lantai 1 – Denah” dan “Lantai 2 – Denah”.'], ['same', 'Biarkan kedua denah menjadi satu dengan nama umum.'], ['delete', 'Hapus salah satu denah dan gunakan denah lainnya untuk kedua lantai.']], explanation: 'Pisahkan lembar gabungan menjadi gambar dengan nama lantai yang jelas agar masing-masing dapat dikelola secara mandiri.' },
      { id: 'scale', topic: 'Skala Gambar', title: 'Garis berlabel 6.000 mm terukur 3.000 mm setelah impor. Tentukan kalibrasi dan verifikasinya.', type: 'scale', lesson: 'scale-relocate-drawing', options: [['same', 'Periksa hanya garis yang digunakan untuk kalibrasi.'], ['independent', 'Ukur dimensi lain sepanjang 4.000 mm dan pastikan hasilnya sesuai.'], ['visual', 'Terima gambar jika ukurannya tampak benar.']], explanation: 'Masukkan panjang aktual 6.000 mm, bukan hasil ukur 3.000 mm. Verifikasi menggunakan dimensi lain sepanjang 4.000 mm.' },
      { id: 'alignment', topic: 'Axis Grid dan Penyelarasan', title: 'Titik acuan gambar adalah A/1. Pilih titik model yang sesuai, lalu tentukan langkah verifikasinya.', type: 'grid', lesson: 'axis-grid', options: [['other', 'Periksa perpotongan grid lain dan pastikan label grid sesuai.'], ['none', 'Tidak perlu pemeriksaan tambahan.'], ['nearest', 'Gunakan perpotongan terdekat tanpa memperhatikan labelnya.']], explanation: 'Pasangkan A/1 pada gambar dengan A/1 pada model. Periksa perpotongan lain dan label grid untuk memastikan keselarasan.' },
    ],
  },
}

const fields = [
  ['settings'], ['rules'], ['projectName', 'ground', 'ruleSet'], ['attributes'],
  ['height1', 'height2', 'grade', 'copy'], ['drawing'], ['length', 'verify'], ['grid', 'alignmentCheck'],
]
const numeric = new Set(['ground', 'height1', 'height2', 'length'])
export function numberAnswer(value, field) {
  let text = String(value ?? '').trim()
  text = text.replace(field === 'length' ? /\s*mm$/i : /\s*m$/i, '').trim()
  if (field === 'length' && /^-?\d{1,3}([., ])\d{3}(?:\1\d{3})*$/.test(text)) text = text.replace(/[., ]/g, '')
  return /^-?\d+(?:[.,]\d+)?$/.test(text) ? Number(text.replace(',', '.')) : NaN
}
export function questionIssues(index, answers) {
  return fields[index].flatMap((field) => {
    if (typeof answers[field] !== 'string' || !answers[field].trim()) return [{ field, reason: 'missing' }]
    if (numeric.has(field) && !Number.isFinite(numberAnswer(answers[field], field))) return [{ field, reason: 'number' }]
    return []
  })
}
export function questionAnswered(index, answers) {
  return questionIssues(index, answers).length === 0
}
export const questionPoints = [15, 15, 10, 10, 15, 10, 15, 10]
export function scoreExercise(a) {
  const scores = [
    a.settings === 'review' ? 15 : 0,
    a.rules === 'inspect' ? 15 : 0,
    (a.projectName?.trim().replace(/\s+/g, ' ').toLowerCase() === 'asg training' ? 4 : 0) + (numberAnswer(a.ground) === -0.5 ? 3 : 0) + (a.ruleSet === 'SMPI' ? 3 : 0),
    a.attributes === 'private' ? 10 : 0,
    (numberAnswer(a.height1) === 3.5 ? 4 : 0) + (numberAnswer(a.height2) === 3.5 ? 4 : 0) + (a.grade?.trim().toUpperCase() === 'K-300' ? 4 : 0) + (a.copy === 'yes' ? 3 : 0),
    a.drawing === 'split' ? 10 : 0,
    (numberAnswer(a.length, 'length') === 6000 ? 10 : 0) + (a.verify === 'independent' ? 5 : 0),
    (a.grid === 'A/1' ? 5 : 0) + (a.alignmentCheck === 'other' ? 5 : 0),
  ]
  const total = scores.reduce((sum, points) => sum + points, 0)
  const criticalPassed = scores[6] === 15 && scores[7] === 10
  return { scores, total, criticalPassed, passed: total >= 80 && criticalPassed }
}

export function loadExercise() {
  const empty = { started: false, submitted: false, index: 0, answers: {} }
  try {
    const saved = JSON.parse(localStorage.getItem(exerciseStorageKey))
    if (!saved || typeof saved !== 'object') return empty
    const answers = Object.fromEntries(fields.flat().filter((key) => typeof saved.answers?.[key] === 'string').map((key) => [key, saved.answers[key].slice(0, 100)]))
    const outdatedProject = ['A', 'B'].includes(answers.ruleSet) || answers.projectName?.trim().toLowerCase() === 'office training 01'
    if (outdatedProject) for (const field of ['projectName', 'ground', 'ruleSet']) delete answers[field]
    const outdatedGrade = /^C\d+$/i.test(answers.grade || '')
    if (outdatedGrade) delete answers.grade
    return { started: Boolean(saved.started), submitted: Boolean(saved.submitted) && fields.every((_, index) => questionAnswered(index, answers)), index: outdatedProject ? 2 : outdatedGrade ? 4 : Math.max(0, Math.min(7, Number.isInteger(saved.index) ? saved.index : 0)), answers }
  } catch { return empty }
}
