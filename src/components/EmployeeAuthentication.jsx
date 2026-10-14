import { useState } from 'react'
import { registerEmployee, loginEmployee } from '../firebase/employeeAccounts'
import '../styles/auth.css'

export default function EmployeeAuthentication({ language, session }) {
  const en = language === 'en'
  const [register, setRegister] = useState(false)
  const [name, setName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    setError('')
    if (register && !name.trim()) { setError(en ? 'Enter your full name.' : 'Masukkan nama lengkap Anda.'); return }
    if (register && password !== confirmation) { setError(en ? 'Passwords do not match.' : 'Konfirmasi password tidak cocok.'); return }
    setBusy(true)
    try {
      if (register) await registerEmployee({ name, employeeId, password })
      else await loginEmployee(employeeId, password)
    } catch (failure) {
      const code = failure.code
      setError(code === 'functions/already-exists' ? (en ? 'Employee number is already registered. Sign in with your original password.' : 'No. karyawan sudah terdaftar. Masuk dengan password asli Anda.')
        : ['functions/resource-exhausted', 'auth/too-many-requests'].includes(code) ? (en ? 'Too many attempts. Please try again later.' : 'Terlalu banyak percobaan. Coba lagi nanti.')
        : register ? (en ? 'Registration could not finish. Retry with the same details and original password, or sign in if your account was created.' : 'Pendaftaran belum selesai. Coba lagi dengan data dan password asli yang sama, atau masuk jika akun sudah dibuat.')
        : (en ? 'Unable to sign in. Check your employee number and password, and your connection.' : 'Tidak dapat masuk. Periksa no. karyawan, password, dan koneksi Anda.'))
    } finally { setPassword(''); setConfirmation(''); setBusy(false) }
  }
  if (session.status === 'checking') return <section className="employee-auth exercise-card" role="status">{en ? 'Checking employee account…' : 'Memeriksa akun karyawan…'}</section>
  if (session.status === 'active') return <section className="employee-auth exercise-card"><span className="eyebrow">{en ? 'Employee account' : 'Akun karyawan'}</span><h1>{session.profile.name}</h1><p>{en ? 'Employee number' : 'No. Karyawan'}: <strong>{session.profile.employeeId}</strong></p><p>{en ? 'You are signed in. Learning synchronization and employee assessments are not enabled yet.' : 'Anda sudah masuk. Sinkronisasi pembelajaran dan latihan karyawan belum diaktifkan.'}</p><button className="outline-nav-button" onClick={() => session.logout().catch(() => setError(en ? 'Unable to sign out. Try again.' : 'Gagal keluar. Coba lagi.'))}>{en ? 'Sign Out' : 'Keluar'}</button>{error && <p role="alert">{error}</p>}</section>
  if (session.status === 'disabled') return <section className="employee-auth exercise-card"><h1>{en ? 'Employee accounts' : 'Akun karyawan'}</h1><p>{en ? 'Employee account services have not been enabled in this environment.' : 'Layanan akun karyawan belum diaktifkan di lingkungan ini.'}</p></section>
  if (session.userPresent) return <section className="employee-auth exercise-card"><h1>{en ? 'Account unavailable' : 'Akun tidak tersedia'}</h1><p>{en ? 'Your employee profile could not be verified. Check your connection or contact an administrator.' : 'Profil karyawan tidak dapat diverifikasi. Periksa koneksi atau hubungi administrator.'}</p><button className="outline-nav-button" onClick={() => session.logout().catch(() => setError(en ? 'Unable to sign out.' : 'Gagal keluar.'))}>{en ? 'Sign Out' : 'Keluar'}</button>{error && <p role="alert">{error}</p>}</section>
  return <section className="employee-auth exercise-card">
    <span className="eyebrow">{en ? 'Employee account' : 'Akun karyawan'}</span><h1>{register ? (en ? 'Create your account' : 'Daftar akun karyawan') : (en ? 'Welcome back' : 'Selamat datang kembali')}</h1>
    <p>{en ? 'Use your six-digit employee number. No email address is needed.' : 'Gunakan no. karyawan enam digit. Alamat email tidak diperlukan.'}</p>
    <div className="employee-auth-tabs"><button type="button" aria-pressed={!register} disabled={busy} onClick={() => { setRegister(false); setError(''); setPassword(''); setConfirmation('') }}>{en ? 'Sign In' : 'Masuk'}</button><button type="button" aria-pressed={register} disabled={busy} onClick={() => { setRegister(true); setError(''); setPassword(''); setConfirmation('') }}>{en ? 'Register' : 'Daftar'}</button></div>
    {error && <p role="alert" className="employee-auth-alert">{error}</p>}
    <form onSubmit={submit}>
      {register && <label htmlFor="employee-name">{en ? 'Full name' : 'Nama Lengkap'}<input id="employee-name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} required maxLength={100} disabled={busy} /></label>}
      <label htmlFor="employee-number">{en ? 'Employee number' : 'No. Karyawan'}<input id="employee-number" type="text" inputMode="numeric" autoComplete="username" pattern="[0-9]{6}" minLength={6} maxLength={6} required value={employeeId} onChange={e => setEmployeeId(e.target.value)} disabled={busy} /></label>
      <label htmlFor="employee-password">Password<input id="employee-password" type={show ? 'text' : 'password'} autoComplete={register ? 'new-password' : 'current-password'} minLength={register ? 8 : undefined} maxLength={128} required value={password} onChange={e => setPassword(e.target.value)} disabled={busy} /></label>
      {register && <label htmlFor="employee-confirmation">{en ? 'Confirm password' : 'Konfirmasi Password'}<input id="employee-confirmation" type={show ? 'text' : 'password'} autoComplete="new-password" required minLength={8} maxLength={128} value={confirmation} onChange={e => setConfirmation(e.target.value)} disabled={busy} /></label>}
      <button className="employee-password-toggle" type="button" aria-pressed={show} onClick={() => setShow(!show)} disabled={busy}>{show ? (en ? 'Hide password' : 'Sembunyikan password') : (en ? 'Show password' : 'Tampilkan password')}</button>
      {register && <small>{en ? 'At least eight characters. The first successful registration claims an available employee number.' : 'Minimal delapan karakter. Pendaftaran pertama yang berhasil memperoleh no. karyawan yang tersedia.'}</small>}
      <button className="primary-button" type="submit" disabled={busy}>{busy ? (en ? 'Please wait…' : 'Mohon tunggu…') : register ? (en ? 'Create Account' : 'Buat Akun') : (en ? 'Sign In' : 'Masuk')}</button>
    </form>
  </section>
}
