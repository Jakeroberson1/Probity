// The structured copy of a published brief, written by `probity publish` into
// content/briefs/<slug>.json. It is the redacted view: the call, the evidence and the
// citations, with none of the method's internal arithmetic. The markdown file beside it
// is the same brief, and is what the public record repo holds.

const FILES = import.meta.glob('../../content/briefs/*.json', {
  import: 'default',
  eager: true,
}) as Record<string, BriefData>

// Post-mortems are written after a call is graded and live beside the brief they grade:
// content/briefs/<slug>.postmortem.md. The brief itself is never edited after publication,
// so the grading notes have to be a separate file.
const POSTMORTEMS = import.meta.glob('../../content/briefs/*.postmortem.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export type Citation = { source: string; locator: string | null; quote: string }

export type BriefGate = {
  number: number
  name: string
  question: string
  /** The plain-language call: "Lean Yes", "Toss-up". Never a score. */
  call: string
  overridden: boolean
  evidence: string[]
  citations: Citation[]
  fda_concerns: string[]
}

export type BriefData = {
  slug: string
  title: string
  event: {
    company: string | null
    ticker: string | null
    product: string | null
    catalyst_type: string | null
    catalyst_date: string
    committee: string | null
    /** The specific question this call answers, when the panel votes on several. */
    question: string | null
  }
  event_label: string
  event_date_label: string
  call: string
  probability: number
  coin_flip: boolean
  summary: string
  tldr: { crux?: string; scenarios?: { outcome: string; implication: string }[] }
  crowd_probability: number | null
  crowd_read: string | null
  gates: BriefGate[]
  risks: string[]
  sources: { sid: string; name: string; url: string | null; fetched_at: string; pages: number | null }[]
  consensus: Record<string, string>
  overrides: { gate: number | null; gate_name: string | null; from: string; to: string; why: string }[]
  method_version: string
  published_at: string
  generated_at: string
}

const BY_SLUG: Record<string, BriefData> = Object.fromEntries(
  Object.values(FILES).map((data) => [data.slug, data]),
)

export const findBriefData = (slug: string): BriefData | undefined => BY_SLUG[slug]

/** The post-mortem markdown for a brief, once it has been graded and one has been written. */
export function findPostMortem(slug: string): string | undefined {
  const entry = Object.entries(POSTMORTEMS).find(([path]) => path.endsWith(`/${slug}.postmortem.md`))
  return entry?.[1]
}

/** Whether a graded call has a post-mortem, so the track record can link to it. */
export const hasPostMortem = (slug: string): boolean => findPostMortem(slug) !== undefined

/** The published brief for a catalyst date, so a track-record row can link to its brief. */
export const briefForDate = (date: string): BriefData | undefined =>
  Object.values(BY_SLUG).find((b) => b.event.catalyst_date === date)

/**
 * Probity's probability minus the crowd's, in points. Positive means Probity is more
 * confident in YES than the crowd was; the sign is what makes a call worth publishing.
 */
export function edgePoints(data: BriefData): number | null {
  if (data.crowd_probability === null) return null
  return Math.round((data.probability - data.crowd_probability) * 10) / 10
}
