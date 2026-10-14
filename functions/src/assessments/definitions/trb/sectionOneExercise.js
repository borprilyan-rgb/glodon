import { exerciseCopy as baseCopy, numberAnswer } from '../tas/sectionOneExercise.js'

const lessons = ['export-tas-model', 'export-tas-model', 'import-tas-model', 'match-import-settings', 'match-import-settings', 'prepare-trb-drawings', 'prepare-trb-drawings', 'prepare-trb-drawings']
const correct = ['1', '0', '2', '1', '0', '2', '0', '1']
const points = [15, 10, 10, 15, 15, 10, 10, 15]
const numeric = { height1: { index: 3, value: 3.5, points: 5 }, height2: { index: 3, value: 3.6, points: 5 }, gridDistance: { index: 6, value: 6000, points: 5 } }
const criticalIndices = [0, 3, 4, 7]
const content = {
  en: {
    title: 'Prepare the Office Model for Reinforcement', entry: 'Check your Section 1 understanding',
    intro: 'Prepare ASG Training for reinforcement modelling. Resolve eight model-transfer and drawing-preparation scenarios using one project reference brief.',
    guide: 'All dimensions and revisions are fictional training data. Initial transfer and the later partial revision are separate stages. Enter floor heights in metres and the reference distance in millimetres. Each scenario has one best action.',
    briefItems: ['Project: ASG Training · destination: ASG Training TRB · Zone A · two floors.', 'Initial transfer R2: all structural entities on Floors 1 and 2 have been checked in TAS and must be transferred.', 'Later revision R3: only Floor 1 columns C1 and C2 change; all other entities remain outside this update scope.', 'Available transfer files: ASG_ZoneA_F1-F2_R2 (initial transfer), ASG_ZoneA_F1_C1-C2_R3 (partial update), and an obsolete R1 file.', 'Approved TRB floor heights: Floor 1 = 3.50 m; Floor 2 = 3.60 m. TAS source heights are 3.20 m and 3.30 m. Keep the approved TRB heights.', 'Source levels L01 and L02 correspond to destination Floors 1 and 2 in Zone A.', 'Drawing revision S03 contains both floor plans. Split and name them by floor, then relocate them to the matching floor/model reference. Grid A/1 is the reference; A to B = 6,000 mm, 1 to 2 = 4,000 mm.', 'After the initial import, C2 appears missing while a display filter is active. Drawing placement and imported geometry must be verified before reinforcement starts.'],
    dataLabels: { height1: 'Approved Floor 1 height (m)', height2: 'Approved Floor 2 height (m)', gridDistance: 'A–B reference distance (mm)' },
    passRule: 'Pass with at least 80/100, plus full marks for initial transfer scope, floor heights, import mapping and final readiness verification.',
    critical: 'Transfer scope, both approved floor heights and their source decision, import mapping and final readiness verification must all be correct, even with a total of 80 or higher.',
    numericError: 'Enter a positive number in the stated unit: heights in m (3.50 or 3,50), distance in mm (6000, 6,000 or 6.000).',
    titles: [
      'For the initial R2 transfer, all structural entities on both floors are required. Which export scope matches the brief?',
      'After the initial transfer, R3 changes only C1 and C2 on Floor 1. How should you prepare the transfer for this update?',
      'You are about to perform the initial import. Which destination and source checks should precede confirmation?',
      'Enter the two approved destination floor heights. TAS has different heights. How should Use floor height in TAS project be handled?',
      'For the initial R2 import, how should zones, floors and element selections be reviewed before Next Step?',
      'C2 is not visible after the initial import while a display filter is active. What should you investigate first?',
      'Enter the A–B reference distance in millimetres. Drawing S03 contains both floor plans. How should it be prepared?',
      'The model and drawings now appear aligned. Which evidence is sufficient to start reinforcement modelling?',
    ],
    options: [
      ['Export Model by Entity with only C1 and C2 on Floor 1 selected.', 'Export Model by Floor with Floors 1 and 2 selected and confirm all required structural entities are included.', 'Export Model by Floor with Floor 1 selected; use its geometry for both floors.'],
      ['Use Export Model by Entity for C1 and C2 on Floor 1; save a file identifying the project, scope and R3 revision.', 'Export every entity on both floors and retain the R2 filename for convenience.', 'Export all columns on both floors because they share the same element type.'],
      ['Open ASG Training TRB and choose the R3 file because it has the newest revision number.', 'Choose the R2 file, but import into whichever TRB project is currently open.', 'Confirm ASG Training TRB, the Zone A / Floors 1–2 initial scope and the R2 source file, then use BIM MODEL > Import Model.'],
      ['Enable the option because all source TAS settings should replace destination settings.', 'Keep the approved TRB heights; do not enable Use floor height in TAS project, and verify the destination heights after import.', 'Enable the option now and assume drawing relocation will correct the floor heights later.'],
      ['Match Zone A, map L01 to Floor 1 and L02 to Floor 2, and include the required structural entity types on both floors before Next Step.', 'Match the floor names only and retain the default zone and element selections.', 'Map both source levels to Floor 1 so all imported entities can be reviewed together.'],
      ['Immediately reimport the whole model without checking the display settings.', 'Create a replacement C2 manually because every hidden entity is missing from the import.', 'Use F12 display controls to show the required columns, then check C2 on the mapped floor against the source; investigate scope/mapping if it remains absent.'],
      ['Use IDENTIFY > Add Drawing, split S03 into floor-specific plans, name them clearly and relocate each to its matching floor and reference.', 'Keep the combined sheet on Floor 1 and use it for both floors without separate placement checks.', 'Reuse the old drawing placement without checking the S03 revision or grid reference.'],
      ['Confirm only that both floor drawings look centred in the viewport.', 'Confirm source revision and scope, Zone A/floor mapping and retained heights; check imported entities and geometry, S03 floor placement, and A/1 plus another labelled grid intersection/distance.', 'Confirm only that the file imported without an error; geometry and drawings can be checked after reinforcement is modelled.'],
    ],
    explanations: [
      'The initial R2 scope includes both whole floors. Use Export Model by Floor and confirm that the required structural entities are included on Floors 1 and 2. The later C1/C2 update does not define the initial scope; exporting one floor leaves the other incomplete.',
      'R3 is a separate partial update: use Export Model by Entity for C1 and C2 on Floor 1, with an identifiable R3 file. Exporting every entity or every column widens the agreed scope. Check the destination update outcome before proceeding; the export choice alone does not prove that existing entities were updated correctly.',
      'The initial transfer needs the R2 whole-floor file and ASG Training TRB destination. Verify project, zone, floors, scope and revision before BIM MODEL > Import Model. The newer R3 file contains only two columns, so it cannot replace the initial transfer.',
      'Enter 3.50 m and 3.60 m. The brief requires the approved TRB heights, so do not enable Use floor height in TAS project for the conflicting 3.20/3.30 m source values. Verify that the destination heights remain correct after import; relocating a drawing does not repair floor settings.',
      'Review zones, explicit floor correspondence and all required structural element types before Next Step. L01 maps to Floor 1 and L02 to Floor 2 in Zone A. Matching names alone does not establish complete scope, and mapping both levels to one floor destroys the intended floor separation.',
      'Visibility is not proof that an entity was omitted. Show the needed columns with F12, inspect C2 on the correct mapped floor and compare it with the source. If still absent, investigate transfer scope and mapping before a corrective import. Blind reimport or manual replacement risks unintended duplicates.',
      'A–B is 6,000 mm. Add the S03 reference through IDENTIFY > Add Drawing, split and name the plans by floor, and relocate each against its matching model reference. Confirm the drawing revision and floor placement; a combined sheet or old placement can lead to reinforcement on the wrong floor.',
      'Readiness requires a checked transfer and checked references: correct revision/scope, zone and floors, approved heights, expected entities and geometry, and S03 drawings on their matching floors. Match A/1 and verify another labelled grid reference and distance. Visual centring or a successful import message does not prove alignment or complete geometry.',
    ],
  },
  id: {
    title: 'Siapkan Model Kantor untuk Pemodelan Tulangan', entry: 'Periksa pemahaman Bagian 1',
    intro: 'Siapkan ASG Training untuk pemodelan tulangan. Selesaikan delapan skenario transfer model dan persiapan gambar berdasarkan satu ringkasan referensi proyek.',
    guide: 'Seluruh dimensi dan revisi merupakan data latihan fiktif. Transfer awal dan pembaruan parsial berikutnya adalah tahap terpisah. Masukkan tinggi lantai dalam meter dan jarak acuan dalam milimeter. Setiap skenario memiliki satu tindakan terbaik.',
    briefItems: ['Proyek: ASG Training · tujuan: ASG Training TRB · Zone A · dua lantai.', 'Transfer awal R2: seluruh entity struktur pada Lantai 1 dan 2 telah diperiksa di TAS dan harus ditransfer.', 'Revisi berikutnya R3: hanya kolom C1 dan C2 pada Lantai 1 berubah; seluruh entity lain berada di luar cakupan pembaruan ini.', 'File transfer tersedia: ASG_ZoneA_F1-F2_R2 (transfer awal), ASG_ZoneA_F1_C1-C2_R3 (pembaruan parsial), dan file R1 yang sudah tidak berlaku.', 'Tinggi lantai TRB yang disetujui: Lantai 1 = 3,50 m; Lantai 2 = 3,60 m. Tinggi sumber TAS adalah 3,20 m dan 3,30 m. Pertahankan tinggi TRB yang disetujui.', 'Level sumber L01 dan L02 sesuai dengan Lantai 1 dan 2 tujuan pada Zone A.', 'Gambar revisi S03 memuat denah kedua lantai. Pisahkan dan beri nama berdasarkan lantai, lalu pindahkan ke lantai/acuan model yang sesuai. Grid A/1 adalah acuan; A ke B = 6.000 mm, 1 ke 2 = 4.000 mm.', 'Setelah impor awal, C2 tampak tidak ada saat filter tampilan aktif. Penempatan gambar dan geometri impor harus diverifikasi sebelum pemodelan tulangan.'],
    dataLabels: { height1: 'Tinggi Lantai 1 yang disetujui (m)', height2: 'Tinggi Lantai 2 yang disetujui (m)', gridDistance: 'Jarak acuan A–B (mm)' },
    passRule: 'Lulus dengan nilai minimal 80/100 serta nilai penuh untuk cakupan transfer awal, tinggi lantai, pemetaan impor, dan verifikasi kesiapan akhir.',
    critical: 'Cakupan transfer, kedua tinggi lantai yang disetujui beserta keputusan sumbernya, pemetaan impor, dan verifikasi kesiapan akhir harus benar, meskipun nilai total mencapai 80.',
    numericError: 'Masukkan angka positif dengan satuan yang diminta: tinggi dalam m (3,50 atau 3.50), jarak dalam mm (6000, 6.000 atau 6,000).',
    titles: [
      'Untuk transfer awal R2, seluruh entity struktur pada kedua lantai diperlukan. Cakupan ekspor mana yang sesuai ringkasan?',
      'Setelah transfer awal, R3 hanya mengubah C1 dan C2 pada Lantai 1. Bagaimana menyiapkan transfer pembaruan ini?',
      'Anda akan melakukan impor awal. Pemeriksaan tujuan dan sumber apa yang dilakukan sebelum konfirmasi?',
      'Masukkan kedua tinggi lantai tujuan yang disetujui. Tinggi TAS berbeda. Bagaimana menangani Use floor height in TAS project?',
      'Untuk impor awal R2, bagaimana zone, lantai, dan pilihan elemen diperiksa sebelum Next Step?',
      'C2 tidak terlihat setelah impor awal saat filter tampilan aktif. Apa yang ditelusuri terlebih dahulu?',
      'Masukkan jarak acuan A–B dalam milimeter. Gambar S03 memuat denah kedua lantai. Bagaimana menyiapkannya?',
      'Model dan gambar kini tampak selaras. Bukti mana yang memadai untuk memulai pemodelan tulangan?',
    ],
    options: [
      ['Export Model by Entity dengan hanya C1 dan C2 pada Lantai 1 terpilih.', 'Export Model by Floor dengan Lantai 1 dan 2 terpilih serta pastikan seluruh entity struktur yang diperlukan tercakup.', 'Export Model by Floor dengan Lantai 1 terpilih; gunakan geometrinya untuk kedua lantai.'],
      ['Gunakan Export Model by Entity untuk C1 dan C2 pada Lantai 1; simpan file yang menunjukkan proyek, cakupan, dan revisi R3.', 'Ekspor seluruh entity kedua lantai dan pertahankan nama file R2 agar mudah digunakan.', 'Ekspor seluruh kolom kedua lantai karena memiliki tipe elemen yang sama.'],
      ['Buka ASG Training TRB dan pilih file R3 karena nomor revisinya paling baru.', 'Pilih file R2, tetapi impor ke proyek TRB mana pun yang sedang terbuka.', 'Pastikan ASG Training TRB, cakupan awal Zone A / Lantai 1–2, dan file sumber R2, lalu gunakan BIM MODEL > Import Model.'],
      ['Aktifkan opsi karena seluruh pengaturan sumber TAS harus menggantikan pengaturan tujuan.', 'Pertahankan tinggi TRB yang disetujui; jangan aktifkan Use floor height in TAS project, lalu verifikasi tinggi tujuan setelah impor.', 'Aktifkan opsi sekarang dan anggap pemindahan gambar akan memperbaiki tinggi lantai kemudian.'],
      ['Cocokkan Zone A, petakan L01 ke Lantai 1 dan L02 ke Lantai 2, serta sertakan tipe entity struktur yang diperlukan pada kedua lantai sebelum Next Step.', 'Cocokkan hanya nama lantai dan pertahankan pilihan zone serta elemen bawaan.', 'Petakan kedua level sumber ke Lantai 1 agar seluruh entity impor dapat diperiksa bersama.'],
      ['Langsung impor ulang seluruh model tanpa memeriksa pengaturan tampilan.', 'Buat pengganti C2 secara manual karena setiap entity tersembunyi pasti tidak terimpor.', 'Gunakan kontrol tampilan F12 untuk menampilkan kolom yang diperlukan, lalu periksa C2 pada lantai hasil pemetaan terhadap sumber; telusuri cakupan/pemetaan jika tetap tidak ada.'],
      ['Gunakan IDENTIFY > Add Drawing, pisahkan S03 menjadi denah per lantai, beri nama yang jelas, dan pindahkan masing-masing ke lantai serta acuan yang sesuai.', 'Pertahankan lembar gabungan pada Lantai 1 dan gunakan untuk kedua lantai tanpa pemeriksaan penempatan terpisah.', 'Gunakan penempatan gambar lama tanpa memeriksa revisi S03 atau acuan grid.'],
      ['Pastikan hanya kedua denah lantai tampak berada di tengah viewport.', 'Pastikan revisi dan cakupan sumber, pemetaan Zone A/lantai serta tinggi yang dipertahankan; periksa entity dan geometri impor, penempatan S03 per lantai, serta A/1 dan perpotongan/jarak grid berlabel lainnya.', 'Pastikan hanya file terimpor tanpa error; geometri dan gambar dapat diperiksa setelah tulangan dimodelkan.'],
    ],
    explanations: [
      'Cakupan awal R2 mencakup kedua lantai secara utuh. Gunakan Export Model by Floor dan pastikan entity struktur yang diperlukan tercakup pada Lantai 1 dan 2. Pembaruan C1/C2 berikutnya tidak menentukan cakupan awal; ekspor satu lantai menyisakan lantai lain belum lengkap.',
      'R3 adalah pembaruan parsial terpisah: gunakan Export Model by Entity untuk C1 dan C2 pada Lantai 1 dengan file R3 yang mudah dikenali. Ekspor seluruh entity atau seluruh kolom memperluas cakupan yang disepakati. Periksa hasil pembaruan tujuan sebelum melanjutkan; pilihan ekspor saja belum membuktikan entity lama diperbarui dengan benar.',
      'Transfer awal memerlukan file R2 seluruh lantai dan tujuan ASG Training TRB. Verifikasi proyek, zone, lantai, cakupan, dan revisi sebelum BIM MODEL > Import Model. File R3 yang lebih baru hanya memuat dua kolom sehingga tidak dapat menggantikan transfer awal.',
      'Masukkan 3,50 m dan 3,60 m. Ringkasan mewajibkan tinggi TRB yang disetujui, jadi jangan aktifkan Use floor height in TAS project untuk nilai sumber 3,20/3,30 m yang berbeda. Verifikasi tinggi tujuan tetap benar setelah impor; pemindahan gambar tidak memperbaiki pengaturan lantai.',
      'Periksa zone, kesesuaian lantai secara eksplisit, dan seluruh tipe elemen struktur yang diperlukan sebelum Next Step. L01 dipetakan ke Lantai 1 dan L02 ke Lantai 2 pada Zone A. Nama yang cocok saja belum membuktikan cakupan lengkap, dan pemetaan kedua level ke satu lantai menghilangkan pemisahan lantai yang dimaksud.',
      'Tampilan tidak membuktikan entity tidak terimpor. Tampilkan kolom yang diperlukan dengan F12, periksa C2 pada lantai pemetaan yang benar, dan bandingkan dengan sumber. Jika tetap tidak ada, telusuri cakupan transfer serta pemetaan sebelum koreksi impor. Impor ulang tanpa pemeriksaan atau penggantian manual berisiko menimbulkan duplikasi.',
      'A–B adalah 6.000 mm. Tambahkan referensi S03 melalui IDENTIFY > Add Drawing, pisahkan dan beri nama denah berdasarkan lantai, lalu pindahkan masing-masing terhadap acuan model yang sesuai. Pastikan revisi gambar serta penempatan lantai; lembar gabungan atau posisi lama dapat menyebabkan tulangan dimodelkan pada lantai yang salah.',
      'Kesiapan memerlukan transfer dan referensi yang diperiksa: revisi/cakupan benar, zone serta lantai sesuai, tinggi disetujui, entity dan geometri sesuai, serta gambar S03 pada lantai yang tepat. Cocokkan A/1 dan verifikasi acuan grid berlabel lain beserta jaraknya. Posisi di tengah layar atau pesan impor berhasil belum membuktikan penyelarasan maupun kelengkapan geometri.',
    ],
  },
}

export function preparationNumber(value, field) {
  const parsed = numberAnswer(value, field === 'gridDistance' ? 'length' : field)
  return parsed > 0 ? parsed : NaN
}

export function createTrbSectionOneExercise(getCourse) {
  const copy = Object.fromEntries(['en', 'id'].map(language => {
    const c = content[language]
    const questions = lessons.map((lesson, index) => ({
      id: `q${index + 1}`, lesson, topic: getCourse(language).allSteps.find(step => step.id === lesson).title,
      title: c.titles[index], type: Object.values(numeric).some(field => field.index === index) ? 'dimensions' : 'choice',
      fields: Object.entries(numeric).filter(([, field]) => field.index === index).map(([name]) => ({ name, label: c.dataLabels[name] })),
      options: c.options[index].map((text, option) => [String(option), text]), explanation: c.explanations[index],
    }))
    return [language, { ...baseCopy[language], ...c, questions, badge: `TRB · ${language === 'en' ? 'Section 1 exercise' : 'Latihan Bagian 1'}`, duration: language === 'en' ? '15–20 minutes · 8 questions · 100 points' : '15–20 menit · 8 pertanyaan · 100 poin', brief: language === 'en' ? 'Project reference brief' : 'Ringkasan referensi proyek', scope: language === 'en' ? 'This exercise checks model preparation decisions. It does not assess a completed TRB model.' : 'Latihan ini mengukur keputusan persiapan model, bukan hasil model TRB yang telah dikerjakan.', required: language === 'en' ? 'Choose an action and complete the requested dimensions in their stated units.' : 'Pilih tindakan dan lengkapi dimensi yang diminta dengan satuan yang disebutkan.', passed: language === 'en' ? 'Section 1 passed' : 'Lulus Bagian 1' }]
  }))
  const storageKey = 'cubicost:trb:section-1-exercise:v2'
  const issues = (index, answers) => [
    ...(['0', '1', '2'].includes(answers[`q${index + 1}`]) && lessons[index] ? [] : [{ field: `q${index + 1}`, reason: 'missing' }]),
    ...Object.entries(numeric).filter(([, field]) => field.index === index).flatMap(([name]) => !String(answers[name] ?? '').trim() ? [{ field: name, reason: 'missing' }] : !Number.isFinite(preparationNumber(answers[name], name)) ? [{ field: name, reason: 'number' }] : []),
  ]
  const answered = (index, answers) => issues(index, answers).length === 0
  const score = answers => {
    const scores = correct.map((choice, index) => {
      const fields = Object.entries(numeric).filter(([, field]) => field.index === index)
      const actionPoints = points[index] - fields.reduce((sum, [, field]) => sum + field.points, 0)
      return (answers[`q${index + 1}`] === choice ? actionPoints : 0) + fields.reduce((sum, [name, field]) => sum + (Math.abs(preparationNumber(answers[name], name) - field.value) < 1e-9 ? field.points : 0), 0)
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
  return { product: 'trb', section: 1, path: '/trb/tests/section-1', copy, storageKey, expectedAnswers: { ...Object.fromEntries(correct.map((value, index) => [`q${index + 1}`, value])), ...Object.fromEntries(Object.entries(numeric).map(([name, field]) => [name, String(field.value)])) }, load, issues, answered, points, score }
}
