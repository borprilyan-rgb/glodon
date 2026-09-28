import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

function paint(ctx, stroke, width, height) {
  if (!stroke.points.length) return
  ctx.save()
  ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over'
  ctx.globalAlpha = stroke.tool === 'highlighter' ? 0.3 : 1
  ctx.strokeStyle = stroke.color
  ctx.fillStyle = stroke.color
  ctx.lineWidth = stroke.width * width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  const [first, ...rest] = stroke.points
  if (!rest.length) {
    ctx.arc(first.x * width, first.y * height, ctx.lineWidth / 2, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.moveTo(first.x * width, first.y * height)
    rest.forEach((point) => ctx.lineTo(point.x * width, point.y * height))
    ctx.stroke()
  }
  ctx.restore()
}

// The layer follows the actual object-fit image, including letterboxing and zoom.
export default function DrawingCanvas({ drawing, image, label }) {
  const canvasRef = useRef(null)
  const cacheRef = useRef(null)
  const draftRef = useRef(null)
  const frameRef = useRef(null)
  const dimensions = useRef({ width: 1, height: 1, ratio: 1 })
  const latest = useRef(drawing)
  useLayoutEffect(() => { latest.current = drawing })

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !cacheRef.current) return
    const ctx = canvas.getContext('2d')
    const { width, height, ratio } = dimensions.current
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(cacheRef.current, 0, 0)
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    if (draftRef.current) paint(ctx, draftRef.current, width, height)
  }, [])

  const schedule = useCallback(() => {
    if (frameRef.current !== null) return
    frameRef.current = requestAnimationFrame(() => { frameRef.current = null; render() })
  }, [render])

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas.parentElement
    const img = parent.querySelector('img')
    if (!img) return undefined
    cacheRef.current = document.createElement('canvas')
    const resize = () => {
      draftRef.current = null
      const box = img.getBoundingClientRect()
      const container = parent.getBoundingClientRect()
      if (!img.naturalWidth || !box.width || !box.height) return
      const scale = Math.min(box.width / img.naturalWidth, box.height / img.naturalHeight)
      const width = img.naturalWidth * scale
      const height = img.naturalHeight * scale
      const ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4000000 / (width * height)))
      dimensions.current = { width, height, ratio }
      Object.assign(canvas.style, { left: `${box.left - container.left + (box.width - width) / 2}px`, top: `${box.top - container.top + (box.height - height) / 2}px`, width: `${width}px`, height: `${height}px` })
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      const cache = cacheRef.current
      cache.width = canvas.width
      cache.height = canvas.height
      const ctx = cache.getContext('2d')
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      latest.current.getStrokes().forEach((stroke) => paint(ctx, stroke, width, height))
      render()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(img)
    img.addEventListener('load', resize)
    resize()
    return () => {
      observer.disconnect()
      img.removeEventListener('load', resize)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
      draftRef.current = null
      cacheRef.current = null
    }
  }, [image, drawing.surfaceKey, drawing.revision, render])

  useEffect(() => {
    if (!drawing.enabled) { draftRef.current = null; schedule() }
  }, [drawing.enabled, schedule])

  function point(event) {
    const box = canvasRef.current.getBoundingClientRect()
    return { x: Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)), y: Math.max(0, Math.min(1, (event.clientY - box.top) / box.height)) }
  }
  function start(event) {
    if (!drawing.enabled || event.button !== 0 || draftRef.current) return
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    const multiplier = drawing.tool === 'highlighter' ? 5 : drawing.tool === 'eraser' ? 6 : 1
    draftRef.current = { tool: drawing.tool, color: drawing.color, width: drawing.size * multiplier / dimensions.current.width, pointerId: event.pointerId, points: [point(event)] }
    schedule()
  }
  function move(event) {
    const draft = draftRef.current
    if (!draft || draft.pointerId !== event.pointerId) return
    event.stopPropagation()
    if (draft.points.length < 2048) draft.points.push(point(event))
    else draft.points[draft.points.length - 1] = point(event)
    schedule()
  }
  function finish(event, cancel = false) {
    const draft = draftRef.current
    if (!draft || draft.pointerId !== event.pointerId) return
    event.stopPropagation()
    draftRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (!cancel) drawing.commit(draft)
    schedule()
  }
  return <canvas ref={canvasRef} className={`drawing-canvas${drawing.enabled ? ' is-drawing' : ''}`} role="img" aria-label={label} onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={(event) => finish(event, true)} onLostPointerCapture={(event) => finish(event, true)} onClick={(event) => event.stopPropagation()} />
}
