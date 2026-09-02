export const buildAllSteps = (parts) => parts.flatMap((part) => part.steps.map((step, index) => ({ ...step, partId: part.id, partTitle: part.title, partNumber: part.number, stepNumber: index + 1 })))
export const getStepHash = (step) => `#/${step.partId}/${step.id}`

export const officialCommands = [
  'Identify Door and Window Schedule', 'Set Classification and Quantity', 'Calculate Selected Entity',
  'View Quantity by Category', 'Filter Relevant Element', 'Calculate Occupied Volume',
  'Measurement Rules', 'Measurement Setting', 'View Expression', 'Identify Column',
  'Identify Beam', 'Identify Slab', 'Floor Settings', '3D Deduction', 'No Effect', 'Calculate', 'Quantity',
]
