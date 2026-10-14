import { exerciseCopy as baseCopy, numberAnswer } from './sectionOneExercise.js'

export const questionPoints = [10, 10, 15, 20, 10, 10, 15, 10]
const lessons = ['identify-pile-caps', 'identify-columns', 'identify-beams', 'identify-slabs', 'identify-structural-walls', 'identify-architectural-walls', 'identify-openings', 'apply-finishes']
const choices = ['1', '2', '0', '1', '2', '0', '1', '2']
const fields = [[], [], [], ['slabThickness'], [], [], ['openingWidth', 'openingHeight'], []]
const numericAnswers = { slabThickness: 150, openingWidth: 900, openingHeight: 2100 }
const content = {
  en: {
    title: 'Identify and Check an Office Model',
    entry: 'Check your Section 2 understanding',
    scope: 'This exercise checks modelling decisions. It does not assess a completed TAS model.',
    intro: 'Continue the ASG Training office project. Use the reference brief to resolve eight modelling scenarios, including slab and door dimensions.',
    guide: 'Assume Section 1 setup, drawing scale and alignment have been verified. Dimensions below are fictional training data, not default TAS settings. Enter dimensions in millimetres; each scenario has one best action.',
    briefItems: ['Project: ASG Training · two floors, 3.50 m each.', 'PC1: complete pile-cap outline and matching PC1 label required.', 'C1: 400 × 400 mm on Floor 2 at A/1.', 'B1: 250 mm wide × 500 mm deep; the generated beam is 250 × 400 mm.', 'S1: 150 mm thick, with a 1,000 × 1,200 mm service opening.', 'CW1: concrete structural wall. MW1: masonry architectural wall.', 'Door schedule columns: Type | Height (mm) | Width (mm). Row: D1 | 2,100 | 900.', 'Room R1: wall finish revised from paint to tile after finish entities were generated.'],
    passRule: 'Pass with at least 80/100, plus full marks for beam correction and slab thickness/opening checks.',
    critical: 'Beam correction and every part of the slab question must be correct, even when the total reaches 80.',
    dataLabels: { slabThickness: 'Slab thickness (mm)', openingWidth: 'D1 width (mm)', openingHeight: 'D1 height (mm)' },
    titles: [
      'The PC1 boundary selection misses one edge and includes a nearby PC2 label. What should you do before Auto-Identify?',
      'C1 has the correct 400 × 400 mm size and A/1 position, but appears on Floor 1. Which action resolves the discrepancy?',
      'The generated B1 beam is 250 × 400 mm. The brief requires 250 × 500 mm. Which correction sequence is appropriate?',
      'Enter the specified S1 thickness, then choose how to handle the service opening omitted from the generated slab.',
      'CW1 has been generated. Which quantity checks match its concrete structural-wall scope?',
      'MW1 is being reviewed alongside CW1. Which identification and quantity approach matches MW1?',
      'Read D1 from the schedule in the brief. Enter its width and height, then choose the correct identification sequence.',
      'R1 already has paint finish entities. Its approved wall finish changes to tile. How should you update and verify it?',
    ],
    options: [
      ['Complete the PC1 boundary but retain PC2 because it is the nearest label.', 'Select the complete PC1 boundary and matching PC1 label, then identify and check size and position.', 'Select only the PC1 label and accept the previously captured incomplete boundary.'],
      ['Rename C1 to include “Floor 2” and retain its current floor assignment.', 'Create a second C1 on Floor 2 and keep the Floor 1 instance as well.', 'Correct its floor assignment, then verify Floor 2, A/1 and its size in 3D.'],
      ['Use Identification Check to correct B1, confirm the updated 3D geometry, then review Volume and Area of Formwork.', 'Change B1’s label to 250 × 500 and use the existing generated geometry.', 'Change the concrete grade, then review Volume while retaining the 400 mm depth.'],
      ['Keep S1 solid and subtract the opening manually from the exported report.', 'Capture the service boundary with Slab Opening Line, review Slab Identification Option, then verify thickness and opening geometry.', 'Change S1 thickness to compensate for the omitted opening, then accept the model.'],
      ['Review Area as masonry quantity and use it for both concrete and formwork.', 'Review Volume alone because formwork always follows the same value.', 'Review Volume and Area of Formwork, including applicable edge or opening-break formwork lengths.'],
      ['Use masonry-wall sidelines, capture relevant openings and labels, identify, then review Area.', 'Use concrete-wall sidelines and review Volume as MW1’s masonry quantity.', 'Use masonry-wall sidelines but omit door/window information and accept the resulting Area.'],
      ['Map the second schedule column to width and the third to height, then identify by label.', 'Map columns by their headers, identify and confirm D1 in the element list, then identify its placements by door/window labels and inspect the result.', 'Map the headers correctly and generate D1 in the element list; treat the type as proof that all model placements are correct.'],
      ['Change R1’s texture only and retain its existing paint finish entities.', 'Apply a second wall finish over the existing paint entities and keep both.', 'Update R1’s assigned finish, use Regenerate Finish Entity, then check the model and quantities against boundaries, openings, columns and exposed beams.'],
    ],
    explanations: [
      'Pick Sideline must capture the complete PC1 frame and Pick Label must capture PC1. A nearby label can associate the wrong type; an incomplete frame cannot establish the intended boundary. Check the generated size and position.',
      'The brief locates C1 on Floor 2 at A/1. Correcting its name does not correct its floor; keeping both instances leaves an unintended column. Verify floor, position and size in 3D.',
      'B1 must be 250 mm wide and 500 mm deep. Identification Check corrects the model element; renaming or changing concrete grade does not fix its depth. Confirm the updated 3D model before reviewing concrete Volume and Area of Formwork.',
      'S1 thickness is 150 mm. Capture the 1,000 × 1,200 mm service boundary with Slab Opening Line and review Slab Identification Option. Verify both the thickness and actual opening in the model; report edits or thickness changes do not repair a missing opening.',
      'CW1 is a concrete structural wall: review concrete Volume and Area of Formwork separately, with applicable edge/opening-break lengths. Masonry Area is a different quantity; concrete volume does not establish formwork area.',
      'MW1 is masonry. Use the masonry-wall identification workflow, including relevant door/window sidelines and labels, then review Area. Omitting openings can make the generated geometry and area unreliable.',
      'D1 is 900 mm wide and 2,100 mm high. The height column comes before width, so map by header rather than position. Creating a type is separate from identifying its placements; inspect the generated openings and their quantities.',
      'Refresh the finish entities after updating R1’s assigned finish. Texture alone does not verify the revised finish entities, and overlaying a second finish risks duplication. Check room boundaries, openings, columns and exposed beams in the updated model and quantities.',
    ],
  },
  id: {
    title: 'Identifikasi dan Periksa Model Kantor',
    entry: 'Periksa pemahaman Bagian 2',
    scope: 'Latihan ini mengukur keputusan pemodelan, bukan hasil model TAS yang telah dikerjakan.',
    intro: 'Lanjutkan proyek kantor ASG Training. Gunakan ringkasan referensi untuk menyelesaikan delapan skenario pemodelan, termasuk dimensi pelat dan pintu.',
    guide: 'Anggap pengaturan Bagian 1, skala, dan penyelarasan gambar sudah diverifikasi. Dimensi berikut adalah data latihan fiktif, bukan pengaturan bawaan TAS. Masukkan dimensi dalam milimeter; setiap skenario memiliki satu tindakan terbaik.',
    briefItems: ['Proyek: ASG Training · dua lantai, masing-masing 3,50 m.', 'PC1: memerlukan outline pile cap lengkap dan label PC1 yang sesuai.', 'C1: 400 × 400 mm pada Lantai 2 di A/1.', 'B1: lebar 250 mm × tinggi 500 mm; balok hasil identifikasi berukuran 250 × 400 mm.', 'S1: tebal 150 mm, dengan opening servis 1.000 × 1.200 mm.', 'CW1: dinding struktur beton. MW1: dinding arsitektur masonry.', 'Kolom schedule pintu: Tipe | Tinggi (mm) | Lebar (mm). Baris: D1 | 2.100 | 900.', 'Room R1: wall finish direvisi dari cat menjadi keramik setelah finish entity dibuat.'],
    passRule: 'Lulus dengan nilai minimal 80/100 serta nilai penuh untuk koreksi balok dan pemeriksaan ketebalan/opening pelat.',
    critical: 'Koreksi balok dan seluruh jawaban pertanyaan pelat harus benar, meskipun nilai total mencapai 80.',
    dataLabels: { slabThickness: 'Ketebalan pelat (mm)', openingWidth: 'Lebar D1 (mm)', openingHeight: 'Tinggi D1 (mm)' },
    titles: [
      'Pemilihan boundary PC1 melewatkan satu sisi dan menyertakan label PC2 di dekatnya. Apa yang dilakukan sebelum Auto-Identify?',
      'Ukuran C1 sudah 400 × 400 mm dan posisinya di A/1, tetapi muncul pada Lantai 1. Tindakan mana yang memperbaiki ketidaksesuaian ini?',
      'Balok B1 hasil identifikasi berukuran 250 × 400 mm. Ringkasan mensyaratkan 250 × 500 mm. Urutan koreksi mana yang tepat?',
      'Masukkan ketebalan S1 sesuai ringkasan, lalu pilih cara menangani opening servis yang belum terbentuk pada pelat.',
      'CW1 telah terbentuk. Pemeriksaan kuantitas mana yang sesuai untuk dinding struktur beton ini?',
      'MW1 ditinjau bersama CW1. Pendekatan identifikasi dan kuantitas mana yang sesuai untuk MW1?',
      'Baca D1 pada schedule dalam ringkasan. Masukkan lebar dan tingginya, lalu pilih urutan identifikasi yang benar.',
      'R1 sudah memiliki finish entity cat. Wall finish yang disetujui berubah menjadi keramik. Bagaimana memperbarui dan memverifikasinya?',
    ],
    options: [
      ['Lengkapi boundary PC1 tetapi pertahankan PC2 karena labelnya paling dekat.', 'Pilih boundary PC1 lengkap dan label PC1 yang sesuai, lalu identifikasi dan periksa ukuran serta posisi.', 'Pilih hanya label PC1 dan terima boundary tidak lengkap yang sudah dipilih.'],
      ['Ubah nama C1 agar memuat “Lantai 2” dan pertahankan penempatan lantainya.', 'Buat C1 kedua pada Lantai 2 dan pertahankan juga C1 pada Lantai 1.', 'Koreksi penempatan lantainya, lalu verifikasi Lantai 2, A/1, dan ukuran pada model 3D.'],
      ['Gunakan Identification Check untuk mengoreksi B1, konfirmasi geometri 3D terbaru, lalu tinjau Volume dan Area of Formwork.', 'Ubah label B1 menjadi 250 × 500 dan gunakan geometri hasil identifikasi yang ada.', 'Ubah mutu beton, lalu tinjau Volume dengan mempertahankan tinggi 400 mm.'],
      ['Pertahankan pelat S1 tanpa opening dan kurangi opening secara manual pada laporan ekspor.', 'Ambil boundary servis dengan Slab Opening Line, tinjau Slab Identification Option, lalu verifikasi ketebalan dan geometri opening.', 'Ubah ketebalan S1 untuk mengompensasi opening yang hilang, lalu terima model.'],
      ['Tinjau Area sebagai kuantitas masonry dan gunakan untuk beton serta bekisting.', 'Tinjau hanya Volume karena bekisting selalu mengikuti nilai yang sama.', 'Tinjau Volume dan Area of Formwork, termasuk panjang bekisting edge atau opening break yang relevan.'],
      ['Gunakan masonry wall sideline, ambil opening dan label terkait, identifikasi, lalu tinjau Area.', 'Gunakan concrete wall sideline dan tinjau Volume sebagai kuantitas masonry MW1.', 'Gunakan masonry wall sideline tetapi abaikan data pintu/jendela dan terima Area hasilnya.'],
      ['Petakan kolom kedua ke lebar dan kolom ketiga ke tinggi, lalu identifikasi berdasarkan label.', 'Petakan kolom berdasarkan header, identifikasi dan pastikan D1 pada element list, lalu identifikasi penempatannya berdasarkan label pintu/jendela dan periksa hasil.', 'Petakan header dengan benar dan buat D1 pada element list; anggap tipe tersebut membuktikan seluruh penempatan model sudah benar.'],
      ['Ubah hanya texture R1 dan pertahankan finish entity cat yang ada.', 'Terapkan wall finish kedua di atas entity cat dan pertahankan keduanya.', 'Perbarui finish yang ditetapkan pada R1, gunakan Regenerate Finish Entity, lalu periksa model dan kuantitas terhadap boundary, opening, column, serta exposed beam.'],
    ],
    explanations: [
      'Pick Sideline harus mengambil frame PC1 lengkap dan Pick Label harus mengambil PC1. Label terdekat dapat menghubungkan tipe yang salah; frame tidak lengkap belum menunjukkan boundary yang dimaksud. Periksa ukuran dan posisi hasilnya.',
      'Ringkasan menempatkan C1 pada Lantai 2 di A/1. Mengubah nama tidak memperbaiki lantai; mempertahankan kedua instance menyisakan kolom yang tidak diperlukan. Verifikasi lantai, posisi, dan ukuran pada model 3D.',
      'B1 harus memiliki lebar 250 mm dan tinggi 500 mm. Identification Check memperbaiki elemen model; perubahan nama atau mutu beton tidak memperbaiki tingginya. Konfirmasi model 3D terbaru sebelum meninjau Volume beton dan Area of Formwork.',
      'Ketebalan S1 adalah 150 mm. Ambil boundary servis 1.000 × 1.200 mm dengan Slab Opening Line dan tinjau Slab Identification Option. Verifikasi ketebalan dan opening pada model; perubahan laporan atau ketebalan tidak memperbaiki opening yang hilang.',
      'CW1 adalah dinding struktur beton: tinjau Volume beton dan Area of Formwork secara terpisah beserta panjang edge/opening break yang relevan. Area masonry merupakan kuantitas berbeda; volume beton tidak membuktikan luas bekisting.',
      'MW1 adalah masonry. Gunakan alur identifikasi masonry wall, termasuk sideline pintu/jendela dan label yang relevan, lalu tinjau Area. Mengabaikan opening dapat membuat geometri dan luas hasil identifikasi tidak andal.',
      'Lebar D1 adalah 900 mm dan tingginya 2.100 mm. Kolom tinggi mendahului lebar, sehingga pemetaan harus mengikuti header, bukan posisi. Pembuatan tipe berbeda dari identifikasi penempatannya; periksa opening hasil identifikasi serta kuantitasnya.',
      'Perbarui finish entity setelah finish R1 diubah. Texture saja tidak memverifikasi entity hasil revisi, dan menumpuk finish kedua berisiko menimbulkan duplikasi. Periksa room boundary, opening, column, dan exposed beam pada model serta kuantitas terbaru.',
    ],
  },
}

export function createSectionTwoExercise(getCourse) {
  const copy = Object.fromEntries(['en', 'id'].map(language => {
    const c = content[language]
    const questions = lessons.map((lesson, index) => ({
      id: `q${index + 1}`, lesson, topic: getCourse(language).allSteps.find(step => step.id === lesson).title,
      title: c.titles[index], type: fields[index].length ? 'dimensions' : 'choice',
      fields: fields[index].map(name => ({ name, label: c.dataLabels[name] })),
      options: c.options[index].map((text, option) => [String(option), text]), explanation: c.explanations[index],
    }))
    return [language, { ...baseCopy[language], ...c, questions, badge: `TAS · ${language === 'en' ? 'Section 2 exercise' : 'Latihan Bagian 2'}`, duration: language === 'en' ? '15–20 minutes · 8 questions · 100 points' : '15–20 menit · 8 pertanyaan · 100 poin', brief: language === 'en' ? 'Project reference brief' : 'Ringkasan referensi proyek', required: language === 'en' ? 'Answer the action question and enter valid dimensions in millimetres.' : 'Jawab pilihan tindakan dan masukkan dimensi yang valid dalam milimeter.', passed: language === 'en' ? 'Section 2 passed' : 'Lulus Bagian 2' }]
  }))
  const storageKey = 'cubicost:tas:section-2-exercise:v2'
  const issues = (index, answers) => {
    if (!lessons[index]) return [{ field: `q${index + 1}`, reason: 'missing' }]
    return [
      ...(['0', '1', '2'].includes(answers[`q${index + 1}`]) ? [] : [{ field: `q${index + 1}`, reason: 'missing' }]),
      ...fields[index].flatMap(field => !String(answers[field] ?? '').trim() ? [{ field, reason: 'missing' }] : !Number.isFinite(numberAnswer(answers[field], 'length')) || numberAnswer(answers[field], 'length') <= 0 ? [{ field, reason: 'number' }] : []),
    ]
  }
  const answered = (index, answers) => issues(index, answers).length === 0
  const score = answers => {
    const scores = choices.map((correct, index) => {
      const actionPoints = index === 3 ? 10 : index === 6 ? 5 : questionPoints[index]
      return (answers[`q${index + 1}`] === correct ? actionPoints : 0) + fields[index].reduce((sum, field) => sum + (numberAnswer(answers[field], 'length') === numericAnswers[field] ? (index === 3 ? 10 : 5) : 0), 0)
    })
    const total = scores.reduce((sum, points) => sum + points, 0)
    const criticalPassed = scores[2] === questionPoints[2] && scores[3] === questionPoints[3]
    return { scores, total, criticalPassed, passed: total >= 80 && criticalPassed }
  }
  const load = () => {
    const empty = { started: false, submitted: false, index: 0, answers: {} }
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey))
      if (!saved || typeof saved !== 'object') return empty
      const allowed = [...choices.map((_, index) => `q${index + 1}`), ...Object.keys(numericAnswers)]
      const answers = Object.fromEntries(allowed.filter(field => typeof saved.answers?.[field] === 'string').map(field => [field, saved.answers[field].slice(0, 100)]))
      return { started: Boolean(saved.started), submitted: Boolean(saved.started && saved.submitted) && choices.every((_, index) => answered(index, answers)), index: Math.max(0, Math.min(7, Number.isInteger(saved.index) ? saved.index : 0)), answers }
    } catch { return empty }
  }
  return { product: 'tas', section: 2, path: '/tas/tests/section-2', copy, storageKey, expectedAnswers: { ...Object.fromEntries(choices.map((value, index) => [`q${index + 1}`, value])), ...Object.fromEntries(Object.entries(numericAnswers).map(([name, value]) => [name, String(value)])) }, load, issues, answered, points: questionPoints, score }
}
