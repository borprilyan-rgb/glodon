// Verbatim TAS and TRB assessment source from
// DAFTAR PERTANYAAN UNTUK PRESENTASI GLODON F.docx.
// Answer keys follow the DOCX except for the three corrections supplied by the user.
export const tasDocxSource = {
  title: 'DAFTAR PERTANYAAN UNTUK PRESENTASI GLODON F',
  sections: [
    {
      title: 'Drawing dan Persiapan Measurement',
      questions: [
        ['Apa fungsi utama Floor Settings pada TAS?', 'Mengatur warna garis gambar CAD', 'Mengatur jenis laporan proyek', 'Mengatur elevasi lantai dan mutu material proyek', 'C'],
        ['Jika dalam suatu proyek terdapat beberapa bangunan, bagaimana cara memisahkan area bangunan tersebut?', 'Tidak perlu melakukan setting, nanti outuputnya akan otomatis terdeteksi', 'Gunakan Zona di Floor Settings', 'Gunakan Separator Line untuk memisahkan bangunannya', 'B'],
        ['Jenis gambar manakah yang paling direkomendasikan untuk digunakan dalam pemodelan TAS?', 'PDF Scan', 'DWG', 'JPEG', 'B'],
        ['Apa fungsi Measurement Rules pada TAS?', 'Mengatur prinsip perhitungan sesuai dengan SMM dan spesifikasi yang digunakan', 'Mengubah gambar DWG menjadi PDF', 'Mengatur diameter tulangan', 'A'],
        ['Apa yang harus dilakukan ketika sudah melakukan Add Drawing?', 'Calculate dan View Expression', 'Split Drawing dan Relocate', 'Rebar Data Check', 'B'],
      ],
    },
    {
      title: 'Pemodelan Element Sistem',
      questions: [
        ['Jika pile cap berada 1 meter di bawah elevasi lantai saat ini, pengaturan Top Elevation yang tepat adalah?', 'Floor_Bottom_Elevation + 1', 'Floor_Bottom_Elevation - 1', 'Floor_Top_Elevation - 1', 'B'],
        ['Urutan Auto Identify balok yang benar adalah?', 'Pick Sideline → Pick Label → Auto Identify', 'Auto Identify → Pick Label → Pick Sideline', 'Pick Label → Auto Identify→ Pick Sideline', 'A'],
        ['Jika pada saat Auto Identify untuk balok ada yang tidak berhasil, metode apa yang dapat digunakan?', 'Menghapus seluruh gambar acuan', 'Menggunakan pemodelan manual', 'Calculate ulang', 'B'],
        ['Pada saat melakukan perubahan finishing pada Room Finish apa yang harus dilakukan setelah merubahnya?', 'Regenerate Room Finish', 'Auto Identify', 'Room Finish otomatis berubah', 'A'],
        ['Bagaimana cara mengganti tampilan Floor Finish yang sudah termodelkan?', 'Pilih Measurement Rules Floor Finish', 'Pilih View Expression', 'Pilih Material Texture atau Fill Color pada Attribute Editor', 'C'],
      ],
    },
    {
      title: 'Verifikasi Quantity dan Laporan',
      questions: [
        ['Ketika terdapat perubahan/revisi modeling namun pada saat melakukan pengecekan ternyata quantity tidak berubah, apa yang harus dilakukan?', 'Perlu Calculate ulang', 'Langsung export hasil tersebut', 'Quantity akan otomatis berubah', 'A'],
        ['Bagaimana cara untuk memastikan volume bekisting balok sudah dikurangi slab?', 'Pada View Expression', 'Measurement Rules', 'Rebar Data Check', 'A'],
        ['Pada saat melakukan report kita ingin mengambil volume slab berdasarkan tebal slab namun pada hasil report keterangan tebal slab tidak muncul, apa yang harus dilakukan?', 'Pilih Calculate', 'Pilih Measurement Rules', 'Pilih Set Classification and Quantity - Centang “Thickness”', 'C'],
        ['Apakah kita bisa mendapatkan quantity pembesian di TAS?', 'Tidak bisa', 'Bisa, namun hanya secara ratio kg/m3', 'Bisa, quantity pembesian sesuai dengan gambar detail', 'B'],
        ['Bagaimana langkah-langkah export model TAS untuk digunakan nantinya di TRB?', 'BIM Model → Export IFC File → Select Folder → Save', 'BIM Model → Export IFC Quantity → Select Folder → Save', 'BIM Model → Export Model → Select Folder → Save', 'C'],
      ],
    },
  ],
}

export const trbDocxSource = {
  title: 'DAFTAR PERTANYAAN UNTUK PRESENTASI GLODON',
  sections: [
    {
      title: 'Drawing dan Persiapan Measurement',
      questions: [
        ['Jika pemodelan struktur dimulai dari TAS dan akan dilanjutkan dengan penulangan di TRB, proses yang dilakukan adalah?', 'BIM Model → Import Model → Select File → Open', 'BIM Model → Export Model → Select File → Open', 'BIM Model → Export to PDF → Select File → Open', 'A'],
        ['Dalam format apakah file model TAS yang akan digunakan pada TRB?', 'DWG', 'IFC', 'Cubic', 'C'],
        ['Apa fungsi Calculation Rules pada TRB?', 'Mengatur aturan detail perhitungan dan konfigurasi penulangan berbagai element', 'Mengatur format gambar kerja saja', 'Mengatur tampilan warna element', 'A'],
        ['Jika kita ingin melakukan pemodelan langsung pada TRB tanpa dimulai dari TAS apakah bisa?', 'Tidak bisa, harus dimulai dari TAS', 'Bisa, namun quantity yang didapatkan tetap hanya pembesian saja', 'Bisa, quantity yang didapatkan lengkap seperti beton, bekisting, pembesian', 'B'],
        ['Untuk memudahkan pemodelan pada TRB kita harus menyiapkan schedule pembesian untuk element kolom dan balok, dalam format apakah schedule tersebut?', 'PDF', 'DWG', 'Excel', 'C'],
      ],
    },
    {
      title: 'Pemodelan Element Sistem',
      questions: [
        ['Element list manakah dibawah ini yang belum bisa dimodelkan di TRB?', 'Tangga', 'Dinding beton', 'Ramp', 'A'],
        ['Diantara element berikut, manakah yang TIDAK BISA ditulangi dengan schedule di TRB?', 'Beam', 'Slab', 'Kolom', 'B'],
        ['Bagaimana cara input data tebal selimut beton pile cap dengan tebal sisi bawah, samping dan atas berbeda?\nMisal : selimut beton bawah 100 mm\nselimut beton samping 50 mm\nselimut beton atas 20 mm', 'Mengganti settingan pile cap di calculation rules menjadi 100/50/20.', 'Mengganti di attribute editor untuk “Cover” menjadi 100/50/20.', 'Mengganti di Floor Settings menjadi 100/50/20.', 'B'],
        ['Pada kolom Links, format "D13-100(5×8)", angka (5×8) menunjukkan?', 'Jumlah Sengkang 5 dan 8 buah', 'Spasi 5 dan 8 cm', '5 kaki vertical dan 8 kaki horizontal', 'C'],
        ['Setelah saya selesai menginput tulangan slab di parametric arrangement, apa yang harus saya lakukan agar tulangan tersebut masuk ke entity?', 'Generate Rebar and Rebar Content', 'Calculate', 'View Quantity', 'A'],
      ],
    },
    {
      title: 'Verifikasi Quantity dan Laporan',
      questions: [
        ['Apa tujuan utama penggunaan Rebar Data Check?', 'Mengubah diameter tulangan secara otomatis', 'Membuat model struktur baru', 'Memeriksa apakah seluruh tulangan telah diinput', 'C'],
        ['Jika ingin melihat bagaimana posisi tulangan terpasang, termasuk posisi lewatan, pengangkuran, dan zona tumpuan-lapangan yaitu menggunakan?', 'Edit Rebar', 'Rebar Layout', 'Rebar Data Check', 'B'],
        ['Jika kita melakukan sedikit perubahan pada modeling dan ingin calculate entity tertentu saja, bagaimana langkah yang benar?', 'Pilih Element - Pilih Entity – View Quantity', 'Pilih Element - Pilih Entity – Calculate', 'Pilih Element - Pilih Entity – Calculate Selected Entity', 'C'],
        ['Jika ingin mengetahui quantity entity tertentu saja pada suatu element, bagaimana langkah yang benar?', 'Pilih Element - Pilih Entity – View Quantity', 'Pilih Element - Pilih Entity – Calculate', 'Pilih Element - Pilih Entity – Calculate Selected Entity', 'A'],
        ['Dalam format apakah report summary quantity yang sudah kita modelkan?', 'Excel', 'PDF', 'JPEG', 'A'],
      ],
    },
  ],
  passScoreNote: 'Minimal nilai 60-70/100',
}
