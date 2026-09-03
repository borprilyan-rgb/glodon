const topics = {
  id: [
    { number: '01', title: 'Persiapan Proyek dan Gambar', topics: ['Pengaturan proyek', 'Pengaturan lantai', 'Impor gambar', 'Skala gambar', 'Verifikasi grid dan gambar'] },
    { number: '02', title: 'Pemodelan Tulangan', topics: ['Pengaturan tulangan umum', 'Tulangan kolom', 'Tulangan balok', 'Tulangan dinding', 'Tulangan pelat', 'Tulangan fondasi'] },
    { number: '03', title: 'Kuantitas dan Laporan', topics: ['Pengaturan perhitungan', 'Perhitungan kuantitas', 'Verifikasi kuantitas', 'Laporan berat tulangan', 'Klasifikasi dan ekspor'] },
  ],
  en: [
    { number: '01', title: 'Project and Drawing Preparation', topics: ['Project settings', 'Floor settings', 'Drawing import', 'Drawing scale', 'Grid and drawing verification'] },
    { number: '02', title: 'Rebar Modelling', topics: ['General rebar settings', 'Column reinforcement', 'Beam reinforcement', 'Wall reinforcement', 'Slab reinforcement', 'Foundation reinforcement'] },
    { number: '03', title: 'Quantity and Reports', topics: ['Calculation settings', 'Quantity calculation', 'Quantity verification', 'Reinforcement-weight report', 'Classification and export'] },
  ],
}

export const getTrbData = (language) => ({ id: 'trb', title: language === 'id' ? 'Tutorial Teknis Cubicost TRB' : 'Cubicost TRB Technical Tutorial', intro: language === 'id' ? 'Pelajari alur kerja pembesian mulai dari persiapan proyek dan pengaturan tulangan hingga perhitungan serta laporan kuantitas.' : 'Learn the rebar workflow from project preparation and reinforcement settings through quantity calculation and reporting.', parts: topics[language], lessonCount: 0, status: 'preparation' })
