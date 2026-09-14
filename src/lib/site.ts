export const EMAIL = 'hello@probity.bio'
export const PILOT_MAILTO = `mailto:${EMAIL}?subject=Pilot%20brief%20request`

// Pages linked from the site that aren't published yet all land on /coming-soon/.
export const COMING_SOON_PAGES = {
  'sample-brief': 'The sample brief',
  privacy: 'The privacy policy',
  terms: 'The terms of service',
  linkedin: 'Our LinkedIn page',
} as const

export type ComingSoonPage = keyof typeof COMING_SOON_PAGES

export const comingSoon = (page: ComingSoonPage) => `/coming-soon/?page=${page}`
