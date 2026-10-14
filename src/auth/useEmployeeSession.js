import { useEffect, useState } from 'react'
import { employeeAuthEnabled, observeEmployee, loadEmployeeProfile, logoutEmployee } from '../firebase/employeeAccounts'

export default function useEmployeeSession() {
  const [session, setSession] = useState({ status: employeeAuthEnabled ? 'checking' : 'disabled', profile: null, userPresent: false })
  useEffect(() => {
    if (!employeeAuthEnabled) return
    let alive = true
    let generation = 0
    let unsubscribe
    try {
      unsubscribe = observeEmployee(async user => {
        if (!alive) return
        const current = ++generation
        setSession({ status: user ? 'checking' : 'signedOut', profile: null, userPresent: !!user })
        if (!user) return
        try {
          const profile = await loadEmployeeProfile(user)
          if (alive && generation === current) setSession({ status: 'active', profile, userPresent: true })
        } catch {
          if (alive && generation === current) setSession({ status: 'unavailable', profile: null, userPresent: true })
        }
      })
    } catch { queueMicrotask(() => { if (alive) setSession({ status: 'unavailable', profile: null, userPresent: false }) }) }
    return () => { alive = false; generation++; unsubscribe?.() }
  }, [])
  async function logout() {
    await logoutEmployee()
    setSession({ status: 'signedOut', profile: null, userPresent: false })
  }
  return { ...session, logout }
}
