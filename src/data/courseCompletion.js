export function getCourseCompletion(step, lessons, completed) {
  const partLessons = lessons.filter(lesson => lesson.partId === step?.partId)
  return {
    courseComplete: lessons.length > 0 && lessons.every(lesson => completed.has(lesson.id)),
    partComplete: partLessons.length > 0 && partLessons.every(lesson => completed.has(lesson.id)),
  }
}
