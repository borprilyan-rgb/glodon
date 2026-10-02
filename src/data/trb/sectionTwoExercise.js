import { exerciseCopy as baseCopy, numberAnswer } from '../tas/sectionOneExercise.js'

const lessons = ['pile-cap-reinforcement', 'column-reinforcement', 'beam-side-label', 'beam-schedule', 'beam-support-layout', 'slab-main-bars', 'slab-support-bars', 'wall-reinforcement']
const related = { 0: ['pile-cap-data-check'], 1: ['column-schedule'] }
const correct = ['2', '0', '1', '2', '0', '1', '2', '0']
const points = [15, 15, 10, 15, 10, 10, 10, 15]
const numeric = { columnCount: { index: 1, value: 8, points: 3 }, columnDiameter: { index: 1, value: 20, points: 3 }, tieSpacing: { index: 1, value: 150, points: 3 }, slabSpacing: { index: 5, value: 150, points: 5 }, supportLength: { index: 6, value: 1200, points: 5 } }
const criticalIndices = [0, 1, 3, 7]
const content = {
  en: {
    title: 'Model the Office Reinforcement', entry: 'Check your Section 2 understanding',
    intro: 'Continue ASG Training after the Section 1 transfer and drawing checks. Resolve eight reinforcement scenarios using the approved training details.',
    guide: 'All reinforcement values are fictional training data, not design recommendations or TRB defaults. Use the supplied details; do not invent missing parameters. Enter whole bar counts and dimensions in millimetres. Each scenario has one best action.',
    briefItems: ['Project: ASG Training TRB · Zone A · two floors. Model geometry, floor heights and S03 drawing placement have been checked.', 'PC1 has an irregular boundary. Approved detail PC-S03 defines its reinforcement, but the imported data has one blank parameter. Resolve it from the approved detail before applying data.', 'Column schedule CS-S03: C1 / Floor 1 = 8 longitudinal bars of 20 mm diameter with 10 mm ties at 150 mm spacing; C1 / Floor 2 = 8 bars of 16 mm diameter with 10 mm ties at 100 mm spacing. Schedule field mapping is not yet verified.', 'B1 Side Label example: 2D20+2D16 at the same position; 2D20/2D16 in separate layers. Follow the grouping shown in this course example.', 'Beam schedule BS-S03: B1 already exists on Floor 1 and its reinforcement changes; B2 on Floor 1 has not been modelled. Confirm identities and field mapping before applying rows.', 'B1 left support is C1. The top-bar range at that end disagrees with detail B-S03; investigate the recognised support and layout before correction.', 'S1 / Floor 2: main bars of 12 mm diameter at 150 mm spacing in the shown A–B direction, within the marked placement boundary.', 'S1 support detail: 12 mm bars at 100 mm spacing, extending 1,200 mm into S1 on the marked side of the support line only.', 'W1 / Floor 2: vertical 16 mm bars at 200 mm spacing and horizontal 12 mm bars at 150 mm spacing on both specified faces within the marked extent. The model currently has vertical bars on one face only.'],
    dataLabels: { columnCount: 'C1 Floor 1 longitudinal bar count', columnDiameter: 'C1 Floor 1 longitudinal bar diameter (mm)', tieSpacing: 'C1 Floor 1 tie spacing (mm)', slabSpacing: 'S1 main-bar spacing (mm)', supportLength: 'S1 support-bar extent (mm)' },
    passRule: 'Pass with at least 80/100, plus full marks for pile-cap data checks, column assignment and values, beam synchronisation, and wall verification.',
    critical: 'Pile-cap data checks, floor-specific column data, beam synchronisation and wall direction/face verification must all be correct, even with a total of 80 or higher.',
    numericError: 'Enter a positive whole number: a bar count without units, or a dimension in mm (150, 1200 or 1,200 mm).',
    titles: [
      'PC1 has an irregular outline and a blank reinforcement parameter. Which preparation and checking sequence is appropriate?',
      'Enter the C1 Floor 1 bar count, longitudinal diameter and tie spacing from CS-S03. How should the schedule be applied?',
      'How should the B1 examples 2D20+2D16 and 2D20/2D16 be interpreted and checked?',
      'BS-S03 changes existing B1 and includes unmodelled B2 on Floor 1. Which application avoids duplicate beams?',
      'B1 top bars extend incorrectly near its left end. Which investigation should precede a correction?',
      'Enter S1 main-bar spacing. Which placement and verification follow detail S03?',
      'Enter the S1 support-bar extent. Which arrangement matches the stated one-sided support detail?',
      'W1 currently has vertical bars on one face only. What correction and final verification are required?',
    ],
    options: [
      ['Keep the standard rectangular outline and fill the blank from another pile cap of similar size.', 'Use the irregular outline but accept the blank parameter if the total looks reasonable.', 'Resolve the blank against PC-S03, follow its irregular boundary, run the documented data check, and compare both geometry and reinforcement with the same approved detail.'],
      ['Verify schedule field mapping and C1 identities by floor, apply each matching row, then check bar count, diameter, ties, positions and ranges against CS-S03.', 'Apply the Floor 1 row to every C1 because the column name is the same on both floors.', 'Use the Floor 2 row on Floor 1 because the smaller diameter reduces the quantity.'],
      ['Both labels mean four bars in one layer; only the diameter differs.', '+ combines groups at the same position; / separates layers in this course example. Preserve both groups and compare the resulting arrangement with B-S03.', '/ separates floors, so assign the second group to Floor 2.'],
      ['Generate both B1 and B2 from the schedule and keep the original B1 for reference.', 'Synchronise both rows without checking whether B2 exists, then accept the import summary.', 'Verify identities and field mapping, synchronise existing B1, generate only unmodelled B2, then confirm each row produced its intended result without a duplicate.'],
      ['Check the recognised C1 support relationship and top/bottom bar positions and ranges against B-S03; correct confirmed mismatches and verify the resulting layout.', 'Shorten the bars until the total agrees with a previous report, without reviewing the support.', 'Change only the beam name and retain the current reinforcement range.'],
      ['Apply the stated diameter and spacing over every Floor 2 slab, irrespective of the marked boundary.', 'Use 12 mm main bars in the A–B direction at the stated spacing within S1’s marked boundary; verify direction, edge conditions and coverage against the detail.', 'Use the stated spacing but rotate the bars to match whichever grid is nearest.'],
      ['Mirror the support bars to both sides because support reinforcement should always be symmetric.', 'Use the main-bar spacing and span for the support bars because they belong to S1.', 'Select the specified support line and marked side; use 12 mm bars at 100 mm spacing over the stated extent, then check coverage together with the main bars.'],
      ['Correct the missing specified face, then verify vertical 16 mm / 200 mm and horizontal 12 mm / 150 mm reinforcement on both faces, including layers and extent, against W1’s detail.', 'Add vertical bars on the second face and skip the horizontal and extent checks because the missing face was the only visible problem.', 'Double the vertical bar count on the existing face to match the total without changing the face arrangement.'],
    ],
    explanations: [
      'Resolve the missing parameter from PC-S03; do not estimate it from another element. Follow the approved irregular boundary and use the documented data check to investigate incomplete or inconsistent data. Confirm geometry and reinforcement against the same detail. A plausible total cannot validate a blank parameter or an incorrect outline.',
      'C1 on Floor 1 requires 8 longitudinal bars of 20 mm diameter and ties at 150 mm spacing (tie diameter 10 mm). Floor 2 has different data. Verify schedule mapping and type/floor identity before synchronising, then check count, diameter, ties, position and range. A repeated C1 label does not authorise copying one row to both floors.',
      'In the course example, + combines the 2D20 and 2D16 groups at the same position, while / keeps them in separate layers. Both retain their stated diameters. Check the resulting arrangement against the source label and detail; a total of four bars alone cannot prove correct layering.',
      'B1 already exists and should be synchronised after identity and field mapping are confirmed. B2 is unmodelled and should be generated through the documented workflow. Check that each row gives one intended update or element, not both. Generating B1 again risks a duplicate; synchronisation alone cannot be assumed to create missing B2.',
      'Trace the incorrect range to the recognised left support and reinforcement layout. Compare top/bottom positions and extents with B-S03, correct only confirmed data or relationship errors, then verify the result. Matching an older quantity or changing a label does not establish the proper range.',
      'Enter 150 mm. S1 uses 12 mm main bars in the A–B direction within its marked placement boundary. Confirm diameter, spacing, direction, edges and coverage against the detail. Applying the same data across unrelated slabs or changing direction from visual convenience does not match the approved scope.',
      'Enter 1,200 mm. Use the specified support line and marked side, 12 mm diameter and 100 mm spacing, extending into S1 for that distance. Review the support and main-bar coverage together. Symmetric mirroring and copying the 150 mm main-bar spacing contradict this detail.',
      'W1 needs both specified faces. Correct the missing face, then check vertical 16 mm bars at 200 mm and horizontal 12 mm bars at 150 mm, including direction, layers and marked extent. Doubling bars on one face may change a total but does not reproduce the specified arrangement; checking only the visible defect is incomplete.',
    ],
  },
  id: {
    title: 'Modelkan Tulangan Kantor', entry: 'Periksa pemahaman Bagian 2',
    intro: 'Lanjutkan ASG Training setelah pemeriksaan transfer dan gambar Bagian 1. Selesaikan delapan skenario tulangan berdasarkan detail latihan yang disetujui.',
    guide: 'Seluruh nilai tulangan adalah data latihan fiktif, bukan rekomendasi desain atau nilai bawaan TRB. Gunakan detail yang diberikan; jangan mengarang parameter yang belum tersedia. Masukkan jumlah batang bulat dan dimensi dalam milimeter. Setiap skenario memiliki satu tindakan terbaik.',
    briefItems: ['Proyek: ASG Training TRB · Zone A · dua lantai. Geometri model, tinggi lantai, dan penempatan gambar S03 sudah diperiksa.', 'PC1 memiliki batas tidak beraturan. Detail PC-S03 yang disetujui menentukan tulangannya, tetapi satu parameter data impor kosong. Lengkapi berdasarkan detail yang disetujui sebelum menerapkan data.', 'Column schedule CS-S03: C1 / Lantai 1 = 8 batang utama berdiameter 20 mm dengan sengkang 10 mm pada spacing 150 mm; C1 / Lantai 2 = 8 batang berdiameter 16 mm dengan sengkang 10 mm pada spacing 100 mm. Pemetaan field schedule belum diverifikasi.', 'Contoh Side Label B1: 2D20+2D16 pada posisi yang sama; 2D20/2D16 pada lapisan terpisah. Ikuti pengelompokan pada contoh materi ini.', 'Beam schedule BS-S03: B1 sudah ada pada Lantai 1 dan data tulangannya berubah; B2 pada Lantai 1 belum dimodelkan. Pastikan identitas serta pemetaan field sebelum menerapkan baris.', 'Support kiri B1 adalah C1. Rentang tulangan atas pada ujung tersebut berbeda dengan detail B-S03; telusuri support yang dikenali dan susunannya sebelum koreksi.', 'S1 / Lantai 2: tulangan utama berdiameter 12 mm pada spacing 150 mm dalam arah A–B yang ditunjukkan, di dalam batas penempatan yang ditandai.', 'Detail tumpuan S1: tulangan 12 mm pada spacing 100 mm, memanjang 1.200 mm ke dalam S1 hanya pada sisi garis tumpuan yang ditandai.', 'W1 / Lantai 2: tulangan vertikal 16 mm pada spacing 200 mm dan horizontal 12 mm pada spacing 150 mm pada kedua muka yang ditentukan, dalam rentang yang ditandai. Model saat ini hanya memiliki tulangan vertikal pada satu muka.'],
    dataLabels: { columnCount: 'Jumlah batang utama C1 Lantai 1', columnDiameter: 'Diameter batang utama C1 Lantai 1 (mm)', tieSpacing: 'Spacing sengkang C1 Lantai 1 (mm)', slabSpacing: 'Spacing tulangan utama S1 (mm)', supportLength: 'Rentang tulangan tumpuan S1 (mm)' },
    passRule: 'Lulus dengan nilai minimal 80/100 serta nilai penuh untuk pemeriksaan data pile cap, penerapan dan nilai kolom, sinkronisasi balok, serta verifikasi dinding.',
    critical: 'Pemeriksaan data pile cap, data kolom per lantai, sinkronisasi balok, serta verifikasi arah/muka tulangan dinding harus benar, meskipun nilai total mencapai 80.',
    numericError: 'Masukkan bilangan bulat positif: jumlah batang tanpa satuan, atau dimensi dalam mm (150, 1200 atau 1.200 mm).',
    titles: [
      'PC1 memiliki batas tidak beraturan dan parameter tulangan kosong. Urutan persiapan dan pemeriksaan mana yang sesuai?',
      'Masukkan jumlah batang, diameter utama, dan spacing sengkang C1 Lantai 1 dari CS-S03. Bagaimana menerapkan schedule?',
      'Bagaimana menafsirkan dan memeriksa contoh B1 2D20+2D16 serta 2D20/2D16?',
      'BS-S03 mengubah B1 yang sudah ada dan memuat B2 yang belum dimodelkan pada Lantai 1. Penerapan mana yang menghindari duplikasi?',
      'Tulangan atas B1 memiliki rentang salah di dekat ujung kiri. Penelusuran apa yang dilakukan sebelum koreksi?',
      'Masukkan spacing tulangan utama S1. Penempatan dan verifikasi mana yang mengikuti detail S03?',
      'Masukkan rentang tulangan tumpuan S1. Susunan mana yang sesuai detail tumpuan satu sisi yang diberikan?',
      'W1 saat ini hanya memiliki tulangan vertikal pada satu muka. Koreksi dan verifikasi akhir apa yang diperlukan?',
    ],
    options: [
      ['Pertahankan batas persegi standar dan isi parameter kosong dari pile cap lain berukuran serupa.', 'Gunakan batas tidak beraturan tetapi terima parameter kosong jika total tampak wajar.', 'Lengkapi parameter dari PC-S03, ikuti batas tidak beraturannya, jalankan pemeriksaan data yang didokumentasikan, lalu bandingkan geometri dan tulangan terhadap detail yang sama.'],
      ['Verifikasi pemetaan field schedule dan identitas C1 per lantai, terapkan baris yang sesuai, lalu periksa jumlah, diameter, sengkang, posisi, dan rentang terhadap CS-S03.', 'Terapkan baris Lantai 1 ke seluruh C1 karena nama kolom sama pada kedua lantai.', 'Gunakan baris Lantai 2 pada Lantai 1 karena diameter lebih kecil mengurangi kuantitas.'],
      ['Kedua label berarti empat batang dalam satu lapisan; hanya diameter berbeda.', '+ menggabungkan kelompok pada posisi yang sama; / memisahkan lapisan pada contoh materi ini. Pertahankan kedua kelompok dan bandingkan susunan hasil terhadap B-S03.', '/ memisahkan lantai, jadi terapkan kelompok kedua ke Lantai 2.'],
      ['Buat B1 dan B2 dari schedule lalu pertahankan B1 lama sebagai referensi.', 'Sinkronkan kedua baris tanpa memeriksa apakah B2 sudah ada, lalu terima ringkasan impor.', 'Verifikasi identitas dan pemetaan field, sinkronkan B1 yang ada, buat hanya B2 yang belum dimodelkan, lalu pastikan setiap baris menghasilkan keluaran yang dimaksud tanpa duplikasi.'],
      ['Periksa hubungan support C1 yang dikenali serta posisi dan rentang tulangan atas/bawah terhadap B-S03; koreksi ketidaksesuaian yang terbukti dan verifikasi susunan hasilnya.', 'Pendekkan batang hingga total sesuai laporan lama tanpa memeriksa support.', 'Ubah hanya nama balok dan pertahankan rentang tulangan saat ini.'],
      ['Terapkan diameter dan spacing tersebut pada seluruh pelat Lantai 2 tanpa melihat batas yang ditandai.', 'Gunakan tulangan utama 12 mm dalam arah A–B pada spacing yang diberikan di dalam batas S1; verifikasi arah, kondisi tepi, dan cakupan terhadap detail.', 'Gunakan spacing tersebut tetapi putar tulangan mengikuti grid mana pun yang terdekat.'],
      ['Cerminkan tulangan tumpuan ke kedua sisi karena tulangan tumpuan harus selalu simetris.', 'Gunakan spacing dan bentang tulangan utama untuk tulangan tumpuan karena keduanya berada pada S1.', 'Pilih garis tumpuan dan sisi yang ditentukan; gunakan batang 12 mm pada spacing 100 mm sepanjang rentang yang diberikan, lalu periksa cakupan bersama tulangan utama.'],
      ['Koreksi muka yang belum memiliki tulangan sesuai detail, lalu verifikasi tulangan vertikal 16 mm / 200 mm dan horizontal 12 mm / 150 mm pada kedua muka, termasuk lapisan dan rentang, terhadap detail W1.', 'Tambahkan tulangan vertikal pada muka kedua dan abaikan pemeriksaan horizontal serta rentang karena muka yang hilang adalah satu-satunya masalah yang terlihat.', 'Gandakan jumlah tulangan vertikal pada muka yang ada untuk menyamakan total tanpa mengubah susunan muka.'],
    ],
    explanations: [
      'Lengkapi parameter yang kosong dari PC-S03; jangan memperkirakannya dari elemen lain. Ikuti batas tidak beraturan yang disetujui dan gunakan pemeriksaan data yang didokumentasikan untuk menelusuri data tidak lengkap atau tidak konsisten. Pastikan geometri dan tulangan sesuai detail yang sama. Total wajar belum memvalidasi parameter kosong atau batas salah.',
      'C1 Lantai 1 memerlukan 8 batang utama berdiameter 20 mm dan sengkang pada spacing 150 mm (diameter sengkang 10 mm). Data Lantai 2 berbeda. Verifikasi pemetaan schedule dan identitas tipe/lantai sebelum sinkronisasi, lalu periksa jumlah, diameter, sengkang, posisi, dan rentang. Label C1 yang sama tidak membenarkan penyalinan satu baris ke kedua lantai.',
      'Pada contoh materi, + menggabungkan kelompok 2D20 dan 2D16 pada posisi yang sama, sedangkan / mempertahankannya pada lapisan terpisah. Kedua kelompok tetap menggunakan diameter masing-masing. Bandingkan susunan hasil dengan label serta detail sumber; total empat batang saja belum membuktikan lapisan benar.',
      'B1 sudah ada dan harus disinkronkan setelah identitas serta pemetaan field dikonfirmasi. B2 belum dimodelkan dan harus dibuat melalui alur yang didokumentasikan. Pastikan setiap baris menghasilkan satu pembaruan atau elemen yang dimaksud, bukan keduanya. Membuat B1 lagi berisiko duplikasi; sinkronisasi saja tidak boleh dianggap otomatis membuat B2 yang belum ada.',
      'Telusuri rentang salah melalui support kiri yang dikenali dan susunan tulangannya. Bandingkan posisi atas/bawah serta rentang dengan B-S03, koreksi hanya kesalahan data atau hubungan yang terbukti, lalu verifikasi hasil. Menyamakan kuantitas lama atau mengganti label tidak membuktikan rentang yang sesuai.',
      'Masukkan 150 mm. S1 menggunakan tulangan utama 12 mm dalam arah A–B di dalam batas penempatan yang ditandai. Pastikan diameter, spacing, arah, tepi, dan cakupan terhadap detail. Menerapkan data pada pelat lain atau mengubah arah demi kemudahan tampilan tidak sesuai cakupan yang disetujui.',
      'Masukkan 1.200 mm. Gunakan garis tumpuan serta sisi yang ditentukan, diameter 12 mm dan spacing 100 mm, memanjang ke dalam S1 sepanjang jarak tersebut. Tinjau cakupan tulangan tumpuan dan utama bersama-sama. Pencerminan simetris atau penyalinan spacing utama 150 mm bertentangan dengan detail ini.',
      'W1 memerlukan kedua muka yang ditentukan. Koreksi muka yang belum memiliki tulangan, lalu periksa vertikal 16 mm pada spacing 200 mm dan horizontal 12 mm pada spacing 150 mm, termasuk arah, lapisan, serta rentang. Menggandakan batang pada satu muka dapat mengubah total tetapi tidak memenuhi susunan yang ditentukan; memeriksa hanya cacat yang terlihat belum lengkap.',
    ],
  },
}

export function reinforcementNumber(value, field) {
  const text = String(value ?? '').trim()
  if (field === 'columnCount' && !/^\d+$/.test(text)) return NaN
  const parsed = field === 'columnCount' ? Number(text) : numberAnswer(text, 'length')
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : NaN
}

export function createTrbSectionTwoExercise(getCourse) {
  const copy = Object.fromEntries(['en', 'id'].map(language => {
    const c = content[language]
    const questions = lessons.map((lesson, index) => ({
      id: `q${index + 1}`, lesson, relatedLessons: (related[index] || []).map(id => ({ id, title: getCourse(language).allSteps.find(step => step.id === id).title })), topic: getCourse(language).allSteps.find(step => step.id === lesson).title,
      title: c.titles[index], type: Object.values(numeric).some(field => field.index === index) ? 'dimensions' : 'choice',
      fields: Object.entries(numeric).filter(([, field]) => field.index === index).map(([name]) => ({ name, label: c.dataLabels[name] })),
      options: c.options[index].map((text, option) => [String(option), text]), explanation: c.explanations[index],
    }))
    return [language, { ...baseCopy[language], ...c, questions, badge: `TRB · ${language === 'en' ? 'Section 2 exercise' : 'Latihan Bagian 2'}`, duration: language === 'en' ? '15–20 minutes · 8 questions · 100 points' : '15–20 menit · 8 pertanyaan · 100 poin', brief: language === 'en' ? 'Project reference brief' : 'Ringkasan referensi proyek', scope: language === 'en' ? 'This exercise checks reinforcement modelling decisions. It does not assess a completed TRB model.' : 'Latihan ini mengukur keputusan pemodelan tulangan, bukan hasil model TRB yang telah dikerjakan.', required: language === 'en' ? 'Choose an action and complete the requested dimensions in their stated units.' : 'Pilih tindakan dan lengkapi dimensi yang diminta dengan satuan yang disebutkan.', passed: language === 'en' ? 'Section 2 passed' : 'Lulus Bagian 2' }]
  }))
  const storageKey = 'cubicost:trb:section-2-exercise:v2'
  const issues = (index, answers) => [
    ...(['0', '1', '2'].includes(answers[`q${index + 1}`]) && lessons[index] ? [] : [{ field: `q${index + 1}`, reason: 'missing' }]),
    ...Object.entries(numeric).filter(([, field]) => field.index === index).flatMap(([name]) => !String(answers[name] ?? '').trim() ? [{ field: name, reason: 'missing' }] : !Number.isFinite(reinforcementNumber(answers[name], name)) ? [{ field: name, reason: 'number' }] : []),
  ]
  const answered = (index, answers) => issues(index, answers).length === 0
  const score = answers => {
    const scores = correct.map((choice, index) => {
      const fields = Object.entries(numeric).filter(([, field]) => field.index === index)
      const actionPoints = points[index] - fields.reduce((sum, [, field]) => sum + field.points, 0)
      return (answers[`q${index + 1}`] === choice ? actionPoints : 0) + fields.reduce((sum, [name, field]) => sum + (Math.abs(reinforcementNumber(answers[name], name) - field.value) < 1e-9 ? field.points : 0), 0)
    })
    const total = scores.reduce((sum, value) => sum + value, 0)
    const criticalPassed = criticalIndices.every(index => scores[index] === points[index])
    return { scores, total, criticalPassed, passed: total >= 80 && criticalPassed }
  }
  const load = () => {
    const empty = { started: false, submitted: false, index: 0, answers: {} }
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey))
      if (!saved || typeof saved !== 'object') return empty
      const allowed = [...correct.map((_, index) => `q${index + 1}`), ...Object.keys(numeric)]
      const answers = Object.fromEntries(allowed.filter(field => typeof saved.answers?.[field] === 'string').map(field => [field, saved.answers[field].slice(0, 100)]))
      return { started: Boolean(saved.started), submitted: Boolean(saved.started && saved.submitted) && correct.every((_, index) => answered(index, answers)), index: Math.max(0, Math.min(7, Number.isInteger(saved.index) ? saved.index : 0)), answers }
    } catch { return empty }
  }
  return { product: 'trb', section: 2, path: '/trb/tests/section-2', copy, storageKey, load, issues, answered, points, score }
}
