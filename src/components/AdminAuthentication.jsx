import { useRef, useState } from 'react'
import { signInAdmin, resetAdminPassword } from '../firebase/client'

const copy = {
  en: {
    email: 'Email', password: 'Password', login: 'Sign In', show: 'Show password', hide: 'Hide password', forgot: 'Forgot Password',
    help: 'Sign in with your authorized admin account.',
    resetSent: 'If this account supports password sign-in, a reset email has been sent. Check your inbox and spam folder.',
    processing: 'Please wait…',
    invalid: 'Unable to sign in. Check your email and password.', unavailable: 'Enable Email/Password sign-in in Firebase Authentication first.',
    network: 'Unable to connect. Check your connection and try again.', limited: 'Too many attempts. Please try again later.', failed: 'The request failed. Please try again.',
  },
  id: {
    email: 'Email', password: 'Kata sandi', login: 'Masuk', show: 'Tampilkan kata sandi', hide: 'Sembunyikan kata sandi', forgot: 'Lupa Kata Sandi',
    help: 'Masuk dengan akun admin yang diizinkan.',
    resetSent: 'Jika akun ini mendukung masuk dengan kata sandi, email pengaturan ulang telah dikirim. Periksa kotak masuk dan folder spam.',
    processing: 'Mohon tunggu…',
    invalid: 'Tidak dapat masuk. Periksa email dan kata sandi Anda.', unavailable: 'Aktifkan login Email/Password di Firebase Authentication terlebih dahulu.',
    network: 'Tidak dapat terhubung. Periksa koneksi dan coba lagi.', limited: 'Terlalu banyak percobaan. Silakan coba lagi nanti.', failed: 'Permintaan gagal. Silakan coba lagi.',
  },
}

export default function AdminAuthentication({ language }) {
  const c = copy[language]
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const emailInput = useRef(null)
  function message(error) {
    const codes = {
      'auth/invalid-credential': c.invalid, 'auth/wrong-password': c.invalid, 'auth/user-not-found': c.invalid, 'auth/user-disabled': c.invalid,
      'auth/invalid-email': c.invalid, 'auth/operation-not-allowed': c.unavailable,
      'auth/network-request-failed': c.network, 'auth/too-many-requests': c.limited,
    }
    return codes[error.code] || c.failed
  }
  async function run(operation) {
    if (busy) return
    setBusy(true); setError(''); setNotice('')
    try { await operation() } catch (error) { setError(message(error)) }
    finally { setPassword(''); setShow(false); setBusy(false) }
  }
  async function submit(event) {
    event.preventDefault()
    await run(() => signInAdmin(email, password))
  }
  async function reset() {
    if (!emailInput.current.reportValidity()) return
    await run(async () => {
      try { await resetAdminPassword(email) } catch (error) { if (error.code !== 'auth/user-not-found') throw error }
      setNotice(c.resetSent)
    })
  }
  return <section className="exercise-card admin-login">
    <p>{c.help}</p>
    {error && <p className="admin-alert" role="alert">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    <form className="admin-auth-form" onSubmit={submit}>
      <label htmlFor="admin-auth-email">{c.email}<input ref={emailInput} id="admin-auth-email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required disabled={busy} /></label>
      <div className="admin-auth-password"><label htmlFor="admin-auth-password">{c.password}</label><span className="admin-password-field"><input id="admin-auth-password" type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required disabled={busy} /><button type="button" aria-controls="admin-auth-password" aria-pressed={show} onClick={() => setShow(current => !current)} disabled={busy}>{show ? c.hide : c.show}</button></span></div>
      <div className="admin-auth-actions"><button className="primary-button" disabled={busy}>{busy ? c.processing : c.login}</button><button type="button" className="admin-details-toggle" onClick={reset} disabled={busy}>{c.forgot}</button></div>
    </form>
  </section>
}
