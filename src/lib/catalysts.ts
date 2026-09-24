import calendar from '../../data/catalyst-calendar.json'
import { DAY_MS, startOfDayET } from '@/lib/dates'
import { EVENTS as SCORED } from '@/lib/track-record'

export type CatalystType = 'adcom' | 'pdufa' | 'readout'

export type Catalyst = {
  id: string
  /** Confirmed date (YYYY-MM-DD), or null when only a window is known. */
  date: string | null
  /** "Q4 2026", "November 2026 (exact date undisclosed)". Empty when the date is firm. */
  date_note: string
  company: string
  ticker: string
  asset: string
  indication: string
  event_type: CatalystType
  /** Why this one is worth watching. */
  why: string
  source_url: string
  /** 1 when the date itself is still unconfirmed. */
  unconfirmed: number
  /** 0 for routine business (flu strain selection, policy discussion) that moves no stock. */
  stock_moving: number
  /** Set by `probity scan` when FDA cancels or postpones the meeting. */
  cancelled?: boolean
  /** AdComs carry the committee hearing them; PDUFAs and readouts don't. */
  committee?: string
}

type Calendar = {
  upcoming: Catalyst[]
  watchlist_tba: Catalyst[]
  generated: string
  /** Pins the next-call box to a specific event while its date is still ahead. */
  next_featured?: { date: string; label: string }
}

const CALENDAR = calendar as unknown as Calendar

/** Every dated catalyst, soonest first. */
export const UPCOMING: Catalyst[] = [...CALENDAR.upcoming].sort((a, b) =>
  (a.date ?? '').localeCompare(b.date ?? ''),
)

/** Catalysts we're tracking that don't have a date yet. */
export const WATCHLIST: Catalyst[] = CALENDAR.watchlist_tba

export const CALENDAR_UPDATED = CALENDAR.generated

export const TYPE_LABEL: Record<CatalystType, string> = {
  adcom: 'FDA panel vote',
  pdufa: 'FDA approval decision',
  readout: 'trial readout',
}

/** Short badge text for the calendar. */
export const TYPE_BADGE: Record<CatalystType, string> = {
  adcom: 'AdCom',
  pdufa: 'PDUFA',
  readout: 'Readout',
}

/** "GRAIL, Inc." → "GRAIL"; "Roche / Genentech" → "Roche"; "Genentech (Roche)" → "Genentech". */
export function shortCompany(company: string): string {
  return company.split(' / ')[0].split(' (')[0].replace(/,?\s+Inc\.?$/, '').trim()
}

/** "Atezolizumab (Tecentriq) + chemo, sBLA (Priority Review)" → "Atezolizumab (Tecentriq) + chemo" */
export function productName(asset: string): string {
  return asset.replace(/,\s*s?(NDA|BLA|PMA)\b.*$/i, '').replace(/\s*\(PMA\)$/, '').trim()
}

export type NextCall = {
  /** e.g. "GRAIL Galleri FDA panel vote" */
  label: string
  date: string
  /** Midnight at the start of the event day, US Eastern. */
  startsAt: number
  /** Midnight at the end of the event day, US Eastern. */
  endsAt: number
  /** Short company name, for "The GRAIL brief lands before Sep 23." */
  briefName: string
}

function toNextCall(date: string, label: string, briefName: string): NextCall {
  const startsAt = startOfDayET(date)
  return { date, label, briefName, startsAt, endsAt: startsAt + DAY_MS }
}

/** Dates already graded on the track record. */
const gradedDates = () => new Set(SCORED.filter((e) => e.right !== null).map((e) => e.date))

/**
 * The next catalyst worth counting down to: dated, not cancelled, not already graded, and
 * stock-moving. Routine business like flu strain selection is on the calendar for completeness
 * but shouldn't take over the homepage. `next_featured` wins while its date is still ahead.
 */
export function nextCall(now: number = Date.now()): NextCall | null {
  const graded = gradedDates()
  const upcoming = UPCOMING.filter(
    (e): e is Catalyst & { date: string } =>
      e.date !== null &&
      !e.cancelled &&
      e.stock_moving === 1 &&
      startOfDayET(e.date) + DAY_MS > now &&
      !graded.has(e.date),
  )

  // A featured event that has since been cancelled gives way to the next real one.
  const featured = CALENDAR.next_featured
  const featuredCancelled = UPCOMING.some((e) => e.date === featured?.date && e.cancelled)
  if (
    featured &&
    !featuredCancelled &&
    !graded.has(featured.date) &&
    startOfDayET(featured.date) + DAY_MS > now
  ) {
    const match = upcoming.find((e) => e.date === featured.date)
    return toNextCall(featured.date, featured.label, match ? shortCompany(match.company) : featured.label)
  }

  const event = upcoming[0]
  if (!event) return null
  const company = shortCompany(event.company)
  const name = company === '—' ? productName(event.asset) : `${company} ${productName(event.asset)}`
  return toNextCall(event.date, `${name} ${TYPE_LABEL[event.event_type]}`, company)
}

/** Whole days from now until the start of a catalyst's day, US Eastern. */
export function daysUntil(date: string, now: number = Date.now()): number {
  return Math.ceil((startOfDayET(date) - now) / DAY_MS)
}

/** "in 15 days" / "tomorrow" / "today" / "past". */
export function countdownLabel(date: string, now: number = Date.now()): string {
  const start = startOfDayET(date)
  if (now >= start + DAY_MS) return 'past'
  if (now >= start) return 'today'
  const days = daysUntil(date, now)
  return days === 1 ? 'tomorrow' : `in ${days} days`
}
