export function getProductConfig(product, t, course = {}) {
  const isTrb = product === 'trb'
  return {
    id: product,
    name: `Cubicost ${product.toUpperCase()}`,
    shortName: product.toUpperCase(),
    logo: `/branding/cubicost-${product}-logo.png`,
    welcomeTitle: isTrb ? course.title : null,
    welcomeText: isTrb ? course.intro : t.landingIntro,
    welcomeEyebrow: isTrb ? `${product.toUpperCase()} · ${t.technicalTutorial}` : t.landingEyebrow,
    courseTitle: isTrb ? course.title : `${t.heroProduct} ${t.heroTitle}`,
    courseIntro: isTrb ? course.intro : t.heroIntro,
    courseRoute: `/${product}/course`,
    lessonRoute: `/${product}/lesson`,
    preview: `/tutorial/${product}/welcome-preview.webp`,
    outcomes: isTrb
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
