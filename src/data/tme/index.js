import { tmeScreenshotCaptions } from './screenshotCaptions.js'

const action = (titleId, titleEn, descriptionId, descriptionEn, file, page) => ({ titleId, titleEn, descriptionId, descriptionEn, file, page })
const lesson = (id, titleId, titleEn, introId, introEn, pages, actions, noteId = '', noteEn = '') => ({ id, titleId, titleEn, introId, introEn, pages, actions, noteId, noteEn })

const definitions = [
  { number: '01', titleId: 'Persiapan Proyek dan Gambar', titleEn: 'Project and Drawing Preparation', summaryId: 'Siapkan lantai dan gambar sebagai dasar identifikasi yang konsisten.', summaryEn: 'Prepare floors and drawings as a consistent basis for identification.', lessons: [
    lesson('floor-settings', 'Mengatur Lantai Proyek', 'Configure Project Floors', 'Atur nama, jumlah, tinggi, dan elevasi lantai agar riser serta kuantitas dikelompokkan dengan benar.', 'Set floor names, counts, heights and elevations so risers and quantities are grouped correctly.', '3–6', [
      action('Buka Floor Setting', 'Open Floor Setting', 'Gunakan Project Setting > Floor Setting untuk membuka tabel lantai.', 'Use Project Setting > Floor Setting to open the floor table.', 'floor-settings-open.png', 4),
      action('Tambahkan jumlah lantai', 'Insert the required floors', 'Pilih Batch Insert Floor, masukkan jumlah lantai, lalu konfirmasi.', 'Select Batch Insert Floor, enter the floor count and confirm.', 'floor-settings-batch-insert.png', 5),
      action('Atur nama dan tinggi lantai', 'Set floor names and heights', 'Ubah Floor Name dan Floor Height sesuai data proyek.', 'Update Floor Name and Floor Height from the project data.', 'floor-settings-name-height.png', 6),
      action('Tinjau hasil pengaturan', 'Review the completed settings', 'Periksa kembali nama lantai, elevasi, dan urutannya.', 'Check the completed floor names, elevations and sequence.', 'floor-settings-review.png', 6),
    ], 'Penetapan lantai yang benar memungkinkan riser dan kuantitas dikelompokkan sesuai lantainya.', 'Correct floor assignment allows risers and quantities to be grouped by floor.'),
    lesson('prepare-drawings', 'Menyiapkan Gambar TME', 'Prepare TME Drawings', 'Unggah, skalakan, pisahkan, beri nama, tetapkan lantai, dan selaraskan gambar sistem.', 'Upload, scale, split, name, assign and align system drawings.', '8–13', [
      action('Tambahkan gambar', 'Add drawings', 'Gunakan Add Drawing dan pilih file gambar yang diperlukan.', 'Use Add Drawing and select the required drawing files.', 'prepare-drawings-add.png', 8),
      action('Periksa dan koreksi skala', 'Check and correct scale', 'Gunakan Scale Drawing atau rasio jarak terukur terhadap jarak aktual, lalu lakukan pemeriksaan independen.', 'Use Scale Drawing or the measured-to-actual distance ratio, then perform an independent check.', 'prepare-drawings-scale.png', 10),
      action('Pisahkan dan beri nama denah', 'Split and name plans', 'Pisahkan beberapa denah dalam satu gambar dan beri nama yang jelas.', 'Split multiple plans in one drawing and give each a clear name.', 'prepare-drawings-split-name.png', 9),
      action('Tetapkan lantai dan lokasi', 'Assign floors and locate drawings', 'Pilih Corresponding Floor, gunakan acuan axis yang konsisten, lalu jalankan Locate.', 'Choose the Corresponding Floor, use a consistent axis reference and run Locate.', 'prepare-drawings-floor-locate.png', 12),
    ], 'Metode rasio pada contoh elektrikal bukan keharusan ketika Scale Drawing dapat memakai panjang aktual secara langsung.', 'The ratio method in the electrical example is not required when Scale Drawing can use an actual length directly.'),
  ]},
  { number: '02', titleId: 'Pekerjaan MVAC', titleEn: 'MVAC Systems', summaryId: 'Identifikasi equipment, perangkat udara, duct, damper, pipa, dan kuantitas MVAC.', summaryEn: 'Identify MVAC equipment, air devices, ducts, dampers, pipes and quantities.', lessons: [
    lesson('mvac-equipment', 'Mengidentifikasi Equipment MVAC', 'Identify MVAC Equipment', 'Buat equipment dan identifikasi perangkat berdasarkan nama, tipe, kapasitas, dan lantai.', 'Create and identify equipment by name, type, capacity and floor.', '14–18', [
      action('Pilih panel AC dan MV', 'Select the AC and MV panel', 'Aktifkan panel pekerjaan AC dan MV.', 'Activate the AC and MV work panel.', 'mvac-equipment-panel.png', 14),
      action('Buat dan atur equipment', 'Create and configure equipment', 'Buat equipment pada Element List dan edit atributnya.', 'Create equipment in Element List and edit its attributes.', 'mvac-equipment-create.png', 14),
      action('Identifikasi device pada lantai', 'Identify devices on floors', 'Gunakan Device > Pick Device, pilih gambar dan lantai, lalu jalankan Identify.', 'Use Device > Pick Device, select the drawing and floors, then run Identify.', 'mvac-equipment-identify.png', 16),
      action('Konfirmasi dan tinjau hasil', 'Confirm and review results', 'Konfirmasi dengan +Create dan periksa nama, tipe, serta kapasitas.', 'Confirm with +Create and review names, types and capacities.', 'mvac-equipment-review.png', 18),
    ]),
    lesson('mvac-air-devices', 'Mengidentifikasi Plenum, Diffuser, dan Grille', 'Identify Plenums, Diffusers and Grilles', 'Buat dan identifikasi perangkat distribusi udara beserta atributnya.', 'Create and identify air-distribution devices and their attributes.', '19–22', [
      action('Buat Plenum Box', 'Create Plenum Box elements', 'Buat elemen Plenum Box dan isi dimensi serta hubungan equipment.', 'Create Plenum Box elements and set dimensions and equipment relationships.', 'mvac-plenum-create.png', 19),
      action('Identifikasi plenum', 'Identify plenums', 'Gunakan Pick Device, pilih lantai, dan konfirmasi perangkat.', 'Use Pick Device, select floors and confirm devices.', 'mvac-plenum-identify.png', 20),
      action('Buat Air Grille', 'Create Air Grille elements', 'Buat elemen diffuser dan grille dengan fungsi, tipe, serta dimensi yang sesuai.', 'Create diffuser and grille elements with the correct function, type and dimensions.', 'mvac-air-grille-create.png', 21),
      action('Identifikasi dan periksa perangkat', 'Identify and review air devices', 'Pilih lantai, jalankan Identify, lalu periksa hasil perangkat udara.', 'Select floors, run Identify and review the air-device results.', 'mvac-air-devices-review.png', 22),
    ]),
    lesson('mvac-main-supply-return-duct', 'Mengidentifikasi Main, Supply, dan Return Duct', 'Identify Main, Supply and Return Ducts', 'Bedakan fungsi main, supply, dan return saat membuat duct serta fitting.', 'Keep main, supply and return functions distinct while creating ducts and fittings.', '23–30', [
      action('Identifikasi duct utama', 'Identify the main duct', 'Gunakan Duct System Identify untuk memilih label dimensi dan garis sisi duct.', 'Use Duct System Identify to select dimension labels and duct sidelines.', 'mvac-main-duct-identify.png', 23),
      action('Atur atribut dan riser', 'Set attributes and risers', 'Edit atribut dan buat riser dengan elevasi awal serta akhir yang benar.', 'Edit attributes and create risers with correct start and end elevations.', 'mvac-main-duct-riser.png', 24),
      action('Identifikasi supply dan return', 'Identify supply and return ducts', 'Identifikasi atau gambar duct supply dan return dengan fungsi yang tepat.', 'Identify or draw supply and return ducts with the correct functions.', 'mvac-supply-return-duct.png', 29),
      action('Buat fitting dan periksa koneksi', 'Generate fittings and check connections', 'Jalankan Air Duct Fitting Identification dan periksa semua sambungan.', 'Run Air Duct Fitting Identification and inspect every connection.', 'mvac-duct-fittings-review.png', 30),
    ]),
    lesson('mvac-fresh-exhaust-duct', 'Mengidentifikasi Fresh dan Exhaust Duct', 'Identify Fresh and Exhaust Ducts', 'Identifikasi fresh dan exhaust duct serta hubungkan grille dan riser.', 'Identify fresh and exhaust ducts and connect grilles and risers.', '31–35', [
      action('Identifikasi fresh duct', 'Identify fresh ducts', 'Pilih garis, label dimensi, dan fungsi fresh duct.', 'Select lines, dimension labels and the fresh-duct function.', 'mvac-fresh-duct.png', 31),
      action('Identifikasi exhaust duct', 'Identify exhaust ducts', 'Identifikasi exhaust duct dan periksa atribut fungsinya.', 'Identify exhaust ducts and review their functional attributes.', 'mvac-exhaust-duct.png', 33),
      action('Buat fitting dan koneksi grille', 'Generate fittings and grille connections', 'Buat fitting lalu hubungkan duct ke grille yang sesuai.', 'Generate fittings and connect ducts to the appropriate grilles.', 'mvac-exhaust-grille.png', 34),
      action('Hubungkan riser dan tinjau sistem', 'Connect risers and review the system', 'Hubungkan ke riser duct dan periksa sistem yang tersambung.', 'Connect to riser ducts and inspect the connected system.', 'mvac-fresh-exhaust-review.png', 35),
    ]),
    lesson('mvac-flexible-duct-damper', 'Mengidentifikasi Flexible Duct dan Damper', 'Identify Flexible Ducts and Dampers', 'Buat flexible duct dan damper, kelompokkan, lalu selaraskan atribut.', 'Create flexible ducts and dampers, group them and align attributes.', '36–41', [
      action('Buat flexible duct', 'Create flexible ducts', 'Buat elemen Flexible Duct dan jalankan Generate Flexible Duct.', 'Create Flexible Duct elements and run Generate Flexible Duct.', 'mvac-flexible-duct.png', 36),
      action('Kelompokkan berdasarkan equipment', 'Group by equipment', 'Isi atribut pengelompokan sesuai equipment yang dilayani.', 'Set the grouping attribute for the served equipment.', 'mvac-flexible-group.png', 37),
      action('Buat dan identifikasi damper', 'Create and identify dampers', 'Buat Air Damper, gunakan Pick Device, dan pilih lantai.', 'Create Air Damper elements, use Pick Device and select floors.', 'mvac-damper-identify.png', 39),
      action('Selaraskan dan verifikasi atribut', 'Align and verify attributes', 'Gunakan Batch dan Adapt Linear Entity Attribute, lalu periksa grille, diffuser, dan damper.', 'Use Batch and Adapt Linear Entity Attribute, then verify grilles, diffusers and dampers.', 'mvac-damper-attributes.png', 41),
    ]),
    lesson('mvac-pipe-quantity', 'Mengidentifikasi Pipa AC dan Menghitung MVAC', 'Identify AC Pipes and Calculate MVAC Quantities', 'Modelkan pipa horizontal dan riser, lalu hitung kuantitas MVAC.', 'Model horizontal pipes and risers, then calculate MVAC quantities.', '42–45', [
      action('Buat elemen pipa AC', 'Create AC pipe elements', 'Buat Pipe atau Refrigerant Pipe dan atur fungsi, dimensi, serta grup.', 'Create Pipe or Refrigerant Pipe elements and set function, dimensions and group.', 'mvac-pipe-create.png', 42),
      action('Gambar atau identifikasi pipa', 'Draw or identify pipes', 'Buat pipa horizontal sesuai jalur gambar.', 'Create horizontal pipework following the drawing route.', 'mvac-pipe-horizontal.png', 43),
      action('Buat riser dan periksa model', 'Create risers and inspect the model', 'Atur elevasi awal dan akhir riser, lalu periksa model MVAC.', 'Set riser start and end elevations, then inspect the MVAC model.', 'mvac-pipe-riser-review.png', 44),
      action('Hitung kuantitas MVAC', 'Calculate MVAC quantities', 'Buka Quantity > Calculation, pilih lantai, dan tinjau hasil.', 'Open Quantity > Calculation, select floors and review results.', 'mvac-quantity-calculation.png', 45),
    ]),
  ]},
  { number: '03', titleId: 'Pekerjaan Pemadam Kebakaran', titleEn: 'Fire Protection Systems', summaryId: 'Modelkan equipment, hydrant, sprinkler, valve, dan kuantitas pemadam.', summaryEn: 'Model fire equipment, hydrants, sprinklers, valves and quantities.', lessons: [
    lesson('fire-equipment', 'Mengidentifikasi Peralatan Pemadam', 'Identify Fire Protection Equipment', 'Buat dan identifikasi hydrant box, extinguisher, dan sprinkler.', 'Create and identify hydrant boxes, extinguishers and sprinklers.', '54–56', [
      action('Buat equipment pemadam', 'Create fire equipment', 'Buat elemen hydrant box dan peralatan pemadam yang tersedia.', 'Create hydrant-box and available fire-equipment elements.', 'fire-equipment-create.png', 54),
      action('Buat elemen sprinkler', 'Create sprinkler elements', 'Atur elemen sprinkler sesuai simbol dan atributnya.', 'Configure sprinkler elements from their symbols and attributes.', 'fire-sprinkler-create.png', 55),
      action('Identifikasi device dan lantai', 'Identify devices and floors', 'Gunakan identifikasi device dan pilih lantai yang sesuai.', 'Use device identification and select the appropriate floors.', 'fire-equipment-identify.png', 56),
      action('Konfirmasi hasil equipment', 'Confirm equipment results', 'Konfirmasi perangkat dan periksa hasil identifikasi.', 'Confirm devices and inspect the identification result.', 'fire-equipment-review.png', 56),
    ]),
    lesson('fire-main-hydrant-pipe', 'Mengidentifikasi Pipa Utama dan Hydrant', 'Identify Main and Hydrant Pipes', 'Buat pipa menurut fungsi dan diameter, kemudian sambungkan ke riser dan hydrant.', 'Create pipes by function and diameter, then connect risers and hydrants.', '57–61', [
      action('Buat elemen pipa', 'Create pipe elements', 'Tetapkan fungsi dan diameter pipa pemadam.', 'Set fire-pipe functions and diameters.', 'fire-pipe-create.png', 57),
      action('Buat main riser', 'Create the main riser', 'Buat riser dengan elevasi awal dan akhir yang tepat.', 'Create a riser with correct start and end elevations.', 'fire-main-riser.png', 58),
      action('Identifikasi garis dan label pipa', 'Identify pipe lines and labels', 'Gunakan Identify Pipe, Pick Pipe Line, dan Pick Pipe Label.', 'Use Identify Pipe, Pick Pipe Line and Pick Pipe Label.', 'fire-pipe-identify.png', 60),
      action('Hubungkan dan tinjau hasil', 'Connect and review results', 'Periksa diameter, dropper, dan koneksi ke riser serta hydrant.', 'Check diameters, droppers and connections to risers and hydrants.', 'fire-hydrant-pipe-review.png', 61),
    ]),
    lesson('fire-sprinkler-valve-quantity', 'Mengidentifikasi Sprinkler, Valve, dan Menghitung Quantity', 'Identify Sprinkler Pipes and Valves', 'Lengkapi sprinkler dan valve sebelum menghitung kuantitas pemadam.', 'Complete sprinkler pipes and valves before calculating fire-system quantities.', '62–70', [
      action('Identifikasi pipa sprinkler', 'Identify sprinkler pipes', 'Pilih garis dan label pipa sprinkler sesuai gambar.', 'Select sprinkler pipe lines and labels from the drawing.', 'fire-sprinkler-pipe.png', 62),
      action('Buat end-pipe dan riser', 'Generate end pipes and risers', 'Gunakan Generate End-Pipe dan Generate Riser Pipes.', 'Use Generate End-Pipe and Generate Riser Pipes.', 'fire-sprinkler-riser.png', 65),
      action('Buat dan sesuaikan valve', 'Create and adapt valves', 'Buat valve, identifikasi perangkat, dan sesuaikan atributnya.', 'Create valves, identify devices and adapt their attributes.', 'fire-valve-identify.png', 68),
      action('Periksa model dan hitung', 'Review the model and calculate', 'Tinjau sistem lengkap lalu jalankan Quantity > Calculation.', 'Inspect the completed system and run Quantity > Calculation.', 'fire-quantity.png', 70),
    ]),
  ]},
  { number: '04', titleId: 'Pekerjaan Elektrikal', titleEn: 'Electrical Systems', summaryId: 'Identifikasi panel, tray, kabel, device, dan kuantitas elektrikal.', summaryEn: 'Identify panels, trays, cables, devices and electrical quantities.', lessons: [
    lesson('electrical-schematic-panel', 'Mengidentifikasi Diagram Skematik Panel', 'Identify the Panel Schematic Diagram', 'Bangun struktur panel dan kabel dari diagram skematik.', 'Build the panel and cable structure from the schematic diagram.', '79–82', [
      action('Tambahkan diagram skematik', 'Add the schematic drawing', 'Unggah diagram yang memuat panel, beban, dan kabel.', 'Add the drawing containing panels, loads and cables.', 'electrical-schematic-add.png', 79),
      action('Identifikasi nama panel', 'Identify panel names', 'Pilih nama panel dan buat Distribution Box yang diperlukan.', 'Identify panel names and create the required Distribution Box elements.', 'electrical-panel-names.png', 80),
      action('Identifikasi beban dan kabel', 'Identify loads and cables', 'Identifikasi terminal load serta spesifikasi kabel.', 'Identify terminal loads and cable specifications.', 'electrical-load-cable.png', 81),
      action('Tinjau Schematic Tree', 'Review the Schematic Tree', 'Periksa panel dan kabel yang dibuat otomatis.', 'Review automatically generated panel and cable elements.', 'electrical-schematic-tree.png', 82),
    ]),
    lesson('electrical-panel-cable-tray', 'Mengidentifikasi Panel dan Cable Tray', 'Identify Panels and Cable Trays', 'Identifikasi panel lalu bangun jalur cable tray, fitting, dan riser.', 'Identify panels and build cable-tray routes, fittings and risers.', '83–88', [
      action('Identifikasi Distribution Box', 'Identify Distribution Boxes', 'Pilih elemen panel, identifikasi device, dan tetapkan lantai.', 'Select panel elements, identify devices and assign floors.', 'electrical-panel-identify.png', 85),
      action('Buat Cable Tray', 'Create Cable Tray elements', 'Buat elemen Cable Tray menggunakan terminologi software.', 'Create Cable Tray elements using the software terminology.', 'electrical-cable-tray-create.png', 86),
      action('Buat tray, fitting, dan riser', 'Generate trays, fittings and risers', 'Buat tray dari garis gambar, lalu tambahkan fitting dan riser.', 'Generate trays from drawing lines, then add fittings and risers.', 'electrical-cable-tray-route.png', 87),
      action('Hubungkan panel dan tinjau hasil', 'Connect panels and review results', 'Hubungkan tray ke panel dan periksa model akhir.', 'Connect trays to panels and inspect the final model.', 'electrical-panel-tray-review.png', 88),
    ]),
    lesson('electrical-cable-wiring', 'Mengidentifikasi Kabel', 'Identify and Route Cables', 'Gunakan Schematic Wiring untuk membuat rute kabel melalui cable tray.', 'Use Schematic Wiring to route cables through cable trays.', '89', [
      action('Pilih panel Cable Conduit', 'Select the Cable Conduit panel', 'Aktifkan panel pekerjaan kabel.', 'Activate the cable work panel.', 'electrical-cable-panel.png', 89),
      action('Buka Schematic Wiring', 'Open Schematic Wiring', 'Buka perintah wiring yang ditampilkan manual.', 'Open the wiring command shown in the manual.', 'electrical-schematic-wiring.png', 89),
      action('Jalankan Auto-Wiring', 'Run Auto-Wiring', 'Konfirmasi source panel, distribution panel, tipe, dan spesifikasi kabel.', 'Confirm source panel, distribution panel, cable type and specification.', 'electrical-auto-wiring.png', 89),
      action('Periksa rute kabel', 'Review the cable route', 'Pastikan rute yang dibuat mengikuti cable tray.', 'Confirm that the generated route follows the cable tray.', 'electrical-cable-route-review.png', 89),
    ], 'Jangan menambahkan langkah yang tidak terbaca pada manual.', 'Do not add steps that are not readable in the manual.'),
    lesson('electrical-devices-quantity', 'Mengidentifikasi Stop Kontak, Saklar, dan Lampu', 'Identify Electrical Devices and Calculate Quantities', 'Identifikasi device elektrikal per lantai dan hitung kuantitasnya.', 'Identify electrical devices by floor and calculate quantities.', '90–97', [
      action('Buat dan identifikasi socket', 'Create and identify sockets', 'Buat Socket, identifikasi simbol, dan pilih lantai.', 'Create Socket elements, identify symbols and select floors.', 'electrical-socket.png', 91),
      action('Buat dan identifikasi switch', 'Create and identify switches', 'Buat Switch dan konfirmasi hasil device.', 'Create Switch elements and confirm device results.', 'electrical-switch.png', 93),
      action('Buat dan identifikasi lamp', 'Create and identify lamps', 'Buat Lamp, pilih lantai, dan konfirmasi hasil.', 'Create Lamp elements, select floors and confirm results.', 'electrical-lamp.png', 95),
      action('Periksa model dan hitung', 'Review the model and calculate', 'Tinjau model elektrikal lalu jalankan Quantity > Calculation.', 'Inspect the electrical model and run Quantity > Calculation.', 'electrical-quantity.png', 97),
    ]),
  ]},
  { number: '05', titleId: 'Pekerjaan Plumbing', titleEn: 'Plumbing Systems', summaryId: 'Identifikasi equipment, sanitary ware, pipa, valve, aksesori, dan kuantitas plumbing.', summaryEn: 'Identify plumbing equipment, sanitary ware, pipes, valves, accessories and quantities.', lessons: [
    lesson('plumbing-equipment-sanitary', 'Mengidentifikasi Equipment dan Sanitary Ware', 'Identify Plumbing Equipment and Sanitary Ware', 'Buat dan identifikasi equipment plumbing serta sanitary fixture.', 'Create and identify plumbing equipment and sanitary fixtures.', '106–109', [
      action('Buat equipment plumbing', 'Create plumbing equipment', 'Buat elemen Equipment dan edit atributnya.', 'Create Equipment elements and edit their attributes.', 'plumbing-equipment-create.png', 106),
      action('Identifikasi equipment', 'Identify equipment', 'Gunakan device identification dan pilih lantai.', 'Use device identification and select floors.', 'plumbing-equipment-identify.png', 107),
      action('Buat Sanitary Ware', 'Create Sanitary Ware elements', 'Buat fixture berdasarkan tipe yang ditampilkan gambar.', 'Create fixtures based on the types shown in the drawing.', 'plumbing-sanitary-create.png', 108),
      action('Identifikasi dan konfirmasi fixture', 'Identify and confirm fixtures', 'Pilih lantai, identifikasi fixture, dan periksa hasil.', 'Select floors, identify fixtures and review results.', 'plumbing-sanitary-review.png', 109),
    ]),
    lesson('plumbing-pipe-valve-accessories', 'Mengidentifikasi Pipa, Valve, dan Aksesori', 'Identify Pipes, Valves and Accessories', 'Bangun jaringan pipa plumbing lengkap dengan riser, fitting, valve, dan aksesori.', 'Build plumbing pipework with risers, fittings, valves and accessories.', '110–116', [
      action('Buat elemen pipa', 'Create pipe elements', 'Tetapkan material, fungsi, dan dimensi pipa.', 'Set pipe material, function and dimensions.', 'plumbing-pipe-create.png', 110),
      action('Identifikasi pipa dan riser', 'Identify pipes and risers', 'Identifikasi atau gambar main pipe dan buat riser.', 'Identify or draw main pipes and create risers.', 'plumbing-pipe-riser.png', 112),
      action('Buat distribusi dan fitting', 'Generate distribution pipes and fittings', 'Hubungkan pipa ke riser lalu buat fitting.', 'Connect pipework to risers and generate fittings.', 'plumbing-pipe-fittings.png', 114),
      action('Identifikasi valve dan sesuaikan atribut', 'Identify valves and adapt attributes', 'Buat valve, gunakan Batch dan Adapt Linear Entity Attribute, lalu tinjau aksesori.', 'Create valves, use Batch and Adapt Linear Entity Attribute, then review accessories.', 'plumbing-valve-accessories.png', 116),
    ]),
    lesson('plumbing-floor-quantity', 'Menyesuaikan Lantai dan Menghitung Quantity Plumbing', 'Adjust Floors and Calculate Plumbing Quantities', 'Pindahkan entity ke lantai yang benar sebelum menghitung kuantitas plumbing.', 'Assign entities to the correct floors before calculating plumbing quantities.', '117–120', [
      action('Pilih entity dengan Batch', 'Select entities with Batch', 'Pilih entity yang perlu dipindahkan dan kecualikan Axis Grid.', 'Select entities requiring reassignment and exclude Axis Grid.', 'plumbing-floor-batch.png', 117),
      action('Ubah Entity Floor Level', 'Update Entity Floor Level', 'Tetapkan lantai yang benar untuk entity terpilih.', 'Assign the correct floor to the selected entities.', 'plumbing-floor-level.png', 118),
      action('Bandingkan dan periksa model', 'Compare and inspect the model', 'Bandingkan kondisi sebelum dan sesudah, lalu periksa model plumbing.', 'Compare before and after states, then inspect the plumbing model.', 'plumbing-floor-review.png', 119),
      action('Hitung kuantitas plumbing', 'Calculate plumbing quantities', 'Buka Quantity > Calculation, pilih lantai, dan tinjau hasil.', 'Open Quantity > Calculation, select floors and review results.', 'plumbing-quantity.png', 120),
    ]),
  ]},
]

const checks = {
  id: ['Tindakan utama telah diselesaikan', 'Atribut, lantai, dan fungsi telah diperiksa', 'Hasil siap digunakan pada materi berikutnya'],
  en: ['The main actions are complete', 'Attributes, floors and functions were checked', 'The result is ready for the next lesson'],
}

export function getTmeData(language) {
  const isId = language === 'id'
  const tutorialParts = definitions.map((part) => ({
    id: `part-${Number(part.number)}`, number: part.number,
    title: isId ? part.titleId : part.titleEn,
    summary: isId ? part.summaryId : part.summaryEn,
    workflow: [],
    steps: part.lessons.map((item) => ({
      id: item.id,
      title: isId ? item.titleId : item.titleEn,
      intro: isId ? item.introId : item.introEn,
      duration: `${item.actions.length * 2} min`,
      manualPages: item.pages,
      instructions: item.actions.map((entry) => isId ? entry.titleId : entry.titleEn),
      actions: item.actions.map((entry, index) => ({
        id: `${item.id}-action-${index + 1}`, number: index + 1,
        title: isId ? entry.titleId : entry.titleEn,
        description: isId ? entry.descriptionId : entry.descriptionEn,
        image: `/tutorial/tme/part-${Number(part.number)}/${entry.file}`,
        imageAlt: isId ? `Antarmuka TME-C halaman ${entry.page} untuk ${entry.titleId}` : `TME-C interface on page ${entry.page} for ${entry.titleEn}`,
        alt: isId ? `Antarmuka TME-C halaman ${entry.page} untuk ${entry.titleId}` : `TME-C interface on page ${entry.page} for ${entry.titleEn}`,
        caption: tmeScreenshotCaptions[entry.file][language],
        requiredDescription: '',
        manualPage: entry.page,
        pending: false,
      })),
      note: isId ? item.noteId : item.noteEn,
      checks: checks[language],
    })),
  }))
  const allSteps = tutorialParts.flatMap((part) => part.steps.map((step, index) => ({ ...step, partId: part.id, partTitle: part.title, partNumber: part.number, stepNumber: index + 1 })))
  return {
    id: 'tme',
    title: isId ? 'Tutorial Teknis Cubicost TME-C' : 'Cubicost TME-C Technical Tutorial',
    intro: isId ? 'Pelajari alur kerja Cubicost TME mulai dari persiapan gambar, identifikasi sistem MVAC, pemadam kebakaran, elektrikal, dan plumbing hingga perhitungan kuantitas.' : 'Learn the Cubicost TME workflow from drawing preparation and MVAC, fire-protection, electrical and plumbing identification through quantity calculation.',
    tutorialParts, allSteps, lessonCount: allSteps.length, status: 'available',
  }
}
