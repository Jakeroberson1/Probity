import { ArrowLink } from '@/components/section'
import { nextCall } from '@/lib/catalysts'
import { formatShortDate } from '@/lib/dates'
import { METHOD_VERSION } from '@/lib/site'
import { nextPending, recordCounts } from '@/lib/track-record'

/** Track record strip: "Track record: 0–0. First vote: Sep 23." */
export function ScoreboardStrip() {
  const { right, wrong, scored } = recordCounts()
  const nextDate = nextPending()?.date ?? nextCall()?.date
  return (
    <div className="scoreboard">
      <ul className="stats">
        <li className="stat">
          <span className="stat__value">
            {right}–{wrong}
          </span>
          <span className="stat__label">Track record</span>
        </li>
        <li className="stat">
          <span className="stat__value">{nextDate ? formatShortDate(nextDate) : '—'}</span>
          <span className="stat__label">{scored === 0 ? 'First vote' : 'Next vote'}</span>
        </li>
        <li className="stat">
          <span className="stat__value">7</span>
          <span className="stat__label">Evidence gates per call</span>
        </li>
        <li className="stat">
          <span className="stat__value">{METHOD_VERSION}</span>
          <span className="stat__label">Method version</span>
        </li>
      </ul>
      <ArrowLink href="/track-record/">See the full track record</ArrowLink>
    </div>
  )
}
