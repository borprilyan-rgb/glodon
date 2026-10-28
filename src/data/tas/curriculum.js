import { getScreenshotCopy } from '../screenshotCopy.js'
import { applySectionOneRevision } from './sectionOneRevision.js'
import { applyPartTwoRevision, replacePartTwoLessons } from './partTwoRevision.js'
import { getTasChecklist } from './checklists.js'

const a = (titleId, descriptionId, titleEn, descriptionEn, file) => ({ titleId, descriptionId, titleEn, descriptionEn, file })
const partTwoTitleCards = {
  'identify-pile-caps': { title: 'IDENTIFIKASI PILE CAP', actionTitleId: 'Identifikasi Pile Cap', actionTitleEn: 'Pile Cap Identification' },
  'identify-columns': { title: 'IDENTIFIKASI KOLOM', actionTitleId: 'Identifikasi Kolom', actionTitleEn: 'Column Identification' },
  'identify-beams': { title: 'IDENTIFIKASI BALOK', actionTitleId: 'Identifikasi Balok', actionTitleEn: 'Beam Identification' },
  'identify-slabs': { title: 'IDENTIFIKASI SLAB', actionTitleId: 'Identifikasi Slab', actionTitleEn: 'Slab Identification' },
  'identify-architectural-walls': { title: 'IDENTIFIKASI DINDING', actionTitleId: 'Identifikasi Dinding', actionTitleEn: 'Wall Identification' },
  'identify-openings': { title: 'IDENTIFIKASI PINTU DAN JENDELA', actionTitleId: 'Identifikasi Pintu dan Jendela', actionTitleEn: 'Door and Window Identification' },
  'apply-finishes': { title: 'IDENTIFIKASI ROOM FINISH', actionTitleId: 'Identifikasi Room Finish', actionTitleEn: 'Room Finish Identification' },
  'calculate-verify-quantity': { title: 'LAPORAN HASIL PEMODELAN', actionTitleId: 'Laporan Hasil Pemodelan', actionTitleEn: 'Model Quantity Report' },
}

const lessons = [
  ['create-project', 'Membuat Proyek TAS', 'Create a TAS Project', 'Membuat proyek dengan aturan pengukuran dan elevasi tanah yang sesuai.', 'Create a project with the applicable measurement rules and ground elevation.', '13-14', [
    a('Pilih New Project', 'Mulai proyek TAS baru dari halaman pembuka aplikasi.', 'Select New Project', 'Start a new TAS project from the application welcome page.', 'create-project-01.webp'),
    a('Masukkan judul proyek', 'Gunakan judul yang membantu membedakan proyek dan revisinya.', 'Enter the project title', 'Use a title that helps distinguish the project and its revision.', 'create-project-02.webp'),
    a('Pilih Measurement Rules', 'Gunakan aturan pengukuran yang berlaku untuk proyek, bukan pengaturan proyek lain.', 'Select Measurement Rules', 'Use the measurement rules applicable to this project rather than settings from another project.', 'create-project-03.webp'),
    a('Masukkan Existing Ground Level', 'Elevasi tanah eksisting memengaruhi kuantitas galian, sehingga nilainya harus mengikuti data proyek.', 'Enter Existing Ground Level', 'Existing ground elevation affects excavation quantities, so use the project value.', 'create-project-04.webp')]],
  ['tas-interface-attributes', 'Memahami Interface dan Attribute', 'Understand the TAS Interface and Attributes', 'Mengenali area kerja TAS serta perbedaan Public dan Private Attribute.', 'Recognise the TAS workspace and distinguish Public from Private Attributes.', '9, 15-16', [
    a('Kenali Function Tab dan Ribbon', 'Keduanya mengelompokkan fungsi utama dan perintah yang tersedia untuk tab aktif.', 'Identify the Function Tab and Ribbon', 'They group the main functions and commands available for the active tab.', 'interface-attributes-01.webp'),
    a('Temukan Element Navigation dan Main Operation', 'Gunakan area ini untuk memilih tipe elemen dan menjalankan operasi pemodelan.', 'Locate Element Navigation and Main Operation', 'Use these areas to choose element types and perform modelling operations.', 'interface-attributes-02.webp'),
    a('Periksa Dynamic Control Bar dan Status Bar', 'Kontrol dinamis berubah mengikuti operasi, sedangkan status bar menampilkan petunjuk operasi.', 'Check the Dynamic Control Bar and Status Bar', 'Dynamic controls change with the operation, while the status bar shows operating guidance.', 'interface-attributes-03.webp'),
    a('Gunakan Public Attribute tanpa seleksi', 'Perubahan berlaku pada entitas dengan nama elemen yang sama ketika tidak ada entitas dipilih.', 'Use Public Attributes without a selection', 'Changes apply to entities sharing the same element name when no entity is selected.', 'interface-attributes-04.webp'),
    a('Pilih entitas untuk Private Attribute', 'Private Attribute hanya mengubah entitas yang dipilih; perubahan tidak berlaku tanpa seleksi.', 'Select entities for Private Attributes', 'Private Attributes affect only selected entities; changes are invalid without a selection.', 'interface-attributes-05.webp')]],
  ['floor-grade-settings', 'Mengatur Floor dan Concrete Grade', 'Configure Floors and Concrete Grades', 'Membangun struktur lantai dan grade beton yang konsisten.', 'Create consistent floor structure and concrete grades.', '17-20', [
    a('Buka Floor Settings', 'Gunakan tabel lantai untuk mengatur superstructure dan substructure.', 'Open Floor Settings', 'Use the floor table to configure the superstructure and substructure.', 'floor-grade-settings-01.webp'),
    a('Sisipkan lantai struktur atas dan bawah', 'Mulai superstructure dari 1st Floor dan substructure dari Foundation Floor.', 'Insert upper and lower floors', 'Start the superstructure from 1st Floor and the substructure from Foundation Floor.', 'floor-grade-settings-02.webp'),
    a('Isi tinggi dan elevasi lantai', 'Masukkan Floor Height untuk setiap lantai dan Bottom Elevation hanya untuk 1st Floor seperti pada manual.', 'Enter floor heights and elevation', 'Enter Floor Height for every floor and Bottom Elevation for 1st Floor only, as shown in the manual.', 'floor-grade-settings-03.webp'),
    a('Masukkan Concrete Grade', 'Tetapkan grade beton untuk elemen yang diperlukan berdasarkan spesifikasi proyek.', 'Enter Concrete Grades', 'Assign concrete grades to the required elements from the project specification.', 'floor-grade-settings-04.webp'),
    a('Gunakan Copy to Other Floor', 'Salin grade hanya ketika lantai tujuan menggunakan grade yang sama.', 'Use Copy to Other Floor', 'Copy grades only when destination floors use the same grades.', 'floor-grade-settings-05.webp')]],
  ['import-split-drawing', 'Mengimpor dan Memisahkan Gambar', 'Import and Split Drawings', 'Menyiapkan gambar sumber yang terpisah dan mudah dikenali.', 'Prepare separated, clearly identified source drawings.', '21-24', [
    a('Tentukan alur berdasarkan format', 'DWG diimpor dan dipisahkan; vector atau scanned PDF juga perlu diskalakan bila diperlukan.', 'Choose the workflow for the format', 'Import and split DWG files; vector or scanned PDFs may also require scaling.', 'import-split-drawing-01.webp'),
    a('Buka Identify > Add', 'Gunakan Add untuk memilih satu atau beberapa gambar sumber.', 'Open Identify > Add', 'Use Add to select one or more source drawings.', 'import-split-drawing-02.webp'),
    a('Buka Drawing Manager dan pilih Split', 'Pisahkan lembar gabungan agar setiap rencana dapat dikelola sendiri.', 'Open Drawing Manager and select Split', 'Separate combined sheets so each plan can be managed independently.', 'import-split-drawing-03.webp'),
    a('Block-select area yang diperlukan', 'Pilih batas rencana yang lengkap lalu konfirmasi pilihan.', 'Block-select the required area', 'Select the complete plan boundary and confirm the selection.', 'import-split-drawing-04.webp'),
    a('Beri nama gambar hasil split', 'Gunakan nama yang menjelaskan lantai dan jenis gambar.', 'Name the split drawing', 'Use a name identifying the floor and drawing type.', 'import-split-drawing-05.webp')]],
  ['scale-relocate-drawing', 'Mengatur Skala dan Posisi Gambar', 'Scale and Relocate Drawings', 'Mengkalibrasi gambar dan menyelaraskannya dengan axis grid.', 'Calibrate a drawing and align it with the axis grid.', '25-26', [
    a('Buka Identify > Scale Drawing', 'Pilih gambar yang akan dikalibrasi sebelum menentukan dua titik referensi.', 'Open Identify > Scale Drawing', 'Select the drawing to calibrate before specifying two reference points.', 'scale-relocate-drawing-01.webp'),
    a('Tentukan titik awal, akhir, dan actual length', 'Gunakan dimensi tertulis yang dapat dipercaya untuk memasukkan panjang sebenarnya.', 'Set start, end and actual length', 'Use a reliable written dimension when entering the actual length.', 'scale-relocate-drawing-02.webp'),
    a('Verifikasi dengan dimensi lain', 'Ukur jarak yang tidak dipakai saat kalibrasi dan pastikan hasilnya sama.', 'Verify with another dimension', 'Measure a distance not used for calibration and confirm that it agrees.', 'scale-relocate-drawing-03.webp'),
    a('Buka Relocate dan pilih titik referensi', 'Gunakan titik yang jelas pada gambar, misalnya perpotongan A/1.', 'Open Relocate and choose a reference point', 'Use a clear drawing point, such as intersection A/1.', 'scale-relocate-drawing-04.webp'),
    a('Selaraskan dengan titik axis grid', 'Cocokkan titik yang sama pada grid dan gunakan intersection snap bila pemilihan tidak akurat.', 'Align to the axis-grid point', 'Match the same grid point and use intersection snap when selection is inaccurate.', 'scale-relocate-drawing-05.webp')]],
  ['axis-grid', 'Membuat Axis Grid', 'Create Axis Grids', 'Membuat axis grid secara otomatis atau manual sesuai gambar.', 'Create axis grids automatically or manually from the drawing.', '27-34', [
    a('Pilih tipe axis grid', 'TAS mendukung orthogonal, diagonal, dan arc axis grid.', 'Choose the axis-grid type', 'TAS supports orthogonal, diagonal and arc axis grids.', 'axis-grid-01.webp'),
    a('Ambil garis dengan Pick Sideline', 'Untuk identifikasi otomatis, pilih axis lines berdasarkan layer atau colour lalu konfirmasi.', 'Capture lines with Pick Sideline', 'For automatic identification, select axis lines by layer or colour and confirm.', 'axis-grid-auto-identify-02.webp'),
    a('Ambil label dengan Pick Label', 'Pilih label axis berdasarkan layer atau colour yang sesuai.', 'Capture labels with Pick Label', 'Select axis labels using the appropriate layer or colour.', 'axis-grid-auto-identify-03.webp'),
    a('Jalankan Auto-Identify', 'Periksa axis yang terbentuk terhadap garis dan label sumber.', 'Run Auto-Identify', 'Check the generated axes against the source lines and labels.', 'axis-grid-auto-identify-04.webp'),
    a('Buat axis orthogonal secara manual', 'Gunakan Draw > New Orthogonal Axis Grid, masukkan numbering dan distance, tentukan posisi, lalu pilih OK.', 'Create an orthogonal grid manually', 'Use Draw > New Orthogonal Axis Grid, enter numbering and distance, position it, then select OK.', 'axis-grid-manual-05.webp')]],
  ['identify-pile-caps', 'Mengidentifikasi Pile Cap', 'Identify Pile Caps', 'Menghasilkan pile cap dari garis dan label yang dapat dikenali.', 'Generate pile caps from recognisable lines and labels.', '35-41', [
    a('Pilih Pick Sideline', 'Gunakan pemilihan berdasarkan layer atau colour pada CAD atau vector PDF yang memiliki data garis.', 'Select Pick Sideline', 'Select by layer or colour on CAD or vector PDFs containing line data.', 'identify-pile-cap-01.webp'),
    a('Pilih frame pile cap', 'Ambil garis tepi pile cap yang lengkap lalu konfirmasi pilihan.', 'Pick the pile-cap frame', 'Capture the complete pile-cap boundary and confirm the selection.', 'identify-pile-cap-02.webp'),
    a('Ambil label pile cap', 'Gunakan Pick Label untuk memilih nama elemen yang sesuai.', 'Capture the pile-cap label', 'Use Pick Label to select the corresponding element name.', 'identify-pile-cap-03.webp'),
    a('Jalankan Auto-Identify dan periksa hasil', 'Tinjau posisi serta ukuran pile cap yang dihasilkan.', 'Run Auto-Identify and inspect the result', 'Review the position and size of the generated pile caps.', 'identify-pile-cap-04.webp'),
    a('Tinjau kuantitas pile cap', 'Periksa Volume untuk beton dan Area of Formwork untuk bekisting.', 'Review pile-cap quantities', 'Check Volume for concrete and Area of Formwork for formwork.', 'identify-pile-cap-05.webp')]],
  ['identify-columns', 'Mengidentifikasi Kolom', 'Identify Columns', 'Menghasilkan kolom dan memeriksa model tiga dimensinya.', 'Generate columns and check their three-dimensional model.', '42-47', [
    a('Kenali tipe kolom yang relevan', 'Contoh manual mencakup round, slanted, composite, dan steel column.', 'Recognise relevant column types', 'Manual examples include round, slanted, composite and steel columns.', 'identify-column-01.webp'),
    a('Pilih outline dengan Pick Sideline', 'Gunakan layer atau colour yang hanya memuat garis pembentuk kolom.', 'Select outlines with Pick Sideline', 'Use a layer or colour containing only column boundary lines.', 'identify-column-02.webp'),
    a('Pilih nama dengan Pick Label', 'Ambil label kolom yang berpasangan dengan outline terpilih.', 'Select names with Pick Label', 'Capture column labels corresponding to the selected outlines.', 'identify-column-03.webp'),
    a('Jalankan Auto-Identify', 'Hasilkan elemen setelah garis dan label selesai dipilih.', 'Run Auto-Identify', 'Generate elements after selecting lines and labels.', 'identify-column-04.webp'),
    a('Periksa kolom dalam 3D', 'Tinjau posisi, ukuran, dan lantai pada model yang dihasilkan.', 'Inspect columns in 3D', 'Review position, size and floor in the generated model.', 'identify-column-05.webp')]],
  ['identify-beams', 'Mengidentifikasi dan Memeriksa Balok', 'Identify and Check Beams', 'Menghasilkan balok, memperbaiki kesalahan, dan memeriksa kuantitasnya.', 'Generate beams, correct errors and review their quantities.', '48-53', [
    a('Pilih beam lines dengan Pick Sideline', 'Gunakan layer atau colour yang sesuai untuk mengambil garis tepi balok.', 'Select beam lines with Pick Sideline', 'Use the appropriate layer or colour to capture beam boundaries.', 'identify-beam-01.webp'),
    a('Pilih label dengan Pick Label', 'Ambil nama balok yang berkaitan dengan garis terpilih.', 'Select labels with Pick Label', 'Capture beam names associated with the selected lines.', 'identify-beam-02.webp'),
    a('Jalankan Auto-Identify', 'Hasilkan model balok setelah data garis dan label lengkap.', 'Run Auto-Identify', 'Generate the beam model after line and label data is complete.', 'identify-beam-03.webp'),
    a('Lakukan Identification Check', 'Periksa, ubah elemen yang salah, lalu konfirmasi pembaruan model 3D.', 'Perform the Identification Check', 'Check and modify incorrect elements, then confirm the updated 3D model.', 'identify-beam-04.webp'),
    a('Tinjau kuantitas balok', 'Periksa Volume beton dan Area of Formwork.', 'Review beam quantities', 'Check concrete Volume and Area of Formwork.', 'identify-beam-05.webp')]],
  ['identify-slabs', 'Mengidentifikasi Pelat dan Slab Opening', 'Identify Slabs and Slab Openings', 'Menghasilkan pelat dan opening dengan ketebalan serta batas yang benar.', 'Generate slabs and openings with correct thickness and boundaries.', '54-60', [
    a('Kenali tipe pelat', 'Contoh manual mencakup in-situ slab, bondek slab, dan spiral ramp.', 'Recognise slab types', 'Manual examples include in-situ slabs, bondek slabs and spiral ramps.', 'identify-slab-01.webp'),
    a('Ambil label pelat', 'Gunakan Pick Label berdasarkan layer atau colour.', 'Capture slab labels', 'Use Pick Label with selection by layer or colour.', 'identify-slab-02.webp'),
    a('Pilih Slab Opening Line', 'Ambil boundary opening berdasarkan layer atau colour lalu konfirmasi.', 'Select Slab Opening Line', 'Capture opening boundaries by layer or colour and confirm.', 'identify-slab-03.webp'),
    a('Jalankan Identify Slab', 'Tinjau Slab Identification Option serta koreksi thickness bila diperlukan.', 'Run Identify Slab', 'Review Slab Identification Option and correct thickness when required.', 'identify-slab-04.webp'),
    a('Periksa hasil dan kuantitas', 'Tinjau Volume, Area of Formwork, dan panjang side formwork pada edge atau break.', 'Check results and quantities', 'Review Volume, Area of Formwork and side-formwork length at edges or breaks.', 'identify-slab-05.webp')]],
  ['identify-structural-walls', 'Mengidentifikasi Dinding Struktur', 'Identify Structural Walls', 'Menghasilkan concrete wall dan meninjau kuantitas strukturnya.', 'Generate concrete walls and review structural quantities.', '61-68', [
    a('Pilih Pick Concrete Wall Sideline', 'Gunakan layer atau colour pada CAD atau vector PDF yang memiliki data garis.', 'Select Pick Concrete Wall Sideline', 'Use layer or colour selection on CAD or vector PDFs containing line data.', 'identify-structural-wall-01.webp'),
    a('Pilih garis dinding struktur', 'Ambil garis concrete wall yang lengkap lalu konfirmasi.', 'Select structural-wall lines', 'Capture complete concrete-wall lines and confirm.', 'identify-structural-wall-02.webp'),
    a('Pilih nama dengan Pick Label', 'Hubungkan label concrete wall dengan garis terpilih.', 'Select names with Pick Label', 'Associate concrete-wall labels with the selected lines.', 'identify-structural-wall-03.webp'),
    a('Jalankan Auto Identify', 'Konfirmasi kotak informasi dan periksa dinding yang dihasilkan.', 'Run Auto Identify', 'Confirm the information prompt and check the generated walls.', 'identify-structural-wall-04.webp'),
    a('Tinjau kuantitas dinding struktur', 'Periksa Volume, Area of Formwork, serta panjang bekisting pada edge atau opening break bila relevan.', 'Review structural-wall quantities', 'Check Volume, Area of Formwork and formwork length at edges or opening breaks where relevant.', 'identify-structural-wall-05.webp')]],
  ['identify-architectural-walls', 'Mengidentifikasi Dinding Arsitektur', 'Identify Architectural Walls', 'Menghasilkan masonry wall dan meninjau luasnya.', 'Generate masonry walls and review their area.', '64, 69-73', [
    a('Bedakan dinding arsitektur dan struktur', 'Dinding masonry dilaporkan berdasarkan area, bukan volume beton.', 'Distinguish architectural and structural walls', 'Masonry walls are reported by area rather than concrete volume.', 'identify-architectural-wall-01.webp'),
    a('Pilih masonry wall sideline', 'Gunakan perintah sideline yang sesuai dan pilih garis berdasarkan layer atau colour.', 'Select masonry-wall sidelines', 'Use the appropriate sideline command and select lines by layer or colour.', 'identify-architectural-wall-02.webp'),
    a('Ambil opening dan label', 'Gunakan Pick Door/Window Sideline bila diperlukan, lalu pilih nama dinding dengan Pick Label.', 'Capture openings and labels', 'Use Pick Door/Window Sideline when required, then capture wall names with Pick Label.', 'identify-architectural-wall-03.webp'),
    a('Jalankan Auto Identify', 'Konfirmasi identifikasi lalu periksa dinding yang dihasilkan.', 'Run Auto Identify', 'Confirm identification and inspect the generated walls.', 'identify-architectural-wall-04.webp'),
    a('Tinjau luas dinding', 'Gunakan hasil Area untuk kuantitas architectural wall.', 'Review wall area', 'Use the Area result for architectural-wall quantities.', 'identify-architectural-wall-05.webp')]],
  ['identify-openings', 'Mengidentifikasi Pintu dan Jendela', 'Identify Door and Window Openings', 'Membuat tipe opening dari schedule dan menempatkannya pada model.', 'Create opening types from a schedule and place them in the model.', '74-81', [
    a('Buka Identify Door and Windows Schedule', 'Block-select seluruh CAD schedule yang diperlukan lalu konfirmasi.', 'Open Identify Door and Windows Schedule', 'Block-select the complete required CAD schedule and confirm.', 'identify-openings-01.webp'),
    a('Petakan kolom schedule', 'Cocokkan setiap kolom tabel dengan field yang tepat sebelum memilih Identify.', 'Map schedule columns', 'Match each table column to the correct field before selecting Identify.', 'identify-openings-02.webp'),
    a('Hasilkan tipe opening', 'Pastikan tipe pintu dan jendela muncul pada element list.', 'Generate opening types', 'Confirm that door and window types appear in the element list.', 'identify-openings-03.webp'),
    a('Pilih label dan jalankan Auto Identify', 'Gunakan Pick Door/Window Label berdasarkan layer atau colour lalu hasilkan opening.', 'Select labels and run Auto Identify', 'Use Pick Door/Window Label by layer or colour, then generate the openings.', 'identify-openings-04.webp'),
    a('Periksa hasil dan kuantitas', 'Tinjau Area of Opening serta panjang edge yang didokumentasikan.', 'Check results and quantities', 'Review Area of Opening and the documented edge-length results.', 'identify-openings-05.webp')]],
  ['apply-finishes', 'Menerapkan dan Memperbarui Finishing', 'Apply and Regenerate Finishes', 'Mengimpor finish schedule, menerapkan finishing, dan memperbarui hasilnya.', 'Import a finish schedule, apply finishes and regenerate results.', '82-91', [
    a('Impor Finish Schedule', 'Buka Draw > Finish Schedule, pilih file Excel, petakan kolom, lalu pilih Identify.', 'Import the Finish Schedule', 'Open Draw > Finish Schedule, select the Excel file, map columns, then choose Identify.', 'apply-finishes-01.webp'),
    a('Tetapkan material texture', 'Pilih floor atau wall finishes dan hubungkan texture yang diperlukan.', 'Assign material textures', 'Select floor or wall finishes and attach the required textures.', 'apply-finishes-02.webp'),
    a('Terapkan finish dengan Point', 'Pilih room pada architecture plan agar material diterapkan pada model 3D.', 'Apply finishes with Point', 'Select the room on the architectural plan to apply materials to the 3D model.', 'apply-finishes-03.webp'),
    a('Gunakan Regenerate Finish Entity', 'Perbarui finish entity setelah finishing pada room berubah.', 'Use Regenerate Finish Entity', 'Refresh finish entities after room finishes change.', 'apply-finishes-04.webp'),
    a('Periksa model dan kuantitas finishing', 'Tinjau pengaruh column, exposed beam, room boundary, dan opening pada hasil.', 'Check the finish model and quantities', 'Review the effects of columns, exposed beams, room boundaries and openings on results.', 'apply-finishes-05.webp')]],
  ['measurement-rules', 'Memeriksa dan Mengubah Measurement Rules', 'Inspect and Change Measurement Rules', 'Menelusuri deduction dan mengubah aturan hanya sesuai standar proyek.', 'Trace deductions and change rules only according to the project standard.', '92-96', [
    a('Pilih beam dan buka View Expression', 'Tinjau concrete-volume expression serta deduction yang berasal dari column.', 'Select the beam and open View Expression', 'Review the concrete-volume expression and the deduction caused by the column.', 'measurement-rules-01.webp'),
    a('Buka Measurement Rules untuk beam', 'Pilih elemen beam dan baca deskripsi aturan secara lengkap.', 'Open Measurement Rules for the beam', 'Select the beam element and read the complete rule description.', 'measurement-rules-02.webp'),
    a('Filter kondisi column', 'Gunakan Filter Relevant Element dan pertahankan hanya kondisi column yang sedang diperiksa.', 'Filter the column condition', 'Use Filter Relevant Element and retain only the column condition being reviewed.', 'measurement-rules-03.webp'),
    a('Terapkan No Effect sebagai contoh manual', 'Pilihan ini hanya contoh beam-column pada manual; gunakan aturan yang diwajibkan standar pengukuran proyek.', 'Apply No Effect as the manual example', 'This is only the manual beam-column example; follow the project measurement standard.', 'measurement-rules-04.webp'),
    a('Hitung ulang dan bandingkan', 'Periksa perubahan expression dan deduction sebelum serta sesudah aturan diubah.', 'Recalculate and compare', 'Check the expression and deduction before and after changing the rule.', 'measurement-rules-after.webp')]],
  ['measurement-settings', 'Mengatur Measurement Settings', 'Configure Measurement Settings', 'Meninjau pengaturan posisi dan tinggi finishing tanpa menebak opsi ambigu.', 'Review finish position and height settings without guessing ambiguous options.', '97-98', [
    a('Buka Quantity > Measurement Setting', 'Gunakan pengaturan ini untuk mengontrol cara kuantitas tertentu dihitung.', 'Open Quantity > Measurement Setting', 'Use these settings to control how particular quantities are measured.', 'measurement-settings-01.webp'),
    a('Pilih Wall Finish', 'Pastikan kategori yang aktif sesuai dengan pengaturan yang akan diperiksa.', 'Select Wall Finish', 'Confirm that the active category matches the settings under review.', 'measurement-settings-02.webp'),
    a('Tinjau finish-position settings', 'Gunakan label antarmuka yang terlihat dan jangan menyimpulkan arti nomor yang tidak jelas.', 'Review finish-position settings', 'Use visible interface labels and do not infer unclear numbered options.', 'measurement-settings-03.webp'),
    a('Tinjau additional-height dan opsi Yes/No', 'Bandingkan pilihan dengan standar serta kebutuhan proyek sebelum mengubahnya.', 'Review additional-height and Yes/No options', 'Compare the choices with the project standard and requirements before changing them.', 'measurement-settings-04.webp'),
    a('Periksa outer-finish settings', 'Pastikan pengaturan finish luar konsisten dengan kondisi dinding yang diukur.', 'Check outer-finish settings', 'Confirm that outer-finish settings match the measured wall condition.', 'measurement-settings-05.webp')]],
  ['calculate-verify-quantity', 'Menghitung dan Memeriksa Kuantitas', 'Calculate and Verify Quantities', 'Menghitung cakupan yang tepat dan memvalidasi deduction secara visual.', 'Calculate the intended scope and validate deductions visually.', '99', [
    a('Pilih Calculate atau Calculate Selected Entity', 'Gunakan Calculate untuk cakupan lantai atau opsi selected entity untuk pemeriksaan terfokus.', 'Choose Calculate or Calculate Selected Entity', 'Use Calculate for a floor scope or the selected-entity option for a focused check.', 'calculate-verify-quantity-01.webp'),
    a('Tentukan lantai atau elemen', 'Pastikan cakupan mencakup semua perubahan yang perlu diperbarui.', 'Choose floors or entities', 'Ensure the scope includes every change requiring an update.', 'calculate-verify-quantity-02.webp'),
    a('Jalankan perhitungan', 'Tunggu hasil selesai diperbarui sebelum memulai verifikasi.', 'Run the calculation', 'Wait for results to finish updating before verification.', 'calculate-verify-quantity-03.webp'),
    a('Buka View Expression pada elemen 3D', 'Pilih model yang relevan dan tinjau expression terbaru.', 'Open View Expression on the 3D entity', 'Select the relevant model entity and review the current expression.', 'calculate-verify-quantity-04.webp'),
    a('Periksa dengan 3D Deduction', 'Pastikan deduction fisik sesuai dengan expression dan measurement rule.', 'Check with 3D Deduction', 'Confirm that the physical deduction agrees with the expression and measurement rule.', 'calculate-verify-quantity-05.webp')]],
  ['quantity-reports', 'Meninjau dan Mengatur Laporan', 'Review and Configure Reports', 'Meninjau kuantitas dan menyusun hierarki laporan yang dapat diverifikasi.', 'Review quantities and create a verifiable report hierarchy.', '100-101', [
    a('Buka View Quantity by Category', 'Tinjau category, quantity, dan unit pada hasil yang telah dihitung.', 'Open View Quantity by Category', 'Review categories, quantities and units in the calculated results.', 'quantity-reports-01.webp'),
    a('Buka Set Classification and Quantity', 'Gunakan pengaturan ini untuk menentukan atribut dan struktur laporan TAS.', 'Open Set Classification and Quantity', 'Use this setting to define TAS report attributes and structure.', 'quantity-reports-02.webp'),
    a('Pilih atribut yang diperlukan', 'Sertakan hanya field yang dibutuhkan oleh penerima laporan.', 'Select the required attributes', 'Include only the fields needed by the report recipient.', 'quantity-reports-03.webp'),
    a('Atur hierarki atribut', 'Pindahkan atribut ke atas atau bawah untuk mengendalikan urutan pengelompokan.', 'Arrange the attribute hierarchy', 'Move attributes up or down to control grouping order.', 'quantity-reports-04.webp'),
    a('Regenerate dan verifikasi laporan', 'Periksa total, unit, dan category structure sebelum laporan diterbitkan.', 'Regenerate and verify the report', 'Check totals, units and category structure before issuing the report.', 'quantity-reports-05.webp')]],
]

const parts = {
  id: [['Persiapan Proyek dan Gambar', 'Measurement Settings → Measurement Rules → Create Project → Configure → Import → Scale → Align → Create Axis'], ['Pemodelan Elemen Bangunan', 'Pile Cap → Column → Beam → Slab → Wall → Door/Window → Room Finish → Quantity/Report'], ['Kuantitas dan Laporan', 'Calculate → Verify → Report']],
  en: [['Project and Drawing Preparation', 'Measurement Settings → Measurement Rules → Create Project → Configure → Import → Scale → Align → Create Axis'], ['Building Element Modelling', 'Pile Cap → Column → Beam → Slab → Wall → Door/Window → Room Finish → Quantity/Report'], ['Quantity and Reports', 'Calculate → Verify → Report']],
}
const ranges = [[0, 6], [6, 14], [14, 18]]

const manualPagesByLesson = {
  'create-project': [14, 14, 14, 14],
  'tas-interface-attributes': [15, 15, 15, 16, 16],
  'floor-grade-settings': [17, 19, 19, 20, 20],
  'import-split-drawing': [22, 23, 24, 24, 24],
  'scale-relocate-drawing': [25, 25, 25, 26, 26],
  'axis-grid': [28, 30, 31, 32, 34],
  'identify-pile-caps': [38, 38, 39, 40, 41],
  'identify-columns': [43, 45, 46, 47, 47],
  'identify-beams': [50, 51, 51, 52, 53],
  'identify-slabs': [56, 57, 58, 59, 60],
  'identify-structural-walls': [65, 65, 66, 67, 68],
  'identify-architectural-walls': [64, 69, 70, 72, 73],
  'identify-openings': [77, 78, 78, 80, 81],
  'apply-finishes': [85, 86, 87, 88, 89],
  'measurement-rules': [93, 94, 94, 95, 96],
  'measurement-settings': [97, 97, 98, 98, 98],
  'calculate-verify-quantity': [99, 99, 99, 99, 99],
  'quantity-reports': [100, 100, 100, 100, 101],
}

const withScreenshotCopy = (action, manualPage, language) => {
  const screenshotCopy = getScreenshotCopy('tas', manualPage, language)
  return { ...action, imageAlt: screenshotCopy.alt, alt: screenshotCopy.alt, caption: screenshotCopy.caption, requiredDescription: '' }
}

const screenshotCropByPage = {
  14: { x: 0.19, y: 0.30, width: 0.76, height: 0.65, imageWidth: 1676, imageHeight: 1002 },
  16: { x: 0.20, y: 0.25, width: 0.68, height: 0.67, imageWidth: 1943, imageHeight: 991 },
  19: { x: 0.19, y: 0.41, width: 0.73, height: 0.50, imageWidth: 1705, imageHeight: 968 },
  20: { x: 0.14, y: 0.27, width: 0.82, height: 0.67, imageWidth: 1713, imageHeight: 950 },
  23: { x: 0.03, y: 0.29, width: 0.94, height: 0.66, imageWidth: 1961, imageHeight: 978 },
  24: { x: 0.03, y: 0.22, width: 0.94, height: 0.74, imageWidth: 1906, imageHeight: 996 },
  25: { x: 0.36, y: 0.18, width: 0.62, height: 0.75, imageWidth: 2004, imageHeight: 947 },
  26: { x: 0.02, y: 0.35, width: 0.96, height: 0.61, imageWidth: 1852, imageHeight: 989 },
  93: { x: 0.15, y: 0.23, width: 0.72, height: 0.74, imageWidth: 1911, imageHeight: 1002 },
  94: { x: 0.02, y: 0.27, width: 0.96, height: 0.70, imageWidth: 2036, imageHeight: 1002 },
  95: { x: 0.04, y: 0.20, width: 0.94, height: 0.78, imageWidth: 1707, imageHeight: 916 },
  96: { x: 0.02, y: 0.20, width: 0.96, height: 0.78, imageWidth: 1768, imageHeight: 1002 },
  97: { x: 0.02, y: 0.28, width: 0.96, height: 0.66, imageWidth: 2024, imageHeight: 775 },
  98: { x: 0.01, y: 0.24, width: 0.98, height: 0.71, imageWidth: 2048, imageHeight: 939 },
}

const imageStepTextByPage = {
  14: {
    id: ['Step 1: Buat project baru.', 'Step 2: Masukkan judul project.', 'Step 3: Pilih Measurement Rules.', 'Step 4: Masukkan Existing Ground Level.'],
    en: ['Step 1: Create a new project.', 'Step 2: Enter the project title.', 'Step 3: Select Measurement Rules.', 'Step 4: Enter Existing Ground Level.'],
  },
  16: {
    id: ['Public: tanpa seleksi, perubahan berlaku untuk semua entitas dengan nama yang sama.', 'Private: entitas harus dipilih; perubahan hanya berlaku untuk entitas yang dipilih.'],
    en: ['Public: without selection, changes apply to all entities with the same name.', 'Private: an entity must be selected; changes apply only to the selected entity.'],
  },
  19: {
    id: ['Step 1: Di 1st Floor, pilih Insert Floor untuk superstructure; di Foundation Floor, pilih Insert Floor untuk substructure.', 'Step 2: Masukkan Floor Height setiap lantai.', 'Step 3: Masukkan Bottom Elevation hanya untuk 1st Floor.'],
    en: ['Step 1: At 1st Floor, select Insert Floor for the superstructure; at Foundation Floor, select Insert Floor for the substructure.', 'Step 2: Enter the Floor Height for each floor.', 'Step 3: Enter Bottom Elevation for the 1st Floor only.'],
  },
  20: {
    id: ['Step 1: Masukkan Concrete Grade untuk elemen yang berbeda.', 'Step 2: Gunakan Copy to Other Floor jika grade sama pada lantai tertentu.'],
    en: ['Step 1: Enter Concrete Grade for different elements.', 'Step 2: Use Copy to Other Floor when the grade is the same on selected floors.'],
  },
  23: {
    id: ['Step 1: Pilih tab Identify, lalu Add drawing(s).', 'Step 2: Pilih drawing(s).'],
    en: ['Step 1: Select the Identify tab, then Add drawing(s).', 'Step 2: Select the drawing(s).'],
  },
  24: {
    id: ['Step 1: Di Drawing Manager, pilih Split.', 'Step 2: Block-select gambar CAD, lalu klik kanan.', 'Step 3: Masukkan nama drawing dengan mengetik atau memilih judul pada gambar.'],
    en: ['Step 1: In Drawing Manager, select Split.', 'Step 2: Block-select the CAD drawing, then right-click.', 'Step 3: Enter the drawing name by typing or selecting its title on the drawing.'],
  },
  25: {
    id: ['Step 1: Buka tab Identify, lalu pilih Scale Drawing.', 'Step 2: Klik kanan pada drawing.', 'Step 3: Tentukan titik awal.', 'Step 4: Tentukan titik akhir.', 'Step 5: Masukkan actual length.'],
    en: ['Step 1: Open the Identify tab, then select Scale Drawing.', 'Step 2: Right-click the drawing.', 'Step 3: Specify the start point.', 'Step 4: Specify the end point.', 'Step 5: Enter the actual length.'],
  },
  26: {
    id: ['Step 1: Buka tab Identify, lalu pilih Relocate.', 'Step 2: Pilih satu titik pada drawing, misalnya A/1.', 'Step 3: Pindahkan titik ke titik yang sama pada gridline. Gunakan intersection snap jika pemilihan kurang akurat.'],
    en: ['Step 1: Open the Identify tab, then select Relocate.', 'Step 2: Select a point on the drawing, such as A/1.', 'Step 3: Move it to the same point on the gridline. Use intersection snap if the selection is inaccurate.'],
  },
  93: {
    id: ['Step 1: Pada tab Quantity, pilih entitas model 3D, misalnya Beam.', 'Step 2: Pilih View Expression.', 'Step 3: Tinjau volume concrete dan deduction dari column yang ingin diubah.'],
    en: ['Step 1: On the Quantity tab, select a 3D model entity, such as a Beam.', 'Step 2: Select View Expression.', 'Step 3: Review the concrete volume and the column deduction to be changed.'],
  },
  94: {
    id: ['Step 1: Pada tab Quantity, pilih Measurement Rules dan elemen Beam.', 'Step 2: Pilih View Expression.', 'Step 3: Pilih Filter Relevant Element dan centang hanya elemen Column.', 'Step 4: Pilih OK.'],
    en: ['Step 1: On the Quantity tab, select Measurement Rules and the Beam element.', 'Step 2: Select View Expression.', 'Step 3: Select Filter Relevant Element and check only Column.', 'Step 4: Select OK.'],
  },
  95: {
    id: ['Step 1: Baca Description dan tentukan rule yang perlu disesuaikan.', 'Step 2: Ubah Option List ke pilihan yang diperlukan, misalnya No Effect.', 'Step 3: Pilih Calculate untuk memperbarui hasil quantity.'],
    en: ['Step 1: Read the Description and decide which rules to adjust.', 'Step 2: Change the Option List to the required choice, such as No Effect.', 'Step 3: Select Calculate to update the quantity result.'],
  },
  96: {
    id: ['Step 1: Bandingkan hasil quantity sebelum dan sesudah Measurement Rules diubah.', 'Angka 1 menunjukkan Volume 0.571 m3 sebelum perubahan (deducted by column).', 'Angka 2 menunjukkan Volume 0.691 m3 setelah perubahan (undeducted by column).'],
    en: ['Step 1: Compare quantity results before and after changing Measurement Rules.', 'Number 1 shows Volume 0.571 m3 before the change (deducted by column).', 'Number 2 shows Volume 0.691 m3 after the change (undeducted by column).'],
  },
  97: {
    id: ['Step 1: Pada tab Quantity, pilih Measurement Setting.', 'Step 2: Pilih contoh Wall Finish.'],
    en: ['Step 1: On the Quantity tab, select Measurement Setting.', 'Step 2: Select Wall Finish as the example.'],
  },
  98: {
    id: ['Step 1: Opsi nomor 2 dan 3 dapat dianggap sebagai setting untuk plaster; nomor 2 untuk finish position dan nomor 3 untuk additional height (dapat disesuaikan sesuai kebutuhan).', 'Step 2: Pilih opsi nomor 5 dan ubah nilainya menjadi Yes.', 'Step 3: Opsi nomor 6 dan 7 dapat dianggap sebagai outer finish dan setting untuk plaster; nomor 6 untuk finish position dan nomor 7 untuk additional height (dapat disesuaikan sesuai kebutuhan).'],
    en: ['Step 1: Options 2 and 3 can be assumed to be settings for plaster; option 2 is for finish position and option 3 for additional height (adjust as desired).', 'Step 2: Select option 5 and change the value to Yes.', 'Step 3: Options 6 and 7 can be assumed to be outer finish and settings for plaster; option 6 is for finish position and option 7 for additional height (adjust as desired).'],
  },
}

const groupedActionTitles = {
  'measurement-settings': {
    97: { id: 'Buka Measurement Setting dan pilih Wall Finish', en: 'Open Measurement Setting and choose Wall Finish' },
    98: { id: 'Tinjau pengaturan finish position dan additional height', en: 'Review finish-position and additional-height settings' },
  },
  'measurement-rules': {
    94: { id: 'Filter kondisi column pada Measurement Rules', en: 'Filter the column condition in Measurement Rules' },
  },
  'create-project': {
    14: { id: 'Siapkan proyek baru dan aturan pengukurannya', en: 'Set up a new project and its measurement rules' },
  },
  'tas-interface-attributes': {
    15: { id: 'Kenali area kerja TAS', en: 'Explore the TAS workspace' },
    16: { id: 'Gunakan Public dan Private Attribute', en: 'Use Public and Private Attributes' },
  },
  'floor-grade-settings': {
    19: { id: 'Atur struktur lantai dan elevasi', en: 'Set up floor levels and elevations' },
    20: { id: 'Atur Concrete Grade pada lantai', en: 'Set Concrete Grades across floors' },
  },
  'import-split-drawing': {
    24: { id: 'Pisahkan dan namai drawing', en: 'Split and name the drawing' },
  },
  'scale-relocate-drawing': {
    25: { id: 'Atur skala drawing dengan titik referensi', en: 'Set the drawing scale using reference points' },
    26: { id: 'Selaraskan drawing dengan axis grid', en: 'Align the drawing with the axis grid' },
  },
}

const groupActionsByImage = (actions, stepId, language) => {
  const groups = []
  for (const action of actions) {
    const previous = groups.at(-1)
    if (previous?.image === action.image) previous.actions.push(action)
    else groups.push({ image: action.image, actions: [action] })
  }
  return groups.map(({ image, actions: groupedActions }, index) => {
    const first = groupedActions[0]
    const page = Number(image.match(/page-(\d+)/)?.[1])
    const sourceText = imageStepTextByPage[page]
    const extractedText = sourceText?.[language] || []
    const contextualTitle = groupedActionTitles[stepId]?.[page]?.[language]
    return {
      ...first,
      id: `${stepId}-image-${index + 1}`,
      number: index + 1,
      title: contextualTitle || first.title,
      description: [...extractedText, ...groupedActions.map((action) => `${action.title} - ${action.description}`)].join('\n'),
      instructionFormat: extractedText.length ? 'numbered' : undefined,
      crop: screenshotCropByPage[page],
    }
  })
}

export function getTasData(language) {
  const isId = language === 'id'
  const tutorialParts = parts[language].map(([title, flow], partIndex) => ({ id: `part-${partIndex + 1}`, number: `0${partIndex + 1}`, title, shortTitle: title, summary: partIndex === 1 ? (isId ? 'Identifikasi otomatis berdasarkan layer atau colour ditujukan terutama untuk CAD dan vector PDF yang memiliki data garis serta teks.' : 'Automatic identification by layer or colour is intended primarily for CAD and vector PDFs containing line and text data.') : (isId ? 'Ikuti alur kerja yang terdokumentasi untuk bagian ini.' : 'Follow the documented workflow for this part.'), workflow: flow.split(' → '), steps: (partIndex === 0 ? [...['measurement-settings', 'measurement-rules'].map((firstId) => lessons.find(([id]) => id === firstId)), ...lessons.slice(...ranges[partIndex])] : lessons.slice(...ranges[partIndex]).filter(([id]) => !['measurement-settings', 'measurement-rules'].includes(id))).map(([id, titleId, titleEn, introId, introEn, pages, actions]) => ({ id, title: isId ? titleId : titleEn, intro: isId ? introId : introEn, duration: `${actions.length * 2} min`, manualPages: pages, instructions: actions.map((item) => isId ? item.titleId : item.titleEn), actions: actions.map((item, index) => { const imageAlt = isId ? `Halaman manual TAS untuk ${item.titleId}` : `TAS manual page for ${item.titleEn}`; const manualPage = manualPagesByLesson[id][index]; return { id: `${id}-action-${index + 1}`, number: index + 1, title: isId ? item.titleId : item.titleEn, description: isId ? item.descriptionId : item.descriptionEn, image: `/tutorial/tas/processed/page-${String(manualPage).padStart(3, '0')}.png`, imageAlt, alt: imageAlt, caption: isId ? `Screenshot asli TAS C v10.300, halaman manual ${manualPage}; tampilan versi baru mungkin sedikit berbeda.` : `Original TAS C v10.300 screenshot from manual page ${manualPage}; newer versions may differ slightly.`, requiredDescription: isId ? `Potongan halaman manual TAS ${manualPage}.` : `Cropped TAS manual page ${manualPage}.`, pending: false } }), checks: isId ? ['Tindakan utama telah diselesaikan', 'Data atau hasil telah dibandingkan dengan dokumen sumber', 'Hasil siap untuk langkah berikutnya'] : ['The main actions are complete', 'Data or results were checked against the source document', 'The result is ready for the next step'] })) }))
  tutorialParts.forEach((part) => part.steps.forEach((step, index) => {
    if (part.id === 'part-1' && index < 7) {
      step.actions = groupActionsByImage(step.actions, step.id, language)
      step.showInstructionsBelowImage = true
    }
    step.actions = step.actions.map((action) => withScreenshotCopy(action, Number(action.image.match(/page-(\d+)/)?.[1]), language))
  }))
  const revisedParts = replacePartTwoLessons(tutorialParts)
  revisedParts.forEach((part) => {
    part.steps = part.steps.map((step) => ({ ...applyPartTwoRevision(applySectionOneRevision(step, language), language), checks: getTasChecklist(step.id, language) }))
    if (part.id === 'part-2') {
      const isEnglish = language === 'en'
      part.steps = part.steps.map((step, stepIndex) => {
        const card = partTwoTitleCards[step.id]
        if (!card) return step
        const imageAlt = isEnglish ? `Cubicost TAS title card with Indonesian heading: ${card.title}` : `Kartu judul Cubicost TAS: ${card.title}`
        const titleCard = {
          id: `${step.id}-title-card`,
          number: 1,
          title: isEnglish ? card.actionTitleEn : card.actionTitleId,
          description: '',
          image: `/tutorial/tas/title-cards/part-2-step-${stepIndex + 1}.svg`,
          imageAlt,
          alt: imageAlt,
          caption: '',
          requiredDescription: imageAlt,
          pending: false,
          hideInstructions: true,
        }
        const existingActions = step.actions.map((action, index) => ({
          ...action,
          id: `${step.id}-action-${index + 2}`,
          number: index + 2,
        }))
        return {
          ...step,
          duration: `${(existingActions.length + 1) * 2} min`,
          instructions: [titleCard.title, ...existingActions.map((action) => `${action.title} ${action.description}`)],
          actions: [titleCard, ...existingActions],
        }
      })
    }
  })
  const updatedSteps = revisedParts.flatMap((part) => part.steps.map((step, index) => ({ ...step, partId: part.id, partTitle: part.title, partNumber: part.number, stepNumber: index + 1 })))
  return { tutorialParts: revisedParts, allSteps: updatedSteps }
}
