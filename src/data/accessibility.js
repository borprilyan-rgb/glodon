const ACCESSIBILITY_KEY = 'cubicost-accessibility-preferences-v1'

const defaults = { textSize: 'default', reducedMotion: 'system' }

function normalizePreferences(value) {
  return {
    textSize: ['default', 'large', 'largest'].includes(value?.textSize) ? value.textSize : defaults.textSize,
    reducedMotion: ['system', 'reduce'].includes(value?.reducedMotion) ? value.reducedMotion : defaults.reducedMotion,
  }
}

export function loadAccessibilityPreferences() {
  try {
    return normalizePreferences(JSON.parse(localStorage.getItem(ACCESSIBILITY_KEY) || '{}'))
  } catch {
    return { ...defaults }
  }
}

export function saveAccessibilityPreferences(preferences) {
  try { localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(normalizePreferences(preferences))) }
  catch { /* Keep the preference active for this session if storage is unavailable. */ }
}

export function applyAccessibilityPreferences(preferences) {
  if (typeof document === 'undefined') return
  const normalized = normalizePreferences(preferences)
  document.documentElement.dataset.textSize = normalized.textSize
  document.documentElement.dataset.reducedMotion = normalized.reducedMotion
}
