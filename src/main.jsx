import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import './styles/refresh.css'
import './styles/theme.css'
import { applyTheme, loadTheme } from './data/theme'
import { applyAccessibilityPreferences, loadAccessibilityPreferences } from './data/accessibility'

applyTheme(loadTheme())
applyAccessibilityPreferences(loadAccessibilityPreferences())

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
