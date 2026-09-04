const scenes = {
  tas: {
    14: ['dialog New Project dengan callout Project Title, Measurement Rules, dan Ground Elevation', 'the New Project dialog with Project Title, Measurement Rules, and Ground Elevation callouts'],
    15: ['ruang kerja berlabel Function Tab, Ribbon, Element Navigation, Main Operation, dan Status Bar', 'the workspace labelled Function Tab, Ribbon, Element Navigation, Main Operation, and Status Bar'],
    16: ['perbandingan Public Attribute dan Private Attribute pada Attribute Editor', 'the Public Attribute and Private Attribute comparison in the Attribute Editor'],
    17: ['alur Project Setting dari Floor Setting menuju Grade Setting', 'the Project Setting flow from Floor Setting to Grade Setting'],
    19: ['tabel Floor Settings dengan Insert Floor, Floor Height, dan Bottom Elevation', 'the Floor Settings table with Insert Floor, Floor Height, and Bottom Elevation'],
    20: ['tabel Grade Settings dengan Concrete Grade dan Copy to Other Floor', 'the Grade Settings table with Concrete Grade and Copy to Other Floor'],
    22: ['diagram alur impor, pemisahan, dan penskalaan gambar DWG serta PDF', 'the workflow for importing, splitting, and scaling DWG and PDF drawings'],
    23: ['Drawing Manager dan dialog pemilihan beberapa file DWG', 'Drawing Manager and the dialog for selecting multiple DWG files'],
    24: ['Split Drawing, batas seleksi kuning, dan dialog penamaan gambar', 'Split Drawing, a yellow selection boundary, and the drawing-name dialog'],
    25: ['Scale Drawing, dua titik referensi, dan dialog Input Actual Length', 'Scale Drawing, two reference points, and the Input Actual Length dialog'],
    26: ['Relocate dengan titik referensi gambar dan perpotongan axis grid', 'Relocate with drawing and axis-grid reference intersections'],
    28: ['contoh orthogonal, arc, dan diagonal axis grid', 'orthogonal, arc, and diagonal axis-grid examples'],
    30: ['Pick Sideline dengan pilihan layer atau colour dan garis axis terpilih', 'Pick Sideline with layer or colour selection and selected axis lines'],
    31: ['Pick Label dengan pilihan layer atau colour dan label axis terpilih', 'Pick Label with layer or colour selection and selected axis labels'],
    32: ['Auto-Identify di atas denah axis grid', 'Auto-Identify above an axis-grid plan'],
    34: ['New Orthogonal Axis Grid dengan field direction, numbering, dan distance', 'New Orthogonal Axis Grid with direction, numbering, and distance fields'],
    38: ['Pick Sideline dan frame pile cap PC2 pada denah', 'Pick Sideline and the PC2 pile-cap frame on the plan'],
    39: ['Pick Label dan teks PC2 pada denah pile cap', 'Pick Label and the PC2 text on the pile-cap plan'],
    40: ['Auto-Identify dengan outline pile cap dan hasil model 3D', 'Auto-Identify with pile-cap outlines and the resulting 3D model'],
    41: ['tabel pile cap dengan Volume dan Area of Formwork', 'the pile-cap table with Volume and Area of Formwork'],
    43: ['contoh composite, round, steel, dan slanted column', 'composite, round, steel, and slanted column examples'],
    45: ['Pick Sideline dan outline kolom K2 pada denah', 'Pick Sideline and the K2 column outline on the plan'],
    46: ['Pick Label dan teks K2 pada denah kolom', 'Pick Label and the K2 text on the column plan'],
    47: ['Auto-Identify dengan outline dan hasil kolom 3D berwarna ungu', 'Auto-Identify with outlines and purple 3D column results'],
    50: ['Pick Sideline dan garis batas balok pada denah', 'Pick Sideline and beam boundary lines on the plan'],
    51: ['Pick Label, label 1B2 300x700, dan Auto-Identify', 'Pick Label, the 1B2 300x700 label, and Auto-Identify'],
    52: ['Identification Check, daftar error, Attribute Editor, dan model balok 3D', 'Identification Check, its error list, the Attribute Editor, and a 3D beam model'],
    53: ['tabel balok dengan Volume dan Area of Formwork', 'the beam table with Volume and Area of Formwork'],
    56: ['contoh in-situ slab, spiral ramp, dan bondek slab', 'in-situ slab, spiral ramp, and bondek slab examples'],
    57: ['Pick Label dan label pelat S1 pada denah', 'Pick Label and the S1 slab label on the plan'],
    58: ['Pick Slab Opening Line dan batas opening pada denah', 'Pick Slab Opening Line and an opening boundary on the plan'],
    59: ['Identify Slab, identification options, thickness table, dan model 3D', 'Identify Slab, identification options, the thickness table, and a 3D model'],
    60: ['tabel pelat dengan Volume, soffit formwork, serta edge dan break lengths', 'the slab table with Volume, soffit formwork, and edge and break lengths'],
    64: ['contoh brick wall, lightweight panel, block wall, dan glass wall', 'brick, lightweight-panel, block, and glass wall examples'],
    65: ['Pick Concrete Wall Sideline dan garis dinding struktur terpilih', 'Pick Concrete Wall Sideline and selected structural-wall lines'],
    66: ['Pick Wall Label dan teks RC WALL 1', 'Pick Wall Label and the RC WALL 1 text'],
    67: ['Auto-Identify, dialog konfirmasi, dan hasil dinding 3D', 'Auto-Identify, its confirmation dialog, and resulting 3D walls'],
    68: ['tabel dinding struktur dengan concrete dan formwork results', 'the structural-wall table with concrete and formwork results'],
    69: ['denah masonry wall dengan garis dinding yang diberi sorotan', 'a masonry-wall plan with highlighted wall lines'],
    70: ['kontrol identifikasi opening dan masonry wall pada denah', 'opening and masonry-wall identification controls on a plan'],
    72: ['Attribute Editor dinding dan hasil model yang teridentifikasi', 'the wall Attribute Editor and identified model result'],
    73: ['tabel dinding arsitektur dengan nilai Area', 'the architectural-wall table with Area values'],
    77: ['schedule pintu dan jendela dengan area tabel terpilih', 'a door and window schedule with its table area selected'],
    78: ['dialog pemetaan kolom schedule pintu dan jendela', 'the door and window schedule column-mapping dialog'],
    80: ['Element List dengan tipe opening hasil identifikasi', 'the Element List with identified opening types'],
    81: ['denah opening dengan label terpilih dan hasil Auto Identify', 'an opening plan with selected labels and Auto Identify results'],
    85: ['Excel Finish Schedule dan tabel pemetaan atribut finish', 'an Excel Finish Schedule and its finish-attribute mapping table'],
    86: ['Attribute Editor finish dengan pilihan material texture', 'the finish Attribute Editor with material-texture options'],
    87: ['denah ruang untuk penerapan finish menggunakan Point', 'a room plan for applying finishes with Point'],
    88: ['model 3D dengan material finish pada lantai dan dinding', 'a 3D model with floor and wall finish materials'],
    89: ['Regenerate Finish dan area model yang diperbarui', 'Regenerate Finish and the updated model area'],
    93: ['menu measurement rules dan pilihan aturan pengukuran', 'the measurement-rules menu and rule choices'],
    94: ['tabel quantity dengan baris elemen dan nilai pengukuran', 'a quantity table with element rows and measurement values'],
    95: ['panel pemeriksaan quantity dan elemen model terkait', 'the quantity-review panel and related model elements'],
    96: ['dialog pengaturan deduction dengan opsi perhitungan', 'the deduction-settings dialog with calculation options'],
    97: ['hubungan elemen dan aturan deduction pada model', 'element relationships and deduction rules in the model'],
    98: ['hasil quantity sebelum dan sesudah deduction diterapkan', 'quantity results before and after deductions are applied'],
    99: ['Model Check dan daftar pemeriksaan elemen', 'Model Check and its element-check list'],
    100: ['daftar temuan model dengan elemen bermasalah yang disorot', 'the model-findings list with a highlighted problem element'],
    101: ['model 3D dan hasil akhir pemeriksaan quantity', 'the 3D model and final quantity-check results'],
  },
  trb: {
    103: ['menu ekspor model TAS untuk transfer ke TRB', 'the TAS model-export menu for transfer to TRB'], 104: ['dialog Export Model dengan pilihan elemen dan lantai', 'the Export Model dialog with element and floor selections'], 105: ['status ekspor dan file model yang dihasilkan', 'the export status and resulting model file'],
    106: ['Import Model dan dialog pemilihan file TRB', 'Import Model and the TRB file-selection dialog'], 107: ['dialog import dengan daftar floor dan mapping model', 'the import dialog with its floor list and model mapping'], 108: ['ringkasan pengaturan import sebelum model dimuat', 'the import-settings summary before loading the model'],
    109: ['model bangunan dan Element Entity Display Settings', 'the building model and Element Entity Display Settings'], 110: ['Drawing Manager dengan gambar struktur di area kerja', 'Drawing Manager with a structural drawing in the workspace'],
    112: ['Attribute Editor pile cap dan reinforcement mode', 'the pile-cap Attribute Editor and reinforcement mode'], 113: ['Attribute Editor pile cap dan diagram Slab Style Reinforcement', 'the pile-cap Attribute Editor and Slab Style Reinforcement diagram'], 114: ['data pile cap dan tampilan reinforcement', 'pile-cap data and the reinforcement view'], 115: ['hasil pemeriksaan pile cap pada model dan tabel', 'pile-cap check results in the model and table'],
    117: ['Attribute Editor kolom dengan All Main Bars, Links, dan Legs', 'the column Attribute Editor with All Main Bars, Links, and Legs'], 118: ['Rebar Input Helper untuk main bars dan links', 'the Rebar Input Helper for main bars and links'], 119: ['editor penampang dengan Corner Bar, Side Bar, dan Draw Link', 'the section editor with Corner Bar, Side Bar, and Draw Link'],
    123: ['pilihan Identify Column Schedule dari Excel atau CAD/PDF', 'Identify Column Schedule choices for Excel or CAD/PDF'], 124: ['Excel schedule, mapping heading, dan Delete Row', 'an Excel schedule, heading mapping, and Delete Row'], 125: ['Identify Schedule dengan floor picker dan Generate in Column Schedule', 'Identify Schedule with a floor picker and Generate in Column Schedule'], 126: ['Define Column Schedule dengan Sync to Entity', 'Define Column Schedule with Sync to Entity'], 127: ['Column Schedule dengan Generate from Element dan Sync to Entity', 'Column Schedule with Generate from Element and Sync to Entity'],
    129: ['detail penampang balok dan field reinforcement', 'a beam-section detail and reinforcement fields'], 130: ['perbandingan notasi plus dan garis miring pada tulangan balok', 'a comparison of plus and slash notation for beam bars'], 131: ['Side Label, balok terpilih, dan tabel input reinforcement', 'a Side Label, selected beam, and reinforcement input table'], 133: ['balok terpilih dan hasil Rebar Layout', 'a selected beam and its Rebar Layout result'], 134: ['Beam Schedule dan kontrol import atau export', 'the Beam Schedule and its import or export controls'], 135: ['tabel mapping beam schedule dan field reinforcement', 'the beam-schedule mapping table and reinforcement fields'], 136: ['alur Excel menuju Generate in Beam Schedule', 'the workflow from Excel to Generate in Beam Schedule'], 137: ['Generate Element dan Sync Beam Info pada Beam Schedule', 'Generate Element and Sync Beam Info in the Beam Schedule'], 138: ['hubungan support balok dan rentang reinforcement', 'beam-support relationships and reinforcement ranges'],
    140: ['Element List Slab Main Bar dan denah reinforcement', 'the Slab Main Bar Element List and reinforcement plan'], 141: ['Attribute Editor slab dan label D10-200', 'the slab Attribute Editor and D10-200 labels'], 142: ['kontrol tulangan utama dan area penempatannya', 'main-bar controls and their placement area'], 144: ['Parametric Arrangement dengan pilihan tipe raft', 'Parametric Arrangement with raft-type choices'], 145: ['hasil susunan tulangan pada denah pelat', 'the reinforcement arrangement on the slab plan'], 146: ['kontrol tulangan tumpuan dan garis support', 'support-bar controls and support lines'], 147: ['hasil tulangan tumpuan dengan spacing dan rentang', 'the support-bar result with spacing and extents'],
    149: ['RC Wall pada Element List dan detail shear wall', 'RC Wall in the Element List and a shear-wall detail'], 150: ['Attribute Editor RC Wall dengan vertical, horizontal, hooks, dan cover', 'the RC Wall Attribute Editor with vertical, horizontal, hooks, and cover fields'], 151: ['detail shear wall dengan segmen dinding disorot', 'a shear-wall detail with highlighted wall segments'], 152: ['Calculation Rules untuk ujung dinding dengan kolom', 'Calculation Rules for a wall end connected to a column'],
    155: ['menu Quantity dengan Calculate dan Calculate Selected Entity', 'the Quantity menu with Calculate and Calculate Selected Entity'], 156: ['Edit Rebar dan model tulangan dinding 3D', 'Edit Rebar and a 3D wall-reinforcement model'], 157: ['Rebar Layout untuk balok, dinding, dan kolom', 'Rebar Layout views for beams, walls, and columns'], 158: ['View Quantity dengan rincian batang dan formula', 'View Quantity with bar and formula details'], 159: ['View Quantity by Category dan Set Classification Condition', 'View Quantity by Category and Set Classification Condition'], 160: ['panel Report dengan Rebar Schedule dan ringkasan elemen', 'the Report panel with Rebar Schedule and element summaries'],
  },
}

const fallback = {
  tas: ['antarmuka TAS dengan ribbon, panel data, dan area model yang disorot', 'the TAS interface with its ribbon, data panel, and highlighted model area'],
  trb: ['antarmuka TRB dengan ribbon, panel reinforcement, dan area gambar yang disorot', 'the TRB interface with its ribbon, reinforcement panel, and highlighted drawing area'],
}

export function getScreenshotCopy(product, page, language) {
  const isId = language === 'id'
  const visible = (scenes[product]?.[page] || fallback[product])[isId ? 0 : 1]
  const subject = `${visible.charAt(0).toUpperCase()}${visible.slice(1)}`
  const directCaption = `${subject}.`
  return {
    caption: directCaption,
    alt: isId
      ? `${product.toUpperCase()}: potongan antarmuka yang menampilkan ${visible}`
      : `${product.toUpperCase()}: cropped interface showing ${subject.charAt(0).toLowerCase()}${subject.slice(1)}`,
  }
}
