const withoutExtension = (filename) => filename?.replace(/\.[^.]+$/, '')

const buildActions = (step, partId, locale, actionDetails) => {
  const baseName = withoutExtension(step.screenshot?.file) || step.id
  return step.instructions.map((instruction, index) => {
    const number = index + 1
    const padded = String(number).padStart(2, '0')
    const isComparison = step.comparisonAt === number
    const fallbackDescription = locale === 'id'
      ? `Tampilkan tindakan ${number} untuk materi ${step.title}.`
      : `Show action ${number} for the ${step.title} lesson.`
    const detail = actionDetails?.[step.id]?.[index]
    const title = detail?.title || instruction.replace(/[.!?]$/, '')
    const description = detail?.description || ''
    const action = {
      id: `${step.id}-action-${number}`,
      number,
      title,
      description,
      callout: detail?.callout,
      image: `/tutorial/tas/${partId}/${index === 0 && step.screenshot?.file ? step.screenshot.file : `${baseName}-${padded}.webp`}`,
      caption: index === 0 && step.screenshot?.description ? step.screenshot.description : fallbackDescription,
      alt: locale === 'id' ? `Tindakan ${number}: ${title}` : `Action ${number}: ${title}`,
      requiredDescription: index === 0 && step.screenshot?.description ? step.screenshot.description : fallbackDescription,
    }
    if (isComparison) {
      action.mediaLayout = 'comparison'
      action.comparison = [
        { label: locale === 'id' ? 'Sebelum' : 'Before', image: `/tutorial/tas/${partId}/${baseName}-before.webp`, caption: locale === 'id' ? 'Kondisi sebelum perubahan aturan pengukuran.' : 'Condition before the measurement-rule change.', alt: locale === 'id' ? 'Kuantitas sebelum perubahan aturan' : 'Quantity before the rule change' },
        { label: locale === 'id' ? 'Sesudah' : 'After', image: `/tutorial/tas/${partId}/${baseName}-after.webp`, caption: locale === 'id' ? 'Kondisi setelah perubahan aturan dan perhitungan ulang.' : 'Condition after the rule change and recalculation.', alt: locale === 'id' ? 'Kuantitas setelah perubahan aturan' : 'Quantity after the rule change' },
      ]
    }
    return action
  })
}

export const buildAllSteps = (parts, locale, actionDetails) => parts.flatMap((part) => part.steps.map((step, index) => ({ ...step, actions: buildActions(step, part.id, locale, actionDetails), partId: part.id, partTitle: part.title, partNumber: part.number, stepNumber: index + 1 })))
export const getStepHash = (step) => `#/${step.partId}/${step.id}`

export const officialCommands = [
  'Identify Door and Window Schedule', 'Set Classification and Quantity', 'Calculate Selected Entity',
  'View Quantity by Category', 'Filter Relevant Element', 'Calculate Occupied Volume',
  'Measurement Rules', 'Measurement Setting', 'View Expression', 'Identify Column',
  'Identify Beam', 'Identify Slab', 'Floor Settings', '3D Deduction', 'No Effect', 'Calculate', 'Quantity',
]
