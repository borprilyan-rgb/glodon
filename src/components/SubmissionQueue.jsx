import { useEffect, useSyncExternalStore } from 'react'
import { submissionStore } from '../firebase/submissionStore'
import '../styles/submissions.css'

export default function SubmissionQueue({ language, course }) {
  const records = useSyncExternalStore(submissionStore.subscribe, submissionStore.getSnapshot)
  const en = language === 'en'
  useEffect(() => {
    const retry = () => { void submissionStore.syncPending() }
    retry()
    window.addEventListener('online', retry)
    return () => window.removeEventListener('online', retry)
  }, [])
  const visible = records.filter(record => !course || record.payload.course === course)
  if (!visible.length) return null
  const labels = en ? { pending: 'Pending central save', saving: 'Saving to central results…', saved: 'Saved centrally', failed: 'Central save failed — still pending' } : { pending: 'Menunggu penyimpanan pusat', saving: 'Menyimpan hasil ke pusat…', saved: 'Tersimpan di pusat', failed: 'Gagal menyimpan ke pusat — masih tertunda' }
  return <section className="exercise-card central-submissions" aria-label={en ? 'Central submissions' : 'Pengiriman hasil pusat'}>
    <h2>{en ? 'Central result storage' : 'Penyimpanan hasil pusat'}</h2>
    <p>{en ? 'Employee IDs are self-reported. Scores are calculated in this browser and are unverified.' : 'Nomor karyawan diisi sendiri. Nilai dihitung di browser dan belum diverifikasi.'}</p>
    <ul>{visible.map(record => <li key={record.payload.attemptId}>
      <strong>{record.payload.course === 'tme' ? 'TME-C' : record.payload.course.toUpperCase()} · {en ? 'Section' : 'Bagian'} {record.payload.section} · {record.payload.score}/{record.payload.maximumScore}</strong>
      <p role="status">{labels[record.status]}</p>
      {record.confirmedAt && <small>{new Date(record.confirmedAt).toLocaleString(language === 'en' ? 'en-GB' : 'id-ID', { timeZone: 'Asia/Jakarta' })} (Asia/Jakarta)</small>}
      {!record.localSaved && <p role="alert">{record.status === 'saved' ? (en ? 'The central record is saved, but its local copy could not be stored in this browser.' : 'Hasil telah tersimpan di pusat, tetapi salinan lokal tidak dapat disimpan di browser ini.') : (en ? 'Browser storage is unavailable. This attempt may be lost after refreshing. Keep this page open until the server confirms it.' : 'Penyimpanan browser tidak tersedia. Percobaan ini dapat hilang setelah memuat ulang. Tetap buka halaman ini sampai server mengonfirmasi.')}</p>}
      {record.error && <p>{record.error}</p>}
      {['pending', 'failed'].includes(record.status) && <button className="secondary-button" type="button" onClick={() => { void submissionStore.sync(record.payload.attemptId) }}>{en ? 'Retry Central Save' : 'Coba Simpan ke Pusat Lagi'}</button>}
    </li>)}</ul>
  </section>
}
