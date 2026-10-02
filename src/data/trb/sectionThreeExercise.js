import { exerciseCopy as baseCopy } from '../tas/sectionOneExercise.js'

const lessons = ['calculate-quantity', 'verify-rebar', 'review-quantity', 'review-quantity', 'quantity-reports', 'quantity-reports', 'quantity-reports', 'quantity-reports']
const correct = ['1', '0', '2', '1', '0', '2', '0', '1']
const points = [15, 15, 15, 15, 10, 10, 5, 15]
const numeric = { barLength: { index: 2, value: 24, points: 5 }, barWeight: { index: 2, value: 59.28, points: 5 }, reportWeight: { index: 4, value: 2.5, points: 5 } }
const criticalIndices = [0, 1, 3, 7]
const content = {
  en: {
    title: 'Verify and Issue the Office Rebar Quantities', entry: 'Check your Section 3 understanding',
    intro: 'Continue ASG Training after the Section 2 reinforcement checks. Resolve eight calculation, verification and reporting scenarios using one project reference brief.',
    guide: 'Use the supplied complete bar lengths and unit weight; do not add further allowances or treat these values as TRB defaults. Each scenario has one best action. Enter length in m, sample weight in kg and the report total in metric tonnes (t).',
    briefItems: ['Project: ASG Training TRB · Zone A · two floors · current reinforcement revision S04. Stored quantities and the existing export still belong to S03.', 'S04 changes: C1 ties and B1 support bars on Floor 1; S1 support bars and W1 face reinforcement on Floor 2. Both floors need updated calculation results.', 'B1 sample check: 8 identical D20 bars, each with a complete scheduled length of 3.00 m including all applicable allowances. For this exercise use exactly 2.47 kg/m. The sample represents only this bar group, not all B1 reinforcement.', 'After the first S04 calculation, a W1 face correction is made. That correction must be recalculated before using its quantity.', 'Final verified S04 reinforcement weights: Floor 1 = 1,480 kg; Floor 2 = 1,020 kg. These are separate complete floor totals without duplicated subtotals. The old S03 report gives 2,400 kg.', 'The recipient requires the combined weight in metric tonnes (1 t = 1,000 kg), grouped by Floor → Element Type → Bar Diameter.', 'A draft export still uses the old classification after Set Classification Condition has been changed. A duplicated floor subtotal also appears among its detail rows.'],
    dataLabels: { barLength: 'B1 sample total bar length (m)', barWeight: 'B1 sample reinforcement weight (kg)', reportWeight: 'Combined S04 reinforcement weight (t)' },
    passRule: 'Pass with at least 80/100, plus full marks for calculation scope, rebar investigation, recalculation after correction and final report verification.',
    critical: 'Calculation scope, rebar investigation, recalculation after correction and final report verification must all be correct, even with a total of 80 or higher.',
    numericError: 'Enter a non-negative decimal in the requested unit: length in m, sample weight in kg, or report weight in t. A decimal point or comma is accepted; omit thousands separators.',
    titles: [
      'S04 changes reinforcement on both floors, while stored quantities are S03. Which calculation scope is appropriate?',
      'B1 support-bar weight is unexpectedly high. Which investigation establishes whether the reinforcement needs correction?',
      'Enter the B1 sample group’s total length and weight using the supplied values. Which comparison should follow?',
      'W1 face reinforcement is corrected after the first S04 calculation. What must happen before accepting View Quantity?',
      'Enter the final combined S04 weight in metric tonnes. The S03 report gives 2,400 kg. How should the difference be handled?',
      'The recipient requires Floor → Element Type → Bar Diameter grouping. Which TRB setup matches that requirement?',
      'Classification settings are now correct, but the draft retains old grouping and a duplicated subtotal among detail rows. What should happen next?',
      'Before issuing the final S04 reinforcement-weight report, which verification is sufficient?',
    ],
    options: [
      ['Calculate B1 only because support bars are the largest visible change.', 'Check model data, calculate both affected floors or every affected entity covering all changes, and wait for completion.', 'Calculate Floor 2 only and retain the previous Floor 1 result.'],
      ['Compare Edit Rebar data with B-S04 and inspect Rebar 3D for support, bar count, diameter, position and range; correct confirmed model issues, then recalculate and compare.', 'Reduce the exported B1 weight until it agrees with the old report without reviewing the model.', 'Use Rebar 3D alone and accept the quantity if the bars appear visually dense enough.'],
      ['Compare the sample directly with the whole-beam total because both refer to B1.', 'Add another allowance to each complete scheduled length, then compare with any D20 row.', 'Compare with the same current B1 D20 bar group in View Quantity, checking count, complete lengths, unit weight and units against the model data.'],
      ['Accept the first S04 calculation because its revision label is already current.', 'Recalculate W1 and any other entities affected by the correction, wait for completion, then review the updated scope, bar types, values and units.', 'Keep the earlier model quantity and adjust only the report total for the added face.'],
      ['Reconcile the new sum with the two current floor totals, confirm scope and kg-to-t conversion, investigate the revision difference and replace the old output after verification.', 'Retain 2,400 kg because an exported report should not change after issue.', 'Average S03 and S04 totals and convert that average to tonnes.'],
      ['Use TAS Set Classification and Quantity and assume the TRB report adopts it.', 'Rename the report “Floor / Element Type / Diameter” while leaving its classification order unchanged.', 'Use TRB Set Classification Condition to arrange Floor, then Element Type, then Bar Diameter; verify the resulting hierarchy before generating the report.'],
      ['Regenerate using current calculated results and classification; investigate/remove duplicate detail or subtotal inclusion, then reconcile floor totals without double counting.', 'Manually reorder the old export and add the duplicated subtotal to the grand total.', 'Accept the draft because a correct settings dialog proves every earlier export is updated.'],
      ['Confirm only that the filename says S04 and the grand total is near the old total.', 'Confirm the S04 model and calculation after the last correction, reconcile floor totals and kg/t conversion without duplicates, check the requested hierarchy, and trace representative bar groups to model data and geometry.', 'Confirm only that Floor is the first heading; quantity, unit and revision checks can follow after issue.'],
    ],
    explanations: [
      'Both floors contain S04 changes. Calculate must include C1/B1 on Floor 1 and S1/W1 on Floor 2, whether by affected floors or every affected entity. Check model data and wait for completion before verification. Calculating one beam or one floor leaves part of the revision stale.',
      'Use Edit Rebar and Rebar 3D together with the approved detail: data establishes count, diameter and lengths, while geometry establishes support relationships, positions and ranges. Correct confirmed model issues, then recalculate and compare. Editing an export or judging visual density does not validate the reinforcement.',
      'Total length = 8 × 3.00 = 24.00 m. Weight = 24.00 × 2.47 = 59.28 kg. The supplied lengths already include allowances, so do not add them twice. Compare only this D20 group with its matching current result; the whole B1 quantity may include other bar groups. Arithmetic alone does not prove model data or geometry is correct.',
      'The W1 correction occurs after calculation, so the earlier result is stale even if labelled S04. Recalculate W1 and any other affected entities, wait for completion, then review updated values, bar types, scope and units. A report-only adjustment cannot update model quantities.',
      'The final total is 1,480 + 1,020 = 2,500 kg = 2.50 t, which is 100 kg (0.10 t) above S03. Reconcile separate current floor totals, scope, revision and conversion before replacing the old output. Retaining or averaging revisions does not represent the final S04 model.',
      'TRB uses Set Classification Condition. Arrange Floor → Element Type → Bar Diameter and verify the generated hierarchy. A report title does not set grouping, and the similarly named TAS command belongs to a different product workflow.',
      'Regenerate the output after classification changes and use current calculations. Investigate the duplicated subtotal and ensure detail rows and subtotal rows are not summed together. Reconcile each floor and the grand total; manually regrouping old rows does not refresh their quantities.',
      'Issue only when the report agrees with the current model and the calculation completed after the last correction. Check scope, revision, classification, floor totals, duplicate handling and kg-to-t conversion, then trace representative bar groups to data and geometry. A plausible total, filename or correct heading alone is insufficient.',
    ],
  },
  id: {
    title: 'Verifikasi dan Terbitkan Kuantitas Tulangan Kantor', entry: 'Periksa pemahaman Bagian 3',
    intro: 'Lanjutkan ASG Training setelah pemeriksaan tulangan Bagian 2. Selesaikan delapan skenario perhitungan, verifikasi, dan pelaporan berdasarkan satu ringkasan referensi proyek.',
    guide: 'Gunakan panjang batang lengkap dan berat per meter yang diberikan; jangan menambahkan allowance lagi atau menganggapnya nilai bawaan TRB. Setiap skenario memiliki satu tindakan terbaik. Masukkan panjang dalam m, berat sampel dalam kg, dan total laporan dalam ton metrik (t).',
    briefItems: ['Proyek: ASG Training TRB · Zone A · dua lantai · revisi tulangan terkini S04. Kuantitas tersimpan dan ekspor yang ada masih berasal dari S03.', 'Perubahan S04: sengkang C1 dan tulangan tumpuan B1 pada Lantai 1; tulangan tumpuan S1 dan muka tulangan W1 pada Lantai 2. Kedua lantai memerlukan hasil perhitungan terbaru.', 'Pemeriksaan sampel B1: 8 batang D20 identik, masing-masing memiliki panjang schedule lengkap 3,00 m termasuk seluruh allowance yang berlaku. Untuk latihan ini gunakan tepat 2,47 kg/m. Sampel hanya mewakili kelompok batang ini, bukan seluruh tulangan B1.', 'Setelah perhitungan S04 pertama, dilakukan koreksi muka tulangan W1. Koreksi harus dihitung ulang sebelum kuantitasnya digunakan.', 'Berat tulangan S04 akhir yang diverifikasi: Lantai 1 = 1.480 kg; Lantai 2 = 1.020 kg. Keduanya total lantai lengkap yang terpisah tanpa subtotal duplikat. Laporan S03 lama menunjukkan 2.400 kg.', 'Penerima meminta berat gabungan dalam ton metrik (1 t = 1.000 kg), dikelompokkan berdasarkan Lantai → Tipe Elemen → Diameter Batang.', 'Draf ekspor masih memakai klasifikasi lama setelah Set Classification Condition diubah. Subtotal lantai duplikat juga muncul di antara baris rinciannya.'],
    dataLabels: { barLength: 'Panjang total batang sampel B1 (m)', barWeight: 'Berat tulangan sampel B1 (kg)', reportWeight: 'Berat tulangan gabungan S04 (t)' },
    passRule: 'Lulus dengan nilai minimal 80/100 serta nilai penuh untuk cakupan perhitungan, penelusuran tulangan, perhitungan ulang setelah koreksi, dan verifikasi laporan akhir.',
    critical: 'Cakupan perhitungan, penelusuran tulangan, perhitungan ulang setelah koreksi, dan verifikasi laporan akhir harus benar, meskipun nilai total mencapai 80.',
    numericError: 'Masukkan desimal tidak negatif dengan satuan yang diminta: panjang dalam m, berat sampel dalam kg, atau berat laporan dalam t. Titik atau koma desimal diterima; jangan gunakan pemisah ribuan.',
    titles: [
      'S04 mengubah tulangan pada kedua lantai, sedangkan kuantitas tersimpan berasal dari S03. Cakupan perhitungan mana yang tepat?',
      'Berat tulangan tumpuan B1 terlalu besar. Penelusuran mana yang membuktikan apakah tulangan perlu dikoreksi?',
      'Masukkan panjang total dan berat kelompok sampel B1 berdasarkan nilai yang diberikan. Perbandingan apa yang dilakukan berikutnya?',
      'Muka tulangan W1 dikoreksi setelah perhitungan S04 pertama. Apa yang wajib dilakukan sebelum menerima View Quantity?',
      'Masukkan berat gabungan S04 akhir dalam ton metrik. Laporan S03 menunjukkan 2.400 kg. Bagaimana menangani selisihnya?',
      'Penerima meminta pengelompokan Lantai → Tipe Elemen → Diameter Batang. Pengaturan TRB mana yang sesuai?',
      'Pengaturan klasifikasi sudah benar, tetapi draf masih memakai kelompok lama dan subtotal duplikat di antara rincian. Apa langkah berikutnya?',
      'Sebelum menerbitkan laporan berat tulangan S04 akhir, verifikasi mana yang memadai?',
    ],
    options: [
      ['Hitung hanya B1 karena tulangan tumpuan adalah perubahan terbesar yang terlihat.', 'Periksa data model, hitung kedua lantai terdampak atau seluruh entity terdampak yang mencakup semua perubahan, lalu tunggu selesai.', 'Hitung hanya Lantai 2 dan pertahankan hasil Lantai 1 sebelumnya.'],
      ['Bandingkan data Edit Rebar dengan B-S04 dan periksa Rebar 3D untuk support, jumlah, diameter, posisi, serta rentang; koreksi masalah model yang terbukti, lalu hitung ulang dan bandingkan.', 'Kurangi berat B1 pada ekspor hingga sesuai laporan lama tanpa memeriksa model.', 'Gunakan hanya Rebar 3D dan terima kuantitas jika batang tampak cukup rapat.'],
      ['Bandingkan sampel langsung dengan total seluruh balok karena keduanya merujuk B1.', 'Tambahkan allowance lagi pada setiap panjang schedule lengkap, lalu bandingkan dengan sembarang baris D20.', 'Bandingkan dengan kelompok D20 B1 yang sama pada View Quantity terbaru, periksa jumlah, panjang lengkap, berat per meter, dan satuan terhadap data model.'],
      ['Terima perhitungan S04 pertama karena label revisinya sudah terbaru.', 'Hitung ulang W1 dan entity lain yang terdampak koreksi, tunggu selesai, lalu tinjau cakupan, tipe batang, nilai, dan satuan terbaru.', 'Pertahankan kuantitas model sebelumnya dan ubah hanya total laporan untuk muka tambahan.'],
      ['Rekonsiliasi jumlah baru terhadap kedua total lantai terbaru, pastikan cakupan dan konversi kg ke t, telusuri selisih revisi, lalu ganti keluaran lama setelah verifikasi.', 'Pertahankan 2.400 kg karena laporan yang diekspor tidak boleh berubah setelah terbit.', 'Ambil rata-rata total S03 dan S04 lalu konversikan rata-rata tersebut ke ton.'],
      ['Gunakan Set Classification and Quantity TAS dan anggap laporan TRB mengikutinya.', 'Ganti nama laporan menjadi “Lantai / Tipe Elemen / Diameter” tanpa mengubah urutan klasifikasi.', 'Gunakan Set Classification Condition TRB untuk menyusun Lantai, lalu Tipe Elemen, lalu Diameter Batang; verifikasi hierarki hasil sebelum membuat laporan.'],
      ['Regenerate dengan perhitungan dan klasifikasi terbaru; telusuri/hilangkan duplikasi rincian atau penyertaan subtotal, lalu rekonsiliasi total lantai tanpa menghitung ganda.', 'Susun ulang ekspor lama secara manual dan tambahkan subtotal duplikat ke grand total.', 'Terima draf karena dialog pengaturan yang benar membuktikan seluruh ekspor lama sudah terbaru.'],
      ['Pastikan hanya nama file memuat S04 dan grand total mendekati total lama.', 'Pastikan model S04 dan perhitungan setelah koreksi terakhir, rekonsiliasi total lantai serta konversi kg/t tanpa duplikasi, periksa hierarki yang diminta, dan telusuri sampel kelompok batang ke data serta geometri model.', 'Pastikan hanya Lantai menjadi heading pertama; pemeriksaan kuantitas, satuan, dan revisi dapat dilakukan setelah terbit.'],
    ],
    explanations: [
      'Kedua lantai memuat perubahan S04. Calculate harus mencakup C1/B1 pada Lantai 1 dan S1/W1 pada Lantai 2, melalui lantai terdampak atau seluruh entity terdampak. Periksa data model dan tunggu selesai sebelum verifikasi. Menghitung satu balok atau satu lantai menyisakan bagian revisi yang belum diperbarui.',
      'Gunakan Edit Rebar dan Rebar 3D bersama detail yang disetujui: data memastikan jumlah, diameter, dan panjang, sedangkan geometri memastikan hubungan support, posisi, dan rentang. Koreksi masalah model yang terbukti, lalu hitung ulang dan bandingkan. Mengubah ekspor atau menilai kerapatan tampilan tidak memvalidasi tulangan.',
      'Panjang total = 8 × 3,00 = 24,00 m. Berat = 24,00 × 2,47 = 59,28 kg. Panjang yang diberikan sudah mencakup allowance, jadi jangan menambahkannya dua kali. Bandingkan hanya kelompok D20 ini dengan hasil terbaru yang sesuai; kuantitas seluruh B1 dapat mencakup kelompok batang lain. Aritmetika saja belum membuktikan data atau geometri model benar.',
      'Koreksi W1 dilakukan setelah perhitungan, sehingga hasil sebelumnya sudah tidak mutakhir meskipun berlabel S04. Hitung ulang W1 serta entity lain yang terdampak, tunggu selesai, lalu tinjau nilai, tipe batang, cakupan, dan satuan terbaru. Penyesuaian laporan saja tidak memperbarui kuantitas model.',
      'Total akhir adalah 1.480 + 1.020 = 2.500 kg = 2,50 t, yaitu 100 kg (0,10 t) di atas S03. Rekonsiliasi total lantai terbaru yang terpisah, cakupan, revisi, dan konversi sebelum mengganti keluaran lama. Mempertahankan atau merata-ratakan revisi tidak mewakili model S04 akhir.',
      'TRB menggunakan Set Classification Condition. Susun Lantai → Tipe Elemen → Diameter Batang dan verifikasi hierarki hasil. Judul laporan tidak menetapkan kelompok, dan perintah TAS yang bernama mirip digunakan pada alur produk berbeda.',
      'Regenerate keluaran setelah perubahan klasifikasi dan gunakan perhitungan terbaru. Telusuri subtotal duplikat serta pastikan baris rincian dan subtotal tidak dijumlahkan bersama. Rekonsiliasi setiap lantai dan grand total; mengelompokkan ulang baris lama secara manual tidak memperbarui kuantitasnya.',
      'Terbitkan hanya ketika laporan sesuai model terbaru dan perhitungan yang selesai setelah koreksi terakhir. Periksa cakupan, revisi, klasifikasi, total lantai, penanganan duplikasi, dan konversi kg ke t, lalu telusuri sampel kelompok batang ke data serta geometri. Total wajar, nama file, atau heading benar saja belum memadai.',
    ],
  },
}

export function rebarQuantityNumber(value, field) {
  const unit = { barLength: 'm', barWeight: 'kg', reportWeight: 't' }[field]
  if (!unit) return NaN
  const text = String(value ?? '').trim().replace(new RegExp(`\\s*${unit}$`, 'i'), '').trim()
  return /^\d+(?:[.,]\d+)?$/.test(text) ? Number(text.replace(',', '.')) : NaN
}

export function createTrbSectionThreeExercise(getCourse) {
  const copy = Object.fromEntries(['en', 'id'].map(language => {
    const c = content[language]
    const questions = lessons.map((lesson, index) => ({
      id: `q${index + 1}`, lesson, topic: getCourse(language).allSteps.find(step => step.id === lesson).title,
      title: c.titles[index], type: Object.values(numeric).some(field => field.index === index) ? 'quantity' : 'choice',
      fields: Object.entries(numeric).filter(([, field]) => field.index === index).map(([name]) => ({ name, label: c.dataLabels[name] })),
      options: c.options[index].map((text, option) => [String(option), text]), explanation: c.explanations[index],
    }))
    return [language, { ...baseCopy[language], ...c, questions, badge: `TRB · ${language === 'en' ? 'Section 3 exercise' : 'Latihan Bagian 3'}`, duration: language === 'en' ? '15–20 minutes · 8 questions · 100 points' : '15–20 menit · 8 pertanyaan · 100 poin', brief: language === 'en' ? 'Project reference brief' : 'Ringkasan referensi proyek', scope: language === 'en' ? 'This exercise checks reinforcement quantity and reporting decisions. It does not assess a completed TRB model.' : 'Latihan ini mengukur keputusan kuantitas tulangan dan pelaporan, bukan hasil model TRB yang telah dikerjakan.', required: language === 'en' ? 'Choose an action and complete the requested dimensions in their stated units.' : 'Pilih tindakan dan lengkapi dimensi yang diminta dengan satuan yang disebutkan.', passed: language === 'en' ? 'Section 3 passed' : 'Lulus Bagian 3' }]
  }))
  const storageKey = 'cubicost:trb:section-3-exercise:v2'
  const issues = (index, answers) => [
    ...(['0', '1', '2'].includes(answers[`q${index + 1}`]) && lessons[index] ? [] : [{ field: `q${index + 1}`, reason: 'missing' }]),
    ...Object.entries(numeric).filter(([, field]) => field.index === index).flatMap(([name]) => !String(answers[name] ?? '').trim() ? [{ field: name, reason: 'missing' }] : !Number.isFinite(rebarQuantityNumber(answers[name], name)) ? [{ field: name, reason: 'number' }] : []),
  ]
  const answered = (index, answers) => issues(index, answers).length === 0
  const score = answers => {
    const scores = correct.map((choice, index) => {
      const fields = Object.entries(numeric).filter(([, field]) => field.index === index)
      const actionPoints = points[index] - fields.reduce((sum, [, field]) => sum + field.points, 0)
      return (answers[`q${index + 1}`] === choice ? actionPoints : 0) + fields.reduce((sum, [name, field]) => sum + (Math.abs(rebarQuantityNumber(answers[name], name) - field.value) < 1e-9 ? field.points : 0), 0)
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
  return { product: 'trb', section: 3, path: '/trb/tests/section-3', copy, storageKey, load, issues, answered, points, score }
}
