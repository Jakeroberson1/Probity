export const EMAIL = 'hello@probity.bio'

/** The signup form on the home page. /subscribe can take over this link later. */
export const SUBSCRIBE_HREF = '/#subscribe'

export const METHOD_VERSION = 'v1.0'

// Pages linked from the site that aren't published yet all land on /coming-soon/.
export const COMING_SOON_PAGES = {
  privacy: 'The privacy policy',
  terms: 'The terms of service',
  linkedin: 'Our LinkedIn page',
} as const

export type ComingSoonPage = keyof typeof COMING_SOON_PAGES

export const comingSoon = (page: ComingSoonPage) => `/coming-soon/?page=${page}`
