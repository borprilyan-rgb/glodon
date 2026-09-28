import { Eraser, Highlighter, Pencil, Trash2, Undo2, X } from 'lucide-react'
import { useRef } from 'react'
import './presentationDrawing.css'

const labels = {
  en: { draw: 'Draw on image', done: 'Finish drawing', pen: 'Pen', highlighter: 'Highlighter', eraser: 'Eraser', undo: 'Undo drawing', clear: 'Clear drawing', size: 'Stroke size', small: 'Thin', medium: 'Medium', large: 'Thick', colors: ['Red', 'Blue', 'Green', 'Yellow'], tools: 'Drawing tools', limit: 'Drawing limit reached. Clear or undo to continue.' },
  id: { draw: 'Gambar pada foto', done: 'Selesai menggambar', pen: 'Pena', highlighter: 'Penyorot', eraser: 'Penghapus', undo: 'Urungkan gambar', clear: 'Hapus semua coretan', size: 'Ketebalan garis', small: 'Tipis', medium: 'Sedang', large: 'Tebal', colors: ['Merah', 'Biru', 'Hijau', 'Kuning'], tools: 'Alat gambar', limit: 'Batas coretan tercapai. Hapus atau urungkan untuk melanjutkan.' },
}

// Handle touch activation on pointer-up so the first tap after a stroke is reliable.
function DrawingButton({ onClick, ...props }) {
  const touchStart = useRef(null)
  return <button {...props}
    onPointerDown={(event) => { if (event.pointerType === 'touch') touchStart.current = { x: event.clientX, y: event.clientY } }}
    onPointerCancel={() => { touchStart.current = null }}
    onPointerUp={(event) => {
      const start = touchStart.current
      touchStart.current = null
      if (event.pointerType !== 'touch' || !start) return
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) return
      event.preventDefault()
      onClick(event)
    }}
    onClick={(event) => { if (event.nativeEvent.pointerType !== 'touch') onClick(event) }}
  />
}

export default function DrawingToolbar({ drawing, language, mode = 'all' }) {
  const c = labels[language]
  if (mode === 'tools' && !drawing.enabled) return null
  return <div className={`drawing-toolbar drawing-toolbar--${mode}`} role="group" aria-label={c.tools}>
    {mode !== 'tools' && <DrawingButton type="button" title={drawing.enabled ? c.done : c.draw} aria-label={drawing.enabled ? c.done : c.draw} aria-pressed={drawing.enabled} onClick={drawing.toggle}>{drawing.enabled ? <X size={19} /> : <Pencil size={19} />}</DrawingButton>}
    {mode !== 'toggle' && drawing.enabled && <>
      {[[Pencil, 'pen'], [Highlighter, 'highlighter'], [Eraser, 'eraser']].map(([Icon, tool]) => <DrawingButton key={tool} type="button" title={c[tool]} aria-label={c[tool]} aria-pressed={drawing.tool === tool} onClick={() => drawing.setTool(tool)}><Icon size={19} /></DrawingButton>)}
      <span className="drawing-colors">{['#e53935', '#1976d2', '#218739', '#fbc02d'].map((color, index) => <DrawingButton key={color} type="button" title={c.colors[index]} aria-label={c.colors[index]} aria-pressed={drawing.color === color} onClick={() => drawing.setColor(color)}><span style={{ backgroundColor: color }} /></DrawingButton>)}</span>
      <label><span className="drawing-sr-only">{c.size}</span><select value={drawing.size} onChange={(event) => drawing.setSize(Number(event.target.value))}><option value={2}>{c.small}</option><option value={4}>{c.medium}</option><option value={8}>{c.large}</option></select></label>
      <DrawingButton type="button" title={c.undo} aria-label={c.undo} disabled={!drawing.canUndo()} onClick={drawing.undo}><Undo2 size={19} /></DrawingButton>
      <DrawingButton type="button" title={c.clear} aria-label={c.clear} disabled={!drawing.getStrokes().length} onClick={drawing.clear}><Trash2 size={19} /></DrawingButton>
    </>}
    {mode !== 'toggle' && drawing.limited && <span role="status">{c.limit}</span>}
  </div>
}
