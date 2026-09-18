import data from '../../data/track-record.json'

export type ScoredEvent = {
  date: string
  event: string
  committee: string
  /** "YES" / "NO", or null until the brief is published. */
  our_call: string | null
  /** Published probability of YES: a percentage (62) or a fraction (0.62). */
  probability: number | null
  outcome: string
  /** Whether the call matched the outcome; null until graded. */
  right: boolean | null
  method_version: string
}

type TrackRecord = { events: ScoredEvent[]; updated: string }

export const EVENTS = [...(data as TrackRecord).events].sort((a, b) => a.date.localeCompare(b.date))

/**
 * The record is counted from the event rows rather than read from the file's
 * `record` block, so the headline number can never disagree with the table.
 */
export function recordCounts() {
  const right = EVENTS.filter((e) => e.right === true).length
  const wrong = EVENTS.filter((e) => e.right === false).length
  return { right, wrong, scored: right + wrong }
}

/** Earliest event still waiting on an outcome. */
export const nextPending = () => EVENTS.find((e) => e.right === null)

export function formatProbability(p: number | null): string {
  if (p === null) return '—'
  return `${Math.round(p <= 1 ? p * 100 : p)}%`
}
