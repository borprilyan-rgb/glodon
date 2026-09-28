import { useCallback, useRef, useState } from 'react'

export default function usePresentationDrawing(surfaceKey) {
  const pages = useRef(new Map())
  const [revision, setRevision] = useState(0)
  const [enabledKey, setEnabledKey] = useState(null)
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#e53935')
  const [size, setSize] = useState(4)
  const [limitKey, setLimitKey] = useState(null)
  const enabled = enabledKey === surfaceKey

  const getPage = useCallback(() => {
    if (!pages.current.has(surfaceKey)) pages.current.set(surfaceKey, { strokes: [], undo: [] })
    return pages.current.get(surfaceKey)
  }, [surfaceKey])

  const edit = useCallback((change) => {
    const page = getPage()
    page.undo.push(page.strokes)
    if (page.undo.length > 20) page.undo.shift()
    page.strokes = change(page.strokes)
    setRevision((value) => value + 1)
  }, [getPage])

  return {
    surfaceKey, revision, enabled, tool, color, size,
    limited: limitKey === surfaceKey,
    setTool, setColor, setSize,
    toggle: () => setEnabledKey((key) => key === surfaceKey ? null : surfaceKey),
    getStrokes: () => getPage().strokes,
    canUndo: () => getPage().undo.length > 0,
    commit: (stroke) => {
      if (getPage().strokes.length >= 100) { setLimitKey(surfaceKey); return }
      edit((strokes) => [...strokes, stroke])
    },
    undo: () => {
      const page = getPage()
      if (!page.undo.length) return
      page.strokes = page.undo.pop()
      setLimitKey(null)
      setRevision((value) => value + 1)
    },
    clear: () => { if (getPage().strokes.length) edit(() => []); setLimitKey(null) },
  }
}
