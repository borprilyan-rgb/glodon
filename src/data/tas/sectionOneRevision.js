// Format Revisi TAS TRB3.pdf, pages 1–23. PDF locations describe lesson
// content; existing lesson IDs and course navigation remain stable.
const selectLayer = ['Pilih "Select by layer/color".', 'Choose "Select by layer/color".']
const pick = (command, targetId, targetEn) => [
  [`Pilih "${command}".`, selectLayer[0], `Klik ${targetId}, lalu klik kanan.`],
  [`Choose "${command}".`, selectLayer[1], `Click ${targetEn}, then right-click.`],
]
const steps = (id, en) => ({ id, en, numbered: true })
const prose = (id, en) => ({ id, en, numbered: false })
const layer = (command, targetId, targetEn) => steps(...pick(command, targetId, targetEn))
const auto = (modelId, modelEn, confirm = false) => prose(
  [`STEP 1: Pilih "Auto-Identify"${confirm ? ', lalu klik "OK"' : ''}.`, `${modelId} termodelkan.`],
  [`STEP 1: Choose "Auto-Identify"${confirm ? ', then click "OK"' : ''}.`, `${modelEn} is modelled.`],
)
const volume = (element, noteId, noteEn) => prose(
  [`Mengetahui volume dasar ${element} berdasarkan perumusan TAS.`, `Catatan: ${noteId}`],
  [`Review the base ${element} volume using the TAS expression.`, `Note: ${noteEn}`],
)

const revisions = {
  'axis-grid': {
    title: ['Identifikasi Axis Grid', 'Axis Grid Identification'],
    firstPage: 1,
    actions: [
      ['Mengidentifikasi Layer Grid Axis', 'Identify Axis Grid Layers', layer('Pick Axis', 'layer Grid Axis', 'the axis-grid layer')],
      ['Mengidentifikasi Label Axis', 'Identify Axis Labels', layer('Pick Label', 'label Axis', 'the axis label')],
      ['Mengidentifikasi Axis', 'Identify Axes', auto('Axis', 'The axis grid')],
    ],
  },
  'identify-pile-caps': {
    title: ['Identifikasi Pile Cap', 'Pile Cap Identification'],
    firstPage: 4,
    actions: [
      ['Mengidentifikasi Layer Pile Cap', 'Identify Pile Cap Layers', layer('Pick Sideline', 'layer garis luar Pile Cap', 'the pile-cap outline layer')],
      ['Mengidentifikasi Label Pile Cap', 'Identify Pile Cap Labels', layer('Pick Label', 'label Pile Cap', 'the pile-cap label')],
      ['Mengidentifikasi Model Pile Cap', 'Identify the Pile Cap Model', auto('Pile Cap', 'The pile cap')],
      ['Mengubah Ketebalan Pile Cap', 'Change Pile Cap Thickness', steps(
        ['Pada Public Attribute, ubah "Height" Pile Cap berdasarkan gambar detail.'],
        ['In Public Attribute, change the pile-cap "Height" to match the detail drawing.'],
      )],
      ['Mengubah Elevasi Top of Pile Cap', 'Change the Top of Pile Cap Elevation', prose(
        ['Jika semua entity tipe tertentu:', 'STEP 1: Pilih "Batch".', 'STEP 2: Pilih tipe Pile Cap yang ingin diubah elevasinya, lalu klik OK.', 'STEP 3: Pada Private Attribute > Top Elevation, ubah "Floor_Bottom_Elevation" menjadi "Floor_Bottom_Elevation-0.300", lalu tekan Enter.', '', 'Jika hanya entity tertentu saja:', 'STEP 1: Pilih entity Pile Cap tertentu.', 'STEP 2: Pada Private Attribute > Top Elevation, ubah "Floor_Bottom_Elevation" menjadi "Floor_Bottom_Elevation-0.300", lalu tekan Enter.'],
        ['For all entities of a selected type:', 'STEP 1: Choose "Batch".', 'STEP 2: Select the pile-cap type whose elevation you want to change, then click OK.', 'STEP 3: In Private Attribute > Top Elevation, change "Floor_Bottom_Elevation" to "Floor_Bottom_Elevation-0.300", then press Enter.', '', 'For selected entities only:', 'STEP 1: Select the specific pile-cap entity.', 'STEP 2: In Private Attribute > Top Elevation, change "Floor_Bottom_Elevation" to "Floor_Bottom_Elevation-0.300", then press Enter.'],
      )],
      ['Pengecekan Volume untuk Satu Pile Cap', 'Check the Volume of One Pile Cap', volume('Pile Cap', 'Volume Pile Cap tidak ada pengurangan slab karena elevasi Top Pile Cap tepat di bawah Slab.', 'The pile-cap volume has no slab deduction because its top elevation is directly below the slab.')],
    ],
  },
  'identify-columns': {
    title: ['Identifikasi Kolom', 'Column Identification'],
    firstPage: 10,
    actions: [
      ['Mengidentifikasi Layer Kolom', 'Identify Column Layers', layer('Pick Sideline', 'layer garis luar Kolom', 'the column outline layer')],
      ['Mengidentifikasi Label Kolom', 'Identify Column Labels', layer('Pick Label', 'label Kolom', 'the column label')],
      ['Mengidentifikasi Model Kolom', 'Identify the Column Model', auto('Kolom', 'The column')],
      ['Mengubah Bottom Kolom Menerus hingga ke Top Pile Cap', 'Extend the Column Bottom to the Top of the Pile Cap', steps(
        ['Pilih entity Kolom yang ingin diteruskan hingga ke Top Pile Cap.', 'Pada Private Attribute > Bottom Elevation, ubah "Floor_Bottom_Elevation" menjadi "Foundation_Top_Elevation", lalu tekan Enter.'],
        ['Select the column entity to extend to the top of the pile cap.', 'In Private Attribute > Bottom Elevation, change "Floor_Bottom_Elevation" to "Foundation_Top_Elevation", then press Enter.'],
      )],
      ['Pengecekan Volume untuk Satu Kolom', 'Check the Volume of One Column', volume('Kolom', 'Volume Kolom belum ada pengurangan karena slab belum dimodelkan.', 'The column volume has no deduction yet because the slab has not been modelled.')],
    ],
  },
  'identify-beams': {
    title: ['Identifikasi Balok', 'Beam Identification'],
    firstPage: 15,
    actions: [
      ['Membuat Element List Tipe Balok', 'Create Beam Types in the Element List', steps(
        ['Klik "+" pada Element List, lalu pilih "Rectangular Beam".', 'Ubah nama, lebar, dan tinggi Balok sesuai schedule pada gambar.', 'Buat seluruh tipe Balok pada Element List.'],
        ['Click "+" in the Element List, then choose "Rectangular Beam".', 'Set the beam name, width and height to match the drawing schedule.', 'Create all beam types in the Element List.'],
      )],
      ['Mengidentifikasi Layer Balok', 'Identify Beam Layers', layer('Pick Sideline', 'layer garis luar Balok', 'the beam outline layer')],
      ['Mengidentifikasi Label Balok', 'Identify Beam Labels', layer('Pick Label', 'layer label Balok', 'the beam-label layer')],
      ['Mengidentifikasi Model Balok', 'Identify the Beam Model', auto('Balok', 'The beam', true)],
      ['Memeriksa Hasil Pemodelan Balok', 'Check the Beam Model', steps(
        ['Pilih "Identification Check".', 'Klik dua kali pada "Unamed Beam (900x500)" untuk mengarahkan ke Balok tersebut.', 'Karena Balok tersebut bukan bagian dari denah Lantai 1 pada contoh, hapus entity dan element listnya.'],
        ['Choose "Identification Check".', 'Double-click "Unamed Beam (900x500)" to locate that beam.', 'In this example, the beam is not part of the Floor 1 plan; delete its entity and Element List entry.'],
      )],
      ['Pengecekan Volume untuk Satu Balok', 'Check the Volume of One Beam', volume('Balok', 'Volume Balok dikurangi yang terkena Pile Cap dan Kolom. Belum ada pengurangan Slab karena belum dimodelkan.', 'The beam volume deducts intersections with pile caps and columns. There is no slab deduction yet because the slab has not been modelled.')],
    ],
  },
  'identify-slabs': {
    title: ['Identifikasi Slab', 'Slab Identification'],
    firstPage: 21,
    actions: [
      ['Mengidentifikasi Label Slab', 'Identify Slab Labels', layer('Pick Label', 'layer label Slab', 'the slab-label layer')],
      ['Mengidentifikasi Model Slab', 'Identify the Slab Model', steps(
        ['Pilih "Auto-Identify", lalu klik "OK".', 'Konfirmasi ketebalan Slab, lalu klik "OK". Slab termodelkan.', 'Ubah nama Element List Slab sesuai pada gambar.'],
        ['Choose "Auto-Identify", then click "OK".', 'Confirm the slab thickness, then click "OK". The slab is modelled.', 'Rename the Slab Element List entry to match the drawing.'],
      )],
      ['Pengecekan Volume untuk Satu Slab', 'Check the Volume of One Slab', volume('Slab', 'Pada contoh ini, pengurangan hanya terdapat pada volume Bekisting yang terkena Balok.', 'In this example, only the formwork quantity is reduced where it intersects beams.')],
    ],
  },
}

export function applySectionOneRevision(step, language) {
  const revision = revisions[step.id]
  if (!revision) return step
  const localeIndex = language === 'id' ? 0 : 1
  const actions = revision.actions.map(([titleId, titleEn, instruction], index) => {
    const title = localeIndex === 0 ? titleId : titleEn
    const lines = instruction[language]
    const description = lines.map((line, lineIndex) => instruction.numbered ? `STEP ${lineIndex + 1}: ${line}` : line).join('\n')
    const image = `/tutorial/tas/revision-section-1/illustration-${String(revision.firstPage + index).padStart(2, '0')}.png`
    const alt = `${revision.title[localeIndex]}: ${title}`
    const presenterImage = image.replace('/revision-section-1/', '/revision-section-1/presenter/')
    return { id: `${step.id}-action-${index + 1}`, number: index + 1, title, description, image, presenterImage, imageAlt: alt, alt, caption: '', requiredDescription: alt, pending: false, instructionFormat: 'verbatim' }
  })
  return { ...step, title: revision.title[localeIndex], hideIntro: true, showInstructionsBelowImage: true, duration: `${actions.length * 2} min`, instructions: actions.map((action) => `${action.title} ${action.description}`), actions }
}
