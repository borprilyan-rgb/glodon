const sections = [
  {
    title: { id: 'Drawing dan Persiapan Measurement', en: 'Drawing and Measurement Preparation' },
    intro: {
      id: 'Periksa pemahaman Anda tentang revisi gambar, pemeriksaan gambar, skala, dan dasar quantity take-off.',
      en: 'Check your understanding of drawing revisions, drawing checks, scale, and quantity take-off fundamentals.',
    },
    questions: [
      {
        topic: { id: 'Revisi drawing', en: 'Drawing revisions' },
        title: { id: 'Mengapa drawing revision harus diperiksa sebelum measurement?', en: 'Why should the drawing revision be checked before measurement?' },
        options: [
          { id: 'Karena perubahan desain dapat menyebabkan perubahan routing, size, quantity, equipment, dan scope pekerjaan.', en: 'Because design changes can affect routing, sizes, quantities, equipment, and work scope.' },
          { id: 'Karena drawing revision hanya digunakan untuk menentukan format laporan.', en: 'Because drawing revisions are only used to determine the report format.' },
          { id: 'Karena measurement tidak dapat dilakukan tanpa mengganti nama file drawing.', en: 'Because measurement cannot be performed until the drawing file is renamed.' },
        ], answer: 0, lesson: 'setting-gambar',
        explanation: { id: 'Perubahan desain pada revisi terbaru dapat mengubah routing, ukuran, kuantitas, equipment, dan cakupan pekerjaan. Pastikan revisi yang digunakan sudah sesuai.', en: 'Design changes in a newer revision can affect routing, sizes, quantities, equipment, and work scope. Confirm that the correct revision is being used.' },
      },
      {
        topic: { id: 'Pemeriksaan drawing', en: 'Drawing checks' },
        title: { id: 'Apa yang harus diperiksa sebelum memasukkan drawing ke TME?', en: 'What should be checked before importing a drawing into TME?' },
        options: [
          { id: 'Hanya nama file dan ukuran drawing.', en: 'Only the file name and drawing size.' },
          { id: 'Drawing number, revision, scale, discipline, level/floor, drawing status, dan kesesuaian dengan dokumen proyek.', en: 'The drawing number, revision, scale, discipline, level/floor, drawing status, and consistency with the project documents.' },
          { id: 'Warna dan format garis pada drawing, ukuran file dan tanggal download drawing.', en: 'Drawing line colors and formats, file size, and download date.' },
        ], answer: 1, lesson: 'setting-gambar',
        explanation: { id: 'Periksa identitas, revisi, skala, discipline, level/floor, status, dan kesesuaian drawing dengan dokumen proyek sebelum menggunakannya.', en: 'Check the drawing identity, revision, scale, discipline, level/floor, status, and consistency with project documents before using it.' },
      },
      {
        topic: { id: 'Skala drawing', en: 'Drawing scale' },
        title: { id: 'Mengapa scale drawing penting?', en: 'Why is drawing scale important?' },
        options: [
          { id: 'Karena scale menjadi dasar konversi ukuran pada gambar menjadi ukuran aktual. Scale yang salah akan menghasilkan quantity yang salah.', en: 'Because scale converts drawing dimensions to actual dimensions. An incorrect scale produces incorrect quantities.' },
          { id: 'Karena scale hanya digunakan untuk menentukan ukuran file drawing.', en: 'Because scale is only used to determine the drawing file size.' },
          { id: 'Karena scale menentukan revision dan status drawing proyek.', en: 'Because scale determines the project drawing revision and status.' },
        ], answer: 0, lesson: 'setting-gambar',
        explanation: { id: 'Skala yang benar memastikan hasil pengukuran gambar merepresentasikan ukuran aktual. Skala yang salah akan memengaruhi quantity.', en: 'A correct scale ensures drawing measurements represent actual dimensions. An incorrect scale affects quantities.' },
      },
      {
        topic: { id: 'Prinsip Quantity Take-Off', en: 'Quantity take-off principles' },
        title: { id: 'Apa prinsip utama Quantity Take-Off menggunakan Glodon TME?', en: 'What is the main Quantity Take-Off sequence in Glodon TME?' },
        options: [
          { id: 'Read → Identify → Classify → Measure → Calculate → Check → Validate → Export', en: 'Read → Identify → Classify → Measure → Calculate → Check → Validate → Export' },
          { id: 'Measure → Calculate → Export → Identify → Read → Check → Delete → Validate', en: 'Measure → Calculate → Export → Identify → Read → Check → Delete → Validate' },
          { id: 'Open → Draw → Color → Edit → Print → Save → Close → Export', en: 'Open → Draw → Color → Edit → Print → Save → Close → Export' },
        ], answer: 0, lesson: 'setting-gambar',
        explanation: { id: 'Urutannya dimulai dengan membaca informasi, mengidentifikasi dan mengklasifikasikan elemen, lalu mengukur, menghitung, memeriksa, memvalidasi, dan mengekspor hasil.', en: 'The sequence is to read the information, identify and classify elements, then measure, calculate, check, validate, and export the results.' },
      },
      {
        topic: { id: 'Panjang pipe', en: 'Pipe length' },
        title: { id: 'Mengapa floor plan saja tidak cukup untuk menghitung panjang pipe?', en: 'Why is a floor plan alone insufficient for measuring pipe length?' },
        options: [
          { id: 'Karena semua panjang pipa harus dihitung berdasarkan jumlah fitting saja.', en: 'Because all pipe lengths must be calculated from the number of fittings alone.' },
          { id: 'Karena floor plan hanya menunjukkan posisi dan jalur pipa secara horizontal, sedangkan panjang aktual juga dapat mencakup perubahan elevasi, vertical pipe, riser, drop, dan koneksi antar-level.', en: 'Because a floor plan shows horizontal pipe locations and routes, while actual length can also include elevation changes, vertical pipes, risers, drops, and connections between levels.' },
          { id: 'Karena floor plan tidak dapat digunakan untuk melihat posisi equipment.', en: 'Because a floor plan cannot be used to see equipment locations.' },
        ], answer: 1, lesson: 'plumbing-pipa',
        explanation: { id: 'Panjang aktual dapat mencakup bagian vertikal dan koneksi antar-level yang tidak terlihat sebagai panjang horizontal pada satu floor plan.', en: 'Actual length can include vertical segments and inter-level connections that are not represented as horizontal length on a single floor plan.' },
      },
    ],
  },
  {
    title: { id: 'Pemodelan Element Sistem', en: 'System Element Modeling' },
    intro: {
      id: 'Terapkan pemeriksaan jalur, duplikasi, klasifikasi sistem, dan fitting pada model TME.',
      en: 'Apply route, duplication, system classification, and fitting checks to TME models.',
    },
    questions: [
      {
        topic: { id: 'Kuantitas jalur pipa', en: 'Pipe route quantity' },
        title: { id: 'Jalur utama pipa 100 m. Branch A 20 m sudah termasuk dalam jalur utama, dan Branch B 15 m terpisah. Berapa kuantitas yang benar?', en: 'The main pipe route is 100 m. Branch A is 20 m and is already included in the main route; Branch B is a separate 15 m. What is the correct quantity?' },
        options: [{ id: '115 m', en: '115 m' }, { id: '120 m', en: '120 m' }, { id: '135 m', en: '135 m' }],
        answer: 0, lesson: 'plumbing-pipa',
        explanation: { id: 'Branch A sudah tercakup dalam 100 m jalur utama. Tambahkan hanya Branch B: 100 + 15 = 115 m.', en: 'Branch A is already included in the 100 m main route. Add only Branch B: 100 + 15 = 115 m.' },
      },
      {
        topic: { id: 'Pemeriksaan cable tray', en: 'Cable tray checking' },
        title: { id: 'Perhitungan manual cable tray 180 m, sedangkan Glodon TME menunjukkan 205 m. Pemeriksaan menemukan jalur vertikal 25 m belum dihitung manual. Apa kesimpulannya?', en: 'A manual cable tray take-off is 180 m, while Glodon TME reports 205 m. A check finds that a 25 m vertical route was omitted from the manual take-off. What is the conclusion?' },
        options: [
          { id: 'Hasil manual pasti salah.', en: 'The manual result is definitely wrong.' },
          { id: 'Kedua hasil harus dirata-ratakan.', en: 'The two results should be averaged.' },
          { id: 'Selisih disebabkan jalur vertikal yang tidak dihitung manual.', en: 'The difference is caused by the vertical route omitted from the manual take-off.' },
        ], answer: 2, lesson: 'electrical-rak-kabel',
        explanation: { id: 'Selisih 25 m sesuai dengan jalur vertikal yang tidak dimasukkan ke pengukuran manual. Rekonsiliasikan cakupan jalur sebelum membandingkan total.', en: 'The 25 m difference matches the vertical route omitted from the manual measurement. Reconcile route coverage before comparing totals.' },
      },
      {
        topic: { id: 'Model duplikat', en: 'Duplicate modeling' },
        title: { id: 'Dua objek cable tray berada tepat pada lokasi yang sama. TME menunjukkan total 200 m, padahal seharusnya 100 m. Apa kemungkinan penyebabnya?', en: 'Two cable tray objects occupy exactly the same location. TME reports 200 m, but the expected total is 100 m. What is the likely cause?' },
        options: [{ id: 'Under measurement', en: 'Under-measurement' }, { id: 'Overlap/duplicate modeling', en: 'Overlapping or duplicate modeling' }, { id: 'Salah modeling', en: 'Incorrect modeling' }],
        answer: 1, lesson: 'electrical-rak-kabel',
        explanation: { id: 'Dua objek yang bertumpuk pada jalur yang sama dapat menggandakan quantity. Periksa dan hapus atau koreksi objek duplikat setelah memastikan cakupannya.', en: 'Two objects overlapping on the same route can double the quantity. Check and remove or correct the duplicate after confirming the intended scope.' },
      },
      {
        topic: { id: 'Klasifikasi ducting', en: 'Duct classification' },
        title: { id: 'Mengapa ducting harus diklasifikasikan berdasarkan sistem atau jenisnya?', en: 'Why should ductwork be classified by system or type?' },
        options: [
          { id: 'Agar quantity dapat diukur, dihitung, dan direkap sesuai kategori pekerjaan.', en: 'So quantities can be measured, calculated, and reported by work category.' },
          { id: 'Agar drawing menjadi lebih berwarna.', en: 'To make the drawing more colorful.' },
          { id: 'Agar revision drawing berubah otomatis.', en: 'To change the drawing revision automatically.' },
        ], answer: 0, lesson: 'mvac-duct',
        explanation: { id: 'Klasifikasi sistem membantu mengukur, menghitung, dan merekap ducting dalam kategori pekerjaan yang tepat.', en: 'System classification helps measure, calculate, and report ductwork under the correct work category.' },
      },
      {
        topic: { id: 'Transition ducting', en: 'Duct transitions' },
        title: { id: 'Dalam quantity take-off, mengapa transition ducting perlu diperhatikan?', en: 'Why should duct transitions be considered in a quantity take-off?' },
        options: [
          { id: 'Karena transition menghubungkan ducting dengan ukuran yang berbeda.', en: 'Because a transition connects ductwork of different sizes.' },
          { id: 'Karena transition selalu dihitung sebagai grille dan merupakan simbol drawing.', en: 'Because a transition is always counted as a grille and is a drawing symbol.' },
          { id: 'Karena transition tidak termasuk pekerjaan ducting.', en: 'Because a transition is not part of ductwork.' },
        ], answer: 0, lesson: 'mvac-duct',
        explanation: { id: 'Transition merupakan fitting yang menghubungkan ducting dengan ukuran berbeda, sehingga perlu dimodelkan dan dihitung dalam pekerjaan ducting.', en: 'A transition is a fitting that connects ductwork of different sizes, so it needs to be modeled and counted as part of the ductwork.' },
      },
    ],
  },
  {
    title: { id: 'Verifikasi Quantity dan Laporan', en: 'Quantity Verification and Reporting' },
    intro: {
      id: 'Pastikan hasil calculation, satuan, cakupan, dan klasifikasi sudah diverifikasi sebelum quantity diekspor.',
      en: 'Verify calculation results, units, scope, and classification before exporting quantities.',
    },
    questions: [
      {
        topic: { id: 'Quantity tidak sesuai', en: 'Unexpected quantity' },
        title: { id: 'Jika hasil calculation tidak sesuai kondisi drawing, apa yang sebaiknya dilakukan?', en: 'If a calculated quantity does not match the drawing condition, what should you do?' },
        options: [
          { id: 'Mengubah quantity secara manual tanpa pengecekan.', en: 'Change the quantity manually without checking.' },
          { id: 'Langsung export hasil tersebut.', en: 'Export the result immediately.' },
          { id: 'Memeriksa kembali measurement, parameter, dan drawing.', en: 'Recheck the measurements, parameters, and drawing.' },
        ], answer: 2, lesson: 'setting-gambar',
        explanation: { id: 'Telusuri measurement, parameter, dan drawing untuk menemukan sumber selisih sebelum menerima atau mengekspor quantity.', en: 'Trace the measurements, parameters, and drawing to find the source of the discrepancy before accepting or exporting the quantity.' },
      },
      {
        topic: { id: 'View Quantity', en: 'View Quantity' },
        title: { id: 'Mengapa View Quantity merupakan bagian penting sebelum Export?', en: 'Why is View Quantity an important step before exporting?' },
        options: [
          { id: 'Karena View Quantity digunakan untuk mengubah revision drawing.', en: 'Because View Quantity is used to change the drawing revision.' },
          { id: 'Karena View Quantity meninjau hasil measurement dan calculation untuk memastikan quantity sudah sesuai.', en: 'Because View Quantity reviews measurement and calculation results to confirm that quantities are appropriate.' },
          { id: 'Karena Export tidak dapat dilakukan jika drawing berwarna.', en: 'Because export cannot be performed if the drawing is in color.' },
        ], answer: 1, lesson: 'penyesuaian-lantai',
        explanation: { id: 'View Quantity memberi kesempatan untuk meninjau hasil measurement dan calculation serta memastikan quantity sesuai sebelum diekspor.', en: 'View Quantity lets you review measurement and calculation results and confirm the quantities before exporting.' },
      },
      {
        topic: { id: 'Kesiapan quantity', en: 'Quantity readiness' },
        title: { id: 'Manakah indikator bahwa quantity siap untuk di-export?', en: 'Which indicates that quantities are ready to export?' },
        options: [
          { id: 'Semua drawing telah dibuka dan file project telah disimpan.', en: 'All drawings have been opened and the project file has been saved.' },
          { id: 'Semua measurement telah dilakukan tanpa pengecekan.', en: 'All measurements have been completed without checking them.' },
          { id: 'Quantity telah dihitung dan direview, tidak ada double counting, klasifikasi benar, serta hasil telah divalidasi.', en: 'Quantities have been calculated and reviewed, double counting is absent, classification is correct, and results are validated.' },
        ], answer: 2, lesson: 'penyesuaian-lantai',
        explanation: { id: 'Sebelum export, hitung dan review quantity, pastikan klasifikasi benar dan tidak ada double counting, lalu validasi hasilnya.', en: 'Before exporting, calculate and review quantities, confirm correct classification and no double counting, then validate the results.' },
      },
      {
        topic: { id: 'Pemeriksaan satuan', en: 'Unit checking' },
        title: { id: 'Suatu item seharusnya dihitung dalam meter (m), tetapi hasilnya menggunakan pcs. Apa yang harus dilakukan?', en: 'An item should be measured in metres (m), but the result is in pieces. What should you do?' },
        options: [
          { id: 'Membiarkannya karena quantity tetap sama.', en: 'Leave it because the quantity is still the same.' },
          { id: 'Memeriksa kembali classification dan unit item tersebut.', en: 'Recheck the item classification and unit.' },
          { id: 'Merevisi drawing dan mengubah scale drawing.', en: 'Revise the drawing and change its scale.' },
        ], answer: 1, lesson: 'plumbing-pipa',
        explanation: { id: 'Perbedaan satuan dapat menunjukkan classification atau unit item yang salah. Periksa keduanya sebelum menggunakan hasilnya.', en: 'A unit mismatch can indicate an incorrect classification or item unit. Check both before using the result.' },
      },
      {
        topic: { id: 'Calculation semua lantai', en: 'Calculation for all floors' },
        title: { id: 'Bagaimana proses untuk mendapatkan quantity pada semua lantai?', en: 'How do you calculate quantities for all floors?' },
        options: [
          { id: 'Quantity → Calculation → Select All → Calculation', en: 'Quantity → Calculation → Select All → Calculation' },
          { id: 'Calculation → Select All Floor → Calculation', en: 'Calculation → Select All Floor → Calculation' },
          { id: 'Quantity → Select All Floor → Calculation', en: 'Quantity → Select All Floor → Calculation' },
        ], answer: 0, lesson: 'setting-lantai',
        explanation: { id: 'Dari menu Quantity, buka Calculation, pilih Select All, lalu jalankan Calculation untuk menghitung seluruh lantai.', en: 'From the Quantity menu, open Calculation, choose Select All, then run Calculation for all floors.' },
      },
    ],
  },
]

const points = [20, 20, 20, 20, 20]

export function createTmeSectionExercise(section) {
  const source = sections[section - 1]
  if (!source) return null
  const copy = Object.fromEntries(['en', 'id'].map((language) => {
    const isEnglish = language === 'en'
    const localizedSection = source.title[language]
    const questions = source.questions.map((question, index) => ({
      id: `q${index + 1}`,
      topic: question.topic[language],
      title: question.title[language],
      type: 'choice',
      lesson: question.lesson,
      options: question.options.map((option, optionIndex) => [String(optionIndex), option[language]]),
      explanation: question.explanation[language],
    }))
    return [language, {
      title: localizedSection,
      badge: `TME-C · ${isEnglish ? 'Section' : 'Bagian'} ${section} ${isEnglish ? 'exercise' : 'latihan'}`,
      entry: isEnglish ? `Check your understanding: ${localizedSection}` : `Periksa pemahaman: ${localizedSection}`,
      intro: source.intro[language],
      duration: isEnglish ? '10–15 minutes · 5 questions · 100 points' : '10–15 menit · 5 pertanyaan · 100 poin',
      passRule: isEnglish ? 'Pass with at least 80/100.' : 'Lulus dengan nilai minimal 80/100.',
      scope: isEnglish ? 'This exercise checks the topics in this section.' : 'Latihan ini memeriksa materi pada bagian ini.',
      guide: isEnglish ? 'Choose the best answer for each question.' : 'Pilih jawaban terbaik untuk setiap pertanyaan.',
      select: isEnglish ? 'Select one answer' : 'Pilih satu jawaban',
      question: isEnglish ? 'Question' : 'Pertanyaan',
      points: isEnglish ? 'points' : 'poin',
      previous: isEnglish ? 'Previous' : 'Sebelumnya',
      next: isEnglish ? 'Next Question' : 'Pertanyaan Berikutnya',
      submit: isEnglish ? 'Submit Answers' : 'Kirim Jawaban',
      required: isEnglish ? 'Select an answer to continue.' : 'Pilih jawaban untuk melanjutkan.',
      correct: isEnglish ? 'Correct' : 'Benar',
      review: isEnglish ? 'Review' : 'Tinjau',
      result: isEnglish ? 'Your result' : 'Hasil latihan',
      passed: isEnglish ? `Section ${section} passed` : `Lulus Bagian ${section}`,
      notPassed: isEnglish ? 'Review and try again' : 'Tinjau materi dan coba lagi',
      retry: isEnglish ? 'Try Again' : 'Coba Lagi',
      reviewLesson: isEnglish ? 'Review Lesson' : 'Tinjau Materi',
      newTab: isEnglish ? 'opens in a new tab' : 'terbuka di tab baru',
      course: isEnglish ? 'Back To Course Map' : 'Kembali ke peta materi',
      noStorage: isEnglish ? 'Browser saving is unavailable. Keep this page open until you finish.' : 'Penyimpanan browser tidak tersedia. Tetap buka halaman ini sampai latihan selesai.',
      summary: isEnglish ? 'Topic results' : 'Hasil topik',
      questions,
    }]
  }))
  const answerKeys = source.questions.map((question) => String(question.answer))
  const storageKey = `cubicost:tme:section-${section}-exercise:v1`
  const path = `/tme/tests/section-${section}`
  const pointsForQuestion = [...points]
  const issues = (index, answers) => answerKeys[index] !== undefined && ['0', '1', '2'].includes(answers[`q${index + 1}`])
    ? []
    : [{ field: `q${index + 1}`, reason: 'missing' }]
  const answered = (index, answers) => issues(index, answers).length === 0
  const score = (answers) => {
    const scores = answerKeys.map((key, index) => answers[`q${index + 1}`] === key ? pointsForQuestion[index] : 0)
    const total = scores.reduce((sum, value) => sum + value, 0)
    return { scores, total, criticalPassed: true, passed: total >= 80 }
  }
  const load = () => {
    const empty = { started: false, submitted: false, index: 0, answers: {} }
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey))
      if (!saved || typeof saved !== 'object') return empty
      const answers = Object.fromEntries(answerKeys.map((_, index) => `q${index + 1}`)
        .filter((field) => typeof saved.answers?.[field] === 'string')
        .map((field) => [field, saved.answers[field].slice(0, 10)]))
      return {
        started: Boolean(saved.started),
        submitted: Boolean(saved.started && saved.submitted) && answerKeys.every((_, index) => answered(index, answers)),
        index: Math.max(0, Math.min(answerKeys.length - 1, Number.isInteger(saved.index) ? saved.index : 0)),
        answers,
      }
    } catch { return empty }
  }
  return { product: 'tme', section, path, copy, storageKey, load, issues, answered, points: pointsForQuestion, score }
}
