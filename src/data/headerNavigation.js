// Keep the primary header navigation to two useful destinations. The mobile
// menu continues to provide the full set of destinations.
export function getHeaderNavigation({ page, product, activeStep }) {
  const links = {
    home: { id: 'home', href: '/' },
    exercises: { id: 'exercises', href: '/exercises' },
    scores: { id: 'scores', href: '/exercises/score' },
    learningMap: { id: 'learningMap', href: `/${product}/` },
  }
  let selected
  if (activeStep && product) selected = ['learningMap']
  else if (page === 'exercises') selected = ['scores']
  else if (page === 'scores') selected = ['exercises', 'home']
  else if (page === 'contact') selected = ['home', 'exercises']
  else if (page === 'exercise' && product) selected = ['exercises', 'learningMap']
  else if (product && ['course', 'welcome'].includes(page)) selected = ['exercises', 'home']
  else if (product && ['welcome', 'tests', 'lesson'].includes(page)) selected = ['learningMap']
  else if (page === 'admin' || product) selected = ['home']
  else if (page === 'hub') selected = []
  else selected = ['exercises']
  return selected.map(id => links[id])
}
