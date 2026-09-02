import { Menu } from 'lucide-react'
import ProgressBar from './ProgressBar'

export default function MobileNavigation({ onOpen, completed, total }) {
  return <header className="mobile-nav"><button className="mobile-nav__menu" onClick={onOpen}><Menu size={21} /><span>Lessons</span></button><ProgressBar completed={completed} total={total} compact /></header>
}
