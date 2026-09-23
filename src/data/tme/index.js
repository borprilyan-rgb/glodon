const action = (title, description, image) => ({ title, description, image })
const lesson = (id, title, purpose, goal, actions) => ({ id, title, purpose, goal, actions })
const sourceModuleByLesson = {
  'setting-lantai': 1, 'setting-gambar': 2,
  'mvac-equipment-plenum-grille': 3, 'mvac-duct': 4, 'mvac-pipa-ac': 5,
  'fire-peralatan': 6, 'fire-pipa': 7, 'fire-valve': 8,
  'electrical-diagram-panel': 9, 'electrical-panel': 10, 'electrical-rak-kabel': 11, 'electrical-kabel': 12, 'electrical-lampu-saklar-stop-kontak': 13,
  'plumbing-equipment': 14, 'plumbing-sanitary': 15, 'plumbing-pipa': 16, 'plumbing-valve-aksesori': 17,
  'penyesuaian-lantai': 18, 'penyesuaian-atribut': 19,
}

// The TME-C curriculum follows the supplied modules exactly, in their original numbered order.
const definitions = [
  { number: '01', title: 'Setting', summary: 'Setting lantai dan gambar sebagai acuan identifikasi.', lessons: [
    lesson('setting-lantai', 'Setting Lantai', 'Menyesuaikan jumlah, nama dan elevasi lantai.', 'Agar quantity riser dapat teridentifikasi dan dapat dikelompokkan sesuai dengan nama lantainya.', [
      action('Setting lantai, import gambar, skala & tentukan as acuan', '', 'module-01.svg'),
      action('Setting lantai', 'Project Setting → Floor Setting → Batch Insert Floor → isi jumlah penambahan lantai → OK. Atau: Project Setting → Floor Setting → Insert Floor beberapa kali sesuai jumlah lantai yang diinginkan. Nama lantai: klik salah satu lantai pada kolom Floor Name → ketik nama lantai yang diinginkan. Elevasi lantai: klik salah satu lantai pada kolom Floor Height → ketik angka ketinggian lantai sesuai desain.', 'floor-settings-open.png'),
    ]),
    lesson('setting-gambar', 'Setting Gambar', 'Mengunggah gambar, cek skala, penyesuaian lantai dan menentukan axis grid.', 'Sebagai dasar identifikasi, agar panjang sesuai aktual, agar hasil dapat terkelompokkan sesuai lantai dan axis grid tiap denah sama.', [
      action('Upload gambar dan cek skala', 'Upload gambar: Add Drawing → cari lokasi file → pilih gambar (satu/lebih) → Open. Cek skala 1: Scale Drawing → blok gambar → klik kanan → klik 2 titik as yang dicek → ketik nilai sesuai panjang aktual (jika berbeda) → OK. Cek skala 2: Identify & Draw → Measure Distance → klik 2 titik as yang dicek → bagi jarak yang dihasilkan dengan jarak aktual → klik kolom Scale → ketik nilai perbandingan (1:1,25).', 'prepare-drawings-add.png'),
      action('Penyesuaian lantai dan titik acuan', 'Penyesuaian lantai: klik kolom Floor → klik tanda titik 3 → pilih lantai → OK. Titik acuan: Locate → klik garis as 1 → klik garis as A.', 'prepare-drawings-floor-locate.png'),
      action('Pemisahan denah sesuai lantai', 'Split Drawing → blok salah satu denah → klik kanan → ketik judul gambar → pilih lantai yang sesuai → OK → OK. Hasil menunjukkan hasil pemisahan sesuai judul gambar dan lantainya masing-masing.', 'prepare-drawings-split-name.png'),
    ]),
  ]},
  { number: '02', title: 'Pekerjaan MVAC', summary: 'Identifikasi equipment, plenum, grille, duct, flexible duct, damper, dan pipa AC.', lessons: [
    lesson('mvac-equipment-plenum-grille', 'Identifikasi Equipment, Plenum dan Grille', 'Mengidentifikasi gambar peralatan sesuai dengan nama, tipe, kapasitas dan atribut lainnya.', 'Agar quantity hasil kalkulasi dapat dikelompokkan berdasarkan tipe, kapasitas dan atribut lainnya.', [
      action('Equipment, Plenum, Grille, Duct, Flexible, Damper, Grouping', '', 'module-03.svg'),
      action('Membuat Element List dan identifikasi', 'Membuat Element List: AC&MV → Equipment/Plenum Box/Air Grille → New Equipment/Plenum Box/Air Grille → Edit Atribut. Equipment: pilih Element List → Equipment/Device → blok gambar equipment → klik kanan → Select Floor → pilih 1 atau lebih lantai → OK → Identify → +Create. Plenum & Grille: pilih Element List → Device → blok gambar → klik kanan → Select Floor → pilih 1 atau lebih lantai → OK → Identify → +Create.', 'mvac-equipment-identify.png'),
    ]),
    lesson('mvac-duct', 'Identifikasi Duct', 'Mengidentifikasi ducting yang berdasarkan fungsinya (supply, return, fresh & exhaust duct) sesuai dengan equipmentnya.', 'Agar quantity hasil kalkulasi dapat dikelompokkan berdasar dimensi dan nama equipmentnya.', [
      action('Identifikasi duct dan fitting duct', 'Air Duct → Duct System Identify → klik label dimensi → klik kanan → klik 2 garis duct → klik kanan → edit atribut system (Supply/Return/Fresh/Exhaust Duct) → edit elevasi → Remark (isi nama equipment) → OK. Fitting Duct: Fitting Identification → blok entity duct/pilih sebagian → klik kanan.', 'mvac-main-duct-identify.png'),
      action('Riser duct dan koneksi grille', 'Riser Duct: pilih Element List → Riser → atur elevasi bawah → atur elevasi atas → klik titik riser. Koneksi Grille: pilih Element List → General Edit → Pipe to Device → klik entitas grille → klik kanan → klik entitas duct.', 'mvac-main-duct-riser.png'),
      action('Flexible duct', 'Membuat Element List: Air Duct → New → Flexible Duct → Edit Atribut. Identifikasi Flexible Duct: pilih Element List → ACMV Pipe Work → Generate Flexible Ducts → Auto Identify → pilih salah satu gambar flexible duct → klik kanan. Penyesuaian Flexible dengan Equipment: pilih semua entitas flexible duct dalam satu line → Remark (isi nama equipment).', 'mvac-flexible-duct.png'),
      action('Volume damper', 'Membuat Element List: Air Damper → New → Air Damper → Edit Atribut. Identifikasi Volume Damper: pilih Element List → Device → pilih gambar volume damper → klik kanan → Select Floor → pilih satu atau lebih lantai → OK → Identify → +Create.', 'mvac-damper-identify.png'),
    ]),
    lesson('mvac-pipa-ac', 'Identifikasi Pipa AC', 'Mengidentifikasi pipa sesuai dengan fungsi, dimensi dan nama group/equipmentnya.', 'Agar quantity hasil kalkulasi dapat dikelompokkan sesuai fungsi, dimensi dan nama group/equipmentnya.', [
      action('Membuat dan identifikasi pipa AC', 'Membuat Element List: Pipe → New (Pipe untuk Drain & Refrigerant Pipe untuk Pipa Refrigerant) → Edit Atribut. Identifikasi Pipa: pilih Element → Single Line → Generate by Element → klik gambar pipa.', 'mvac-pipe-create.png'),
    ]),
  ]},
  { number: '03', title: 'Pekerjaan Pemadam', summary: 'Identifikasi peralatan, pipa, riser, dan valve pemadam.', lessons: [
    lesson('fire-peralatan', 'Identifikasi Peralatan', 'Mengidentifikasi peralatan (pompa, hydrant box, APAR, head sprinkler) sesuai kapasitas dan elevasi.', 'Agar quantity hasil kalkulasi dikelompokkan sesuai dengan nama, tipe dan kapasitas.', [
      action('Equipment, Head, Pipa, & Valve', '', 'module-06.svg'),
      action('Membuat Element List dan identifikasi equipment', 'Membuat Element List: Fire Equipment (untuk peralatan pompa, IHB, OHB, SC & Landing Valve) → New → Edit Atribut. Identifikasi Equipment: pilih Element → Device → blok gambar peralatan → klik kanan → Select Floor → pilih satu/lebih lantai → OK → Identify → +Create.', 'fire-equipment-identify.png'),
    ]),
    lesson('fire-pipa', 'Identifikasi Pipa', 'Mengidentifikasi pipa dari pompa ke shaft, termasuk riser sesuai dengan fungsi dan dimensinya.', 'Agar quantity hasil kalkulasi dikelompokkan sebagai pipa utama sesuai dengan fungsi dan dimensinya.', [
      action('Identifikasi pipa', 'Membuat Element List: Pipe → New Pipe → Edit Atribut. Identifikasi Pipa: pilih Element → Identify Pipe → klik garis pipa → klik kanan → klik label dimensi pipa → klik kanan → Find All → Identify.', 'fire-pipe-identify.png'),
      action('Identifikasi pipa riser dan koneksi beda level', 'Identifikasi Pipa Riser: pilih Element → Riser → atur elevasi bawah → atur elevasi atas → klik pada titik riser. Koneksi Pipa Beda Level: pilih Element → Generate Riser Pipes → klik kedua pipa (atas & bawah) → klik kanan.', 'fire-main-riser.png'),
    ]),
    lesson('fire-valve', 'Identifikasi Valve', 'Mengidentifikasi valve sesuai dengan tipe, fungsi dan dimensinya.', 'Agar quantity hasil kalkulasi dikelompokkan sesuai dengan lantai, tipe, fungsi dan dimensinya.', [
      action('Membuat dan identifikasi valve', 'Membuat Element List: Valve & Flange → New Valve → Edit Atribut. Identifikasi Valve: pilih Element → Device → blok gambar valve → klik kanan → Select Floor → pilih satu/lebih lantai → OK → Identify → +Create.', 'fire-valve-identify.png'),
    ]),
  ]},
  { number: '04', title: 'Pekerjaan Elektrikal', summary: 'Identifikasi diagram panel, panel, rak kabel, kabel, lampu, saklar, dan stop kontak.', lessons: [
    lesson('electrical-diagram-panel', 'Identifikasi Diagram Panel', 'Mengidentifikasi skematik diagram panel mulai dari sumber daya sampai outlet.', 'Memudahkan saat identifikasi panel, kabel feeder dan kabel power.', [
      action('Setting, Equipment, Head, Pipa, & Valve', '', 'module-09.svg'),
      action('Membuat daftar panel dan identifikasi terminal panel & kabel', 'Klik 2x untuk buka gambar → Cable Conduit → System Diagram → Add Distribution Box → klik 2x kolom Name → blok nama panel pada gambar → klik kanan. Klik kolom Terminal Load → klik tanda (…) → pilih satu/lebih panel tujuan → klik kolom Cable Specification → klik tanda (…) → klik satu/lebih nama kabel → klik kolom Circuit Number → klik tanda (…) → pilih satu/lebih nama panel → OK.', 'electrical-panel-names.png'),
    ]),
    lesson('electrical-panel', 'Identifikasi Panel', 'Mengidentifikasi gambar panel sesuai dengan nama panelnya.', 'Agar dapat terdeteksi jumlah panel dan sebagai dasar untuk identifikasi kabel feeder dan power.', [
      action('Identifikasi panel', 'Klik 2x untuk buka gambar → Distribution Board → pilih Element → Device → klik gambar panel → klik kanan → Select Floor → pilih gambar → OK → Identify → +Create.', 'electrical-panel-identify.png'),
    ]),
    lesson('electrical-rak-kabel', 'Identifikasi Rak Kabel', 'Mengidentifikasi gambar sebagai rak kabel sesuai dengan jenis dan dimensinya.', 'Memudahkan untuk identifikasi kabel dan dapat mengelompokkan quantity berdasarkan lantai, tipe dan dimensinya.', [
      action('Membuat dan identifikasi rak kabel', 'Membuat Element List: Cable Tray → New Cable Tray → Edit Atribut. Identifikasi Rak Kabel: pilih Element → Double Line → klik 2 garis rak kabel. Identifikasi Riser: pilih Element → Riser → atur elevasi bawah → atur elevasi atas → klik pada titik riser.', 'electrical-cable-tray-create.png'),
    ]),
    lesson('electrical-kabel', 'Identifikasi Kabel', 'Mengidentifikasi kabel dari panel ke panel dan ke equipment melalui rak kabel.', 'Agar hasil kalkulasi dikelompokkan sesuai nama panel induk dan distribusinya, serta jenis dan dimensi kabelnya.', [
      action('Identifikasi kabel', 'Cable Conduit → pilih Element → Schematic Wiring → Auto-Wiring → klik kanan.', 'electrical-auto-wiring.png'),
    ]),
    lesson('electrical-lampu-saklar-stop-kontak', 'Identifikasi Lampu, Saklar & Stop Kontak', 'Mengidentifikasi lampu, saklar & stop kontak sesuai dengan tipe dan kapasitasnya.', 'Agar hasil kalkulasi dikelompokkan sesuai dengan lantai, tipe dan kapasitasnya.', [
      action('Membuat dan identifikasi lampu, saklar & stop kontak', 'Membuat Element List: Lighting Fixture → New Lamp → Edit Atribut. Identifikasi Lampu: pilih Element → Device → klik gambar lampu → klik kanan → Select Floor → pilih gambar → OK → Identify → +Create. Membuat Element List: Switch & Socket → New Switch/Socket → Edit Atribut. Identifikasi Saklar & Stop Kontak: pilih Element → Device → klik gambar → klik kanan → Select Floor → pilih gambar → OK → Identify → +Create.', 'electrical-lamp.png'),
    ]),
  ]},
  { number: '05', title: 'Pekerjaan Plumbing', summary: 'Identifikasi equipment, sanitary, pipa, valve, dan aksesori plumbing.', lessons: [
    lesson('plumbing-equipment', 'Identifikasi Equipment', 'Mengidentifikasi equipment sesuai dengan jenis, dan kapasitasnya.', 'Agar dapat mengetahui quantity equipment hasil kalkulasi sesuai jenis dan kapasitasnya.', [
      action('Equipment, Air Bersih, Air Kotor, Air Bekas, Pipa Vent dan Air Hujan', '', 'module-14.svg'),
      action('Membuat dan identifikasi equipment', 'Membuat Element List: Equipment → New Equipment → Edit Atribut. Identifikasi Equipment: pilih Element → Device → klik/blok gambar equipment → klik kanan → Select Floor → pilih lantai & gambar → OK → Identify → +Create.', 'plumbing-equipment-identify.png'),
    ]),
    lesson('plumbing-sanitary', 'Identifikasi Sanitary', 'Mengidentifikasi sanitary sesuai dengan jenis dan elevasinya.', 'Agar mempermudahkan saat identifikasi pipa plumbing dari pipa horizontal ke masing-masing unit sanitary.', [
      action('Membuat dan identifikasi sanitary', 'Membuat Element List: Sanitary Ware → New Sanitary Ware → Edit Atribut. Identifikasi Sanitary: pilih Element → Device → klik/blok gambar sanitary → klik kanan → Select Floor → pilih lantai & gambar → OK → Identify → +Create.', 'plumbing-sanitary-create.png'),
    ]),
    lesson('plumbing-pipa', 'Identifikasi Pipa', 'Mengidentifikasi pipa sesuai dengan fungsi, material dan dimensinya.', 'Agar quantity hasil kalkulasi dapat dikelompokkan sesuai jenis material dan dimensinya.', [
      action('Identifikasi pipa single line', 'Membuat Element List: Pipe → New Pipe → Edit Atribut. Identifikasi Pipa: pilih Element → Single Line → klik garis pipa.', 'plumbing-pipe-create.png'),
      action('Identifikasi pipa double line dan koneksi riser', 'Identifikasi Pipa: pilih Element → Double Line → klik garis ke 1 → klik garis ke 2. Koneksi Pipa Riser: pilih Element → Riser → atur level bawah → atur level atas → klik pada titik riser.', 'plumbing-pipe-riser.png'),
    ]),
    lesson('plumbing-valve-aksesori', 'Identifikasi Valve & Aksesori', 'Mengidentifikasi valve dan aksesori sesuai dengan tipe, fungsi dan dimensinya.', 'Agar quantity hasil kalkulasi dikelompokkan sesuai dengan lantai, tipe, fungsi dan dimensinya.', [
      action('Membuat dan identifikasi valve', 'Membuat Element List: Valve & Flange → New Valve → Edit Atribut. Identifikasi Valve: pilih Element → Device → klik/blok gambar valve → klik kanan → Select Floor → pilih lantai & gambar → OK → Identify → +Create.', 'plumbing-valve-accessories.png'),
    ]),
  ]},
  { number: '06', title: 'Penyesuaian', summary: 'Penyesuaian lantai dan atribut entitas.', lessons: [
    lesson('penyesuaian-lantai', 'Penyesuaian Lantai', 'Menyesuaikan entitas hasil identifikasi sesuai dengan lantainya.', 'Agar quantity hasil kalkulasi sesuai dengan lantainya.', [
      action('Lantai & Atribut', '', 'module-18.svg'),
      action('Penyesuaian lantai', 'Batch → pilih semua entitas (kecuali Axis Grid) → OK. Edit atribut pada Entity Floor Level → pilih lantai yang sesuai.', 'plumbing-floor-level.png'),
    ]),
    lesson('penyesuaian-atribut', 'Penyesuaian Atribut', 'Menyesuaikan atribut aksesori MVAC, pemadam dan plumbing sesuai dengan fungsi dan nama equipmentnya.', 'Agar quantity hasil kalkulasi dapat dikelompokkan sesuai fungsi dan nama equipmentnya.', [
      action('Penyesuaian grille & damper dengan equipment', 'Batch → Air Grille & Air Damper → OK → Adapt Linear Entity Attribute → pilih Element → klik atribut yang akan disesuaikan → OK.', 'mvac-damper-attributes.png'),
    ]),
  ]},
]

const englishParts = {
  '01': ['Setup', 'Set up floors and drawings as the identification reference.'],
  '02': ['MVAC Work', 'Identify equipment, plenums, grilles, ducts, flexible ducts, dampers, and AC pipes.'],
  '03': ['Fire-Fighting Work', 'Identify fire-fighting equipment, pipes, risers, and valves.'],
  '04': ['Electrical Work', 'Identify panel diagrams, panels, cable trays, cables, lamps, switches, and sockets.'],
  '05': ['Plumbing Work', 'Identify plumbing equipment, sanitary ware, pipes, valves, and accessories.'],
  '06': ['Adjustments', 'Adjust entity floors and attributes.'],
}

const englishLessons = {
  'setting-lantai': ['Floor Setup', 'Adjust the number, names, and elevations of floors.', 'So riser quantities can be identified and grouped by floor name.', [
    ['Floor setup, drawing import, scale, and axis reference', ''],
    ['Floor setup', 'Project Setting → Floor Setting → Batch Insert Floor → enter the number of floors to add → OK. Alternatively: Project Setting → Floor Setting → Insert Floor repeatedly for the required number of floors. Floor name: click a floor in the Floor Name column → enter the required floor name. Floor elevation: click a floor in the Floor Height column → enter the design floor height.'],
  ]],
  'setting-gambar': ['Drawing Setup', 'Upload drawings, check their scale, assign floors, and set the axis grid.', 'As the basis for identification, so lengths match actual dimensions, results are grouped by floor, and the axis grid is consistent on each plan.', [
    ['Upload drawings and check scale', 'Upload drawings: Add Drawing → find the file location → select one or more drawings → Open. Scale check 1: Scale Drawing → select the drawing → right-click → click the two axis points to check → enter the actual length when different → OK. Scale check 2: Identify & Draw → Measure Distance → click the two axis points to check → divide the measured distance by the actual distance → click the Scale column → enter the ratio (1:1.25).'],
    ['Assign floors and set the reference point', 'Floor assignment: click the Floor column → click the three-dot button → select the floor → OK. Reference point: Locate → click axis line 1 → click axis line A.'],
    ['Split plans by floor', 'Split Drawing → select one plan → right-click → enter the drawing title → select the applicable floor → OK → OK. The result shows the split plans with their respective drawing titles and floors.'],
  ]],
  'mvac-equipment-plenum-grille': ['Identify Equipment, Plenums, and Grilles', 'Identify equipment drawings by name, type, capacity, and other attributes.', 'So calculated quantities can be grouped by type, capacity, and other attributes.', [
    ['Equipment, plenums, grilles, ducts, flexible ducts, dampers, and grouping', ''],
    ['Create the Element List and identify items', 'Create the Element List: AC&MV → Equipment/Plenum Box/Air Grille → New Equipment/Plenum Box/Air Grille → Edit Attributes. Equipment: select Element List → Equipment/Device → select the equipment drawing → right-click → Select Floor → select one or more floors → OK → Identify → +Create. Plenums & Grilles: select Element List → Device → select the drawing → right-click → Select Floor → select one or more floors → OK → Identify → +Create.'],
  ]],
  'mvac-duct': ['Identify Ducts', 'Identify ductwork by function (supply, return, fresh, and exhaust duct) for the applicable equipment.', 'So calculated quantities can be grouped by dimension and equipment name.', [
    ['Identify ducts and duct fittings', 'Air Duct → Duct System Identify → click the dimension label → right-click → click the two duct lines → right-click → edit the system attribute (Supply/Return/Fresh/Exhaust Duct) → edit the elevation → Remark (enter the equipment name) → OK. Duct fittings: Fitting Identification → select all or part of the duct entities → right-click.'],
    ['Duct risers and grille connections', 'Duct riser: select Element List → Riser → set the lower elevation → set the upper elevation → click the riser point. Grille connection: select Element List → General Edit → Pipe to Device → click the grille entity → right-click → click the duct entity.'],
    ['Flexible ducts', 'Create the Element List: Air Duct → New → Flexible Duct → Edit Attributes. Identify flexible ducts: select Element List → ACMV Pipe Work → Generate Flexible Ducts → Auto Identify → select a flexible-duct drawing → right-click. Adjust flexible ducts to equipment: select all flexible-duct entities in one line → Remark (enter the equipment name).'],
    ['Volume dampers', 'Create the Element List: Air Damper → New → Air Damper → Edit Attributes. Identify volume dampers: select Element List → Device → select the volume-damper drawing → right-click → Select Floor → select one or more floors → OK → Identify → +Create.'],
  ]],
  'mvac-pipa-ac': ['Identify AC Pipes', 'Identify pipes by function, dimension, and group/equipment name.', 'So calculated quantities can be grouped by function, dimension, and group/equipment name.', [
    ['Create and identify AC pipes', 'Create the Element List: Pipe → New (Pipe for Drain and Refrigerant Pipe for refrigerant piping) → Edit Attributes. Identify pipes: select Element → Single Line → Generate by Element → click the pipe drawing.'],
  ]],
  'fire-peralatan': ['Identify Equipment', 'Identify equipment (pumps, hydrant boxes, fire extinguishers, and sprinkler heads) by capacity and elevation.', 'So calculated quantities are grouped by name, type, and capacity.', [
    ['Equipment, heads, pipes, and valves', ''],
    ['Create the Element List and identify equipment', 'Create the Element List: Fire Equipment (for pumps, IHB, OHB, SC, and Landing Valve) → New → Edit Attributes. Identify equipment: select Element → Device → select the equipment drawing → right-click → Select Floor → select one or more floors → OK → Identify → +Create.'],
  ]],
  'fire-pipa': ['Identify Pipes', 'Identify pipes from pumps to shafts, including risers, by function and dimension.', 'So calculated quantities are grouped as main pipes by function and dimension.', [
    ['Identify pipes', 'Create the Element List: Pipe → New Pipe → Edit Attributes. Identify pipes: select Element → Identify Pipe → click the pipe line → right-click → click the pipe-dimension label → right-click → Find All → Identify.'],
    ['Identify pipe risers and different-level connections', 'Identify pipe risers: select Element → Riser → set the lower elevation → set the upper elevation → click the riser point. Different-level pipe connection: select Element → Generate Riser Pipes → click both pipes (upper and lower) → right-click.'],
  ]],
  'fire-valve': ['Identify Valves', 'Identify valves by type, function, and dimension.', 'So calculated quantities are grouped by floor, type, function, and dimension.', [
    ['Create and identify valves', 'Create the Element List: Valve & Flange → New Valve → Edit Attributes. Identify valves: select Element → Device → select the valve drawing → right-click → Select Floor → select one or more floors → OK → Identify → +Create.'],
  ]],
  'electrical-diagram-panel': ['Identify the Panel Diagram', 'Identify the panel schematic diagram from the power source to the outlet.', 'To make panel, feeder-cable, and power-cable identification easier.', [
    ['Setup, equipment, heads, pipes, and valves', ''],
    ['Create the panel list and identify panel terminals and cables', 'Double-click to open the drawing → Cable Conduit → System Diagram → Add Distribution Box → double-click the Name column → select the panel name in the drawing → right-click. Click the Terminal Load column → click the (…) button → select one or more destination panels → click the Cable Specification column → click the (…) button → select one or more cable names → click the Circuit Number column → click the (…) button → select one or more panel names → OK.'],
  ]],
  'electrical-panel': ['Identify Panels', 'Identify panel drawings by panel name.', 'So the panel count can be detected and used as the basis for feeder- and power-cable identification.', [
    ['Identify panels', 'Double-click to open the drawing → Distribution Board → select Element → Device → click the panel drawing → right-click → Select Floor → select the drawing → OK → Identify → +Create.'],
  ]],
  'electrical-rak-kabel': ['Identify Cable Trays', 'Identify drawings as cable trays by type and dimension.', 'To make cable identification easier and group quantities by floor, type, and dimension.', [
    ['Create and identify cable trays', 'Create the Element List: Cable Tray → New Cable Tray → Edit Attributes. Identify cable trays: select Element → Double Line → click the two cable-tray lines. Identify risers: select Element → Riser → set the lower elevation → set the upper elevation → click the riser point.'],
  ]],
  'electrical-kabel': ['Identify Cables', 'Identify cables from panel to panel and to equipment through cable trays.', 'So calculated quantities are grouped by main panel, distribution panel, cable type, and cable dimension.', [
    ['Identify cables', 'Cable Conduit → select Element → Schematic Wiring → Auto-Wiring → right-click.'],
  ]],
  'electrical-lampu-saklar-stop-kontak': ['Identify Lamps, Switches, and Sockets', 'Identify lamps, switches, and sockets by type and capacity.', 'So calculated quantities are grouped by floor, type, and capacity.', [
    ['Create and identify lamps, switches, and sockets', 'Create the Element List: Lighting Fixture → New Lamp → Edit Attributes. Identify lamps: select Element → Device → click the lamp drawing → right-click → Select Floor → select the drawing → OK → Identify → +Create. Create the Element List: Switch & Socket → New Switch/Socket → Edit Attributes. Identify switches and sockets: select Element → Device → click the drawing → right-click → Select Floor → select the drawing → OK → Identify → +Create.'],
  ]],
  'plumbing-equipment': ['Identify Equipment', 'Identify equipment by type and capacity.', 'So calculated equipment quantities can be reviewed by type and capacity.', [
    ['Equipment, clean water, dirty water, waste water, vent pipes, and rainwater', ''],
    ['Create and identify equipment', 'Create the Element List: Equipment → New Equipment → Edit Attributes. Identify equipment: select Element → Device → click or select the equipment drawing → right-click → Select Floor → select the floor and drawing → OK → Identify → +Create.'],
  ]],
  'plumbing-sanitary': ['Identify Sanitary Ware', 'Identify sanitary ware by type and elevation.', 'To make plumbing-pipe identification easier from horizontal pipes to each sanitary unit.', [
    ['Create and identify sanitary ware', 'Create the Element List: Sanitary Ware → New Sanitary Ware → Edit Attributes. Identify sanitary ware: select Element → Device → click or select the sanitary drawing → right-click → Select Floor → select the floor and drawing → OK → Identify → +Create.'],
  ]],
  'plumbing-pipa': ['Identify Pipes', 'Identify pipes by function, material, and dimension.', 'So calculated quantities can be grouped by material type and dimension.', [
    ['Identify single-line pipes', 'Create the Element List: Pipe → New Pipe → Edit Attributes. Identify pipes: select Element → Single Line → click the pipe line.'],
    ['Identify double-line pipes and riser connections', 'Identify pipes: select Element → Double Line → click line 1 → click line 2. Pipe-riser connection: select Element → Riser → set the lower level → set the upper level → click the riser point.'],
  ]],
  'plumbing-valve-aksesori': ['Identify Valves and Accessories', 'Identify valves and accessories by type, function, and dimension.', 'So calculated quantities are grouped by floor, type, function, and dimension.', [
    ['Create and identify valves', 'Create the Element List: Valve & Flange → New Valve → Edit Attributes. Identify valves: select Element → Device → click or select the valve drawing → right-click → Select Floor → select the floor and drawing → OK → Identify → +Create.'],
  ]],
  'penyesuaian-lantai': ['Floor Adjustments', 'Adjust identified entities to the correct floor.', 'So calculated quantities match the correct floor.', [
    ['Floors and attributes', ''],
    ['Adjust floors', 'Batch → select all entities (except Axis Grid) → OK. Edit the Entity Floor Level attribute → select the applicable floor.'],
  ]],
  'penyesuaian-atribut': ['Attribute Adjustments', 'Adjust MVAC, fire-fighting, and plumbing accessory attributes by function and equipment name.', 'So calculated quantities can be grouped by function and equipment name.', [
    ['Adjust grilles and dampers to equipment', 'Batch → Air Grille & Air Damper → OK → Adapt Linear Entity Attribute → select Element → click the attribute to adjust → OK.'],
  ]],
}

export function getTmeData(language) {
  const isEnglish = language === 'en'
  const tutorialParts = definitions.map((part) => ({
    id: `part-${Number(part.number)}`,
    number: part.number,
    title: isEnglish ? englishParts[part.number]?.[0] || part.title : part.title,
    summary: isEnglish ? englishParts[part.number]?.[1] || part.summary : part.summary,
    workflow: [],
    steps: part.lessons.map((item) => {
      const translation = englishLessons[item.id]
      const useEnglish = isEnglish && translation
      const [title, purpose, goal, actions] = useEnglish ? translation : [item.title, item.purpose, item.goal, item.actions.map((entry) => [entry.title, entry.description])]
      return {
        id: item.id,
        title,
        intro: `${useEnglish ? 'Purpose' : 'Maksud'}: ${purpose}`,
        duration: `${actions.length * 2} min`,
        manualPages: '',
        instructions: actions.map(([actionTitle]) => actionTitle),
        actions: actions.map(([actionTitle, description], index) => ({
          id: `${item.id}-action-${index + 1}`,
          number: index + 1,
          title: actionTitle,
          description,
          image: item.actions[index].image.endsWith('.svg')
            ? `/tutorial/tme/source-slides/covers/${item.actions[index].image}`
            : `/tutorial/tme/source-slides/module-${String(sourceModuleByLesson[item.id]).padStart(2, '0')}/page-${String(index - (item.actions[0].image.endsWith('.svg') ? 0 : -1)).padStart(2, '0')}.png`,
          imageAlt: `${title}: ${actionTitle}`,
          alt: `${title}: ${actionTitle}`,
          caption: actionTitle,
          requiredDescription: '',
          pending: false,
        })),
        note: `${useEnglish ? 'Goal' : 'Tujuan'}: ${goal}`,
        checks: [purpose, goal],
      }
    }),
  }))
  const allSteps = tutorialParts.flatMap((part) => part.steps.map((step, index) => ({
    ...step,
    partId: part.id,
    partTitle: part.title,
    partNumber: part.number,
    stepNumber: index + 1,
  })))

  return {
    id: 'tme',
    title: isEnglish ? 'Cubicost TME-C Technical Tutorial' : 'Tutorial Teknis Cubicost TME-C',
    intro: isEnglish ? 'Setup, MVAC, fire-fighting, electrical, plumbing, and adjustment work.' : 'Setting, pekerjaan MVAC, pemadam, elektrikal, plumbing, dan penyesuaian.',
    tutorialParts,
    allSteps,
    lessonCount: allSteps.length,
    status: 'available',
  }
}
