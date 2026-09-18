import { Layout } from '@/components/layout'
import { Reveal } from '@/components/reveal'
import { formatMediumDate, formatShortDate } from '@/lib/dates'
import { EVENTS, formatProbability, nextPending, recordCounts } from '@/lib/track-record'

const yesNo = (value: boolean | null) => (value === null ? '—' : value ? 'Yes' : 'No')

export function TrackRecordPage() {
  const { right, wrong, scored } = recordCounts()
  const next = nextPending()

  return (
    <Layout>
      <section className="hero page-hero page-hero--compact" aria-labelledby="record-title">
        <div className="container hero__inner">
          <Reveal as="p" className="badge">
            Track record
          </Reveal>
          <Reveal as="h1" className="hero__title record__score" id="record-title">
            <span className="sr-only">Track record: </span>
            {right}–{wrong}
          </Reveal>
          <Reveal as="p" className="hero__sub">
            {scored === 0
              ? `No calls graded yet.${next ? ` First vote: ${formatShortDate(next.date)}.` : ''}`
              : `${scored} ${scored === 1 ? 'call' : 'calls'} graded.`}{' '}
            We grade every call after its date, right or wrong.
          </Reveal>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="record-title">
        <div className="container">
          <Reveal className="panel table-panel">
            <div className="table-scroll" tabIndex={0} role="region" aria-label="Scoreboard">
              <table className="record-table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Event</th>
                    <th scope="col">Committee</th>
                    <th scope="col">Our call</th>
                    <th scope="col">Probability</th>
                    <th scope="col">Outcome</th>
                    <th scope="col">Right?</th>
                    <th scope="col">Method v.</th>
                  </tr>
                </thead>
                <tbody>
                  {EVENTS.map((e) => (
                    <tr key={`${e.date}-${e.event}`}>
                      <td className="record-table__date">
                        <time dateTime={e.date}>{formatMediumDate(e.date)}</time>
                      </td>
                      <th scope="row">{e.event}</th>
                      <td>{e.committee}</td>
                      <td>{e.our_call ?? '—'}</td>
                      <td>{formatProbability(e.probability)}</td>
                      <td>
                        <span className={`pill pill--${e.outcome.toLowerCase()}`}>{e.outcome}</span>
                      </td>
                      <td>{yesNo(e.right)}</td>
                      <td>{e.method_version}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  )
}
