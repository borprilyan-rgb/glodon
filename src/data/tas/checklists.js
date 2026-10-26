// Three checks per lesson preserve the existing completion/checklist indices.
// Each item reflects the actions currently taught, including the PDF revisions.
const checklists = {
  'measurement-settings': [
    ['Saya dapat membuka Measurement Setting dan memilih Wall Finish.', 'I can open Measurement Setting and select Wall Finish.'],
    ['Saya dapat meninjau pengaturan posisi finishing, additional height, dan pilihan Yes/No.', 'I can review finish-position settings, additional height, and Yes/No options.'],
    ['Saya dapat mencocokkan pengaturan outer finish dengan kondisi dinding dan ketentuan proyek.', 'I can match outer-finish settings to the wall condition and project requirements.'],
  ],
  'measurement-rules': [
    ['Saya dapat membaca View Expression balok dan mengenali pengurangan akibat kolom.', 'I can read the beam View Expression and identify the deduction caused by a column.'],
    ['Saya dapat menggunakan Filter Relevant Element untuk memeriksa aturan hubungan balok dan kolom.', 'I can use Filter Relevant Element to inspect the beam-column rule.'],
    ['Saya dapat membandingkan expression sebelum dan sesudah perubahan aturan serta Calculate ulang pada contoh.', 'I can compare the expression before and after the example rule change and recalculation.'],
  ],
  'create-project': [
    ['Saya dapat membuat New Project dan mengisi judul proyek.', 'I can create a New Project and enter its title.'],
    ['Saya dapat memilih Measurement Rules yang sesuai dengan proyek.', 'I can select the Measurement Rules applicable to the project.'],
    ['Saya dapat mengisi Existing Ground Level sesuai data proyek.', 'I can enter Existing Ground Level from the project data.'],
  ],
  'tas-interface-attributes': [
    ['Saya dapat menemukan Function Tab, Ribbon, Element Navigation, dan Main Operation.', 'I can locate the Function Tab, Ribbon, Element Navigation, and Main Operation.'],
    ['Saya dapat menjelaskan fungsi Dynamic Control Bar dan Status Bar.', 'I can explain the Dynamic Control Bar and Status Bar.'],
    ['Saya dapat membedakan penggunaan Public Attribute tanpa seleksi dan Private Attribute pada entity terpilih.', 'I can distinguish Public Attributes without a selection from Private Attributes on selected entities.'],
  ],
  'floor-grade-settings': [
    ['Saya dapat menambahkan lantai struktur atas dan bawah melalui Floor Settings.', 'I can add superstructure and substructure floors through Floor Settings.'],
    ['Saya dapat mengisi Floor Height, Bottom Elevation, dan Concrete Grade sesuai data proyek.', 'I can enter Floor Height, Bottom Elevation, and Concrete Grade from the project data.'],
    ['Saya dapat menggunakan Copy to Other Floor ketika lantai tujuan memakai Concrete Grade yang sama.', 'I can use Copy to Other Floor when the destination floors use the same Concrete Grade.'],
  ],
  'import-split-drawing': [
    ['Saya dapat memilih alur impor sesuai format gambar dan menggunakan Identify > Add.', 'I can choose the import workflow for the drawing format and use Identify > Add.'],
    ['Saya dapat menggunakan Split pada Drawing Manager untuk memilih area rencana yang lengkap.', 'I can use Split in Drawing Manager to select a complete plan area.'],
    ['Saya dapat memberi nama gambar hasil split berdasarkan lantai dan jenis gambar.', 'I can name split drawings by floor and drawing type.'],
  ],
  'scale-relocate-drawing': [
    ['Saya dapat menggunakan Scale Drawing dengan dua titik referensi dan actual length.', 'I can use Scale Drawing with two reference points and the actual length.'],
    ['Saya dapat memverifikasi skala dengan dimensi lain yang tidak digunakan saat kalibrasi.', 'I can verify the scale using another dimension that was not used for calibration.'],
    ['Saya dapat menggunakan Relocate untuk menyelaraskan gambar dengan titik axis grid yang sama.', 'I can use Relocate to align the drawing with the matching axis-grid point.'],
  ],
  'axis-grid': [
    ['Saya dapat memilih layer Grid Axis melalui Pick Axis dan Select by layer/color.', 'I can select the axis-grid layer using Pick Axis and Select by layer/color.'],
    ['Saya dapat memilih label axis melalui Pick Label.', 'I can select axis labels using Pick Label.'],
    ['Saya dapat menjalankan Auto-Identify untuk membentuk axis grid.', 'I can run Auto-Identify to generate the axis grid.'],
  ],
  'identify-pile-caps': [
    ['Saya dapat memilih layer dan label Pile Cap lalu menjalankan Auto-Identify.', 'I can select pile-cap layers and labels, then run Auto-Identify.'],
    ['Saya dapat mengubah Height dan Top Elevation Pile Cap melalui Public/Private Attribute sesuai contoh.', 'I can change pile-cap Height and Top Elevation through Public/Private Attributes as shown in the example.'],
    ['Saya dapat membaca expression volume Pile Cap dan menjelaskan catatan pengurangan slab pada contoh.', 'I can read the pile-cap volume expression and explain the example note about slab deductions.'],
  ],
  'identify-columns': [
    ['Saya dapat memilih layer dan label kolom lalu menjalankan Auto-Identify.', 'I can select column layers and labels, then run Auto-Identify.'],
    ['Saya dapat mengubah Bottom Elevation kolom menjadi Foundation_Top_Elevation pada contoh.', 'I can change column Bottom Elevation to Foundation_Top_Elevation in the example.'],
    ['Saya dapat membaca expression volume kolom dan menjelaskan mengapa belum ada pengurangan slab pada tahap ini.', 'I can read the column volume expression and explain why there is no slab deduction at this stage.'],
  ],
  'identify-beams': [
    ['Saya dapat membuat tipe Rectangular Beam beserta nama, lebar, dan tinggi sesuai schedule.', 'I can create Rectangular Beam types with names, widths, and heights matching the schedule.'],
    ['Saya dapat mengidentifikasi layer dan label balok, menjalankan Auto-Identify, dan meninjau Identification Check.', 'I can identify beam layers and labels, run Auto-Identify, and review Identification Check.'],
    ['Saya dapat membaca expression volume balok dan catatan pengurangan akibat Pile Cap serta kolom pada contoh.', 'I can read the beam volume expression and the example deductions for pile caps and columns.'],
  ],
  'identify-slabs': [
    ['Saya dapat memilih label Slab melalui Pick Label dan Select by layer/color.', 'I can select slab labels using Pick Label and Select by layer/color.'],
    ['Saya dapat menjalankan Auto-Identify, mengonfirmasi ketebalan, dan mengubah nama Element List Slab.', 'I can run Auto-Identify, confirm the thickness, and rename the slab Element List entry.'],
    ['Saya dapat membaca expression Slab dan catatan pengurangan bekisting yang terkena balok pada contoh.', 'I can read the slab expression and the example note about formwork deductions at beams.'],
  ],
  'identify-architectural-walls': [
    ['Saya dapat menggunakan Pick Masonry Wall Sideline untuk memilih garis terluar dinding dan menjalankan Auto-Identify.', 'I can use Pick Masonry Wall Sideline to select the outermost wall lines and run Auto-Identify.'],
    ['Saya dapat membersihkan entity/Element List dan mengatur nama, kategori, material, serta ketebalan dinding.', 'I can remove unused entities/Element List entries and set wall names, categories, materials, and thicknesses.'],
    ['Saya dapat melengkapi dinding yang belum termodelkan menggunakan tools Draw dan mengenali hasil model pada gambar.', 'I can model remaining walls with the Draw tools and recognise the resulting model in the image.'],
  ],
  'identify-openings': [
    ['Saya dapat mengimpor Schedule Door & Window melalui Element Schedule dan memeriksa format kolom serta row.', 'I can import a Door & Window Schedule through Element Schedule and check its column and row format.'],
    ['Saya dapat memilih layer serta label pintu/jendela dan menjalankan Auto-Identify.', 'I can select door/window layers and labels and run Auto-Identify.'],
    ['Saya dapat melengkapi pintu/jendela yang belum termodelkan menggunakan Point pada menu Draw.', 'I can model remaining doors/windows using Point on the Draw tab.'],
  ],
  'apply-finishes': [
    ['Saya dapat mengimpor Finish Schedule dan menempatkan Room menggunakan Point.', 'I can import a Finish Schedule and place Rooms using Point.'],
    ['Saya dapat mengubah warna/texture finishing melalui Material Texture pada Attribute Editor.', 'I can change finish colours/textures through Material Texture in the Attribute Editor.'],
    ['Saya dapat menggunakan Regenerate Finish Entity pada Room dan jenis finishing yang diubah.', 'I can use Regenerate Finish Entity for the Room and finish types that changed.'],
  ],
  'calculate-verify-quantity': [
    ['Saya dapat menjalankan Calculate untuk All Floors dan mengetahui kapan Calculate perlu diulang setelah revisi.', 'I can run Calculate for All Floors and explain when to recalculate after revisions.'],
    ['Saya dapat membuka View Expression pada entity model untuk melihat Quantity Expression.', 'I can open View Expression on a model entity to view its Quantity Expression.'],
    ['Saya dapat membuka View Quantity by Category, mengatur Set Classification and Quantity, lalu Export to Excel.', 'I can open View Quantity by Category, configure Set Classification and Quantity, and Export to Excel.'],
  ],
  'pile-cap-report': [
    ['Saya dapat menjelaskan penggunaan Volume(m3) untuk volume beton Pile Cap.', 'I can explain how Volume(m3) is used for pile-cap concrete volume.'],
    ['Saya dapat membedakan Area of formwork(m2), Area of soffit(m2), Area of side(m2), dan Area of top(m2).', 'I can distinguish Area of formwork(m2), Area of soffit(m2), Area of side(m2), and Area of top(m2).'],
    ['Saya dapat menjelaskan Number(pc) dan Weight of rebar(kg) beserta satuannya.', 'I can explain Number(pc) and Weight of rebar(kg), including their units.'],
  ],
  'slab-report': [
    ['Saya dapat membedakan kegunaan Volume(m3) dan Area(m2) pada report In-Situ Slab.', 'I can distinguish the uses of Volume(m3) and Area(m2) in the In-Situ Slab report.'],
    ['Saya dapat membedakan Area of formwork to soffit(m2) dan Area of formwork to edge and break of slab(m2).', 'I can distinguish Area of formwork to soffit(m2) from Area of formwork to edge and break of slab(m2).'],
    ['Saya dapat menjelaskan Weight of rebar(kg) sebagai berat tulangan slab dalam kg.', 'I can explain Weight of rebar(kg) as slab rebar weight in kg.'],
  ],
  'beam-report': [
    ['Saya dapat menjelaskan Volume(m3) sebagai volume beton Beam.', 'I can explain Volume(m3) as beam concrete volume.'],
    ['Saya dapat membedakan Area of formwork(m2), Area of formwork to side of beam(m2), dan Area of formwork to soffit of beam(m2).', 'I can distinguish Area of formwork(m2), Area of formwork to side of beam(m2), and Area of formwork to soffit of beam(m2).'],
    ['Saya dapat menjelaskan Weight of rebar(kg) sebagai berat tulangan Beam dalam kg.', 'I can explain Weight of rebar(kg) as beam rebar weight in kg.'],
  ],
  'column-report': [
    ['Saya dapat membedakan Volume(m3) untuk beton dan Area of formwork(m2) untuk bekisting Column.', 'I can distinguish Volume(m3) for concrete from Area of formwork(m2) for column formwork.'],
    ['Saya dapat menjelaskan Number(pc) untuk jumlah Column dan Weight of rebar(kg) untuk berat tulangan.', 'I can explain Number(pc) for the column count and Weight of rebar(kg) for rebar weight.'],
    ['Saya dapat menjelaskan Girth(m) sebagai keliling elemen Column dalam m.', 'I can explain Girth(m) as the column element perimeter in m.'],
  ],
  'wall-report': [
    ['Saya dapat menjelaskan Area(m2) sebagai luas elemen Wall.', 'I can explain Area(m2) as the wall element area.'],
    ['Saya dapat menjelaskan Net length of wall(m) sebagai panjang bersih dinding.', 'I can explain Net length of wall(m) as the net wall length.'],
    ['Saya dapat membedakan satuan m2 pada Area(m2) dan m pada Net length of wall(m).', 'I can distinguish m2 for Area(m2) from m for Net length of wall(m).'],
  ],
  'openings-report': [
    ['Saya dapat menjelaskan Area of opening(m2) pada report Door dan Window.', 'I can explain Area of opening(m2) in the Door and Window reports.'],
    ['Saya dapat menjelaskan Number(pc) sebagai jumlah elemen Door atau Window.', 'I can explain Number(pc) as the count of Door or Window elements.'],
    ['Saya dapat membedakan Area of frame(m2) untuk frame dan Area of opening(m2) untuk bukaan.', 'I can distinguish Area of frame(m2) for frames from Area of opening(m2) for openings.'],
  ],
  'finishes-report': [
    ['Saya dapat mengenali kolom finishing pada report Room dan Floor Finish beserta kegunaannya.', 'I can identify the finish columns in the Room and Floor Finish reports and explain their uses.'],
    ['Saya dapat membedakan kolom permukaan datar/vertikal pada Waterproof serta panjang/luas pada Skirting.', 'I can distinguish flat/vertical surface columns in Waterproof and length/area columns in Skirting.'],
    ['Saya dapat menjelaskan kolom luas pada Wall Finish serta Area of suspended ceiling(m2) dan Girth(m) pada Suspended Ceiling.', 'I can explain the area columns in Wall Finish and Area of suspended ceiling(m2) and Girth(m) in Suspended Ceiling.'],
  ],
}

export function getTasChecklist(lessonId, language = 'id') {
  const items = checklists[lessonId]
  if (!items) throw new Error(`Missing TAS completion checklist: ${lessonId}`)
  return items.map(item => item[language === 'en' ? 1 : 0])
}
