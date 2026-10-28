import { useEffect, useState } from 'react'
import { applyTheme, loadTheme, saveTheme } from './data/theme'
import { applyAccessibilityPreferences, loadAccessibilityPreferences, saveAccessibilityPreferences } from './data/accessibility'
import { getTasData } from './data/tas/index.js'
import { partTwoLessonAliases } from './data/tas/partTwoRevision.js'
import { getTrbData } from './data/trb/index.js'
import { getTmeData } from './data/tme/index.js'
import { uiText } from './data/uiText'
import TutorialLayout from './components/TutorialLayout'
import CourseHub from './components/CourseHub'

import LandingPage from './components/LandingPage'
import CourseMapPage from './components/CourseMapPage'
import TutorialStep from './components/TutorialStep'
import PileCapReportLesson from './components/PileCapReportLesson'
import { getReportLessons, getReportLesson, emptyReportProgress, loadReportProgress, saveReportProgress, reportLessonAliases } from './data/tas/tasReports'
import { getCourseCompletion } from './data/courseCompletion'
import ContactPage from './components/ContactPage'
import ExerciseHub from './components/ExerciseHub'
import ExerciseScoresPage from './components/ExerciseScoresPage'
import SettingsPage from './components/SettingsPage'
import MobileSearchPage from './components/MobileSearchPage'
import SectionExercise from './components/SectionExercise'
import { PARTICIPANT_EDIT_LOCK_KEY, PARTICIPANT_EDIT_LOCK_MS, PARTICIPANT_KEY, loadParticipant, loadParticipantEditLockUntil, hasParticipant, canEditParticipant } from './data/participant'
import { readTestScores } from './data/testScores'
import { getSectionExercise } from './data/sectionExercises'



import Presentation, { PresentationEntry } from './components/Presentation'



const LEGACY_TAS_KEY = 'cubicost-tas-tutorial-progress-v1'
const TAS_PROGRESS_KEY = 'cubicost:tutorial:tas:progress'
const TAS_LAST_LESSON_KEY = 'cubicost:tutorial:tas:lastLesson'
const TAS_MIGRATION_KEY = 'cubicost:tutorial:tas:migrated-v1'
const TAS_CURRICULUM_MIGRATION_KEY = 'cubicost:tutorial:tas:curriculum-v2-migrated'
const TAS_CURRICULUM_BACKUP_KEY = 'cubicost:tutorial:tas:progress:curriculum-v1-backup'
const TRB_PROGRESS_KEY = 'cubicost:tutorial:trb:progress'
const TRB_LAST_LESSON_KEY = 'cubicost:tutorial:trb:lastLesson'
const TME_PROGRESS_KEY = 'cubicost:tutorial:tme:progress'
const TME_LAST_LESSON_KEY = 'cubicost:tutorial:tme:lastLesson'

const LANGUAGE_KEY = 'cubicost-tas-tutorial-language-v1'
const TAS_LESSON_IDS = new Set([...getTasData('en').allSteps, ...getReportLessons('en')].map((step) => step.id))
const TRB_LESSON_IDS = new Set(getTrbData('en').allSteps.map((step) => step.id))
const TME_LESSON_IDS = new Set(getTmeData('en').allSteps.map((step) => step.id))
const TAS_LAST_LESSON_MAP = { 'floor-settings': 'floor-grade-settings', 'import-drawing': 'import-split-drawing', 'set-scale': 'scale-relocate-drawing', 'verify-scale': 'scale-relocate-drawing', 'view-expression': 'measurement-rules', 'filter-deduction': 'measurement-rules', 'change-rule': 'measurement-rules', recalculate: 'calculate-verify-quantity', 'verify-deduction': 'calculate-verify-quantity', 'quantity-category': 'quantity-reports', 'configure-report': 'quantity-reports' }

function mapTasLessonId(id) {
  const mapped = reportLessonAliases[id] || partTwoLessonAliases[id] || TAS_LAST_LESSON_MAP[id] || id
  return partTwoLessonAliases[mapped] || (TAS_LESSON_IDS.has(mapped) ? mapped : null)
}

function routeFromLocation() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const hashParts = window.location.hash.replace(/^#\/?/, '').split('/')
  const exerciseMatch = path.match(/^\/(tas|trb|tme)\/(?:exercise|tests)\/section-([1-3])$/)
  if (exerciseMatch) {
    if (path.includes('/exercise/')) window.history.replaceState({}, '', path.replace('/exercise/', '/tests/'))
    return { product: exerciseMatch[1], page: 'exercise', section: Number(exerciseMatch[2]) }
  }
  if (path === '/exercises/score') return { page: 'scores' }
  if (path === '/exercises') return { page: 'exercises' }
  if (path === '/settings') return { page: 'settings' }
  if (path === '/search') return { page: window.matchMedia('(max-width: 767px)').matches ? 'search' : 'hub' }
  if (path === '/present') return { page: 'presentation', search: window.location.search }
  if (path === '/contact') return { page: 'contact' }
  if (path === '/admin/results') return { page: 'admin' }
  if (path === '/trb/reference' || (path === '/' && hashParts[0] === 'trb' && hashParts[1] === 'reference')) {
    window.history.replaceState({}, '', '/trb/course')
    return { product: 'trb', page: 'course' }
  }
  if (path === '/') {
    const [first, second] = hashParts
    if (first === 'course') return { product: 'tas', page: 'welcome' }
    if (first && first !== 'tas' && first !== 'trb' && first !== 'tme') return { product: 'tas', page: 'lesson', stepId: mapTasLessonId(second) || second }
    return { page: 'hub' }
  }
  const [product, view, stepId] = path.split('/').filter(Boolean)
  if (!['tas', 'trb', 'tme'].includes(product)) return { page: 'hub' }
  if (view === 'tests') {
    window.history?.replaceState({}, '', '/exercises')
    return { page: 'exercises' }
  }
  if (!view || view === 'course') {
    const coursePath = `/${product}/`
    if (window.location.pathname !== coursePath) window.history?.replaceState({}, '', coursePath + (window.location.search || '') + (window.location.hash || ''))
    return { product, page: 'welcome' }
  }
  if (view === 'course') return { product, page: 'course' }
  if (product === 'tas' && view === 'lesson' && stepId === 'staircase-report') return { product, page: 'welcome' }
  if (view === 'lesson' && stepId) return { product, page: 'lesson', stepId: product === 'tas' ? mapTasLessonId(stepId) || stepId : stepId }
  return { product, page: 'welcome' }
}

function normaliseProgress(saved, initialStepId, storedLastLesson) {
  const completed = new Set((Array.isArray(saved) ? saved : Array.isArray(saved?.completed) ? saved.completed : []).filter(id => typeof id === 'string'))
  const rawChecks = !Array.isArray(saved) && saved?.checklists
  const checklists = Object.fromEntries(Object.entries(rawChecks && typeof rawChecks === 'object' ? rawChecks : {}).filter(([, checks]) => Array.isArray(checks)).map(([id, checks]) => [id, checks.filter(index => Number.isInteger(index) && index >= 0)]))
  const started = new Set((Array.isArray(saved) ? saved : Array.isArray(saved?.started) ? saved.started : [...completed, ...Object.keys(checklists)]).filter(id => typeof id === 'string'))
  if (initialStepId) started.add(initialStepId)
  return { completed, checklists, started, lastLesson: initialStepId || storedLastLesson || (!Array.isArray(saved) && saved?.lastLesson) || null }
}

// TODO: Consolidate duplicated TAS/TRB/TME progress loading, persistence and checklist updates
// only with migration coverage; preserve all storage keys and product-specific validation.
function loadTasProgress(initialStepId) {
  try {
    if (!localStorage.getItem(TAS_MIGRATION_KEY)) {
      const legacy = localStorage.getItem(LEGACY_TAS_KEY)
      if (legacy && !localStorage.getItem(TAS_PROGRESS_KEY)) {
        const migrated = normaliseProgress(JSON.parse(legacy), null, null)
        localStorage.setItem(TAS_PROGRESS_KEY, JSON.stringify({ completed: [...migrated.completed], checklists: migrated.checklists, started: [...migrated.started] }))
        if (migrated.lastLesson) localStorage.setItem(TAS_LAST_LESSON_KEY, migrated.lastLesson)
      }
      localStorage.setItem(TAS_MIGRATION_KEY, '1')
    }
    if (!localStorage.getItem(TAS_CURRICULUM_MIGRATION_KEY)) {
      const currentRaw = localStorage.getItem(TAS_PROGRESS_KEY)
      if (currentRaw && !localStorage.getItem(TAS_CURRICULUM_BACKUP_KEY)) localStorage.setItem(TAS_CURRICULUM_BACKUP_KEY, currentRaw)
      const current = JSON.parse(currentRaw || '[]')
      const oldCompleted = new Set(Array.isArray(current) ? current : current.completed || [])
      const oldStarted = new Set(Array.isArray(current) ? current : current.started || [...oldCompleted])
      const completed = new Set(['identify-columns', 'identify-beams', 'identify-slabs', 'identify-openings', 'apply-finishes'].filter((id) => oldCompleted.has(id)))
      if (['view-expression', 'measurement-rules', 'filter-deduction', 'change-rule'].every((id) => oldCompleted.has(id))) completed.add('measurement-rules')
      if (['recalculate', 'verify-deduction'].every((id) => oldCompleted.has(id))) completed.add('calculate-verify-quantity')
      if (['quantity-category', 'configure-report'].every((id) => oldCompleted.has(id))) completed.add('quantity-reports')
      const started = new Set([...oldStarted].map(mapTasLessonId).filter(Boolean))
      const checklists = Object.fromEntries(Object.entries(Array.isArray(current) ? {} : current.checklists || {}).filter(([id]) => TAS_LESSON_IDS.has(id)))
      localStorage.setItem(TAS_PROGRESS_KEY, JSON.stringify({ completed: [...completed], checklists, started: [...started] }))
      const previousLast = localStorage.getItem(TAS_LAST_LESSON_KEY) || (!Array.isArray(current) && current.lastLesson) || null
      const mappedLast = mapTasLessonId(previousLast)
      mappedLast ? localStorage.setItem(TAS_LAST_LESSON_KEY, mappedLast) : localStorage.removeItem(TAS_LAST_LESSON_KEY)
      localStorage.setItem(TAS_CURRICULUM_MIGRATION_KEY, '1')
    }
    const progress = normaliseProgress(JSON.parse(localStorage.getItem(TAS_PROGRESS_KEY) || '[]'), initialStepId, localStorage.getItem(TAS_LAST_LESSON_KEY))
    return { ...progress, lastLesson: mapTasLessonId(progress.lastLesson), started: new Set([...progress.started].map(mapTasLessonId).filter(Boolean)) }
  } catch {
    // A failed migration write must not hide progress that is still readable.
    try { return normaliseProgress(JSON.parse(localStorage.getItem(TAS_PROGRESS_KEY) || localStorage.getItem(LEGACY_TAS_KEY) || '[]'), initialStepId, localStorage.getItem(TAS_LAST_LESSON_KEY)) }
    catch { return normaliseProgress([], initialStepId, null) }
  }
}

function loadTrbProgress(initialStepId) {
  try {
    const progress = normaliseProgress(JSON.parse(localStorage.getItem(TRB_PROGRESS_KEY) || '[]'), TRB_LESSON_IDS.has(initialStepId) ? initialStepId : null, localStorage.getItem(TRB_LAST_LESSON_KEY))
    progress.completed = new Set([...progress.completed].filter((id) => TRB_LESSON_IDS.has(id)))
    progress.started = new Set([...progress.started].filter((id) => TRB_LESSON_IDS.has(id)))
    if (!TRB_LESSON_IDS.has(progress.lastLesson)) progress.lastLesson = null
    return progress
  }
  catch { return normaliseProgress([], initialStepId, null) }
}

function loadTmeProgress(initialStepId) {
  try {
    const progress = normaliseProgress(JSON.parse(localStorage.getItem(TME_PROGRESS_KEY) || '[]'), TME_LESSON_IDS.has(initialStepId) ? initialStepId : null, localStorage.getItem(TME_LAST_LESSON_KEY))
    progress.completed = new Set([...progress.completed].filter((id) => TME_LESSON_IDS.has(id)))
    progress.started = new Set([...progress.started].filter((id) => TME_LESSON_IDS.has(id)))
    progress.checklists = Object.fromEntries(Object.entries(progress.checklists).filter(([id]) => TME_LESSON_IDS.has(id)))
    if (!TME_LESSON_IDS.has(progress.lastLesson)) progress.lastLesson = null
    return progress
  } catch { return normaliseProgress([], initialStepId, null) }
}

export default function App() {
  const [theme, setTheme] = useState(loadTheme)
  const toggleTheme = () => setTheme(current => current === 'dark' ? 'light' : 'dark')
  useEffect(() => { applyTheme(theme); saveTheme(theme) }, [theme])
  const [accessibility, setAccessibility] = useState(loadAccessibilityPreferences)
  useEffect(() => { applyAccessibilityPreferences(accessibility); saveAccessibilityPreferences(accessibility) }, [accessibility])
  const updateAccessibility = (key, value) => setAccessibility(current => ({ ...current, [key]: value }))
  const initialRoute = routeFromLocation()
  const [route, setRoute] = useState(initialRoute)
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'id' } catch { return 'id' }
  })
  const reportLessons = getReportLessons(language)
  const [tasProgress, setTasProgress] = useState(() => loadTasProgress(initialRoute.product === 'tas' && TAS_LESSON_IDS.has(initialRoute.stepId) ? initialRoute.stepId : null))
  const [reportProgress, setReportProgress] = useState(loadReportProgress)
  const [trbProgress, setTrbProgress] = useState(() => loadTrbProgress(initialRoute.product === 'trb' ? initialRoute.stepId : null))
  const [tmeProgress, setTmeProgress] = useState(() => loadTmeProgress(initialRoute.product === 'tme' ? initialRoute.stepId : null))
  const [query, setQuery] = useState('')
  const [testScores, setTestScores] = useState(readTestScores)
  const [participant, setParticipant] = useState(loadParticipant)
  const [participantEditUntil, setParticipantEditUntil] = useState(loadParticipantEditLockUntil)
  const [editingParticipant, setEditingParticipant] = useState(false)
  const [participantSaveFailed, setParticipantSaveFailed] = useState(false)
  const [progressSaveFailed, setProgressSaveFailed] = useState({})
  const { tutorialParts, allSteps } = getTasData(language)
  const trb = getTrbData(language)
  const tme = getTmeData(language)
  const t = uiText[language]
  const completed = tasProgress.completed

  function saveParticipant(profile) {
    if (!hasParticipant(profile) || (hasParticipant(participant) && (participantEditUntil > Date.now() || !canEditParticipant(participant)))) return
    const saved = { ...profile, updatedAt: Date.now() }
    const editUntil = Date.now() + PARTICIPANT_EDIT_LOCK_MS
    setParticipant(saved)
    setParticipantEditUntil(editUntil)
    setEditingParticipant(false)
    try {
      localStorage.setItem(PARTICIPANT_KEY, JSON.stringify(saved))
      localStorage.setItem(PARTICIPANT_EDIT_LOCK_KEY, String(editUntil))
      localStorage.setItem('cubicost:student-name', saved.name)
      setParticipantSaveFailed(false)
    } catch { setParticipantSaveFailed(true) }
  }

  function beginParticipantEdit() {
    if (participantEditUntil > Date.now() || !canEditParticipant(participant)) return
    setEditingParticipant(true)
  }

  useEffect(() => {
    const onLocationChange = () => {
      const nextRoute = routeFromLocation()
      setRoute(nextRoute)
      if (nextRoute.product === 'tas' && TAS_LESSON_IDS.has(nextRoute.stepId)) setTasProgress((current) => {
        const started = new Set(current.started)
        started.add(nextRoute.stepId)
        return { ...current, started, lastLesson: nextRoute.stepId }
      })
      if (nextRoute.product === 'trb' && TRB_LESSON_IDS.has(nextRoute.stepId)) setTrbProgress((current) => {
        const started = new Set(current.started)
        started.add(nextRoute.stepId)
        return { ...current, started, lastLesson: nextRoute.stepId }
      })
      if (nextRoute.product === 'tme' && TME_LESSON_IDS.has(nextRoute.stepId)) setTmeProgress((current) => {
        const started = new Set(current.started)
        started.add(nextRoute.stepId)
        return { ...current, started, lastLesson: nextRoute.stepId }
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    const onFullscreenNavigation = (event) => {
      // Reloading a document ends native fullscreen. Keep ordinary app links
      // in this document only while the app-wide fullscreen session is active.
      if (document.fullscreenElement !== document.documentElement || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
      const destination = new URL(link.href, window.location.href)
      if (destination.origin !== window.location.origin) return
      const isAppRoute = /^\/(?:search|settings|contact|present|exercises(?:\/score)?|(?:tas|trb|tme)(?:\/(?:course|reference|tests|lesson\/[^/]+|(?:exercise|tests)\/section-[1-3]))?)?\/?$/.test(destination.pathname)
      if (!isAppRoute || (destination.pathname === window.location.pathname && destination.search === window.location.search && destination.hash)) return
      event.preventDefault()
      window.history.pushState({}, '', destination.pathname + destination.search + destination.hash)
      setQuery('')
      setEditingParticipant(false)
      onLocationChange()
    }
    window.addEventListener('popstate', onLocationChange)
    window.addEventListener('hashchange', onLocationChange)
    document.addEventListener('click', onFullscreenNavigation)
    const mobileViewport = window.matchMedia('(max-width: 767px)')
    const onSearchViewportChange = () => { if (window.location.pathname.replace(/\/+$/, '') === '/search') onLocationChange() }
    mobileViewport.addEventListener('change', onSearchViewportChange)
    return () => { window.removeEventListener('popstate', onLocationChange); window.removeEventListener('hashchange', onLocationChange); document.removeEventListener('click', onFullscreenNavigation); mobileViewport.removeEventListener('change', onSearchViewportChange) }
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(TAS_PROGRESS_KEY, JSON.stringify({ completed: [...tasProgress.completed], checklists: tasProgress.checklists, started: [...tasProgress.started] }))
      tasProgress.lastLesson ? localStorage.setItem(TAS_LAST_LESSON_KEY, tasProgress.lastLesson) : localStorage.removeItem(TAS_LAST_LESSON_KEY)
      queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, tas: false })))
    } catch { queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, tas: true }))) }
  }, [tasProgress])
  useEffect(() => {
    try {
      localStorage.setItem(TRB_PROGRESS_KEY, JSON.stringify({ completed: [...trbProgress.completed], checklists: trbProgress.checklists, started: [...trbProgress.started] }))
      trbProgress.lastLesson ? localStorage.setItem(TRB_LAST_LESSON_KEY, trbProgress.lastLesson) : localStorage.removeItem(TRB_LAST_LESSON_KEY)
      queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, trb: false })))
    } catch { queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, trb: true }))) }
  }, [trbProgress])
  useEffect(() => {
    try {
      localStorage.setItem(TME_PROGRESS_KEY, JSON.stringify({ completed: [...tmeProgress.completed], checklists: tmeProgress.checklists, started: [...tmeProgress.started] }))
      tmeProgress.lastLesson ? localStorage.setItem(TME_LAST_LESSON_KEY, tmeProgress.lastLesson) : localStorage.removeItem(TME_LAST_LESSON_KEY)
      queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, tme: false })))
    } catch { queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, tme: true }))) }
  }, [tmeProgress])
  useEffect(() => { try { localStorage.setItem(LANGUAGE_KEY, language) } catch { /* Keep the language usable without storage. */ } document.documentElement.lang = language }, [language])

  const activeData = route.product === 'trb' ? trb : route.product === 'tme' ? tme : { tutorialParts, allSteps }
  const activeIndex = activeData.allSteps.findIndex((step) => step.id === route.stepId && (!route.partId || step.partId === route.partId))
  const activeReport = route.product === 'tas' && route.page === 'lesson' ? getReportLesson(route.stepId, language) : null
  const isReportPrototype = Boolean(activeReport)
  const activeStep = activeReport || (activeIndex >= 0 ? { ...activeData.allSteps[activeIndex], partStepCount: activeData.tutorialParts.find((part) => part.id === activeData.allSteps[activeIndex].partId).steps.length } : null)
  useEffect(() => {
    const failed = !saveReportProgress(reportProgress)
    queueMicrotask(() => setProgressSaveFailed(current => ({ ...current, tasReports: failed })))
  }, [reportProgress])
  const term = query.trim().toLocaleLowerCase(language)
  const tasCourseSteps = [...allSteps.filter(step => step.partId !== 'part-3'), ...reportLessons]
  const tasCourseParts = tutorialParts.map(part => part.id === 'part-3' ? { ...part, title: 'Report', shortTitle: 'Report', summary: language === 'en' ? 'Read Quantity columns for each report type.' : 'Mengenal kolom Quantity untuk setiap jenis report.', steps: reportLessons } : part)
  const tasCourseCompleted = new Set([...tasProgress.completed, ...reportLessons.filter(step => reportProgress[step.id].completed).map(step => step.id)].filter(id => tasCourseSteps.some(step => step.id === id)))
  const tasCourseStarted = new Set([...tasProgress.started, ...reportLessons.filter(step => reportProgress[step.id].completed || reportProgress[step.id].checks.length).map(step => step.id)].filter(id => tasCourseSteps.some(step => step.id === id)))
  const courseLearningProgress = {
    tas: { completed: tasCourseCompleted.size, total: tasCourseSteps.length },
    trb: { completed: trbProgress.completed.size, total: trb.allSteps.length },
    tme: { completed: tmeProgress.completed.size, total: tme.allSteps.length },
  }
  const filteredParts = tasCourseParts.map(part => ({ ...part, steps: term ? part.steps.filter(step => `${step.title} ${step.intro || ''} ${(step.instructions || step.actions.map(action => action.title)).join(' ')}`.toLocaleLowerCase(language).includes(term)) : part.steps })).filter(part => part.steps.length)
  const filteredTrbParts = trb.tutorialParts.map((part) => ({ ...part, steps: term ? part.steps.filter((step) => `${step.title} ${step.intro} ${step.instructions.join(' ')}`.toLocaleLowerCase(language).includes(term)) : part.steps })).filter((part) => part.steps.length)
  const filteredTmeParts = tme.tutorialParts.map((part) => ({ ...part, steps: term ? part.steps.filter((step) => `${step.title} ${step.intro} ${step.instructions.join(' ')}`.toLocaleLowerCase(language).includes(term)) : part.steps })).filter((part) => part.steps.length)
  const lastIncomplete = tasProgress.lastLesson && !tasCourseCompleted.has(tasProgress.lastLesson) ? tasCourseSteps.find(step => step.id === tasProgress.lastLesson) : null
  const continueStep = lastIncomplete || tasCourseSteps.find(step => !tasCourseCompleted.has(step.id)) || tasCourseSteps[0]
  const trbLastIncomplete = trbProgress.lastLesson && !trbProgress.completed.has(trbProgress.lastLesson) ? trb.allSteps.find((step) => step.id === trbProgress.lastLesson) : null
  const continueTrbStep = trbLastIncomplete || trb.allSteps.find((step) => !trbProgress.completed.has(step.id)) || trb.allSteps[0]
  const tmeLastIncomplete = tmeProgress.lastLesson && !tmeProgress.completed.has(tmeProgress.lastLesson) ? tme.allSteps.find((step) => step.id === tmeProgress.lastLesson) : null
  const continueTmeStep = tmeLastIncomplete || tme.allSteps.find((step) => !tmeProgress.completed.has(step.id)) || tme.allSteps[0]

  const toggleCheck = (checkIndex) => setTasProgress((current) => {
    const selected = new Set(current.completed.has(activeStep.id) ? activeStep.checks.map((_, index) => index) : current.checklists[activeStep.id] || [])
    selected.has(checkIndex) ? selected.delete(checkIndex) : selected.add(checkIndex)
    const nextCompleted = new Set(current.completed)
    if (selected.size < activeStep.checks.length) nextCompleted.delete(activeStep.id)
    return { ...current, completed: nextCompleted, checklists: { ...current.checklists, [activeStep.id]: [...selected] } }
  })
  const toggleComplete = () => setTasProgress((current) => {
    const nextCompleted = new Set(current.completed)
    nextCompleted.has(activeStep.id) ? nextCompleted.delete(activeStep.id) : nextCompleted.add(activeStep.id)
    return { ...current, completed: nextCompleted }
  })
  const reset = () => { if (window.confirm(t.resetConfirm)) { setTasProgress({ completed: new Set(), checklists: {}, started: new Set(), lastLesson: null }); setReportProgress(emptyReportProgress()) } }
  const resetTrb = () => { if (window.confirm(t.resetConfirm)) setTrbProgress({ completed: new Set(), checklists: {}, started: new Set(), lastLesson: null }) }
  const updateTrbCheck = (checkIndex) => setTrbProgress((current) => {
    const selected = new Set(current.completed.has(activeStep.id) ? activeStep.checks.map((_, index) => index) : current.checklists[activeStep.id] || [])
    selected.has(checkIndex) ? selected.delete(checkIndex) : selected.add(checkIndex)
    const nextCompleted = new Set(current.completed)
    if (selected.size < activeStep.checks.length) nextCompleted.delete(activeStep.id)
    return { ...current, completed: nextCompleted, checklists: { ...current.checklists, [activeStep.id]: [...selected] } }
  })
  const toggleTrbComplete = () => setTrbProgress((current) => {
    const nextCompleted = new Set(current.completed)
    nextCompleted.has(activeStep.id) ? nextCompleted.delete(activeStep.id) : nextCompleted.add(activeStep.id)
    return { ...current, completed: nextCompleted }
  })
  const resetTme = () => { if (window.confirm(t.resetConfirm)) setTmeProgress({ completed: new Set(), checklists: {}, started: new Set(), lastLesson: null }) }
  const updateTmeCheck = (checkIndex) => setTmeProgress((current) => {
    const selected = new Set(current.completed.has(activeStep.id) ? activeStep.checks.map((_, index) => index) : current.checklists[activeStep.id] || [])
    selected.has(checkIndex) ? selected.delete(checkIndex) : selected.add(checkIndex)
    const nextCompleted = new Set(current.completed)
    if (selected.size < activeStep.checks.length) nextCompleted.delete(activeStep.id)
    return { ...current, completed: nextCompleted, checklists: { ...current.checklists, [activeStep.id]: [...selected] } }
  })
  const toggleTmeComplete = () => setTmeProgress((current) => {
    const nextCompleted = new Set(current.completed)
    nextCompleted.has(activeStep.id) ? nextCompleted.delete(activeStep.id) : nextCompleted.add(activeStep.id)
    return { ...current, completed: nextCompleted }
  })

  const product = route.product || null
  const courseHome = {
    tas: { parts: filteredParts, allSteps: tasCourseSteps, started: tasCourseStarted, lastLesson: tasProgress.lastLesson, continueStep, onReset: reset },
    trb: { parts: filteredTrbParts, allSteps: trb.allSteps, started: trbProgress.started, lastLesson: trbProgress.lastLesson, continueStep: continueTrbStep, onReset: resetTrb, course: trb },
    tme: { parts: filteredTmeParts, allSteps: tme.allSteps, started: tmeProgress.started, lastLesson: tmeProgress.lastLesson, continueStep: continueTmeStep, onReset: resetTme, course: tme },
  }[product]
  const visibleProgress = product === 'tas' ? { completed: tasCourseCompleted } : product === 'trb' ? trbProgress : product === 'tme' ? tmeProgress : tasProgress
  const visibleTotal = product === 'tas' ? tasCourseSteps.length : product === 'trb' ? trb.allSteps.length : product === 'tme' ? tme.allSteps.length : allSteps.length
  const completion = getCourseCompletion(activeStep, product === 'tas' ? tasCourseSteps : activeData.allSteps, visibleProgress.completed)
  const progressCannotSave = product ? progressSaveFailed[product] || (product === 'tas' && progressSaveFailed.tasReports) : Object.values(progressSaveFailed).some(Boolean)
  if (route.page === 'presentation') {
    return <Presentation key={route.search || ''} theme={theme} onThemeToggle={toggleTheme} courses={{ tas: { tutorialParts: tasCourseParts, allSteps: tasCourseSteps, lessonAliases: { ...partTwoLessonAliases, ...reportLessonAliases } }, trb, tme }} language={language} onLanguageChange={setLanguage} />
  }
  return <TutorialLayout key={`${route.page}:${product || ''}:${route.stepId || ''}:${route.section || ''}`} theme={theme} onThemeToggle={toggleTheme} page={route.page} product={product} activeStep={activeStep} completed={visibleProgress.completed} total={visibleTotal} showProgress={Boolean(product) && !['welcome', 'tests', 'exercise'].includes(route.page)} language={language} onLanguageChange={setLanguage} t={t}>
    {!['exercise', 'tests', 'exercises', 'scores', 'search'].includes(route.page) && <PresentationEntry language={language} />}
    {progressCannotSave && <p role="status">{language === 'en' ? 'Your learning progress could not be saved in this browser. Changes may be lost after refreshing.' : 'Kemajuan belajar tidak dapat disimpan di browser ini. Perubahan dapat hilang setelah memuat ulang.'}</p>}
    {route.page === 'lesson' && !activeStep && <section className="tutorial-step"><header className="step-header"><h1>{t.lessonNotFound}</h1><p>{t.lessonNotFoundDescription}</p></header><a className="primary-button" href={`/${product}/`}>{t.backToCourseMap}</a></section>}


    {route.page === 'hub' && <CourseHub language={language} tas={{ allSteps: tasCourseSteps, progress: { completed: tasCourseCompleted, started: tasCourseStarted }, continueStep }} trb={{ ...trb, progress: trbProgress, continueStep: continueTrbStep }} tme={{ ...tme, progress: tmeProgress, continueStep: continueTmeStep }} t={t} />}

    {participantSaveFailed && ['exercise', 'tests', 'exercises'].includes(route.page) && <p role="alert">{language === 'en' ? 'Your details could not be saved in this browser.' : 'Data diri tidak dapat disimpan di browser ini.'}</p>}
    {route.page === 'exercise' && (!hasParticipant(participant) || editingParticipant ? <section className="exercise-card participant-required"><h1>{language === 'en' ? 'Personal details required' : 'Data diri diperlukan'}</h1><p>{language === 'en' ? 'Add or update your details on the main Exercises page before opening a section.' : 'Tambahkan atau ubah data diri di halaman utama Latihan sebelum membuka bagian.'}</p><a className="primary-button" href="/exercises">{language === 'en' ? 'Go to Exercises' : 'Buka Latihan'}</a></section> : <SectionExercise key={product + '-' + route.section} profile={participant} onScoreSaved={() => setTestScores(readTestScores())} language={language} exercise={getSectionExercise(product, route.section)} />)}
    {route.page === 'exercises' && <ExerciseHub language={language} profile={participant} scores={testScores} editingParticipant={editingParticipant} participantEditUntil={participantEditUntil} onEditParticipant={beginParticipantEdit} onSaveParticipant={saveParticipant} />}
    {route.page === 'scores' && <ExerciseScoresPage language={language} profile={participant} scores={testScores} courseProgress={courseLearningProgress} />}
    {route.page === 'settings' && <SettingsPage language={language} onLanguageChange={setLanguage} theme={theme} onThemeToggle={toggleTheme} accessibility={accessibility} onAccessibilityChange={updateAccessibility} t={t} />}
    {route.page === 'search' && <MobileSearchPage courses={{ tas: { tutorialParts: tasCourseParts }, trb, tme }} t={t} />}
    {route.page === 'admin' && <section className="exercise-card"><h1>{language === 'en' ? 'Central results temporarily disconnected' : 'Hasil pusat sementara tidak terhubung'}</h1><p>{language === 'en' ? 'Firebase connections are disabled. You can review results saved in this browser on the scores page.' : 'Koneksi Firebase dinonaktifkan. Hasil yang tersimpan di browser ini dapat dilihat di halaman nilai.'}</p><a className="primary-button" href="/exercises/score">{language === 'en' ? 'View local results' : 'Lihat hasil lokal'}</a></section>}
    {route.page === 'contact' && <ContactPage t={t} />}
    {courseHome && ['welcome', 'course'].includes(route.page) && <div className="course-home" data-product={product}><h1 className="sr-only">{product === 'tme' ? 'Cubicost TME-C' : 'Cubicost ' + product.toUpperCase()}</h1><LandingPage compact {...courseHome} completed={visibleProgress.completed} product={product} language={language} t={t} /><CourseMapPage embedded {...courseHome} completed={visibleProgress.completed} query={query} setQuery={setQuery} product={product} language={language} t={t} /></div>}
    {activeReport && <PileCapReportLesson completion={completion} key={activeReport.id} step={activeReport} index={tasCourseSteps.findIndex(step => step.id === activeReport.id)} total={tasCourseSteps.length} progress={reportProgress[activeReport.id]} onCheck={(index) => setReportProgress(current => { const entry = current[activeReport.id]; return { ...current, [activeReport.id]: { ...entry, checks: entry.checks.includes(index) ? entry.checks.filter(item => item !== index) : [...entry.checks, index] } } })} onToggle={() => setReportProgress(current => ({ ...current, [activeReport.id]: { ...current[activeReport.id], completed: !current[activeReport.id].completed } }))} previous={reportLessons[activeReport.stepNumber - 2] || allSteps.filter(step => step.partId === 'part-2').at(-1)} next={reportLessons[activeReport.stepNumber]} t={t} />}
    {product === 'tas' && route.page === 'lesson' && !isReportPrototype && activeStep && <TutorialStep completion={completion} step={activeStep} index={activeIndex} total={activeStep.partId === 'part-3' ? allSteps.length : tasCourseSteps.length} isComplete={completed.has(activeStep.id)} selectedChecks={tasProgress.checklists[activeStep.id] || []} onCheck={toggleCheck} onToggle={toggleComplete} previous={allSteps[activeIndex - 1]} next={activeStep.id === 'calculate-verify-quantity' ? reportLessons[0] : allSteps[activeIndex + 1]} product="tas" language={language} t={t} />}
    {product === 'trb' && route.page === 'lesson' && activeStep && <TutorialStep completion={completion} step={activeStep} index={activeIndex} total={trb.allSteps.length} isComplete={trbProgress.completed.has(activeStep.id)} selectedChecks={trbProgress.checklists[activeStep.id] || []} onCheck={updateTrbCheck} onToggle={toggleTrbComplete} previous={trb.allSteps[activeIndex - 1]} next={trb.allSteps[activeIndex + 1]} product="trb" language={language} t={t} />}
    {product === 'tme' && route.page === 'lesson' && activeStep && <TutorialStep completion={completion} step={activeStep} index={activeIndex} total={tme.allSteps.length} isComplete={tmeProgress.completed.has(activeStep.id)} selectedChecks={tmeProgress.checklists[activeStep.id] || []} onCheck={updateTmeCheck} onToggle={toggleTmeComplete} previous={tme.allSteps[activeIndex - 1]} next={tme.allSteps[activeIndex + 1]} product="tme" t={t} />}
  </TutorialLayout>
}
