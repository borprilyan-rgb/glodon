export function getProductConfig(product, t, course = {}) {
  const hasCourseData = product !== 'tas'
  const isTme = product === 'tme'
  return {
    id: product,
    name: `Cubicost ${product === 'tme' ? 'TME-C' : product.toUpperCase()}`,
    shortName: product === 'tme' ? 'TME-C' : product.toUpperCase(),
    logo: `/branding/cubicost-${product}-logo.png`,
    welcomeTitle: hasCourseData ? course.title : null,
    welcomeText: hasCourseData ? course.intro : t.landingIntro,
    welcomeEyebrow: hasCourseData ? `${product === 'tme' ? 'TME-C' : product.toUpperCase()} · ${t.technicalTutorial}` : t.landingEyebrow,
    courseTitle: hasCourseData ? course.title : `${t.heroProduct} ${t.heroTitle}`,
    courseIntro: hasCourseData ? course.intro : t.heroIntro,
    partCount: course.tutorialParts?.length || 3,
    progressKey: `cubicost:tutorial:${product}:progress`,
    lastLessonKey: `cubicost:tutorial:${product}:lastLesson`,
    courseRoute: `/${product}/course`,
    lessonRoute: `/${product}/lesson`,
    preview: `/tutorial/${product}/welcome-preview.webp`,
    outcomes: isTme
      ? [
          { title: t.tmeOutcome1Title, description: t.tmeOutcome1 },
          { title: t.tmeOutcome2Title, description: t.tmeOutcome2 },
          { title: t.tmeOutcome3Title, description: t.tmeOutcome3 },
        ]
      : hasCourseData
      ? [
          { title: t.trbOutcome1Title, description: t.trbOutcome1 },
          { title: t.trbOutcome2Title, description: t.trbOutcome2 },
          { title: t.trbOutcome3Title, description: t.trbOutcome3 },
        ]
      : [
          { title: t.outcome1Title, description: t.outcome1Text },
          { title: t.outcome2Title, description: t.outcome2Text },
          { title: t.outcome3Title, description: t.outcome3Text },
        ],
  }
}
