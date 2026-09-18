import calendar from '../../data/catalyst-calendar.json'
import { DAY_MS, startOfDayET } from '@/lib/dates'

export type CatalystType = 'adcom' | 'pdufa' | 'readout'

export type Catalyst = {
  company: string
  product: string
  type: CatalystType
  covered: boolean
  /** Confirmed date (YYYY-MM-DD), or null when only a window is known. */
  date: string | null
  window?: string
  committee?: string
  indication?: string
  note?: string
  ticker: string | null
  unconfirmed?: boolean
}

type Calendar = {
  events: Catalyst[]
  /** Pins the next-call box to a specific event while its date is still ahead. */
  next_featured?: { date: string; label: string }
  updated: string
}

const CALENDAR = calendar as Calendar

const TYPE_LABEL: Record<CatalystType, string> = {
  adcom: 'FDA panel vote',
  pdufa: 'FDA approval decision',
  readout: 'trial readout',
}

/** "GRAIL, Inc." → "GRAIL"; "Roche / Genentech" → "Roche"; "Genentech (Roche)" → "Genentech". */
export function shortCompany(company: string): string {
  return company.split(' / ')[0].split(' (')[0].replace(/,?\s+Inc\.?$/, '').trim()
}

/** "Atezolizumab (Tecentriq) + chemo, sBLA" → "Atezolizumab (Tecentriq) + chemo" */
function productName(product: string): string {
  return product.replace(/,\s*s?(NDA|BLA)$/, '').replace(/\s*\(PMA\)$/, '').trim()
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

/**
 * The next covered catalyst whose day hasn't ended yet. `next_featured` wins
 * while its date is ahead; once that day is over, the earliest remaining
 * covered event with a confirmed date takes over automatically. Events known
 * only by a window ("Q4 2026") never drive the countdown.
 */
export function nextCall(now: number = Date.now()): NextCall | null {
  const upcoming = CALENDAR.events
    .filter((e): e is Catalyst & { date: string } => e.covered && e.date !== null)
    .filter((e) => startOfDayET(e.date) + DAY_MS > now)
    .sort((a, b) => a.date.localeCompare(b.date))

  const featured = CALENDAR.next_featured
  if (featured && startOfDayET(featured.date) + DAY_MS > now) {
    const match = upcoming.find((e) => e.date === featured.date)
    return toNextCall(featured.date, featured.label, match ? shortCompany(match.company) : featured.label)
  }

  const event = upcoming[0]
  if (!event) return null
  const company = shortCompany(event.company)
  return toNextCall(event.date, `${company} ${productName(event.product)} ${TYPE_LABEL[event.type]}`, company)
}
