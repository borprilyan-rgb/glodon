// Format Revisi TAS TRB part2.pdf replaces Part 2 Steps 5–8.
import source from './partTwoRevision.source.json' with { type: 'json' }

export const partTwoLessonAliases = { 'identify-structural-walls': 'identify-architectural-walls', 'quantity-reports': 'calculate-verify-quantity' }
const revisions = {
  'identify-architectural-walls': {
    title: ['Identifikasi Dinding', 'Wall Identification'],
    actions: [
      [1, 'Mengidentifikasi Layer Dinding', 'Identify Wall Layers', [
        'Pilih "Pick Concrete Wall Sideline", lalu ubah menjadi "Pick Masonry Wall Sideline".',
        'Pilih "Select by layer/color".',
        'Klik layer terluar garis dinding, lalu klik kanan.',
        'Pilih "Auto-Identify".',
      ], [
        'Select "Pick Concrete Wall Sideline", then change to "Pick Masonry Wall Sideline".',
        'Select "Select by layer/color".',
        'Click the outermost wall-line layer, then right-click.',
        'Select "Auto-Identify".',
      ], 'Layer dinding diambil dari garis terluar dinding, termasuk tebal finishing, karena berpengaruh pada volume area finishing lantai dan ceiling. Saat memodelkan Room Finish/Finishing, ketebalannya tidak memengaruhi volume finishing lainnya.',
      'Select the outermost wall line, including the finish thickness, because it affects the floor-finish and ceiling quantities. When modelling Room Finish/Finishing, its thickness does not affect other finish quantities.'],
      [2, 'Pemodelan Dinding secara Manual', 'Model Walls Manually', [
        'Hapus entity dan Element List yang tidak digunakan.',
        'Ubah nama, kategori, material, dan ketebalan dinding pada Attribute Editor.',
        'Modelkan dinding yang belum termodelkan secara manual menggunakan tools "Draw".',
      ], [
        'Delete unused entities and Element List entries.',
        'Change the wall name, category, material, and thickness in the Attribute Editor.',
        'Model any remaining walls manually using the "Draw" tools.',
      ]],
      [3, 'Hasil Pemodelan Dinding', 'Wall Modelling Result', [], []],
    ],
  },
  'identify-openings': {
    title: ['Identifikasi Pintu dan Jendela', 'Door and Window Identification'],
    actions: [
      [4, 'Mengidentifikasi Schedule Pintu dan Jendela', 'Identify the Door and Window Schedule', [
        'Pilih "Element Schedule".',
        'Pilih "Import Excel File", pilih file Schedule Door & Window, lalu klik "Open".',
        'Pastikan kolom dan row sesuai dengan formatnya.',
        'Pilih "Identify".',
      ], [
        'Select "Element Schedule".',
        'Select "Import Excel File", choose the Door & Window Schedule file, then click "Open".',
        'Check that the columns and rows match the required format.',
        'Select "Identify".',
      ]],
      [5, 'Mengidentifikasi Layer Pintu dan Jendela', 'Identify Door and Window Layers', [
        'Pilih "Pick Door/Window Sideline".', 'Pilih "Select by layer/color".', 'Klik layer pintu/jendela, lalu klik kanan.',
      ], [
        'Select "Pick Door/Window Sideline".', 'Select "Select by layer/color".', 'Click the door/window layer, then right-click.',
      ]],
      [6, 'Mengidentifikasi Label Pintu dan Jendela', 'Identify Door and Window Labels', [
        'Pilih "Pick Door/Window Label".', 'Pilih "Select by layer/color".', 'Klik label pintu/jendela, lalu klik kanan.', 'Pilih "Auto-Identify".',
      ], [
        'Select "Pick Door/Window Label".', 'Select "Select by layer/color".', 'Click the door/window label, then right-click.', 'Select "Auto-Identify".',
      ]],
      [7, 'Mengidentifikasi Label Pintu dan Jendela', 'Identify Door and Window Labels', [
        'Pilih "Pick Door/Window Label".', 'Pilih "Select by layer/color".', 'Klik label pintu/jendela, lalu klik kanan.', 'Pilih "Auto-Identify".',
      ], [
        'Select "Pick Door/Window Label".', 'Select "Select by layer/color".', 'Click the door/window label, then right-click.', 'Select "Auto-Identify".',
      ], 'Jika ada pintu/jendela yang belum termodelkan, modelkan secara manual menggunakan tools "Point" pada menu Draw.',
      'If any doors/windows remain unmodelled, model them manually using the "Point" tool on the Draw tab.'],
      [8, 'Hasil Pemodelan Pintu dan Jendela', 'Door and Window Modelling Result', [
        'Jika ada pintu/jendela yang belum termodelkan, modelkan secara manual menggunakan tools "Point" pada menu Draw.',
      ], [
        'If any doors/windows remain unmodelled, model them manually using the "Point" tool on the Draw tab.',
      ]],
    ],
  },
  'apply-finishes': {
    title: ['Identifikasi Room Finish', 'Room Finish Identification'],
    actions: [
      [9, 'Mengidentifikasi Schedule Finish', 'Identify the Finish Schedule', [
        'Pilih "Finish Schedule".', 'Pilih "Import Excel File", pilih file Schedule Finish, lalu klik "Open".',
        'Pastikan kolom dan row sesuai dengan formatnya.', 'Pilih "Identify", lalu klik "OK".',
      ], [
        'Select "Finish Schedule".', 'Select "Import Excel File", choose the Finish Schedule file, then click "Open".',
        'Check that the columns and rows match the required format.', 'Select "Identify", then click "OK".',
      ]],
      [10, 'Mengidentifikasi Room Finish', 'Identify Room Finishes', [
        'Pilih Room pada Element List yang akan dimodelkan.', 'Pilih "Point" pada menu Draw.',
        'Klik area Room pada gambar untuk Element List yang dipilih, lalu klik kanan.',
      ], [
        'Select the Room to model in the Element List.', 'Select "Point" on the Draw tab.',
        'Click the Room area in the drawing for the selected Element List entry, then right-click.',
      ]],
      [11, 'Mengubah Tampilan Material Warna/Texture Finishing', 'Change the Finish Material Colour/Texture', [
        'Pilih Element List/material yang akan diubah tampilannya.', 'Klik "Material Texture" di bagian paling bawah Attribute Editor.',
        'Klik "Import", pilih texture/warna, klik "Open", lalu pilih Material Texture dan klik "Select".',
      ], [
        'Select the Element List entry/material whose appearance you want to change.', 'Click "Material Texture" at the bottom of the Attribute Editor.',
        'Click "Import", choose a texture/colour, click "Open", then choose the Material Texture and click "Select".',
      ]],
      [12, 'Jika Terdapat Perubahan Finishing', 'Update Changed Finishes', [
        'Pilih finishing yang akan diubah.', 'Klik "Regenerate Finish Entity".',
        'Pilih Room dan jenis finishing yang sebelumnya diubah, lalu klik "OK".',
      ], [
        'Select the finish to change.', 'Click "Regenerate Finish Entity".',
        'Select the Room and finish types you changed, then click "OK".',
      ]],
    ],
  },
  'calculate-verify-quantity': {
    title: ['Report Hasil Pemodelan', 'Model Quantity Calculation'],
    actions: [[13, 'Menghitung Quantity Hasil Pemodelan', 'Calculate Model Quantities', [
      'Klik "Calculate" untuk menghitung quantity hasil pemodelan.',
      'Pilih "All Floors", klik "OK", lalu klik "OK" setelah proses perhitungan selesai.',
      'Untuk melihat Quantity Expression, pilih Element List, pilih "View Expression", lalu pilih entity pada model.',
    ], [
      'Click "Calculate" to calculate the model quantities.',
      'Select "All Floors", click "OK", then click "OK" when calculation finishes.',
      'To view a Quantity Expression, select an Element List entry, select "View Expression", then select an entity in the model.',
    ], 'Jika pemodelan direvisi setelah Calculate, jalankan Calculate kembali agar quantity mengikuti model yang telah diubah.',
    'If the model is revised after calculation, run Calculate again to update the quantities to match the changed model.']],
  },
  'quantity-reports': {
    title: ['Report Hasil Model', 'Model Quantity Report'],
    actions: [[14, 'Menghitung Quantity Hasil Pemodelan', 'Review and Export Model Quantities', [
      'Pilih "View Quantity by Category", pilih lantai dan element, lalu klik "OK".',
      'Pilih "Set Classification and Quantity" untuk menampilkan atau menyembunyikan klasifikasi pada Report Quantity, lalu klik "OK".',
      'Klik "Export to Excel", klik "OK", lalu "Save".',
    ], [
      'Select "View Quantity by Category", select the floor and element, then click "OK".',
      'Select "Set Classification and Quantity" to show or hide classifications in the Quantity Report, then click "OK".',
      'Click "Export to Excel", click "OK", then "Save".',
    ]]],
  },
}

// PDF pages 13 and 14 are Actions 1 and 2 of the same Step 8.
revisions['calculate-verify-quantity'].actions.push(...revisions['quantity-reports'].actions)
delete revisions['quantity-reports']

export function replacePartTwoLessons(parts) {
  const byId = new Map(parts.flatMap(part => part.steps).map(step => [step.id, step]))
  const replacements = ['identify-architectural-walls', 'identify-openings', 'apply-finishes', 'calculate-verify-quantity']
  return parts.map(part => {
    if (part.id === 'part-2') return { ...part, steps: [...part.steps.slice(0, 4), ...replacements.map(id => byId.get(id))] }
    // Both former Quantity lessons now live in Part 2 Step 8. App supplies the
    // separate, existing Part 3 Report curriculum.
    if (part.id === 'part-3') return { ...part, steps: [] }
    return part
  })
}

export function applyPartTwoRevision(step, language) {
  const revision = revisions[step.id]
  if (!revision) return step
  const isId = language === 'id'
  const title = revision.title[isId ? 0 : 1]
  const actions = revision.actions.map(([page, titleId, titleEn, linesId, linesEn, noteId, noteEn], index) => {
    const actionTitle = isId ? titleId : titleEn
    const pdfPage = source.pages.find(item => item.page === page)
    const lines = (isId ? pdfPage.instructions || linesId : linesEn).map((line, index) => `STEP ${index + 1}: ${line}`)
    const note = isId ? pdfPage.note || noteId : noteEn
    if (note) lines.push('', `${isId ? 'Catatan' : 'Note'}: ${note}`)
    const image = `/tutorial/tas/revision-part-2/illustration-${String(page).padStart(2, '0')}.png`
    const alt = `${title}: ${actionTitle}`
    return { id: `${step.id}-action-${index + 1}`, number: index + 1, title: actionTitle, description: lines.join('\n'), image, presenterImage: image, imageAlt: alt, alt, caption: '', requiredDescription: alt, pending: false, instructionFormat: 'verbatim', sourcePage: page }
  })
  return { ...step, title, hideIntro: true, showInstructionsBelowImage: true, note: undefined, warning: undefined, duration: `${actions.length * 2} min`, instructions: actions.map(action => `${action.title} ${action.description}`), actions }
}
