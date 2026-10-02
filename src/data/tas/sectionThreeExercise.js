import { exerciseCopy as baseCopy } from './sectionOneExercise.js'

const lessons = ['calculate-verify-quantity', 'calculate-verify-quantity', 'calculate-verify-quantity', 'quantity-reports', 'quantity-reports', 'quantity-reports', 'quantity-reports', 'quantity-reports']
const correct = ['0', '1', '2', '0', '1', '2', '0', '1']
const points = [15, 15, 15, 10, 10, 10, 10, 15]
const numeric = { beamVolume: { index: 2, value: 0.7, points: 10 }, reportVolume: { index: 4, value: 23, points: 5 } }
const criticalIndices = [0, 1, 7]
const content = {
  en: {
    title: 'Verify and Issue the Office Quantities', entry: 'Check your Section 3 understanding',
    intro: 'Continue ASG Training after the model checks in Section 2. Resolve eight calculation and reporting scenarios using the project reference brief.',
    guide: 'The model geometry has been checked. All values below are fictional training data. Use the stated units and the supplied expression; the deduction is an exercise assumption, not a universal TAS rule. Each scenario has one best action.',
    briefItems: ['Project: ASG Training · two floors · current model revision R2.', 'R2 changes: B1 depth corrected on Floor 1; S1 opening and R1 wall finish corrected on Floor 2. Stored quantities still belong to R1.', 'B1 check: width 0.25 m × depth 0.50 m × length 6.00 m. The verified project expression subtracts 0.05 m³ for the column overlap.', 'Updated concrete Volume totals: Floor 1 = 12.40 m³; Floor 2 = 10.60 m³. These are distinct floor totals with no duplicate rows.', 'An older R1 report gives a combined concrete total of 22.50 m³.', 'The recipient requires concrete Volume (m³), formwork Area (m²), and masonry Area (m²), grouped by Floor, then Element Type.', 'After changing the report hierarchy, the existing export still uses the previous grouping.'],
    dataLabels: { beamVolume: 'B1 net concrete volume (m³)', reportVolume: 'Combined concrete volume (m³)' },
    passRule: 'Pass with at least 80/100, plus full marks for calculation scope, deduction investigation and final report verification.',
    critical: 'Calculation scope, deduction investigation and final report verification must all be correct, even with a total of 80 or higher.',
    numericError: 'Enter a non-negative volume in m³, such as 0.70 or 0,70.',
    titles: [
      'R2 changes affect B1 on Floor 1 and S1/R1 on Floor 2. Stored quantities are from R1. Which calculation scope is appropriate?',
      'B1 has an unexpected column deduction. What should you do before deciding whether the result or rule needs correction?',
      'Use the verified B1 expression in the brief to enter its net concrete volume. Which verification step should follow?',
      'View Quantity by Category contains concrete Volume, formwork Area and masonry Area. Which comparison is valid?',
      'Enter the combined R2 concrete volume for both floors. The R1 report shows 22.50 m³. How should the difference be handled?',
      'The recipient requires Floor → Element Type grouping. Which TAS report setup matches this requirement?',
      'The hierarchy is now correct, but the export still contains the old grouping. What should happen next?',
      'Before issuing the R2 report, which verification provides sufficient evidence that its quantities and structure are current?',
    ],
    options: [
      ['Calculate both affected floors, or select every affected entity and include all changes, then wait for calculation to finish.', 'Calculate B1 only because its corrected depth affects concrete Volume.', 'Calculate Floor 2 only because it contains the latest finish change.'],
      ['Apply No Effect immediately, recalculate, then accept the larger volume.', 'Inspect the current View Expression, compare 3D Deduction and the applicable project rule, correct any confirmed issue, then recalculate and compare.', 'Subtract the expected deduction from the exported report without reviewing the model expression.'],
      ['Compare only the final total with the old R1 report and accept it if they match.', 'Use the arithmetic result as proof that the model geometry and rule are correct.', 'Compare the current View Expression and 3D Deduction with the verified B1 geometry and project rule.'],
      ['Compare each category with the corresponding model scope and unit; keep concrete, formwork and masonry totals separate.', 'Add all three category totals to obtain one overall project quantity.', 'Compare formwork Area directly with concrete Volume because both belong to the same element.'],
      ['Retain 22.50 m³ because the earlier report was already exported.', 'Reconcile the new sum with the current floor/category results, confirm R2 scope and units, and replace the old output after verification.', 'Average the old and new totals to reduce the effect of the revision.'],
      ['Select Floor and Element Type but retain Element Type above Floor.', 'Change the report title to “Floor / Element Type” and leave the hierarchy unchanged.', 'Use Set Classification and Quantity; select the required quantity fields and put Floor above Element Type in the attribute hierarchy.'],
      ['Regenerate the report using the revised hierarchy, then check grouping, totals and units against the current calculated results.', 'Reorder the old export manually and keep its R1 quantities.', 'Recalculate one beam only; assume the previous export automatically adopts the new hierarchy.'],
      ['Confirm the filename says R2 and that the grand total is plausible.', 'Confirm R2 model and calculated scope, reconcile floor/category totals and units, check Floor → Element Type grouping, and sample-check quantities against expressions and deductions.', 'Confirm the new grouping alone; matching headings make revision and quantity checks unnecessary.'],
    ],
    explanations: [
      'Both floors contain changes. Calculate must cover every affected floor or entity, including the corrected slab opening and finish, and finish before verification. Calculating only B1 or Floor 2 leaves part of R2 unrefreshed.',
      'Trace the deduction through the current expression, its 3D representation and the required project rule. Change only a confirmed error, then recalculate and compare. No Effect is a lesson example, not a default remedy; editing an export does not repair the calculation.',
      'Gross volume = 0.25 × 0.50 × 6.00 = 0.75 m³. Net volume = 0.75 − 0.05 = 0.70 m³ under the supplied expression. Arithmetic checks the expression but does not prove that TAS used the right geometry or deduction; verify both in the current model.',
      'Concrete Volume is measured in m³; formwork and masonry Area are measured in m² and describe different categories. Compare each with its own scope and source. Adding unlike units, or combining unrelated areas, cannot produce a meaningful project total.',
      'The R2 total is 12.40 + 10.60 = 23.00 m³, which is 0.50 m³ above R1. Reconcile the distinct floor totals, category, units and revision before replacing the old report. Averaging revisions or retaining an old export does not represent R2.',
      'Set Classification and Quantity controls TAS quantity fields and attribute hierarchy. Place Floor above Element Type so each floor contains its element-type groups. Selecting both fields without their required order, or changing the title, does not establish the hierarchy.',
      'Regenerate after changing report settings and verify the output against current calculations. A correct settings dialog does not prove that an earlier export has changed; manual regrouping of R1 rows still leaves outdated quantities.',
      'Issuing requires agreement between the current model revision, calculated scope and regenerated report. Reconcile totals and units by floor/category, check the requested hierarchy and trace samples through expressions and 3D deductions. A filename or plausible grand total alone is insufficient.',
    ],
  },
  id: {
    title: 'Verifikasi dan Terbitkan Kuantitas Kantor', entry: 'Periksa pemahaman Bagian 3',
    intro: 'Lanjutkan ASG Training setelah pemeriksaan model Bagian 2. Selesaikan delapan skenario perhitungan dan pelaporan berdasarkan ringkasan referensi proyek.',
    guide: 'Geometri model sudah diperiksa. Seluruh nilai berikut adalah data latihan fiktif. Gunakan satuan dan expression yang diberikan; deduction merupakan asumsi latihan, bukan aturan universal TAS. Setiap skenario memiliki satu tindakan terbaik.',
    briefItems: ['Proyek: ASG Training · dua lantai · revisi model terkini R2.', 'Perubahan R2: tinggi B1 dikoreksi pada Lantai 1; opening S1 dan wall finish R1 dikoreksi pada Lantai 2. Kuantitas tersimpan masih berasal dari revisi R1.', 'Pemeriksaan B1: lebar 0,25 m × tinggi 0,50 m × panjang 6,00 m. Expression proyek yang sudah diverifikasi mengurangi 0,05 m³ untuk overlap kolom.', 'Total Volume beton terbaru: Lantai 1 = 12,40 m³; Lantai 2 = 10,60 m³. Keduanya merupakan total lantai terpisah tanpa baris duplikat.', 'Laporan revisi R1 menunjukkan total beton gabungan 22,50 m³.', 'Penerima memerlukan Volume beton (m³), Area bekisting (m²), dan Area masonry (m²), dikelompokkan berdasarkan Lantai, lalu Tipe Elemen.', 'Setelah hierarki laporan diubah, ekspor yang ada masih menggunakan pengelompokan sebelumnya.'],
    dataLabels: { beamVolume: 'Volume beton bersih B1 (m³)', reportVolume: 'Volume beton gabungan (m³)' },
    passRule: 'Lulus dengan nilai minimal 80/100 serta nilai penuh untuk cakupan perhitungan, penelusuran deduction, dan verifikasi laporan akhir.',
    critical: 'Cakupan perhitungan, penelusuran deduction, dan verifikasi laporan akhir harus benar, meskipun nilai total mencapai 80.',
    numericError: 'Masukkan volume tidak negatif dalam m³, misalnya 0,70 atau 0.70.',
    titles: [
      'Perubahan R2 mencakup B1 pada Lantai 1 dan S1/R1 pada Lantai 2. Kuantitas tersimpan berasal dari revisi R1. Cakupan perhitungan mana yang tepat?',
      'B1 memiliki deduction kolom yang tidak sesuai harapan. Apa yang dilakukan sebelum menentukan apakah hasil atau aturannya perlu dikoreksi?',
      'Gunakan expression B1 yang sudah diverifikasi dalam ringkasan untuk memasukkan volume beton bersih. Pemeriksaan apa yang dilakukan berikutnya?',
      'View Quantity by Category memuat Volume beton, Area bekisting, dan Area masonry. Perbandingan mana yang valid?',
      'Masukkan Volume beton gabungan R2 untuk kedua lantai. Laporan revisi R1 menunjukkan 22,50 m³. Bagaimana menangani selisihnya?',
      'Penerima meminta pengelompokan Lantai → Tipe Elemen. Pengaturan laporan TAS mana yang sesuai?',
      'Hierarki sudah benar, tetapi ekspor masih memuat pengelompokan lama. Apa langkah berikutnya?',
      'Sebelum menerbitkan laporan R2, verifikasi mana yang memberikan bukti memadai bahwa kuantitas dan strukturnya sudah terbaru?',
    ],
    options: [
      ['Hitung kedua lantai terdampak, atau pilih seluruh entity terdampak yang mencakup semua perubahan, lalu tunggu perhitungan selesai.', 'Hitung hanya B1 karena koreksi tingginya memengaruhi Volume beton.', 'Hitung hanya Lantai 2 karena perubahan finish terakhir berada di sana.'],
      ['Langsung terapkan No Effect, hitung ulang, lalu terima volume yang lebih besar.', 'Periksa View Expression terbaru, bandingkan 3D Deduction dan aturan proyek terkait, koreksi masalah yang terbukti, lalu hitung ulang dan bandingkan.', 'Kurangi deduction yang diharapkan pada laporan ekspor tanpa memeriksa expression model.'],
      ['Bandingkan hanya total akhir dengan laporan revisi R1 dan terima jika nilainya sama.', 'Gunakan hasil aritmetika sebagai bukti bahwa geometri dan aturan model sudah benar.', 'Bandingkan View Expression dan 3D Deduction terbaru dengan geometri B1 serta aturan proyek yang sudah diverifikasi.'],
      ['Bandingkan setiap kategori dengan cakupan model dan satuan yang sesuai; pisahkan total beton, bekisting, dan masonry.', 'Jumlahkan seluruh total ketiga kategori untuk memperoleh satu kuantitas proyek.', 'Bandingkan Area bekisting langsung dengan Volume beton karena keduanya berasal dari elemen yang sama.'],
      ['Pertahankan 22,50 m³ karena laporan sebelumnya sudah diekspor.', 'Rekonsiliasi jumlah terbaru terhadap hasil per lantai/kategori, pastikan cakupan R2 dan satuannya, lalu ganti keluaran lama setelah verifikasi.', 'Ambil rata-rata total lama dan baru untuk mengurangi pengaruh revisi.'],
      ['Pilih Lantai dan Tipe Elemen tetapi pertahankan Tipe Elemen di atas Lantai.', 'Ubah judul laporan menjadi “Lantai / Tipe Elemen” tanpa mengubah hierarki.', 'Gunakan Set Classification and Quantity; pilih field kuantitas yang diperlukan dan tempatkan Lantai di atas Tipe Elemen dalam hierarki atribut.'],
      ['Regenerate laporan dengan hierarki terbaru, lalu periksa pengelompokan, total, dan satuan terhadap hasil perhitungan terkini.', 'Susun ulang ekspor lama secara manual dan pertahankan kuantitas revisi R1.', 'Hitung ulang satu balok saja; anggap ekspor sebelumnya otomatis mengikuti hierarki baru.'],
      ['Pastikan nama file memuat R2 dan grand total tampak wajar.', 'Pastikan model R2 serta cakupan perhitungannya, rekonsiliasi total per lantai/kategori dan satuan, periksa pengelompokan Lantai → Tipe Elemen, lalu periksa sampel terhadap expression dan deduction.', 'Pastikan hanya pengelompokan baru; heading yang sesuai membuat pemeriksaan revisi dan kuantitas tidak diperlukan.'],
    ],
    explanations: [
      'Kedua lantai memuat perubahan. Calculate harus mencakup seluruh lantai atau entity terdampak, termasuk koreksi opening pelat dan finish, serta selesai sebelum verifikasi. Menghitung hanya B1 atau Lantai 2 menyisakan bagian R2 yang belum diperbarui.',
      'Telusuri deduction melalui expression terbaru, representasi 3D, dan aturan proyek yang diwajibkan. Koreksi hanya kesalahan yang terbukti, lalu hitung ulang dan bandingkan. No Effect merupakan contoh materi, bukan solusi bawaan; perubahan ekspor tidak memperbaiki perhitungan.',
      'Volume bruto = 0,25 × 0,50 × 6,00 = 0,75 m³. Volume bersih = 0,75 − 0,05 = 0,70 m³ sesuai expression latihan. Aritmetika memeriksa expression, tetapi belum membuktikan geometri atau deduction yang digunakan TAS benar; verifikasi keduanya pada model terkini.',
      'Volume beton menggunakan m³; Area bekisting dan masonry menggunakan m² serta mewakili kategori berbeda. Bandingkan masing-masing terhadap cakupan dan sumbernya. Menjumlahkan satuan berbeda atau area yang tidak terkait tidak menghasilkan total proyek yang bermakna.',
      'Total R2 adalah 12,40 + 10,60 = 23,00 m³, yaitu 0,50 m³ di atas revisi R1. Rekonsiliasi total lantai terpisah, kategori, satuan, dan revisi sebelum mengganti laporan lama. Rata-rata antar revisi atau ekspor lama tidak mewakili R2.',
      'Set Classification and Quantity mengatur field kuantitas dan hierarki atribut TAS. Tempatkan Lantai di atas Tipe Elemen agar setiap lantai memuat kelompok tipe elemennya. Memilih kedua field tanpa urutan yang diminta atau mengganti judul tidak menetapkan hierarki.',
      'Regenerate setelah pengaturan laporan berubah dan verifikasi keluarannya terhadap perhitungan terkini. Dialog pengaturan yang benar tidak membuktikan ekspor sebelumnya berubah; mengelompokkan ulang baris revisi R1 tetap menyisakan kuantitas lama.',
      'Penerbitan memerlukan kesesuaian revisi model terkini, cakupan perhitungan, dan laporan hasil regenerate. Rekonsiliasi total serta satuan per lantai/kategori, periksa hierarki yang diminta, dan telusuri sampel melalui expression serta 3D Deduction. Nama file atau grand total yang wajar saja belum memadai.',
    ],
  },
}

export function volumeAnswer(value) {
  const text = String(value ?? '').trim().replace(/\s*m(?:³|3|\^3)$/i, '').trim()
  return /^\d+(?:[.,]\d+)?$/.test(text) ? Number(text.replace(',', '.')) : NaN
}

export function createSectionThreeExercise(getCourse) {
  const copy = Object.fromEntries(['en', 'id'].map(language => {
    const c = content[language]
    const questions = lessons.map((lesson, index) => ({
      id: `q${index + 1}`, lesson, topic: getCourse(language).allSteps.find(step => step.id === lesson).title,
      title: c.titles[index], type: Object.values(numeric).some(field => field.index === index) ? 'quantity' : 'choice',
      fields: Object.entries(numeric).filter(([, field]) => field.index === index).map(([name]) => ({ name, label: c.dataLabels[name] })),
      options: c.options[index].map((text, option) => [String(option), text]), explanation: c.explanations[index],
    }))
    return [language, { ...baseCopy[language], ...c, questions, badge: `TAS · ${language === 'en' ? 'Section 3 exercise' : 'Latihan Bagian 3'}`, duration: language === 'en' ? '15–20 minutes · 8 questions · 100 points' : '15–20 menit · 8 pertanyaan · 100 poin', brief: language === 'en' ? 'Project reference brief' : 'Ringkasan referensi proyek', scope: language === 'en' ? 'This exercise checks quantity and reporting decisions. It does not assess a completed TAS model.' : 'Latihan ini mengukur keputusan kuantitas dan pelaporan, bukan hasil model TAS yang telah dikerjakan.', passed: language === 'en' ? 'Section 3 passed' : 'Lulus Bagian 3' }]
  }))
  const storageKey = 'cubicost:tas:section-3-exercise:v2'
  const issues = (index, answers) => [
    ...(['0', '1', '2'].includes(answers[`q${index + 1}`]) && lessons[index] ? [] : [{ field: `q${index + 1}`, reason: 'missing' }]),
    ...Object.entries(numeric).filter(([, field]) => field.index === index).flatMap(([name]) => !String(answers[name] ?? '').trim() ? [{ field: name, reason: 'missing' }] : !Number.isFinite(volumeAnswer(answers[name])) ? [{ field: name, reason: 'number' }] : []),
  ]
  const answered = (index, answers) => issues(index, answers).length === 0
  const score = answers => {
    const scores = correct.map((choice, index) => {
      const numericFields = Object.entries(numeric).filter(([, field]) => field.index === index)
      const actionPoints = points[index] - numericFields.reduce((sum, [, field]) => sum + field.points, 0)
      return (answers[`q${index + 1}`] === choice ? actionPoints : 0) + numericFields.reduce((sum, [name, field]) => sum + (Math.abs(volumeAnswer(answers[name]) - field.value) < 1e-9 ? field.points : 0), 0)
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
  return { product: 'tas', section: 3, path: '/tas/tests/section-3', copy, storageKey, load, issues, answered, points, score }
}
