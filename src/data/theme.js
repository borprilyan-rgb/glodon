export const THEME_KEY = 'cubicost:theme'

export function loadTheme() {
  try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light' }
  catch { return 'light' }
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
}

export function saveTheme(theme) {
  try { localStorage.setItem(THEME_KEY, theme) } catch { /* Keep the toggle usable when storage is blocked. */ }
}
