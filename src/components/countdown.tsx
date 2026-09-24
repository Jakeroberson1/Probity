import { ArrowLink } from '@/components/section'
import { useNow } from '@/hooks/use-now'
import { briefForDate } from '@/lib/brief-data'
import { briefHref } from '@/lib/briefs'
import { nextCall } from '@/lib/catalysts'
import { formatLongDate } from '@/lib/dates'
import { EVENTS, formatProbability } from '@/lib/track-record'

const UNITS = [
  ['days', 86_400_000],
  ['hours', 3_600_000],
  ['minutes', 60_000],
  ['seconds', 1_000],
] as const

function splitDuration(ms: number) {
  let rest = Math.max(0, ms)
  return UNITS.map(([unit, size]) => {
    const value = Math.floor(rest / size)
    rest -= value * size
    return { unit, value }
  })
}

/** Next-call box: the next covered catalyst and a live countdown to its day. */
export function NextCallPanel() {
  const now = useNow(1000)
  const call = nextCall(now)

  if (!call) {
    // Nothing on the calendar yet. The last graded call is more use to a reader than an
    // apology about scheduling, and it is the thing the whole site is arguing about.
    const last = [...EVENTS].reverse().find((e) => e.right !== null)
    const brief = last ? briefForDate(last.date) : undefined
    return (
      <div className="next-call">
        <p className="eyebrow">{last ? 'Last call' : 'Next call'}</p>
        {last ? (
          <>
            <p className="next-call__title">{last.event}</p>
            <p className="next-call__date">
              Called {last.our_call} at {formatProbability(last.probability)}. {last.outcome}.
            </p>
            <p className="next-call__today">{last.right ? 'Right.' : 'Wrong.'}</p>
            {brief && <ArrowLink href={briefHref(brief.slug)}>Read the brief</ArrowLink>}
          </>
        ) : (
          <p className="next-call__title">The next date isn't set yet.</p>
        )}
      </div>
    )
  }

  const today = now >= call.startsAt
  const parts = splitDuration(call.startsAt - now)
  return (
    <div className="next-call">
      <p className="eyebrow">Next call</p>
      <p className="next-call__title">{call.label}</p>
      <p className="next-call__date">
        <time dateTime={call.date}>{formatLongDate(call.date)}</time>
      </p>
      {today ? (
        <p className="next-call__today">It's today.</p>
      ) : (
        <div className="countdown" role="timer" aria-label={`${parts[0].value} days, ${parts[1].value} hours to go`}>
          {parts.map(({ unit, value }) => (
            <div className="countdown__unit" key={unit} aria-hidden="true">
              <span className="countdown__value">{String(value).padStart(2, '0')}</span>
              <span className="countdown__label">{unit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
