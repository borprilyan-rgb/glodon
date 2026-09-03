import { getStepPath } from './tutorialUtils.js'

export function getLessonDestination({ step, next, product }) {
  const courseMapPath = `/${product}/course`
  if (!step) return { type: 'course', href: courseMapPath, product }
  if (!next) return { type: 'course', href: courseMapPath, product, completedPart: step.partTitle }
  const crossesPart = next.partId !== step.partId
  return {
    type: crossesPart ? 'part' : 'lesson',
    href: getStepPath(next, product),
    product,
    nextLesson: next,
    completedPart: step.partTitle,
    completedPartNumber: step.partNumber,
    nextPart: crossesPart ? next.partTitle : null,
    nextPartNumber: crossesPart ? next.partNumber : null,
  }
}
