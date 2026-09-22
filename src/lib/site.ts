export const EMAIL = 'hello@probity.bio'

/** The signup form on the home page. /subscribe can take over this link later. */
export const SUBSCRIBE_HREF = '/#subscribe'

/** Buttondown's own hosted signup page. Brief pages send readers straight here. */
export const NEWSLETTER_HREF = 'https://buttondown.com/probity'

export const METHOD_VERSION = 'v1.0'

/**
 * The public brief record. The repo is private until it's deliberately opened, so the
 * witness line on a brief page names the commit without linking to a 404. Set
 * PUBLIC to true once the repo is public and the links go live.
 */
export const BRIEF_RECORD = {
  PUBLIC: false,
  repo: 'https://github.com/Jakeroberson1/probity-briefs',
  commitUrl: (sha: string) => `https://github.com/Jakeroberson1/probity-briefs/commit/${sha}`,
} as const

// Pages linked from the site that aren't published yet all land on /coming-soon/.
export const COMING_SOON_PAGES = {
  privacy: 'The privacy policy',
  terms: 'The terms of service',
  linkedin: 'Our LinkedIn page',
} as const

export type ComingSoonPage = keyof typeof COMING_SOON_PAGES

export const comingSoon = (page: ComingSoonPage) => `/coming-soon/?page=${page}`
