export const EMAIL = 'hello@probity.bio'

/** The signup form on the home page. /subscribe can take over this link later. */
export const SUBSCRIBE_HREF = '/#subscribe'

/** Buttondown's own hosted signup page. Brief pages send readers straight here. */
export const NEWSLETTER_HREF = 'https://buttondown.com/probity'

export const METHOD_VERSION = 'v1.0'

/**
 * The public brief record: every brief, committed before its catalyst date.
 *
 * The witness line links to a brief's commit history rather than to the file, because the
 * dates are the point. "Published before the vote" is a claim until a reader can check the
 * timestamp themselves, and the history page is where they check it.
 */
export const BRIEF_RECORD = {
  PUBLIC: true,
  repo: 'https://github.com/Jakeroberson1/probity-briefs',
  historyUrl: (slug: string) =>
    `https://github.com/Jakeroberson1/probity-briefs/commits/main/briefs/${slug}.md`,
} as const

// Pages linked from the site that aren't published yet all land on /coming-soon/.
export const COMING_SOON_PAGES = {
  privacy: 'The privacy policy',
  terms: 'The terms of service',
  linkedin: 'Our LinkedIn page',
} as const

export type ComingSoonPage = keyof typeof COMING_SOON_PAGES

export const comingSoon = (page: ComingSoonPage) => `/coming-soon/?page=${page}`
