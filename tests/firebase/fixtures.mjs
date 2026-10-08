export const participant = { name: 'Ayu', jobTitle: 'Engineer', employeeId: '000012' }

export function answersFor(exercise) {
  if (exercise.officePlan) return { settings: 'review', rules: 'inspect', projectName: 'ASG Training', ground: '-0.5', ruleSet: 'SMPI', attributes: 'private', height1: '3.5', height2: '3.5', grade: 'K-300', copy: 'yes', drawing: 'split', length: '6000', verify: 'independent', grid: 'A/1', alignmentCheck: 'other' }
  return Object.fromEntries(exercise.copy.en.questions.flatMap(question => [[question.id, '0'], ...(question.fields || []).map(field => [field.name, '1'])]))
}
