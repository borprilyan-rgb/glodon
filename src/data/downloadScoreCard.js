import { participantFields, participantLabels } from './participant'
import { scoreLabel, scoreStatus } from './testScores'

export async function downloadScoreCard({ product, profile, rows, language }) {
  const en = language === 'en'
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  const width = 840
  function draw() {
    let y = 52
    function text(value, { size = 22, bold = false, color = '#163453', maxWidth = 736 } = {}) {
      ctx.font = `${bold ? '700' : '400'} ${size}px Arial, sans-serif`
      ctx.fillStyle = color
      ctx.textBaseline = 'top'
      // Wrap long names, IDs and section titles without truncating the export.
      let line = ''
      for (const word of String(value).split(/\s+/)) {
        if (line && ctx.measureText(`${line} ${word}`).width > maxWidth) {
          ctx.fillText(line, 52, y)
          y += size * 1.45
          line = ''
        }
        for (const char of `${line ? ' ' : ''}${word}`) {
          if (line && ctx.measureText(line + char).width > maxWidth) {
            ctx.fillText(line, 52, y)
            y += size * 1.45
            line = ''
          }
          line += char
        }
      }
      ctx.fillText(line, 52, y)
      y += size * 1.45
    }
    function divider() {
      ctx.fillStyle = '#dae5ee'
      ctx.fillRect(52, y, 736, 1)
      y += 24
    }
    text('CUBICOST LEARNING CENTRE', { size: 16, bold: true, color: '#1466d8' })
    y += 12
    text(`Cubicost ${product.toUpperCase()} · ${scoreLabel(language)}`, { size: 36, bold: true })
    y += 20
    divider()
    for (const field of participantFields) {
      text(participantLabels[language][field], { size: 16, color: '#536a80' })
      text(profile?.[field]?.trim() || '—', { bold: true })
      y += 12
    }
    divider()
    for (const { section, title, result, critical } of rows) {
      const top = y
      text(`${en ? 'Section' : 'Bagian'} ${section}: ${title}`, { bold: true, maxWidth: 570 })
      const afterTitle = y
      ctx.font = '700 26px Arial, sans-serif'
      ctx.fillStyle = '#163453'
      ctx.textAlign = 'right'
      ctx.fillText(`${result?.total ?? 0}/100`, 788, top)
      ctx.textAlign = 'left'
      y = Math.max(afterTitle, top + 38)
      text(scoreStatus(result, language), { size: 18, bold: true, color: !result ? '#536a80' : result.passed ? '#23754f' : '#956013' })
      if (result && !result.criticalPassed) text(critical, { size: 17, color: '#956013' })
      y += 20
      divider()
    }
    return y + 28
  }
  const height = Math.ceil(draw())
  canvas.width = width * 2
  canvas.height = height * 2
  ctx.scale(2, 2)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#1466d8'
  ctx.fillRect(0, 0, width, 8)
  draw()
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('PNG export failed')
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const name = (profile?.name || 'score').trim().replace(/[^\p{L}\p{N}_-]+/gu, '-').slice(0, 70)
  link.href = url
  link.download = `cubicost-${product}-${name}.png`
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}
