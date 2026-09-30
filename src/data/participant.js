export const PARTICIPANT_KEY = 'cubicost:participant'
export const participantFields = ['name', 'jobTitle', 'employeeId']
export const participantLabels = {
  en: { name: 'Name', jobTitle: 'Job title', employeeId: 'Employee ID' },
  id: { name: 'Nama', jobTitle: 'Jabatan', employeeId: 'No. Karyawan' },
}
export function loadParticipant() {
  try {
    const saved = JSON.parse(localStorage.getItem(PARTICIPANT_KEY) || '{}')
    return Object.fromEntries(participantFields.map(field => [field, typeof saved?.[field] === 'string' ? saved[field].slice(0, 100) : field === 'name' ? (localStorage.getItem('cubicost:student-name') || '').slice(0, 100) : '']))
  } catch { return { name: '', jobTitle: '', employeeId: '' } }
}
export const hasParticipant = profile => participantFields.every(field => profile[field]?.trim())
