import { buildAllSteps } from './tutorialUtils.js'

export const tutorialParts = [
  { id: 'part-1', number: '01', shortTitle: 'Persiapan proyek', title: 'Pengaturan Lantai dan Skala Gambar', summary: 'Bangun dasar proyek yang andal sebelum membuat elemen model.', workflow: ['Pengaturan', 'Impor', 'Skala', 'Verifikasi'], steps: [
    { id: 'create-project', title: 'Membuat atau Membuka Proyek TAS', duration: '4 menit', screenshot: null, intro: 'Mulai dengan informasi proyek yang sesuai dengan dokumen kontrak dan standar pengukuran.', instructions: ['Buat proyek TAS baru atau buka proyek yang sudah tersedia.', 'Periksa nama dan lokasi proyek agar file keluaran mudah dikenali.', 'Tinjau aturan perhitungan dan pastikan sesuai dengan persyaratan proyek.', 'Pastikan satuan proyek sudah benar sebelum mengimpor gambar.'], note: 'Satuan proyek menentukan cara TAS membaca jarak pada gambar yang diimpor.', warning: 'Perubahan satuan setelah pemodelan dimulai dapat membuat dimensi dan kuantitas tidak valid.', checks: ['Identitas proyek sudah benar', 'Aturan perhitungan sudah dikonfirmasi', 'Satuan sesuai dengan gambar sumber'] },
    { id: 'floor-settings', title: 'Mengatur Lantai pada Floor Settings', duration: '6 menit', screenshot: { file: 'floor-settings.jpg', title: 'Dialog Floor Settings', description: 'Tampilkan daftar lantai beserta kolom nama, tinggi lantai, dan elevasi.' }, intro: 'Tentukan susunan vertikal bangunan agar setiap elemen dibuat pada level yang benar.', instructions: ['Buka menu Floor Settings.', 'Tambahkan seluruh lantai sesuai gambar bangunan.', 'Masukkan nama lantai, tinggi lantai, dan elevasi untuk setiap level.', 'Bandingkan kembali urutan lantai dan nilai elevasinya dengan gambar arsitektur dan struktur.'], note: 'Tinggi lantai adalah jarak vertikal yang ditetapkan untuk satu tingkat. Elevasi lantai adalah level absolut lantai terhadap datum proyek.', warning: 'Tinggi lantai yang benar tetap dapat menempatkan elemen pada level yang salah jika elevasinya keliru.', checks: ['Seluruh lantai sudah dibuat', 'Tinggi dan elevasi dibedakan dengan benar', 'Level sesuai dengan gambar'] },
    { id: 'import-drawing', title: 'Mengimpor Gambar', duration: '4 menit', screenshot: { file: 'import-drawing.jpg', title: 'Impor gambar', description: 'Tampilkan kontrol impor dan lantai tujuan yang sedang aktif.' }, intro: 'Tempatkan setiap gambar sumber pada lantai yang diwakilinya.', instructions: ['Pilih lantai yang sesuai sebelum mengimpor gambar.', 'Impor gambar arsitektur atau struktur yang diperlukan.', 'Pastikan nama, visibilitas, dan posisi gambar benar pada lantai aktif.', 'Periksa kembali lantai tujuan sebelum memulai identifikasi atau pemodelan.'], warning: 'Gambar yang ditempatkan pada lantai yang salah dapat menyebabkan elemen salah posisi dan kesalahan pemodelan.', checks: ['Lantai yang benar sedang aktif', 'Gambar terlihat dengan baik', 'Gambar sesuai dengan level yang dipilih'] },
    { id: 'set-scale', title: 'Mengatur Skala Gambar', duration: '5 menit', screenshot: { file: 'drawing-scale.jpg', title: 'Kalibrasi skala gambar', description: 'Tampilkan dua titik kalibrasi yang dipilih dan kolom jarak sebenarnya.' }, intro: 'Kalibrasikan gambar yang diimpor menggunakan dimensi yang dapat dipercaya.', instructions: ['Pilih dua titik presisi yang memiliki dimensi gambar yang diketahui.', 'Tentukan titik kalibrasi pertama dan kedua.', 'Masukkan jarak sebenarnya menggunakan satuan proyek.', 'Terapkan koreksi skala dan biarkan TAS menyesuaikan gambar.'], note: 'Jarak grid yang panjang dan memiliki dimensi jelas biasanya lebih andal daripada detail kecil.', warning: 'Kesalahan skala akan memengaruhi seluruh hasil panjang, luas, volume, dan kuantitas.', checks: ['Titik acuan dipilih dengan presisi', 'Jarak sebenarnya memakai satuan proyek', 'Koreksi skala sudah diterapkan'] },
    { id: 'verify-scale', title: 'Memverifikasi Skala', duration: '3 menit', screenshot: null, intro: 'Gunakan dimensi independen untuk membuktikan bahwa kalibrasi sudah benar.', instructions: ['Ukur satu grid, ruangan, atau dimensi struktur yang tidak dipakai saat kalibrasi.', 'Bandingkan hasil pengukuran TAS dengan dimensi tertulis pada gambar.', 'Jika berbeda, periksa kembali titik acuan, satuan, dan skala gambar sumber.', 'Lanjutkan pemodelan hanya setelah kedua nilai tersebut sesuai.'], note: 'Verifikasi merupakan gerbang kendali mutu, bukan pemeriksaan tambahan yang opsional.', checks: ['Dimensi independen sudah diukur', 'Nilai TAS dan gambar sudah sesuai', 'Skala disetujui untuk pemodelan'] },
  ]},
  { id: 'part-2', number: '02', shortTitle: 'Elemen model', title: 'Identifikasi Kolom, Balok, Pelat, Bukaan, dan Finishing', summary: 'Identifikasi elemen struktur dan arsitektur berdasarkan urutan ketergantungannya.', workflow: ['Identify Column', 'Identify Beam', 'Identify Slab', 'Openings', 'Finishes'], steps: [
    { id: 'identify-columns', title: 'Mengidentifikasi Kolom', duration: '7 menit', screenshot: { file: 'identify-column.jpg', title: 'Identify Column', description: 'Tampilkan gambar kolom yang dipilih, pemetaan label, dan hasil kolom 3D.' }, intro: 'Kolom menjadi penumpu utama dan perlu dibuat sebelum elemen yang bergantung padanya.', instructions: ['Buka Identify Column.', 'Pilih atau lakukan block selection pada gambar kolom yang relevan.', 'Petakan label dan dimensi kolom.', 'Periksa tipe, ukuran, tinggi, elevasi, dan lantai kolom.', 'Generate kolom, lalu periksa ukuran dan posisinya pada tampilan 3D.'], note: 'Gunakan tampilan 3D untuk menemukan level yang salah serta kolom yang terputar atau terduplikasi.', checks: ['Label dan ukuran sudah dipetakan', 'Lantai dan elevasi sudah benar', 'Kolom lolos pemeriksaan 3D'] },
    { id: 'identify-beams', title: 'Mengidentifikasi Balok', duration: '7 menit', screenshot: { file: 'identify-beam.jpg', title: 'Identify Beam', description: 'Tampilkan pemilihan garis dan label balok serta sambungan balok-kolom pada tampilan 3D.' }, intro: 'Gunakan susunan kolom yang sudah terbentuk untuk mengidentifikasi balok penghubung.', instructions: ['Buka Identify Beam.', 'Pilih garis dan label balok yang terkait.', 'Periksa lebar, tinggi, level, dan elevasi balok.', 'Generate balok.', 'Periksa sambungan balok dan kolom pada tampilan 3D.'], warning: 'Balok yang terputus atau memiliki offset vertikal dapat menghambat pengenalan batas pelat.', checks: ['Garis dan label sudah dipasangkan', 'Dimensi dan level sudah benar', 'Sambungan lolos pemeriksaan 3D'] },
    { id: 'identify-slabs', title: 'Mengidentifikasi Pelat Lantai', duration: '7 menit', screenshot: { file: 'identify-slab.jpg', title: 'Identify Slab', description: 'Tampilkan batas pelat tertutup, elemen penumpu, tebal, dan opsi elevasi.' }, intro: 'Pengenalan pelat bergantung pada batas yang lengkap dan elemen penumpu yang benar.', instructions: ['Pastikan kolom, dinding, dan balok sudah dibuat.', 'Buka Identify Slab dan pilih area yang dimaksud.', 'Periksa batas pelat dan elemen penumpunya.', 'Tinjau opsi identifikasi pelat.', 'Periksa tebal dan elevasi pelat, lalu generate pelat dan tinjau hasilnya.'], note: 'Perbaiki celah atau tumpang tindih pada geometri penumpu sebelum memaksakan identifikasi.', checks: ['Elemen penumpu sudah tersedia', 'Batas pelat sudah tertutup', 'Tebal dan elevasi sudah diverifikasi'] },
    { id: 'identify-openings', title: 'Mengidentifikasi Bukaan Pintu dan Jendela', duration: '8 menit', screenshot: { file: 'identify-openings.jpg', title: 'Identify Door and Window Schedule', description: 'Tampilkan pemetaan tabel dan bukaan yang sudah ditempatkan pada dinding.' }, intro: 'Buat tipe bukaan yang konsisten dari tabel, kemudian tempatkan pada model.', instructions: ['Buka Identify Door and Window Schedule.', 'Lakukan block selection pada tabel pintu dan jendela.', 'Petakan kolom tipe, lebar, tinggi, dan tinggi ambang.', 'Generate tipe bukaan pintu dan jendela.', 'Tempatkan bukaan pada dinding yang benar.', 'Periksa posisi dan ukurannya pada tampilan 3D.'], warning: 'Tabel yang akurat tidak dapat memperbaiki bukaan yang ditempatkan pada dinding atau lantai yang salah.', checks: ['Kolom tabel sudah dipetakan', 'Tipe bukaan sudah dibuat', 'Posisi dan dimensi lolos pemeriksaan 3D'] },
    { id: 'apply-finishes', title: 'Menerapkan Finishing', duration: '8 menit', screenshot: { file: 'apply-finishes.jpg', title: 'Finishing ruangan', description: 'Tampilkan ruangan terpilih dan definisi finishing lantai, dinding, skirting, serta plafon.' }, intro: 'Gunakan batas ruangan untuk menerapkan kuantitas finishing secara terkoordinasi.', instructions: ['Buat atau identifikasi ruangan dengan batas yang lengkap.', 'Tentukan tipe finishing lantai, dinding, skirting, dan plafon.', 'Terapkan finishing pada ruangan yang sesuai.', 'Periksa tinggi, posisi, dan batas finishing.', 'Pastikan bukaan dan batas ruangan memengaruhi finishing dengan benar.'], note: 'Keandalan kuantitas finishing bergantung pada ketepatan batas ruangan dan data bukaan.', checks: ['Ruangan memiliki batas tertutup', 'Tipe finishing sudah diterapkan', 'Bukaan memengaruhi finishing dengan benar'] },
  ]},
  { id: 'part-3', number: '03', shortTitle: 'Kuantitas & laporan', title: 'Aturan Pengukuran, Kuantitas, dan Laporan', summary: 'Telusuri pengurangan, sesuaikan aturan dengan cermat, hitung ulang, dan terbitkan laporan yang telah diverifikasi.', workflow: ['Periksa', 'Sesuaikan', 'Hitung', 'Verifikasi', 'Laporkan'], steps: [
    { id: 'view-expression', title: 'Memeriksa Rumus Kuantitas', duration: '5 menit', screenshot: { file: 'view-expression.jpg', title: 'View Expression', description: 'Tampilkan elemen terpilih, rumus kuantitas, dan pengurangannya.' }, intro: 'Telusuri kuantitas sampai ke rumusnya sebelum mengubah aturan apa pun.', instructions: ['Pilih elemen model yang kuantitasnya akan diperiksa.', 'Buka View Expression.', 'Tinjau rumus kuantitas, komponen perhitungan, dan pengurangannya.', 'Identifikasi elemen berpotongan yang memengaruhi hasil perhitungan.'], note: 'Pengurangan yang terlihat membantu menentukan aturan yang relevan, tetapi bukan berarti aturan tersebut pasti salah.', checks: ['Elemen yang benar sudah dipilih', 'Rumus sudah ditinjau', 'Sumber pengurangan sudah diidentifikasi'] },
    { id: 'measurement-rules', title: 'Membuka Measurement Rules', duration: '4 menit', screenshot: { file: 'measurement-rules.jpg', title: 'Measurement Rules', description: 'Tampilkan tab Quantity, tipe elemen terpilih, deskripsi aturan, dan opsinya.' }, intro: 'Buka aturan untuk tipe elemen yang kuantitasnya sedang diukur.', instructions: ['Buka tab Quantity.', 'Pilih Measurement Rules.', 'Pilih tipe elemen yang sesuai.', 'Baca seluruh deskripsi aturan sebelum mengubah opsi.'], warning: 'Aturan sambungan yang tampak serupa dapat memengaruhi kuantitas berbeda. Pastikan tipe elemen dan deskripsinya terlebih dahulu.', checks: ['Tipe elemen yang benar sudah dipilih', 'Deskripsi aturan sudah dibaca', 'Opsi aktif sudah dicatat'] },
    { id: 'filter-deduction', title: 'Memfilter Elemen Pengurang', duration: '3 menit', screenshot: null, intro: 'Persempit daftar aturan sesuai elemen berpotongan yang sudah diidentifikasi.', instructions: ['Gunakan Filter Relevant Element.', 'Pilih hanya elemen yang menyebabkan pengurangan.', 'Pastikan aturan hasil filter menjelaskan sambungan yang dimaksud.', 'Hindari mengubah aturan sambungan lain yang tidak berkaitan.'], note: 'Perubahan aturan yang spesifik lebih mudah diverifikasi dan lebih kecil risikonya terhadap kuantitas lain.', checks: ['Elemen relevan sudah difilter', 'Sambungan sudah dikonfirmasi', 'Aturan lain tidak diubah'] },
    { id: 'change-rule', title: 'Mengubah Aturan Pengukuran', duration: '5 menit', screenshot: null, intro: 'Pilih opsi yang sesuai dengan standar pengukuran proyek.', instructions: ['Pilih opsi aturan pengukuran yang dibutuhkan untuk perpotongan tersebut.', 'Gunakan No Effect jika elemen yang berpotongan tidak boleh memengaruhi kuantitas.', 'Gunakan Calculate Occupied Volume jika volume yang ditempati perlu diperhitungkan atau dikurangkan.', 'Catat perubahan agar hasilnya dapat diperiksa setelah perhitungan ulang.'], warning: 'Perubahan aturan tidak langsung memperbarui kuantitas yang sudah dihitung.', checks: ['Opsi sesuai dengan standar', 'Cakupan perubahan dipahami', 'Perubahan sudah dicatat'] },
    { id: 'recalculate', title: 'Menghitung Ulang Kuantitas', duration: '4 menit', screenshot: { file: 'calculate-quantity.jpg', title: 'Calculate Quantity', description: 'Tampilkan Calculate atau Calculate Selected Entity beserta cakupan elemen yang terdampak.' }, intro: 'Perbarui kuantitas setelah mengubah data model atau aturan.', instructions: ['Pilih Calculate atau Calculate Selected Entity.', 'Tentukan lantai atau elemen yang terdampak.', 'Jalankan perhitungan.', 'Tunggu sampai hasil kuantitas selesai diperbarui.'], note: 'Perhitungan elemen terpilih berguna untuk menguji perubahan aturan secara cepat dan terfokus.', checks: ['Cakupan terdampak sudah dipilih', 'Perhitungan sudah selesai', 'Hasil sudah diperbarui'] },
    { id: 'verify-deduction', title: 'Memverifikasi Pengurangan dalam 3D', duration: '5 menit', comparisonAt: 5, screenshot: { file: '3d-deduction.jpg', title: '3D Deduction', description: 'Tampilkan bagian yang dikurangkan dengan sorotan pada elemen model terpilih.' }, intro: 'Gunakan tampilan model untuk memastikan bagian yang disertakan atau dikurangkan oleh rumus terbaru.', instructions: ['Buka kembali View Expression.', 'Pilih elemen dan jenis kuantitas yang akan diperiksa.', 'Klik 3D Deduction.', 'Periksa bagian model yang disorot sebagai pengurangan.', 'Pastikan perubahan kuantitas sesuai dengan aturan yang dipilih.'], warning: 'Total yang terlihat masuk akal belum cukup; verifikasi pengurangan fisiknya dalam konteks model.', checks: ['Rumus hasil hitung ulang sudah dibuka', 'Pengurangan sudah diperiksa dalam 3D', 'Hasil sesuai dengan aturan yang dimaksud'] },
    { id: 'quantity-category', title: 'Melihat Kuantitas Berdasarkan Kategori', duration: '5 menit', screenshot: { file: 'view-quantity-category.jpg', title: 'View Quantity by Category', description: 'Tampilkan hierarki kategori beserta kuantitas dan satuannya.' }, intro: 'Tinjau hasil perhitungan dalam tampilan kuantitas yang terstruktur.', instructions: ['Pastikan perhitungan kuantitas sudah dijalankan.', 'Buka View Quantity by Category.', 'Periksa kategori, kuantitas, satuan, dan susunan hierarki.', 'Lakukan pemeriksaan sampel total terhadap elemen model yang mewakili.'], note: 'Laporan kategori menggunakan kondisi model dan aturan pengukuran yang sedang aktif.', checks: ['Kuantitas sudah diperbarui', 'Hierarki sudah diperiksa', 'Satuan dan sampel total sudah diverifikasi'] },
    { id: 'configure-report', title: 'Mengatur Laporan Kuantitas', duration: '6 menit', screenshot: { file: 'report-classification.jpg', title: 'Set Classification and Quantity', description: 'Tampilkan atribut laporan yang dipilih dan kontrol urutan hierarki.' }, intro: 'Susun hierarki laporan akhir sesuai tujuan dan kebutuhan penerimanya.', instructions: ['Buka Set Classification and Quantity.', 'Pilih atribut laporan yang diperlukan.', 'Pindahkan atribut ke atas atau ke bawah untuk mengatur hierarki laporan.', 'Generate ulang laporan.', 'Verifikasi total, satuan, dan klasifikasi sebelum laporan diterbitkan.'], warning: 'Selalu validasi total laporan setelah mengubah klasifikasi atau hierarki.', checks: ['Atribut yang diperlukan sudah dipilih', 'Hierarki sudah disusun dengan tepat', 'Total dan satuan akhir sudah diverifikasi'] },
  ]},
]

const detail = (title, description) => ({ title, description })
const actionDetails = {
  'create-project': [
    detail('Pilih proyek TAS', 'Buat proyek baru untuk pekerjaan ini atau pastikan file proyek lama yang dibuka sudah benar.'),
    detail('Konfirmasi identitas proyek', 'Periksa nama dan lokasi proyek sebelum melanjutkan. Informasi ini membantu menjaga file kuantitas hasil ekspor agar mudah ditelusuri.'),
    detail('Tinjau aturan perhitungan', 'Pastikan aturan yang dipilih mengikuti persyaratan proyek dan standar pengukuran yang berlaku.'),
    detail('Verifikasi satuan proyek', 'Konfirmasikan satuan metrik atau imperial sebelum mengimpor gambar agar TAS membaca setiap jarak dengan benar.'),
  ],
  'floor-settings': [
    detail('Buka Floor Settings', 'Akses Floor Settings dari pengaturan proyek untuk mulai mendefinisikan level bangunan.'),
    detail('Buat daftar lantai', 'Tambahkan seluruh lantai bangunan dengan urutan yang sama seperti pada gambar perencanaan.'),
    detail('Masukkan informasi level', 'Tetapkan nama lantai, tinggi lantai, dan elevasi yang jelas untuk setiap level.'),
    detail('Cocokkan susunan lantai', 'Bandingkan tabel lantai dengan dokumen arsitektur dan struktur sebelum melanjutkan.'),
  ],
  'import-drawing': [
    detail('Pilih lantai tujuan', 'Aktifkan level yang diwakili oleh gambar sumber sebelum memulai proses impor.'),
    detail('Impor gambar sumber', 'Pilih file arsitektur atau struktur yang relevan untuk lantai aktif.'),
    detail('Periksa penempatan gambar', 'Verifikasi nama, visibilitas, orientasi, dan posisi gambar pada level yang dipilih.'),
    detail('Konfirmasi sebelum pemodelan', 'Periksa kembali lantai tujuan sebelum mengidentifikasi atau menggambar elemen model.'),
  ],
  'set-scale': [
    detail('Pilih titik kalibrasi', 'Gunakan dua titik presisi yang terhubung oleh dimensi tertulis dan dapat dipercaya.'),
    detail('Tandai kedua titik acuan', 'Pilih titik pertama dan kedua dengan cermat agar tidak terjadi pergeseran kalibrasi.'),
    detail('Masukkan jarak sebenarnya', 'Ketik dimensi yang diketahui menggunakan satuan proyek, bukan panjang yang terlihat di layar.'),
    detail('Terapkan koreksi skala', 'Biarkan TAS menyesuaikan gambar sebelum Anda mengambil pengukuran model.'),
  ],
  'verify-scale': [
    detail('Pilih dimensi pembanding', 'Gunakan grid, ruangan, atau dimensi struktur yang tidak dipakai saat kalibrasi.'),
    detail('Bandingkan hasil pengukuran', 'Cocokkan nilai pengukuran TAS dengan dimensi tertulis pada gambar sumber.'),
    detail('Atasi perbedaan nilai', 'Jika hasil berbeda, periksa titik acuan, satuan proyek, dan skala gambar asli.'),
    detail('Setujui skala gambar', 'Mulai pemodelan hanya setelah dimensi TAS dan gambar pembanding menunjukkan nilai yang sama.'),
  ],
  'identify-columns': [
    detail('Buka Identify Column', 'Mulai proses pengenalan kolom melalui alat identifikasi TAS yang sesuai.'),
    detail('Pilih gambar kolom', 'Gunakan selection atau block selection yang hanya mencakup gambar kolom terkait.'),
    detail('Petakan label dan dimensi', 'Hubungkan penanda kolom yang terdeteksi dengan ukuran dan identitas yang benar.'),
    detail('Validasi properti kolom', 'Periksa tipe, ukuran, tinggi, elevasi, dan lantai sebelum membuat elemen model.'),
    detail('Generate dan periksa kolom', 'Buat kolom lalu gunakan tampilan 3D untuk menemukan kesalahan posisi, level, atau rotasi.'),
  ],
  'identify-beams': [
    detail('Buka Identify Beam', 'Mulai pengenalan balok setelah kolom penumpu selesai dibuat.'),
    detail('Pilih garis dan label', 'Sertakan setiap garis balok beserta label yang menentukan identitas dan dimensinya.'),
    detail('Validasi properti balok', 'Konfirmasikan lebar, tinggi, level, dan elevasi sebelum membuat balok.'),
    detail('Generate balok', 'Buat elemen balok berdasarkan hasil identifikasi yang sudah ditinjau.'),
    detail('Periksa sambungan balok', 'Gunakan tampilan 3D untuk memastikan balok bertemu kolom tanpa celah atau offset.'),
  ],
  'identify-slabs': [
    detail('Siapkan elemen penumpu', 'Generate kolom, dinding, dan balok agar TAS dapat mengenali batas pelat dengan andal.'),
    detail('Buka Identify Slab', 'Pilih area pelat yang dimaksud menggunakan alat identifikasi pelat.'),
    detail('Periksa batas pelat', 'Pastikan perimeter tertutup dan mengikuti elemen penumpu yang benar.'),
    detail('Tinjau opsi identifikasi', 'Pilih pengaturan yang sesuai dengan kondisi gambar dan geometri pelat yang diinginkan.'),
    detail('Generate dan periksa pelat', 'Konfirmasikan tebal dan elevasi, buat pelat, lalu tinjau hasilnya dalam konteks model.'),
  ],
  'identify-openings': [
    detail('Buka alat identifikasi schedule', 'Gunakan Identify Door and Window Schedule untuk membuat tipe bukaan dari tabel gambar.'),
    detail('Pilih seluruh schedule', 'Lakukan block selection pada tabel terkait tanpa menyertakan catatan atau gambar lain.'),
    detail('Petakan kolom schedule', 'Tetapkan tipe, lebar, tinggi, dan tinggi ambang pada kolom tabel yang benar.'),
    detail('Generate tipe bukaan', 'Buat definisi pintu dan jendela yang dapat digunakan kembali dari data schedule.'),
    detail('Tempatkan bukaan pada dinding', 'Identifikasi atau sisipkan setiap bukaan pada dinding dan lantai bangunan yang benar.'),
    detail('Periksa bukaan dalam 3D', 'Verifikasi posisi, dimensi, tinggi ambang, dan keterkaitan bukaan dengan dinding.'),
  ],
  'apply-finishes': [
    detail('Siapkan batas ruangan', 'Buat atau identifikasi ruangan tertutup sebelum menetapkan kuantitas finishing.'),
    detail('Tentukan tipe finishing', 'Siapkan spesifikasi finishing lantai, dinding, skirting, dan plafon yang diperlukan.'),
    detail('Terapkan finishing ke ruangan', 'Tetapkan setiap tipe finishing hanya pada ruangan yang termasuk dalam cakupannya.'),
    detail('Tinjau geometri finishing', 'Periksa tinggi, posisi, dan batas finishing terhadap kebutuhan ruangan.'),
    detail('Verifikasi pengaruh batas', 'Pastikan pintu, jendela, dan tepi ruangan mengubah kuantitas finishing secara tepat.'),
  ],
  'view-expression': [
    detail('Pilih elemen yang diukur', 'Tentukan elemen model yang hasil perhitungan kuantitasnya perlu diperiksa.'),
    detail('Buka View Expression', 'Tampilkan rincian perhitungan untuk elemen dan jenis kuantitas yang dipilih.'),
    detail('Telusuri rumus kuantitas', 'Periksa komponen perhitungan dan pengurangan, bukan hanya nilai akhirnya.'),
    detail('Identifikasi sumber pengurangan', 'Tentukan elemen berpotongan yang menyebabkan penyesuaian pada kuantitas.'),
  ],
  'measurement-rules': [
    detail('Buka tab Quantity', 'Masuk ke alat kuantitas untuk tipe elemen yang sedang ditinjau.'),
    detail('Buka Measurement Rules', 'Tampilkan kumpulan aturan yang mengendalikan perpotongan dan pengurangan.'),
    detail('Pilih tipe elemen', 'Gunakan kategori yang sesuai dengan elemen yang kuantitasnya telah diperiksa.'),
    detail('Baca deskripsi aturan', 'Pahami cakupan aturan dan opsi aktif sebelum melakukan perubahan.'),
  ],
  'filter-deduction': [
    detail('Buka Filter Relevant Element', 'Persempit daftar aturan berdasarkan perpotongan yang ditemukan dalam View Expression.'),
    detail('Pilih elemen pengurang', 'Sisakan hanya tipe elemen yang menyebabkan pengurangan yang sedang diperiksa.'),
    detail('Konfirmasi aturan sambungan', 'Pastikan hasil filter menjelaskan kondisi perpotongan fisik yang dimaksud.'),
    detail('Lindungi aturan lain', 'Biarkan pengaturan sambungan lain tetap sama agar kuantitas yang tidak terkait tidak berubah.'),
  ],
  'change-rule': [
    detail('Pilih opsi yang diperlukan', 'Gunakan perlakuan pengukuran yang diwajibkan standar proyek untuk perpotongan ini.'),
    detail('Pahami No Effect', 'Pilih No Effect jika elemen berpotongan tidak boleh mengubah kuantitas yang diukur.'),
    detail('Pahami occupied volume', 'Pilih Calculate Occupied Volume jika bagian yang ditempati perlu masuk dalam logika pengurangan.'),
    detail('Catat perubahan aturan', 'Dokumentasikan pengaturan baru agar pengaruhnya dapat diperiksa setelah perhitungan ulang.'),
  ],
  recalculate: [
    detail('Pilih perintah perhitungan', 'Gunakan Calculate untuk cakupan luas atau Calculate Selected Entity untuk pemeriksaan terfokus.'),
    detail('Tentukan cakupan perhitungan', 'Pilih hanya lantai atau elemen yang terdampak saat menguji perubahan tertentu.'),
    detail('Jalankan perhitungan', 'Mulai perhitungan kuantitas setelah memastikan cakupan yang dipilih sudah tepat.'),
    detail('Tunggu hasil diperbarui', 'Jangan memverifikasi kuantitas sampai TAS selesai menghitung dan memperbarui hasil.'),
  ],
  'verify-deduction': [
    detail('Buka kembali View Expression', 'Kembali ke rumus yang sudah diperbarui setelah menghitung ulang kuantitas terkait.'),
    detail('Pilih kuantitas yang diperiksa', 'Tentukan elemen dan jenis kuantitas yang benar untuk pemeriksaan visual.'),
    detail('Buka 3D Deduction', 'Tampilkan bagian model yang dimasukkan TAS ke dalam pengurangan.'),
    detail('Periksa volume yang disorot', 'Tinjau geometri pengurangan dalam konteks model, bukan hanya berdasarkan nilai total.'),
    detail('Bandingkan sebelum dan sesudah', 'Pastikan kuantitas dan volume pengurangan terbaru mengikuti aturan pengukuran yang dimaksud.'),
  ],
  'quantity-category': [
    detail('Hitung kuantitas terbaru', 'Perbarui seluruh kuantitas yang diperlukan sebelum membuka laporan kategori.'),
    detail('Buka View Quantity by Category', 'Tampilkan hasil perhitungan berdasarkan hierarki kategori yang telah dikonfigurasi.'),
    detail('Tinjau struktur laporan', 'Periksa kategori, nilai, satuan, dan hierarki agar lengkap dan konsisten.'),
    detail('Periksa sampel total', 'Bandingkan total kategori yang mewakili dengan elemen model terkait.'),
  ],
  'configure-report': [
    detail('Buka klasifikasi laporan', 'Gunakan Set Classification and Quantity untuk mengendalikan kolom dan pengelompokan laporan.'),
    detail('Pilih atribut laporan', 'Sertakan hanya atribut yang dibutuhkan penerima laporan dan standar proyek.'),
    detail('Susun hierarki', 'Pindahkan atribut ke atas atau ke bawah untuk membentuk urutan pengelompokan.'),
    detail('Generate ulang laporan', 'Perbarui laporan agar struktur klasifikasi terbaru diterapkan.'),
    detail('Lakukan pemeriksaan akhir', 'Verifikasi total, satuan, dan klasifikasi sebelum laporan kuantitas diterbitkan.'),
  ],
}

export const allSteps = buildAllSteps(tutorialParts, 'id', actionDetails)
