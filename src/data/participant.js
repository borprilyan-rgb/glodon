export const PARTICIPANT_KEY = 'cubicost:participant'
export const PARTICIPANT_EDIT_LOCK_KEY = 'cubicost:participant:edit-lock-until'
export const PARTICIPANT_EDIT_LOCK_MS = 60 * 60 * 1000
export const participantFields = ['name', 'jobTitle', 'employeeId']
export const participantLabels = {
  en: { name: 'Name', jobTitle: 'Job title', employeeId: 'Employee ID' },
  id: { name: 'Nama', jobTitle: 'Jabatan', employeeId: 'No. Karyawan' },
}
export function loadParticipant() {
  try {
    const saved = JSON.parse(localStorage.getItem(PARTICIPANT_KEY) || '{}')
    const profile = Object.fromEntries(participantFields.map(field => [field, typeof saved?.[field] === 'string' ? saved[field].slice(0, 100) : field === 'name' ? (localStorage.getItem('cubicost:student-name') || '').slice(0, 100) : '']))
    return { ...profile, updatedAt: Number.isFinite(saved?.updatedAt) ? saved.updatedAt : 0 }
  } catch { return { name: '', jobTitle: '', employeeId: '' } }
}
export function loadParticipantEditLockUntil() {
  try {
    const until = Math.max(Number(localStorage.getItem(PARTICIPANT_EDIT_LOCK_KEY)) || 0, (loadParticipant().updatedAt || 0) + PARTICIPANT_EDIT_LOCK_MS)
    return Number.isFinite(until) && until > Date.now() ? until : 0
  } catch { return 0 }
}
export const isValidEmployeeId = value => /^\d{6}$/.test(String(value ?? '').trim())
export const hasParticipant = profile => participantFields.every(field => typeof profile?.[field] === 'string' && profile[field].trim()) && isValidEmployeeId(profile.employeeId)

export const canEditParticipant = (profile, now = Date.now()) => !hasParticipant(profile) || Math.max(loadParticipantEditLockUntil(), profile.updatedAt ? profile.updatedAt + PARTICIPANT_EDIT_LOCK_MS : 0) <= now
