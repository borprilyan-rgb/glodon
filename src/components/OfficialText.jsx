import { officialCommands } from '../data/tutorialUtils'

const commandPattern = new RegExp(`(${officialCommands.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g')

export default function OfficialText({ children }) {
  if (typeof children !== 'string') return children
  return children.split(commandPattern).map((part, index) => officialCommands.includes(part) ? <strong className="tas-command" key={`${part}-${index}`}>{part}</strong> : part)
}
