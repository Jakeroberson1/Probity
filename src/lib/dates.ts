// FDA meeting days and action dates run on US Eastern time.
const TIME_ZONE = 'America/New_York'

export const DAY_MS = 24 * 60 * 60 * 1000

/** UTC instant of midnight at the start of `date` (YYYY-MM-DD), US Eastern time. */
export function startOfDayET(date: string): number {
  const [y, m, d] = date.split('-').map(Number)
  const guess = Date.UTC(y, m - 1, d)
  return guess - easternOffsetMs(guess)
}

function easternOffsetMs(utc: number): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(new Date(utc))
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value)
  return Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second')) - utc
}

// Calendar dates carry no time, so format them at UTC noon to keep the day stable in every zone.
const asDate = (date: string) => new Date(`${date}T12:00:00Z`)

/** "2026-09-23" → "September 23, 2026" */
export const formatLongDate = (date: string) =>
  asDate(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

/** "2026-09-23" → "Sep 23, 2026" */
export const formatMediumDate = (date: string) =>
  asDate(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

/** "2026-09-23" → "Sep 23" */
export const formatShortDate = (date: string) =>
  asDate(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
