import source from './pileCapReport.source.json' with { type: 'json' }

const definitions = [
  ['A', null, 'Kategori zona konstruksi yang dipakai untuk mengelompokkan data.', 'Nilai [Null] adalah teks yang tercantum pada sumber. Ini menunjukkan zona tidak terisi pada pengelompokan ini; bukan kuantitas nol.'],
  ['B', null, 'Nama lantai yang menjadi kelompok lokasi elemen dalam report.', 'Foundation Floor berlaku untuk delapan baris data karena sel B3:B10 digabung. Nama lantai tidak menyatakan elevasi numerik.'],
  ['C', null, 'Nama elemen atau tipe Pile Cap yang menjadi kelompok report.', 'PS.1 adalah nama dari sumber, bukan jumlah unit atau ukuran. Rincian geometri tidak dapat ditentukan hanya dari nama ini.'],
  ['D', 'm3', 'Volume yang dilaporkan untuk kelompok Pile Cap pada baris tersebut.', '1.584 adalah volume untuk baris PS.1. Jangan langsung menganggapnya volume satu unit; Number(pc) pada baris yang sama adalah 8. Aturan deduction tidak dijelaskan dalam worksheet ini.'],
  ['E', 'm2', 'Luas bekisting yang dilaporkan sebagai Area of formwork.', '8.260 adalah nilai report pada baris PS.1. Jangan menjumlahkannya lagi dengan kolom F–H tanpa memeriksa aturan report; worksheet tidak memberikan hubungan penjumlahannya.'],
  ['F', 'm2', 'Luas yang diberi label soffit, yaitu sisi bawah elemen.', '2.315 adalah luas soffit yang dilaporkan pada baris PS.1. Label ini tidak membuktikan seluruh luas tersebut harus menjadi item bekisting dalam BOQ.'],
  ['G', 'm2', 'Luas yang diberi label side, yaitu sisi samping elemen.', '8.260 adalah luas side pada baris PS.1. Kesamaan nilainya dengan Area of formwork pada data ini tidak menetapkan aturan umum untuk proyek lain.'],
  ['H', 'm2', 'Luas yang diberi label top, yaitu sisi atas elemen.', '0.140 adalah nilai pada H3. H5:H10 kosong pada sumber dan tetap ditampilkan kosong, bukan diubah menjadi nol. Pastikan maknanya melalui model dan aturan proyek sebelum dipakai dalam BOQ.'],
  ['I', 'pc', 'Jumlah yang dilaporkan untuk kelompok elemen pada baris tersebut.', '8 adalah jumlah pada baris PS.1, bukan nama tipe. Total report adalah 72; jumlah ini tidak menjelaskan ukuran tiap entity.'],
  ['J', 'kg', 'Berat tulangan yang dilaporkan untuk kelompok Pile Cap pada baris tersebut.', '79.200 adalah berat pada baris PS.1. Worksheet ini tidak menjelaskan asal berat, diameter, panjang batang, atau rumusnya; jangan menganggapnya rincian penulangan yang telah diverifikasi.'],
]

export const pileCapReport = {
  source,
  groups: [
    { title: source.cells.A1.raw, from: 0, count: 3, range: 'A–C' },
    { title: source.cells.D1.raw, from: 3, count: 7, range: 'D–J' },
  ],
  columns: definitions.map(([letter, unit, definition, interpretation], index) => ({
    letter, header: source.cells[`${letter}2`].raw, unit, definition, interpretation,
    group: index < 3 ? source.cells.A1.raw : source.cells.D1.raw,
    example: source.cells[`${letter}3`].display, exampleCell: `${letter}3`,
  })),
  rows: Array.from({ length: 8 }, (_, index) => index + 3),
}

export function reportCell(letter, row) {
  return source.cells[`${letter}${row}`].display
}

// Retain the original import name for the first report route.
export { reportProgressKey, loadReportProgress } from './tasReports.js'
import { reportLessons } from './tasReports.js'
export const reportPrototype = reportLessons[0]
