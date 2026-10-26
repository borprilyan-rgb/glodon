// Keep the primary header navigation to two useful destinations. The mobile
// menu continues to provide the full set of destinations.
export function getHeaderNavigation({ page, product, activeStep }) {
  const links = {
    contact: { id: 'contact', href: '/contact' },
    home: { id: 'home', href: '/' },
    exercises: { id: 'exercises', href: product ? `/${product}/tests` : '/exercises' },
    learningMap: { id: 'learningMap', href: `/${product}/` },
  }
  let selected
  if (activeStep && product) selected = ['contact', 'learningMap']
  else if (page === 'contact') selected = ['home', 'exercises']
  else if (page === 'exercise' && product) selected = ['exercises', 'learningMap']
  else if (product && ['course', 'welcome'].includes(page)) selected = ['exercises', 'home']
  else if (product && ['welcome', 'tests', 'lesson'].includes(page)) selected = ['contact', 'learningMap']
  else if (['exercises', 'admin'].includes(page) || product) selected = ['contact', 'home']
  else if (page === 'hub') selected = ['contact']
  else selected = ['contact', 'exercises']
  return selected.map(id => links[id])
}
