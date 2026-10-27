import { getScreenshotCopy } from '../screenshotCopy.js'

const a = (titleId, descriptionId, titleEn, descriptionEn, file) => ({ titleId, descriptionId, titleEn, descriptionEn, file })

const lessons = [
  ['export-tas-model', 'Memahami dan Mengekspor Model TAS', 'Understand and Export a TAS Model', 'Membuat file transfer TAS yang sesuai dengan cakupan model yang akan dikerjakan di TRB.', 'Create a TAS transfer file that matches the model scope to be developed in TRB.', '103-105', [
    a('Tentukan cakupan transfer', 'Gunakan alur TAS-ke-TRB setelah model sumber diperiksa dan tentukan apakah seluruh lantai atau hanya elemen tertentu yang perlu diperbarui.', 'Define the transfer scope', 'Use the TAS-to-TRB workflow after checking the source model, then decide whether whole floors or selected entities require an update.', 'export-model-01.webp'),
    a('Pilih Export Model by Floor', 'Gunakan ekspor per lantai ketika seluruh elemen pada lantai yang dipilih perlu dipindahkan ke proyek TRB.', 'Choose Export Model by Floor', 'Use floor-based export when all elements on the selected floors need to be transferred to the TRB project.', 'export-model-02.webp'),
    a('Gunakan Export Model by Entity bila diperlukan', 'Ekspor berdasarkan elemen cocok untuk pembaruan parsial agar cakupan transfer tetap terbatas.', 'Use Export Model by Entity when needed', 'Entity-based export is suited to partial updates where the transfer scope must remain limited.', 'export-model-03.webp'),
    a('Simpan file model', 'Gunakan nama file dan lokasi yang menunjukkan proyek, cakupan, dan revisi agar file dapat dikenali saat diimpor.', 'Save the model file', 'Use a filename and location that identify the project, scope and revision before importing it.', 'export-model-04.webp')]],
  ['import-tas-model', 'Mengimpor Model TAS ke TRB', 'Import a TAS Model into TRB', 'Memasukkan file transfer TAS ke proyek TRB tujuan yang benar.', 'Bring the TAS transfer file into the correct destination TRB project.', '106', [
    a('Buka proyek TRB tujuan', 'Buat proyek baru atau buka proyek yang benar sebelum memasukkan data dari TAS.', 'Open the destination TRB project', 'Create a new project or open the correct project before bringing in TAS data.', 'import-model-01.webp'),
    a('Buka BIM MODEL > Import Model', 'Gunakan perintah Import Model dari area BIM MODEL untuk memulai transfer.', 'Open BIM MODEL > Import Model', 'Use Import Model in the BIM MODEL area to begin the transfer.', 'import-model-02.webp'),
    a('Pilih file hasil ekspor', 'Gunakan file yang sebelumnya disimpan dari TAS dan periksa nama serta revisinya.', 'Select the exported file', 'Choose the file previously saved from TAS and verify its name and revision.', 'import-model-03.webp'),
    a('Konfirmasi impor', 'Lanjutkan setelah proyek tujuan dan file sumber dipastikan sesuai.', 'Confirm the import', 'Continue only after confirming the destination project and source file.', 'import-model-04.webp')]],
  ['match-import-settings', 'Menyesuaikan Pengaturan Impor', 'Match the Import Settings', 'Menyelaraskan zona, lantai, dan elemen sebelum model TAS dibuat di TRB.', 'Align zones, floors and elements before creating the TAS model in TRB.', '107-108', [
    a('Periksa penanganan zone', 'Tinjau bagaimana zone dari model sumber akan diperlakukan pada proyek TRB tujuan.', 'Review zone handling', 'Check how zones from the source model will be handled in the destination TRB project.', 'match-import-01.webp'),
    a('Tentukan sumber tinggi lantai', 'Aktifkan Use floor height in TAS project hanya ketika tinggi lantai sumber memang harus dipertahankan.', 'Choose the floor-height source', 'Enable Use floor height in TAS project only when the source floor heights should be retained.', 'match-import-02.webp'),
    a('Pilih lantai dan elemen', 'Batasi pilihan pada lantai serta tipe elemen yang termasuk dalam cakupan transfer.', 'Select floors and elements', 'Limit the selection to the floors and element types included in the transfer scope.', 'match-import-03.webp'),
    a('Lanjutkan dengan Next Step', 'Periksa kembali pemetaan sebelum berpindah ke tahap konfirmasi berikutnya.', 'Continue with Next Step', 'Review the mapping before moving to the next confirmation stage.', 'match-import-04.webp')]],
  ['prepare-trb-drawings', 'Memeriksa Model dan Menyiapkan Gambar', 'Check the Model and Prepare Drawings', 'Memastikan model terlihat dengan benar dan gambar kerja siap digunakan untuk identifikasi.', 'Confirm that the model displays correctly and drawings are ready for identification.', '109-110', [
    a('Atur tampilan elemen dengan F12', 'Gunakan kontrol tampilan untuk menampilkan hanya elemen yang diperlukan saat pemeriksaan.', 'Control entity display with F12', 'Use the display controls to show the entities required for the current review.', 'prepare-drawing-01.webp'),
    a('Periksa model yang ditransfer', 'Tampilkan elemen yang dibutuhkan dan pastikan lantai serta geometri utamanya sesuai.', 'Check the transferred model', 'Display the required entities and confirm their floors and main geometry.', 'prepare-drawing-02.webp'),
    a('Tambahkan building plan', 'Buka rencana bangunan lalu gunakan IDENTIFY > Add Drawing untuk memasukkan gambar referensi.', 'Add the building plan', 'Open the building plan, then use IDENTIFY > Add Drawing to add the reference drawing.', 'prepare-drawing-03.webp'),
    a('Pisahkan dan pindahkan gambar', 'Atur bagian gambar pada lokasi lantai yang tepat sebelum pemodelan tulangan dimulai.', 'Split and relocate the drawing', 'Arrange drawing portions on the correct floors before reinforcement modelling begins.', 'prepare-drawing-04.webp')]],
  ['pile-cap-reinforcement', 'Mendefinisikan Tulangan Pile Cap', 'Define Pile Cap Reinforcement', 'Menetapkan data tulangan pile cap pada elemen yang sesuai.', 'Assign pile-cap reinforcement data to the correct elements.', '112-113', [
    a('Pilih pile cap', 'Pastikan elemen dan lantai yang aktif sesuai dengan detail tulangan yang akan diterapkan.', 'Select the pile cap', 'Confirm that the active element and floor match the reinforcement detail being applied.', 'pile-cap-01.webp'),
    a('Buka pengaturan tulangan', 'Masuk ke pengaturan reinforcement pile cap dan gunakan data dari detail struktur yang telah disetujui.', 'Open the reinforcement settings', 'Open the pile-cap reinforcement settings and use data from the approved structural detail.', 'pile-cap-02.webp'),
    a('Masukkan data tulangan', 'Isi parameter yang ditunjukkan pada detail tanpa mengasumsikan nilai yang tidak tersedia.', 'Enter the reinforcement data', 'Enter the parameters shown in the detail without assuming unavailable values.', 'pile-cap-03.webp'),
    a('Tinjau hasilnya', 'Periksa kembali susunan yang terbentuk terhadap gambar sumber.', 'Review the result', 'Check the resulting arrangement against the source drawing.', 'pile-cap-04.webp')]],
  ['pile-cap-data-check', 'Memeriksa Data dan Membuat Pile Cap Tidak Beraturan', 'Check Data and Create an Irregular Pile Cap', 'Memvalidasi data pile cap dan menangani bentuk tidak beraturan sesuai geometri sumber.', 'Validate pile-cap data and handle irregular shapes according to the source geometry.', '114-115', [
    a('Jalankan pemeriksaan data', 'Gunakan pemeriksaan yang didokumentasikan untuk menemukan data yang belum lengkap atau tidak konsisten.', 'Run the data check', 'Use the documented check to find incomplete or inconsistent data.', 'pile-cap-check-01.webp'),
    a('Tinjau temuan', 'Hubungkan setiap temuan dengan elemen dan detail struktur yang relevan sebelum memperbaikinya.', 'Review the findings', 'Relate each finding to the relevant element and structural detail before correcting it.', 'pile-cap-check-02.webp'),
    a('Buat batas tidak beraturan', 'Ikuti geometri pile cap pada gambar ketika bentuk standar tidak mewakili kondisi model.', 'Create the irregular boundary', 'Follow the pile-cap geometry in the drawing when a standard shape does not represent the model.', 'pile-cap-check-03.webp'),
    a('Periksa bentuk dan data tulangan', 'Pastikan batas elemen dan data reinforcement merujuk pada detail yang sama.', 'Check the shape and reinforcement data', 'Confirm that the element boundary and reinforcement data refer to the same detail.', 'pile-cap-check-04.webp')]],
  ['column-reinforcement', 'Mendefinisikan Tulangan Kolom', 'Define Column Reinforcement', 'Menerapkan data tulangan kolom dan memeriksa hasilnya pada elemen yang benar.', 'Apply column reinforcement data and check it on the correct elements.', '117-119', [
    a('Pilih kolom yang sesuai', 'Cocokkan tipe dan lantai kolom dengan detail atau schedule sumber.', 'Select the correct column', 'Match the column type and floor to the source detail or schedule.', 'column-rebar-01.webp'),
    a('Buka definisi reinforcement', 'Gunakan area data tulangan kolom yang ditunjukkan manual.', 'Open the reinforcement definition', 'Use the column reinforcement data area shown in the manual.', 'column-rebar-02.webp'),
    a('Masukkan tulangan utama dan sengkang', 'Salin parameter dari dokumen struktur dan pertahankan satuan proyek.', 'Enter longitudinal bars and ties', 'Transfer the parameters from the structural documents while retaining project units.', 'column-rebar-03.webp'),
    a('Periksa susunan kolom', 'Tinjau jumlah, posisi, dan rentang tulangan terhadap detail sumber.', 'Check the column arrangement', 'Review bar quantity, position and range against the source detail.', 'column-rebar-04.webp')]],
  ['column-schedule', 'Mengimpor dan Menyinkronkan Column Schedule', 'Import and Synchronise a Column Schedule', 'Menggunakan column schedule untuk menyelaraskan data tulangan kolom.', 'Use a column schedule to align column reinforcement data.', '122-127', [
    a('Siapkan column schedule', 'Pastikan tabel sumber terbaca dan hanya memuat area schedule yang relevan.', 'Prepare the column schedule', 'Ensure the source table is legible and contains only the relevant schedule area.', 'column-schedule-01.webp'),
    a('Impor schedule', 'Pilih column schedule yang benar dan pertahankan hubungan dengan gambar sumber.', 'Import the schedule', 'Choose the correct column schedule and retain its relationship to the source drawing.', 'column-schedule-02.webp'),
    a('Petakan informasi kolom', 'Cocokkan kolom data schedule dengan atribut TRB yang didokumentasikan.', 'Map the column information', 'Match schedule columns to the documented TRB attributes.', 'column-schedule-03.webp'),
    a('Sinkronkan ke model', 'Terapkan data hanya setelah tipe dan identitas kolom dipastikan cocok.', 'Synchronise with the model', 'Apply the data only after confirming that column types and identities match.', 'column-schedule-04.webp'),
    a('Periksa hasil sinkronisasi', 'Tinjau sampel kolom agar data model sesuai dengan baris schedule.', 'Check the synchronised result', 'Review sample columns to ensure model data agrees with the schedule rows.', 'column-schedule-05.webp')]],
  ['beam-side-label', 'Mendefinisikan Tulangan Balok dengan Side Label', 'Define Beam Reinforcement with Side Label', 'Membaca dan menerapkan Side Label balok dengan pemisah + dan / secara tepat.', 'Read and apply beam Side Labels with the + and / separators correctly.', '129-132', [
    a('Pilih balok dan Side Label', 'Gunakan label yang benar-benar terkait dengan balok yang sedang didefinisikan.', 'Select the beam and Side Label', 'Use the label that belongs to the beam currently being defined.', 'beam-side-label-01.webp'),
    a('Baca notasi dengan tanda +', 'Dalam contoh manual, tanda + menggabungkan kelompok batang pada posisi yang sama; pertahankan pengelompokan tersebut saat memasukkan data.', 'Interpret notation using +', 'In the manual example, + combines bar groups at the same position; retain that grouping when entering data.', 'beam-side-label-02.webp'),
    a('Baca notasi dengan tanda /', 'Dalam contoh manual, tanda / memisahkan susunan batang antar lapisan; jangan memperlakukannya sebagai penjumlahan satu lapis.', 'Interpret notation using /', 'In the manual example, / separates bars between layers; do not treat it as a single-layer addition.', 'beam-side-label-03.webp'),
    a('Periksa hasil Side Label', 'Bandingkan susunan yang terbentuk dengan label dan detail balok sumber.', 'Check the Side Label result', 'Compare the resulting arrangement with the source beam label and detail.', 'beam-side-label-04.webp')]],
  ['beam-schedule', 'Mengimpor atau Membuat Balok dari Beam Schedule', 'Import or Create Beams from a Beam Schedule', 'Memilih antara sinkronisasi balok yang sudah ada dan pembuatan elemen yang belum dimodelkan.', 'Choose between synchronising existing beams and generating elements that have not been modelled.', '134-137', [
    a('Impor beam schedule', 'Pilih tabel yang sesuai dan pastikan identitas balok dapat dipetakan.', 'Import the beam schedule', 'Choose the correct table and ensure beam identities can be mapped.', 'beam-schedule-01.webp'),
    a('Petakan kolom schedule', 'Hubungkan label dan data reinforcement ke atribut yang ditunjukkan dalam alur schedule.', 'Map the schedule columns', 'Connect labels and reinforcement data to the attributes shown in the schedule workflow.', 'beam-schedule-02.webp'),
    a('Sinkronkan balok yang sudah ada', 'Jika balok telah dimodelkan, perbarui informasi balok tanpa membuat elemen duplikat.', 'Synchronise an existing beam', 'If the beam is already modelled, update its information without creating a duplicate element.', 'beam-schedule-03.webp'),
    a('Buat balok yang belum dimodelkan', 'Jika elemen belum tersedia, gunakan hasil schedule untuk menghasilkan balok sesuai alur manual.', 'Generate an unmodelled beam', 'If the element does not exist, use the schedule result to generate the beam through the documented workflow.', 'beam-schedule-04.webp'),
    a('Periksa cakupan hasil', 'Pastikan setiap baris schedule menghasilkan pembaruan atau elemen yang dimaksud, bukan keduanya.', 'Check the result scope', 'Ensure each schedule row produces the intended update or element, not both.', 'beam-schedule-05.webp')]],
  ['beam-support-layout', 'Memeriksa Support dan Susunan Tulangan Balok', 'Check Beam Supports and Reinforcement Layout', 'Memastikan support serta susunan reinforcement balok sesuai kondisi model.', 'Confirm that beam supports and reinforcement layout match the model condition.', '133, 138', [
    a('Periksa support balok', 'Pastikan hubungan ujung balok dikenali sebelum menilai rentang tulangan.', 'Check beam supports', 'Confirm that beam-end relationships are recognised before reviewing reinforcement ranges.', 'beam-support-01.webp'),
    a('Tinjau susunan tulangan', 'Periksa posisi tulangan atas, bawah, dan bagian terkait terhadap detail sumber.', 'Review the reinforcement layout', 'Check top, bottom and related bar positions against the source detail.', 'beam-support-02.webp'),
    a('Koreksi ketidaksesuaian data', 'Perbarui hanya data yang dapat ditelusuri ke schedule atau detail struktur.', 'Correct data mismatches', 'Update only data that can be traced to the schedule or structural detail.', 'beam-support-03.webp'),
    a('Validasi hasil akhir', 'Pastikan support dan rentang tulangan tetap konsisten setelah koreksi.', 'Validate the final result', 'Confirm that supports and reinforcement ranges remain consistent after correction.', 'beam-support-04.webp')]],
  ['slab-main-bars', 'Mendefinisikan dan Menyusun Tulangan Utama Pelat', 'Define and Arrange Slab Main Bars', 'Menetapkan tulangan utama pelat dan menyesuaikan area penempatannya.', 'Define slab main reinforcement and adjust its placement area.', '140-145', [
    a('Pilih pelat dan arah tulangan', 'Pastikan area pelat serta arah kerja mengacu pada gambar struktur.', 'Select the slab and bar direction', 'Confirm the slab area and spanning direction from the structural drawing.', 'slab-main-01.webp'),
    a('Definisikan tulangan utama', 'Masukkan diameter dan spacing sesuai detail tanpa membuat nilai perkiraan.', 'Define the main bars', 'Enter diameter and spacing from the detail without estimating missing values.', 'slab-main-02.webp'),
    a('Tentukan area penempatan', 'Atur batas susunan agar reinforcement diterapkan pada area pelat yang dimaksud.', 'Set the placement area', 'Adjust the layout boundary so reinforcement applies to the intended slab area.', 'slab-main-03.webp'),
    a('Sesuaikan susunan batang', 'Gunakan kontrol penyusunan yang didokumentasikan untuk mengikuti kondisi tepi dan bentang.', 'Adjust the bar arrangement', 'Use the documented layout controls to follow edge and span conditions.', 'slab-main-04.webp'),
    a('Periksa hasil pada pelat', 'Bandingkan arah, spacing, dan cakupan dengan gambar sumber.', 'Check the slab result', 'Compare direction, spacing and coverage with the source drawing.', 'slab-main-05.webp')]],
  ['slab-support-bars', 'Menyusun Tulangan Tumpuan Pelat', 'Arrange Slab Support Bars', 'Menempatkan tulangan tumpuan pada garis dan rentang yang sesuai.', 'Place slab support bars on the correct lines and ranges.', '146-147', [
    a('Tentukan garis tumpuan', 'Pilih support yang sesuai dengan detail tulangan negatif atau tumpuan.', 'Define the support line', 'Select the support that matches the negative or support reinforcement detail.', 'slab-support-01.webp'),
    a('Masukkan data tulangan tumpuan', 'Gunakan diameter, spacing, dan rentang yang tercantum pada dokumen sumber.', 'Enter support-bar data', 'Use the diameter, spacing and range stated in the source documents.', 'slab-support-02.webp'),
    a('Atur cakupan penempatan', 'Pastikan panjang dan sisi penempatan mengikuti kondisi tumpuan.', 'Set the placement extent', 'Ensure placement length and side follow the support condition.', 'slab-support-03.webp'),
    a('Periksa hubungan dengan tulangan utama', 'Tinjau apakah susunan tumpuan dan tulangan utama mencakup area yang semestinya.', 'Check the relationship to main bars', 'Review whether support and main-bar layouts cover the intended areas.', 'slab-support-04.webp')]],
  ['wall-reinforcement', 'Mendefinisikan Tulangan Dinding', 'Define Wall Reinforcement', 'Menerapkan tulangan dinding sesuai arah, lapisan, dan area model.', 'Apply wall reinforcement according to direction, layer and model area.', '149-153', [
    a('Pilih dinding yang benar', 'Periksa tipe, lantai, dan rentang dinding sebelum memasukkan reinforcement.', 'Select the correct wall', 'Check wall type, floor and extent before entering reinforcement.', 'wall-rebar-01.webp'),
    a('Definisikan tulangan vertikal', 'Masukkan data vertikal dari detail dinding yang berlaku.', 'Define vertical reinforcement', 'Enter vertical reinforcement data from the applicable wall detail.', 'wall-rebar-02.webp'),
    a('Definisikan tulangan horizontal', 'Gunakan data horizontal untuk arah dan lapisan yang ditentukan gambar.', 'Define horizontal reinforcement', 'Use the horizontal data for the direction and layer specified in the drawing.', 'wall-rebar-03.webp'),
    a('Tinjau area dan lapisan', 'Pastikan reinforcement berada pada sisi dan cakupan dinding yang benar.', 'Review areas and layers', 'Confirm that reinforcement is on the correct wall sides and extents.', 'wall-rebar-04.webp'),
    a('Periksa hasil dinding', 'Bandingkan susunan akhir dengan detail sumber sebelum melanjutkan.', 'Check the wall result', 'Compare the final arrangement with the source detail before continuing.', 'wall-rebar-05.webp')]],
  ['calculate-quantity', 'Menghitung Berdasarkan Lantai atau Elemen', 'Calculate by Floor or Entity', 'Menjalankan perhitungan dengan cakupan lantai atau elemen yang sesuai.', 'Run calculation for the appropriate floor or entity scope.', '155', [
    a('Tentukan cakupan perhitungan', 'Pilih lantai untuk cakupan menyeluruh atau elemen untuk pemeriksaan terfokus.', 'Choose the calculation scope', 'Choose floors for a broad scope or entities for a focused check.', 'calculate-quantity-01.webp'),
    a('Pilih lantai atau elemen', 'Pastikan pilihan mencakup semua model reinforcement yang perlu diperbarui.', 'Select floors or entities', 'Ensure the selection includes every reinforcement model that requires updating.', 'calculate-quantity-02.webp'),
    a('Jalankan perhitungan', 'Mulai proses setelah cakupan dan data model diperiksa.', 'Run the calculation', 'Start the process after checking the scope and model data.', 'calculate-quantity-03.webp'),
    a('Konfirmasi hasil diperbarui', 'Tunggu proses selesai sebelum membuka pemeriksaan atau laporan.', 'Confirm the result is updated', 'Wait for completion before opening checks or reports.', 'calculate-quantity-04.webp')]],
  ['verify-rebar', 'Memeriksa Tulangan dengan Edit Rebar dan Rebar 3D', 'Check Reinforcement with Edit Rebar and Rebar 3D', 'Memeriksa data dan geometri reinforcement sebelum memakai hasil kuantitas.', 'Check reinforcement data and geometry before using quantity results.', '156-157', [
    a('Pilih elemen yang diperiksa', 'Gunakan sampel yang mewakili tipe dan kondisi reinforcement penting.', 'Select an element to check', 'Use samples representing important reinforcement types and conditions.', 'verify-rebar-01.webp'),
    a('Buka Edit Rebar', 'Tinjau data batang pada elemen yang dipilih dan cocokkan dengan detail sumber.', 'Open Edit Rebar', 'Review bar data on the selected element and compare it with the source detail.', 'verify-rebar-02.webp'),
    a('Tampilkan Rebar 3D', 'Gunakan tampilan tiga dimensi untuk memeriksa posisi, arah, dan rentang batang.', 'Display Rebar 3D', 'Use the three-dimensional view to check bar positions, directions and extents.', 'verify-rebar-03.webp'),
    a('Catat dan perbaiki temuan', 'Koreksi data sumber model sebelum menghitung ulang kuantitas yang terdampak.', 'Record and correct findings', 'Correct source model data before recalculating affected quantities.', 'verify-rebar-04.webp')]],
  ['review-quantity', 'Meninjau Hasil Kuantitas Tulangan', 'Review Reinforcement Quantity Results', 'Menelusuri hasil reinforcement quantity pada model yang telah dihitung.', 'Review reinforcement quantity results in the calculated model.', '158', [
    a('Pastikan perhitungan terbaru', 'Gunakan hasil yang diperbarui setelah perubahan terakhir pada model reinforcement.', 'Confirm calculation is current', 'Use results updated after the latest reinforcement model changes.', 'review-quantity-01.webp'),
    a('Buka View Quantity', 'Tampilkan hasil kuantitas untuk elemen atau cakupan yang sedang diperiksa.', 'Open View Quantity', 'Display quantity results for the element or scope under review.', 'review-quantity-02.webp'),
    a('Tinjau rincian hasil', 'Periksa jenis batang, nilai, dan unit terhadap elemen model yang dipilih.', 'Review result details', 'Check bar types, values and units against the selected model element.', 'review-quantity-03.webp'),
    a('Lakukan pemeriksaan sampel', 'Bandingkan beberapa hasil dengan data model sebelum membuat laporan.', 'Perform sample checks', 'Compare representative results with model data before creating a report.', 'review-quantity-04.webp')]],
  ['quantity-reports', 'Mengelompokkan Kuantitas dan Membuat Laporan', 'Classify Quantities and Create Reports', 'Mengatur klasifikasi dan menghasilkan laporan reinforcement yang dapat ditinjau.', 'Configure classification and produce a reviewable reinforcement report.', '159-160', [
    a('Buka Set Classification Condition', 'Gunakan perintah TRB ini untuk menentukan struktur pengelompokan hasil.', 'Open Set Classification Condition', 'Use this TRB command to define the grouping structure for results.', 'quantity-report-01.webp'),
    a('Pilih kondisi klasifikasi', 'Susun atribut yang diperlukan sesuai tujuan laporan dan standar proyek.', 'Choose classification conditions', 'Arrange the required attributes for the report purpose and project standard.', 'quantity-report-02.webp'),
    a('Terapkan pengelompokan', 'Periksa hierarki hasil sebelum menghasilkan keluaran akhir.', 'Apply the grouping', 'Review the resulting hierarchy before generating the final output.', 'quantity-report-03.webp'),
    a('Buat laporan', 'Hasilkan laporan reinforcement weight dengan cakupan dan unit yang telah diperiksa.', 'Create the report', 'Generate the reinforcement-weight report with verified scope and units.', 'quantity-report-04.webp'),
    a('Verifikasi laporan akhir', 'Periksa total, klasifikasi, unit, dan revisi sebelum laporan digunakan.', 'Verify the final report', 'Check totals, classifications, units and revision before the report is used.', 'quantity-report-05.webp')]],
]

const partDefinitions = {
  id: [['01', 'Persiapan Model', 'Transfer model TAS dan siapkan gambar yang diperlukan di TRB.'], ['02', 'Pemodelan Tulangan', 'Definisikan dan periksa reinforcement untuk elemen utama.'], ['03', 'Verifikasi Kuantitas dan Laporan', 'Hitung, validasi, kelompokkan, dan laporkan hasil reinforcement.']],
  en: [['01', 'Model Preparation', 'Transfer the TAS model and prepare the required drawings in TRB.'], ['02', 'Rebar Modelling', 'Define and check reinforcement for the main elements.'], ['03', 'Quantity Verification and Reports', 'Calculate, validate, classify and report reinforcement results.']],
}

const partRanges = [[0, 4], [4, 14], [14, 18]]

const manualPageByAction = {
  'export-tas-model': [103, 104, 104, 105],
  'import-tas-model': [106, 106, 106, 106],
  'match-import-settings': [107, 107, 108, 108],
  'prepare-trb-drawings': [109, 109, 110, 110],
  'pile-cap-reinforcement': [112, 113, 113, 113],
  'pile-cap-data-check': [114, 114, 115, 115],
  'column-reinforcement': [117, 118, 119, 119],
  'column-schedule': [123, 124, 125, 126, 127],
  'beam-side-label': [129, 130, 130, 131],
  'beam-schedule': [134, 135, 136, 137, 137],
  'beam-support-layout': [138, 133, 133, 138],
  'slab-main-bars': [140, 141, 142, 144, 145],
  'slab-support-bars': [146, 146, 147, 147],
  'wall-reinforcement': [149, 150, 150, 151, 152],
  'calculate-quantity': [155, 155, 155, 155],
  'verify-rebar': [156, 156, 157, 157],
  'review-quantity': [158, 158, 158, 158],
  'quantity-reports': [159, 159, 160, 160, 160],
}

const screenshotCropByPage = {
  106: { x: 0.02, y: 0.23, width: 0.96, height: 0.74, imageWidth: 2040, imageHeight: 1002 },
  107: { x: 0.22, y: 0.30, width: 0.56, height: 0.66, imageWidth: 1829, imageHeight: 991 },
  108: { x: 0.02, y: 0.31, width: 0.96, height: 0.60, imageWidth: 1832, imageHeight: 938 },
  109: { x: 0.15, y: 0.20, width: 0.71, height: 0.72, imageWidth: 1860, imageHeight: 1002 },
  110: { x: 0.02, y: 0.55, width: 0.96, height: 0.40, imageWidth: 1923, imageHeight: 764 },
  114: { x: 0.02, y: 0.28, width: 0.96, height: 0.69, imageWidth: 1696, imageHeight: 987 },
  115: { x: 0.02, y: 0.20, width: 0.96, height: 0.77, imageWidth: 1943, imageHeight: 921 },
  119: { x: 0.02, y: 0.02, width: 0.65, height: 0.96, imageWidth: 1948, imageHeight: 1002 },
  126: { x: 0.02, y: 0.02, width: 0.96, height: 0.58, imageWidth: 1958, imageHeight: 1002 },
  124: { x: 0.02, y: 0.28, width: 0.48, height: 0.58, imageWidth: 2004, imageHeight: 966 },
  125: { x: 0.02, y: 0.02, width: 0.70, height: 0.95, imageWidth: 1958, imageHeight: 1002 },
  127: { x: 0.02, y: 0.29, width: 0.96, height: 0.68, imageWidth: 1721, imageHeight: 987 },
  131: { x: 0.02, y: 0.28, width: 0.96, height: 0.69, imageWidth: 1946, imageHeight: 963 },
  133: { x: 0.02, y: 0.30, width: 0.96, height: 0.67, imageWidth: 2025, imageHeight: 1002 },
  135: { x: 0.52, y: 0.02, width: 0.46, height: 0.95, imageWidth: 2048, imageHeight: 1002 },
  136: { x: 0.02, y: 0.02, width: 0.68, height: 0.95, imageWidth: 1981, imageHeight: 965 },
  137: { x: 0.02, y: 0.02, width: 0.96, height: 0.76, imageWidth: 2033, imageHeight: 891 },
  138: { x: 0.02, y: 0.02, width: 0.46, height: 0.95, imageWidth: 1470, imageHeight: 971 },
  130: { x: 0.02, y: 0.02, width: 0.96, height: 0.52, imageWidth: 1870, imageHeight: 1000 },
  147: { x: 0.02, y: 0.28, width: 0.96, height: 0.69, imageWidth: 1849, imageHeight: 987 },
  150: { x: 0.02, y: 0.02, width: 0.96, height: 0.80, imageWidth: 1409, imageHeight: 894 },
  155: { x: 0.02, y: 0.02, width: 0.48, height: 0.84, imageWidth: 1514, imageHeight: 981 },
  157: { x: 0.02, y: 0.28, width: 0.96, height: 0.69, imageWidth: 1893, imageHeight: 1002 },
  159: { x: 0.02, y: 0.02, width: 0.96, height: 0.68, imageWidth: 1965, imageHeight: 969 },
  160: { x: 0.02, y: 0.13, width: 0.96, height: 0.84, imageWidth: 2007, imageHeight: 1000 },
}

const imageStepTextByPage = {
  106: {
    id: ['Step 1: Buat proyek TRB baru.', 'Step 2: Pada tab BIM MODEL, pilih Import Model.', 'Step 3: Pilih file model, lalu klik OK untuk menyelesaikan.'],
    en: ['Step 1: Create a new TRB project.', 'Step 2: On the BIM MODEL tab, select Import Model.', 'Step 3: Select the model file, then click OK to finish.'],
  },
  107: {
    id: ['Step 1: Gunakan zone dari project yang diimpor, atau pertahankan zone project saat ini dan buat zone baru dari project yang diimpor.', 'Step 2: Centang Use floor height in TAS project.', 'Step 3: Pilih Next Step.'],
    en: ['Step 1: Use the zone from the imported project, or keep the current project zone and create a new zone from the imported project.', 'Step 2: Tick Use floor height in TAS project.', 'Step 3: Select Next Step.'],
  },
  108: {
    id: ['Step 1: Pilih All Floors untuk diimpor.', 'Step 2: Pilih All Elements untuk diimpor.', 'Step 3: Pilih Next Step.'],
    en: ['Step 1: Select All Floors to import.', 'Step 2: Select All Elements to import.', 'Step 3: Select Next Step.'],
  },
  109: {
    id: ['Step 1: Tekan F12 atau klik kontrol yang ditandai untuk membuka pengaturan tampilan elemen, lalu centang semua elemen.', 'Step 2: Klik dua kali untuk menampilkan building plan.'],
    en: ['Step 1: Press F12 or click the marked control to open entity display settings, then tick all elements.', 'Step 2: Double-click to show the building plan.'],
  },
  110: {
    id: ['Step 1: Pada tab IDENTIFY, pilih Add Drawing.', 'Step 2: Pilih Split drawing.', 'Step 3: Pilih Relocate drawing.'],
    en: ['Step 1: On the IDENTIFY tab, select Add Drawing.', 'Step 2: Select Split drawing.', 'Step 3: Select Relocate drawing.'],
  },
  114: {
    id: ['Step 1: Pada tab {Tool}, klik [Rebar Data Check].', 'Step 2: Pilih Range dan Element.', 'Step 3: Klik dua kali temuan untuk menuju elemen bermasalah.'],
    en: ['Step 1: On the {Tool} tab, click [Rebar Data Check].', 'Step 2: Select the Range and Element.', 'Step 3: Double-click a finding to navigate to the problematic entity.'],
  },
  113: {
    id: ['Edit data tulangan dengan mengklik teks hijau pada diagram. Untuk spacing, contoh manual dapat ditulis d19-150 tanpa tanda @.', 'Cover bawah/samping/atas ditampilkan sebagai 50/50/20.', 'Pilih No pada Deduct Top Bar Of Slab/Raft jika tulangan pelat atas dan bawah menerus melewati pile cap.'],
    en: ['Edit reinforcement data by clicking the green text in the diagram. For spacing, the manual example can be entered as d19-150 without the @ sign.', 'Bottom/side/top cover is shown as 50/50/20.', 'Choose No for Deduct Top Bar Of Slab/Raft when the top and bottom slab bars continue through the pile cap.'],
  },
  115: {
    id: ['Step 1: Pada daftar elemen pile cap, klik New lalu pilih parametric pile cap.', 'Step 2: Pilih bentuk yang sesuai dengan pile cap yang akan dimodelkan.', 'Step 3: Masukkan informasi tulangan dan bentuk di attribute editor.'],
    en: ['Step 1: In the pile-cap element list, click New and choose parametric pile cap.', 'Step 2: Choose the shape that matches the pile cap to model.', 'Step 3: Enter the reinforcement and shape information in the attribute editor.'],
  },
  119: {
    id: ['Step 1: Untuk tulangan utama, klik [Corner Bar] atau [Side Bar], lalu isi Rebar Info.', 'Step 2: Untuk link/sengkang, klik [Draw Link] lalu isi Rebar Info.', 'Catatan: Gunakan tombol (…) pada nilai atribut untuk melihat format input yang tersedia.'],
    en: ['Step 1: For main bars, click [Corner Bar] or [Side Bar], then fill in Rebar Info.', 'Step 2: For links, click [Draw Link], then fill in Rebar Info.', 'Note: Use the (…) button in the attribute value to review available input formats.'],
  },
  124: {
    id: ['Step 1: Siapkan schedule di Excel.', 'Step 2: Buka Identify Schedule untuk mengimpor Excel.', 'Step 3: Cocokkan heading TRB dengan heading pada Excel.', 'Step 4: Klik kanan teks heading Excel pada baris kedua, lalu pilih Delete > Delete Row.'],
    en: ['Step 1: Prepare the schedule in Excel.', 'Step 2: Open Identify Schedule to import the Excel file.', 'Step 3: Match the TRB heading to the Excel heading.', 'Step 4: Right-click the Excel heading text in row two, then choose Delete > Delete Row.'],
  },
  125: {
    id: ['Step 5: Pada sel Floor setiap kolom, pilih lantai yang sesuai lalu klik OK.', 'Step 6: Blok semua baris kosong lalu hapus baris tersebut.', 'Step 7: Klik Generate in Column Schedule.'],
    en: ['Step 5: In the Floor cell for each column, choose the correct floor and click OK.', 'Step 6: Select all empty rows and delete them.', 'Step 7: Click Generate in Column Schedule.'],
  },
  126: {
    id: ['Informasi tambahan: schedule kolom juga dapat dipakai untuk memasukkan tulangan. Buat kolom baru, isi data, lalu gunakan Generate Element untuk menggambar kolom.', 'Untuk elemen yang sudah dimodelkan, gunakan Generate from Element untuk mengambil informasinya ke schedule, lalu [Sync to Entity] untuk menyinkronkan data tulangan.'],
    en: ['Additional information: the column schedule can also be used to enter reinforcement. Create a new column, enter the data, then use Generate Element to draw the column.', 'For elements already modelled, use Generate from Element to bring their information into the schedule, then [Sync to Entity] to synchronise reinforcement data.'],
  },
  127: {
    id: ['Step 1: Pada tab {Draw}, klik [Column Schedule].', 'Step 2: Klik [Generate from Element] untuk membuat informasi semua kolom yang telah didefinisikan.', 'Step 3: Tinjau atau ubah data bila perlu, lalu klik [Sync to Entity].'],
    en: ['Step 1: On the {Draw} tab, click [Column Schedule].', 'Step 2: Click [Generate from Element] to generate information for all defined columns.', 'Step 3: Review or edit the data if needed, then click [Sync to Entity].'],
  },
  131: {
    id: ['Step 1: Pada tab {Draw}, klik [Side Label].', 'Step 2: Pilih balok.', 'Step 3: Masukkan Rebar Info.'],
    en: ['Step 1: On the {Draw} tab, click [Side Label].', 'Step 2: Select the beam.', 'Step 3: Enter Rebar Info.'],
  },
  130: {
    id: ['Tanda + menggabungkan batang pada lapisan yang sama; tanda / memisahkan batang pada lapisan berbeda.', 'Jika informasi side bar hanya menunjukkan satu sisi, masukkan jumlah total batang side bar.'],
    en: ['The + sign combines bars in the same layer; the / sign separates bars in different layers.', 'If side-bar information shows only one side, enter the total number of side bars.'],
  },
  133: {
    id: ['Step 1: Pada tab {Quantity}, pilih [Calculate] atau [Calculate Selected Entity].', 'Step 2: Klik [Rebar Layout].', 'Step 3: Pilih balok.', 'Step 4: Periksa susunan tulangan. Gunakan Apply to all bila berlaku untuk semua elemen terkait.'],
    en: ['Step 1: On the {Quantity} tab, select [Calculate] or [Calculate Selected Entity].', 'Step 2: Click [Rebar Layout].', 'Step 3: Select the beam.', 'Step 4: Check the reinforcement arrangement. Use Apply to all when it applies to all related entities.'],
  },
  135: {
    id: ['Step 1: Siapkan tabel beam schedule di Excel.', 'Step 2: Buka Identify Schedule.', 'Step 3: Cocokkan heading schedule dengan kolom Excel, lalu hapus baris heading Excel kedua.', 'Step 4: Klik Generate in Beam Schedule.', 'Step 5: Klik Sync Beam Info dan pilih sinkronisasi ke entity.'],
    en: ['Step 1: Prepare the beam schedule table in Excel.', 'Step 2: Open Identify Schedule.', 'Step 3: Match schedule headings to the Excel columns, then delete the second Excel heading row.', 'Step 4: Click Generate in Beam Schedule.', 'Step 5: Click Sync Beam Info and choose to synchronise to the entity.'],
  },
  136: {
    id: ['Step 1: Buka Identify Schedule dan siapkan tabel sumber.', 'Step 2: Pilih heading yang sesuai untuk setiap kolom schedule.', 'Step 3: Hapus baris heading Excel kedua.', 'Step 4: Klik Generate in Beam Schedule.', 'Step 5: Untuk balok yang belum dimodelkan, klik Generate Element.', 'Step 6: Untuk balok yang sudah dimodelkan, klik Sync Beam Info.'],
    en: ['Step 1: Open Identify Schedule and prepare the source table.', 'Step 2: Select the matching heading for each schedule column.', 'Step 3: Delete the second Excel heading row.', 'Step 4: Click Generate in Beam Schedule.', 'Step 5: For beams not yet modelled, click Generate Element.', 'Step 6: For beams already modelled, click Sync Beam Info.'],
  },
  137: {
    id: ['Pilih Generate Element jika balok belum dimodelkan. Jika balok sudah ada, gunakan Sync Beam Info untuk memperbarui informasinya.'],
    en: ['Choose Generate Element if the beam is not yet modelled. If it already exists, use Sync Beam Info to update its information.'],
  },
  138: {
    id: ['Support balok dapat dikenali dari kolom atau dinding di lantai bawah, balok dengan ukuran lebih besar atau sama, foundation, dan slab.', 'Untuk mengatur support, klik kanan balok lalu pilih Batch Identify Support, Re-pick Span (F), Set Beam Support (Q), atau Delete Beam Support (J) sesuai kebutuhan.'],
    en: ['Beam supports may be identified from columns or walls on the floor below, larger or same-size beams, foundations, and slabs.', 'To manage supports, right-click a beam and choose Batch Identify Support, Re-pick Span (F), Set Beam Support (Q), or Delete Beam Support (J) as needed.'],
  },
  142: {
    id: ['Step 1: Klik Slab Main Bars.', 'Step 2: Pada fungsi {Draw}, klik [Parametric Arrangement].', 'Step 3: Pilih tipe pelat/raft.', 'Step 4: Pilih tipe susunan tulangan.', 'Step 5: Masukkan data tulangan.', 'Step 6: Klik Generate.'],
    en: ['Step 1: Click Slab Main Bars.', 'Step 2: In the {Draw} function, click [Parametric Arrangement].', 'Step 3: Select the slab/raft type.', 'Step 4: Select the reinforcement arrangement type.', 'Step 5: Enter the reinforcement data.', 'Step 6: Click Generate.'],
  },
  147: {
    id: ['Step 1: Pada tab {Draw}, klik [Arrange by Beam].', 'Step 2: Klik balok.', 'Step 3 (opsional): Jika panjang kedua sisi berbeda, klik sisi kiri balok.'],
    en: ['Step 1: On the {Draw} tab, click [Arrange by Beam].', 'Step 2: Click the beam.', 'Step 3 (optional): If the two sides have different lengths, click the left side of the beam.'],
  },
  150: {
    id: ['Pada Project Settings > Calculation Rules, atur kondisi ujung dinding dengan kolom agar sesuai dengan detail proyek.'],
    en: ['In Project Settings > Calculation Rules, set the wall-end condition with a column to match the project detail.'],
  },
  155: {
    id: ['Step 1: Untuk menghitung berdasarkan lantai, pilih lantai lalu klik [Calculate].', 'Step 2: Untuk menghitung elemen tertentu, klik kanan elemen dan pilih [Calculate Selected Entity].'],
    en: ['Step 1: To calculate by floor, select the floors and click [Calculate].', 'Step 2: To calculate a specific entity, right-click it and choose [Calculate Selected Entity].'],
  },
  157: {
    id: ['Klik [Rebar Layout], lalu pilih elemen yang sudah dihitung untuk meninjau susunan tulangannya.'],
    en: ['Click [Rebar Layout], then select an entity that has already been calculated to review its reinforcement layout.'],
  },
  159: {
    id: ['Untuk membuat ulang laporan, klik [Set Classification Condition].', 'Pilih atribut klasifikasi yang diperlukan, lalu gunakan Move Up atau Move Down untuk mengatur urutannya.'],
    en: ['To regenerate the report, click [Set Classification Condition].', 'Select the required classification attributes, then use Move Up or Move Down to set their order.'],
  },
  160: {
    id: ['Contoh laporan mencakup Rebar Schedule, Element Rebar Schedule by Summary Info, Element Rebar Schedule by Floor, Summary Reports, dan Custom Report.'],
    en: ['Report examples include Rebar Schedule, Element Rebar Schedule by Summary Info, Element Rebar Schedule by Floor, Summary Reports, and Custom Report.'],
  },
}

const groupedActionTitles = {
  'export-tas-model': {
    104: { id: 'Pilih metode ekspor model', en: 'Choose an export method' },
  },
  'import-tas-model': {
    106: { id: 'Impor model TAS ke proyek TRB', en: 'Import the TAS model into TRB' },
  },
  'match-import-settings': {
    107: { id: 'Sesuaikan zone dan tinggi lantai', en: 'Match zones and floor heights' },
    108: { id: 'Pilih lantai dan elemen untuk diimpor', en: 'Select floors and elements to import' },
  },
  'prepare-trb-drawings': {
    109: { id: 'Periksa tampilan model yang diimpor', en: 'Check the display of the imported model' },
    110: { id: 'Tambahkan, pisahkan, dan pindahkan drawing', en: 'Add, split and relocate the drawing' },
  },
  'pile-cap-data-check': {
    114: { id: 'Temukan dan periksa data tulangan', en: 'Find and review reinforcement data' },
    115: { id: 'Buat pile cap dengan bentuk khusus', en: 'Create a pile cap with a custom shape' },
  },
  'pile-cap-reinforcement': {
    113: { id: 'Masukkan dan tinjau data tulangan pile cap', en: 'Enter and review pile-cap reinforcement data' },
  },
  'column-reinforcement': {
    119: { id: 'Masukkan tulangan utama dan link kolom', en: 'Enter column main bars and links' },
  },
  'beam-side-label': {
    130: { id: 'Baca notasi dan tips Side Label', en: 'Interpret Side Label notation and tips' },
  },
  'beam-schedule': {
    137: { id: 'Hasilkan atau sinkronkan balok', en: 'Generate or synchronise beams' },
  },
  'beam-support-layout': {
    133: { id: 'Periksa dan susun tulangan balok', en: 'Check and arrange beam reinforcement' },
  },
  'slab-support-bars': {
    146: { id: 'Tentukan garis dan data tulangan tumpuan', en: 'Define the support line and bar data' },
    147: { id: 'Atur dan tinjau tulangan tumpuan', en: 'Arrange and review support bars' },
  },
  'wall-reinforcement': {
    150: { id: 'Atur dan periksa tulangan dinding', en: 'Set and check wall reinforcement' },
  },
  'calculate-quantity': {
    155: { id: 'Hitung kuantitas berdasarkan lantai atau elemen', en: 'Calculate quantity by floor or entity' },
  },
  'verify-rebar': {
    156: { id: 'Periksa data dan geometri tulangan', en: 'Check reinforcement data and geometry' },
    157: { id: 'Tinjau susunan tulangan', en: 'Review the reinforcement layout' },
  },
  'review-quantity': {
    158: { id: 'Tinjau hasil kuantitas tulangan', en: 'Review reinforcement quantity results' },
  },
  'quantity-reports': {
    159: { id: 'Atur klasifikasi laporan', en: 'Set report classification' },
    160: { id: 'Tinjau jenis laporan tulangan', en: 'Review reinforcement report types' },
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
    const page = Number(image.match(/page-(\d+)\.png$/)?.[1])
    const extractedText = imageStepTextByPage[page]?.[language] || []
    return {
      ...first,
      id: `${stepId}-image-${index + 1}`,
      number: index + 1,
      title: groupedActions.length > 1 ? groupedActionTitles[stepId]?.[page]?.[language] || first.title : first.title,
      description: [...extractedText, ...groupedActions.map((action) => `${action.title} - ${action.description}`)].join('\n'),
      instructionFormat: extractedText.length ? 'numbered' : undefined,
      crop: screenshotCropByPage[page],
    }
  })
}

export function getTrbData(language) {
  const isId = language === 'id'
  const tutorialParts = partDefinitions[language].map(([number, title, summary], partIndex) => ({
    id: `part-${partIndex + 1}`, number, title, summary, workflow: [],
    steps: lessons.slice(...partRanges[partIndex]).map(([id, titleId, titleEn, introId, introEn, pages, actions]) => ({
      id, title: isId ? titleId : titleEn, intro: isId ? introId : introEn, duration: `${actions.length * 2} min`, manualPages: pages,
      instructions: actions.map((item) => isId ? item.titleId : item.titleEn),
      actions: actions.map((item, index) => {
        const manualPage = manualPageByAction[id][index]
        const screenshotCopy = getScreenshotCopy('trb', manualPage, language)
        return { id: `${id}-action-${index + 1}`, number: index + 1, title: isId ? item.titleId : item.titleEn, description: isId ? item.descriptionId : item.descriptionEn, image: `/tutorial/trb/processed/page-${manualPage}.png`, imageAlt: screenshotCopy.alt, alt: screenshotCopy.alt, caption: screenshotCopy.caption, requiredDescription: '', pending: false }
      }),
      checks: isId ? ['Tindakan telah dicocokkan dengan dokumen sumber', 'Data dan cakupan elemen telah diperiksa', 'Hasil siap digunakan pada langkah berikutnya'] : ['Actions were checked against the source document', 'Element data and scope were reviewed', 'The result is ready for the next step'],
    })),
  }))
  tutorialParts[0].steps.forEach((step) => {
    step.actions = groupActionsByImage(step.actions, step.id, language)
    step.showInstructionsBelowImage = true
  })
  tutorialParts[1].steps.forEach((step) => {
    step.actions = groupActionsByImage(step.actions, step.id, language)
    step.showInstructionsBelowImage = true
  })
  tutorialParts[2].steps.forEach((step) => {
    step.actions = groupActionsByImage(step.actions, step.id, language)
    step.showInstructionsBelowImage = true
  })
  const allSteps = tutorialParts.flatMap((part) => part.steps.map((step, index) => ({ ...step, partId: part.id, partTitle: part.title, partNumber: part.number, stepNumber: index + 1 })))
  return { id: 'trb', title: isId ? 'Tutorial Teknis Cubicost TRB' : 'Cubicost TRB Technical Tutorial', intro: isId ? 'Pelajari alur kerja pembesian mulai dari persiapan proyek dan pengaturan tulangan hingga perhitungan serta laporan kuantitas.' : 'Learn the rebar workflow from project preparation and reinforcement settings through quantity calculation and reporting.', tutorialParts, allSteps, lessonCount: allSteps.length, status: 'available' }
}
