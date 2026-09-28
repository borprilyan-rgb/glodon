import { ArrowRight } from 'lucide-react'
import { getSectionExercise } from '../data/sectionExercises'
import '../styles/exercise.css'

export default function ExerciseEntry({ language = 'id', product = 'tas', section = 1, exercise = getSectionExercise(product, section) }) {
  if (!exercise) return null
  const c = exercise.copy[language]
  return <aside className="exercise-entry"><div><strong>{c.entry}</strong><small>{c.duration}</small></div><a className="primary-button" href={exercise.path}>{c.start}<ArrowRight size={16} /></a></aside>
}
