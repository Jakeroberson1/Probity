import { Layout } from '@/components/layout'
import { Reveal } from '@/components/reveal'
import { useHashScroll } from '@/hooks/use-hash-scroll'
import { useNow } from '@/hooks/use-now'
import { briefForDate, hasPostMortem, type BriefData } from '@/lib/brief-data'
import { briefHref } from '@/lib/briefs'
import {
  countdownLabel,
  productName,
  shortCompany,
  TYPE_BADGE,
  UPCOMING,
  WATCHLIST,
  type Catalyst,
} from '@/lib/catalysts'
import { formatMediumDate } from '@/lib/dates'
import { EVENTS as SCORED, formatProbability, type ScoredEvent } from '@/lib/track-record'

/**
 * Every FDA catalyst we're tracking, in date order. Rows that already have a brief link to it,
 * rows that have been graded show the result, and rows with neither offer the brief by email.
 */
export function CalendarPage() {
  useHashScroll()
  const now = useNow(60_000)
  const rows = calendarRows()
  const months = groupByMonth(rows)

  return (
    <Layout>
      <section className="hero page-hero page-hero--compact" aria-labelledby="calendar-title">
        <div className="container hero__inner">
          <Reveal as="p" className="badge">
            Calendar
          </Reveal>
          <Reveal as="h1" className="hero__title page-hero__title" id="calendar-title">
            The catalyst calendar
          </Reveal>
          <Reveal as="p" className="hero__sub">
            Every FDA catalyst we're tracking, with a brief before each date and a grade after.
            Nothing is ever edited or deleted.
          </Reveal>
        </div>
      </section>

      <section className="section section--tight" aria-label="Dated catalysts">
        <div className="container stack">
          {months.map(([month, items]) => (
            <Reveal className="panel" key={month}>
              <h2 className="calendar__month">{month}</h2>
              <ol className="calendar__list">
                {items.map((row) => (
                  <CatalystRow key={row.catalyst.id} row={row} now={now} />
                ))}
              </ol>
            </Reveal>
          ))}

          <Reveal className="panel" id="watchlist">
            <h2 className="calendar__month">Watchlist, date TBA</h2>
            <ol className="calendar__list calendar__list--compact">
              {WATCHLIST.map((c) => (
                <li className="calendar-row calendar-row--compact" key={c.id}>
                  <span className="calendar-row__when">{c.date_note || 'Date TBA'}</span>
                  <span className="calendar-row__main">
                    <span className="calendar-row__title">{title(c)}</span>
                    <span className="calendar-row__indication">{c.indication}</span>
                  </span>
                  <TypeBadge catalyst={c} />
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>
    </Layout>
  )
}

/** A calendar row: the catalyst, plus whatever we've published about it so far. */
type Row = { catalyst: Catalyst; brief?: BriefData; scored?: ScoredEvent }

function calendarRows(): Row[] {
  const rows: Row[] = UPCOMING.map((catalyst) => ({
    catalyst,
    brief: catalyst.date ? briefForDate(catalyst.date) : undefined,
  }))

  // Graded calls aren't in the calendar file, which only looks forward. They belong here: a
  // calendar that quietly drops the events we've already been scored on is a sales page.
  for (const scored of SCORED) {
    if (scored.right === null) continue
    if (rows.some((r) => r.catalyst.date === scored.date)) continue
    const brief = briefForDate(scored.date)
    rows.push({ catalyst: fromScored(scored, brief), brief, scored })
  }

  return rows.sort((a, b) => (a.catalyst.date ?? '').localeCompare(b.catalyst.date ?? ''))
}

/** Build a calendar entry for a past call out of what the track record and its brief know. */
function fromScored(scored: ScoredEvent, brief?: BriefData): Catalyst {
  return {
    id: `scored-${scored.date}`,
    date: scored.date,
    date_note: '',
    company: brief?.event.company ?? '',
    ticker: brief?.event.ticker ?? '',
    asset: brief?.event.product ?? scored.event,
    indication: scored.committee,
    event_type: (brief?.event.catalyst_type as Catalyst['event_type']) ?? 'adcom',
    why: '',
    source_url: '',
    unconfirmed: 0,
    stock_moving: 1,
  }
}

function groupByMonth(rows: Row[]): [string, Row[]][] {
  const months = new Map<string, Row[]>()
  for (const row of rows) {
    if (!row.catalyst.date) continue
    const [year, month] = row.catalyst.date.split('-')
    const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    months.set(label, [...(months.get(label) ?? []), row])
  }
  return [...months]
}

function title(c: Catalyst): string {
  const company = shortCompany(c.company)
  const asset = productName(c.asset)
  return company && company !== '—' ? `${company} ${asset}` : asset
}

function TypeBadge({ catalyst }: { catalyst: Catalyst }) {
  return (
    <span className={`type-badge type-badge--${catalyst.event_type}`}>
      {TYPE_BADGE[catalyst.event_type]}
    </span>
  )
}

function CatalystRow({ row, now }: { row: Row; now: number }) {
  const { catalyst, brief, scored } = row
  const routine = catalyst.stock_moving === 0
  // "past" is what the clock says; "graded" is what actually happened, and it's the better word
  // on a page whose whole claim is that every call gets scored.
  const when = scored ? 'graded' : catalyst.date ? countdownLabel(catalyst.date, now) : catalyst.date_note
  const past = when === 'past'

  return (
    <li className={['calendar-row', routine && 'calendar-row--routine'].filter(Boolean).join(' ')}>
      <span className="calendar-row__when">
        {catalyst.date && (
          <time className="calendar-row__date" dateTime={catalyst.date}>
            {formatMediumDate(catalyst.date)}
          </time>
        )}
        <span className="calendar-row__countdown">{when}</span>
        {catalyst.unconfirmed === 1 && <span className="calendar-row__flag">date unconfirmed</span>}
        {catalyst.cancelled && <span className="calendar-row__flag">cancelled</span>}
      </span>

      <span className="calendar-row__main">
        <span className="calendar-row__title">{title(catalyst)}</span>
        <span className="calendar-row__indication">{catalyst.indication}</span>
        {catalyst.source_url && (
          <a
            className="calendar-row__source"
            href={catalyst.source_url}
            rel="noreferrer noopener"
            target="_blank"
          >
            FDA source ↗
          </a>
        )}
      </span>

      <span className="calendar-row__badges">
        <TypeBadge catalyst={catalyst} />
        {routine && <span className="calendar-row__routine">routine</span>}
      </span>

      <span className="calendar-row__action">
        {scored && brief ? (
          <a
            className="calendar-row__result"
            href={hasPostMortem(brief.slug) ? `${briefHref(brief.slug)}#postmortem` : briefHref(brief.slug)}
          >
            Called {scored.our_call} {formatProbability(scored.probability)} → {scored.outcome} ·{' '}
            <strong>{scored.right ? 'Right' : 'Wrong'}</strong>
          </a>
        ) : brief ? (
          <a className="calendar-row__cta" href={briefHref(brief.slug)}>
            Read the brief
          </a>
        ) : past ? (
          <span className="calendar-row__pending">Grading</span>
        ) : null}
      </span>
    </li>
  )
}
