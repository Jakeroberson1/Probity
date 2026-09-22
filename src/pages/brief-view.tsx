import { Reveal } from '@/components/reveal'
import { ArrowLink } from '@/components/section'
import { CtaButton } from '@/components/threeui'
import type { BriefData, BriefGate } from '@/lib/brief-data'
import { edgePoints } from '@/lib/brief-data'
import { formatLongDate, formatMediumDate } from '@/lib/dates'
import { BRIEF_RECORD, NEWSLETTER_HREF } from '@/lib/site'
import { nextPending, recordCounts } from '@/lib/track-record'

/**
 * A published brief. The verdict is the design: everything above the fold is the call, the
 * question it answers, and how far it sits from what everyone else expected. The evidence is
 * one click away rather than in the way, since most readers want the number and the few who
 * want the citations really want them.
 */
export function BriefPage({ brief }: { brief: BriefData }) {
  return (
    <>
      <BriefHero brief={brief} />
      <TldrBox brief={brief} />
      <Evidence brief={brief} />
      <Witness brief={brief} />
      <TrackRecordStrip />
      <Signup
        id="brief-signup-foot"
        title="Get the next call before its date."
        sub="Every brief is free, published before the catalyst, and graded after."
      />
    </>
  )
}

/** "GRAIL ... blood test: FDA panel vote" -> "GRAIL ... blood test"; the eyebrow already says it. */
function headline(brief: BriefData): string {
  const suffix = `: ${brief.event_label}`
  return brief.title.endsWith(suffix) ? brief.title.slice(0, -suffix.length) : brief.title
}

function BriefHero({ brief }: { brief: BriefData }) {
  return (
    <section className="hero brief-hero" aria-labelledby="brief-title">
      <div className="container brief-hero__inner">
        <Reveal as="p" className="brief-hero__eyebrow">
          {brief.event_label} · {brief.event_date_label}
        </Reveal>
        <Reveal as="h1" className="brief-hero__title" id="brief-title">
          {headline(brief)}
        </Reveal>
        <Reveal className="brief-verdict">
          <span className="brief-verdict__value">
            {brief.call}, {brief.probability}%
          </span>
          <span className="brief-verdict__label">
            probability of a yes vote{brief.event.committee ? `, ${brief.event.committee}` : ''}
          </span>
        </Reveal>
        <Signup
          id="brief-signup-head"
          title="A brief before every FDA catalyst."
          sub="Free, and always published before the date."
          compact
        />
      </div>
    </section>
  )
}

function Signup({
  id,
  title,
  sub,
  compact = false,
}: {
  id: string
  title: string
  sub: string
  compact?: boolean
}) {
  const body = (
    <div className={compact ? 'brief-signup brief-signup--compact' : 'brief-signup'}>
      <div>
        <p className="brief-signup__title">{title}</p>
        <p className="brief-signup__sub">{sub}</p>
      </div>
      <CtaButton label="Get future briefs" href={NEWSLETTER_HREF} />
    </div>
  )
  if (compact) return <Reveal id={id}>{body}</Reveal>
  return (
    <section className="section section--tight" aria-label="Get future briefs">
      <div className="container">
        <Reveal className="panel" id={id}>
          {body}
        </Reveal>
      </div>
    </section>
  )
}

function TldrBox({ brief }: { brief: BriefData }) {
  const edge = edgePoints(brief)
  const question = brief.event.question
  const scenarios = brief.tldr.scenarios ?? []
  return (
    <section className="section section--tight" aria-labelledby="brief-tldr-title">
      <div className="container">
        <Reveal className="panel tldr">
          <h2 className="tldr__title" id="brief-tldr-title">
            TL;DR
          </h2>

          <dl className="tldr__grid">
            <div className="tldr__row">
              <dt>The call</dt>
              <dd>
                <strong>
                  {brief.call}, {brief.probability}%
                </strong>
                {question ? <span className="tldr__question">{question}</span> : null}
              </dd>
            </div>

            {brief.crowd_probability !== null && (
              <div className="tldr__row">
                <dt>Versus the crowd</dt>
                <dd>
                  The crowd read {brief.crowd_read ?? `${brief.crowd_probability}%`}
                  {brief.crowd_read ? ` (${brief.crowd_probability}% midpoint)` : ''}.{' '}
                  {edge === null || edge === 0 ? (
                    'Probity is level with it.'
                  ) : (
                    <>
                      Probity is <strong>{Math.abs(edge)} points {edge > 0 ? 'above' : 'below'}</strong> it,
                      on the same side of the call.
                    </>
                  )}
                </dd>
              </div>
            )}

            {brief.tldr.crux && (
              <div className="tldr__row">
                <dt>The crux</dt>
                <dd>{brief.tldr.crux}</dd>
              </div>
            )}
          </dl>

          {scenarios.length > 0 && (
            <div className="tldr__scenarios">
              <p className="tldr__scenarios-title">
                What each outcome would settle
                <span className="tldr__disclaimer">Scenarios, not positions to take.</span>
              </p>
              <ul className="scenario-list">
                {scenarios.map((s) => (
                  <li key={s.outcome}>
                    <span className="scenario-list__outcome">{s.outcome}</span>
                    <span className="scenario-list__implication">{s.implication}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function Evidence({ brief }: { brief: BriefData }) {
  const citations = brief.gates.reduce((n, g) => n + g.citations.length, 0)
  return (
    <section className="section section--tight" aria-label="Evidence">
      <div className="container">
        <Reveal className="panel">
          <p className="evidence__summary-line">{brief.summary}</p>
          <details className="evidence">
            <summary className="evidence__toggle">
              <span>Read the full evidence</span>
              <span className="evidence__meta">
                7 gates · {citations} verified citations · {brief.sources.length} sources
              </span>
            </summary>
            <div className="evidence__body">
              <table className="gate-table">
                <thead>
                  <tr>
                    <th scope="col">Gate</th>
                    <th scope="col">Call</th>
                  </tr>
                </thead>
                <tbody>
                  {brief.gates.map((g) => (
                    <tr key={g.number}>
                      <th scope="row">
                        {g.number}. {g.name}
                      </th>
                      <td>
                        {g.call}
                        {g.overridden && <span className="pill">analyst override</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {brief.gates.map((g) => (
                <GateDetail key={g.number} gate={g} />
              ))}

              <h3 className="evidence__heading">Risks</h3>
              <ul className="evidence__list">
                {brief.risks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>

              <h3 className="evidence__heading">Sources</h3>
              <ul className="evidence__list">
                {brief.sources.map((s) => (
                  <li key={s.sid}>
                    <strong>{s.sid}.</strong>{' '}
                    {s.url ? (
                      <a href={s.url} rel="noreferrer noopener" target="_blank">
                        {s.name}
                      </a>
                    ) : (
                      s.name
                    )}
                    {s.pages ? ` · ${s.pages} pages` : ''}
                  </li>
                ))}
              </ul>

              <h3 className="evidence__heading">Analyst overrides</h3>
              {brief.overrides.length === 0 ? (
                <p className="evidence__note">
                  None. The method's scores stand as they came out of the gates.
                </p>
              ) : (
                <ul className="evidence__list">
                  {brief.overrides.map((o) => (
                    <li key={`${o.gate ?? 'p'}-${o.why}`}>
                      <strong>
                        {o.gate ? `Gate ${o.gate} (${o.gate_name})` : 'Probability'}: {o.from} to {o.to}.
                      </strong>{' '}
                      {o.why}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        </Reveal>
      </div>
    </section>
  )
}

function GateDetail({ gate }: { gate: BriefGate }) {
  return (
    <div className="gate">
      <h3 className="gate__title">
        Gate {gate.number}: {gate.name}
        <span className="gate__call">{gate.call}</span>
      </h3>
      <p className="gate__question">{gate.question}</p>
      {gate.fda_concerns.length > 0 && (
        <>
          <p className="gate__label">What the FDA's questions show it is worried about</p>
          <ul className="evidence__list">
            {gate.fda_concerns.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      )}
      <ul className="evidence__list">
        {gate.evidence.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
      {gate.citations.length > 0 && (
        <ul className="citations">
          {gate.citations.map((c) => (
            <li key={c.quote}>
              <span className="citations__source">
                [{c.source}]{c.locator ? ` ${c.locator}` : ''}
              </span>
              <q className="citations__quote">{c.quote}</q>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Witness({ brief }: { brief: BriefData }) {
  const published = formatLongDate(brief.published_at.slice(0, 10))
  const voted = formatMediumDate(brief.event.catalyst_date).replace(/,\s*\d{4}$/, '')
  const line = `Published ${published}, before the ${voted} vote.`
  return (
    <section className="section section--tight" aria-label="Publication record">
      <div className="container">
        <Reveal as="p" className="witness">
          {BRIEF_RECORD.PUBLIC ? (
            <a href={BRIEF_RECORD.historyUrl(brief.slug)} rel="noreferrer noopener" target="_blank">
              {line}
            </a>
          ) : (
            line
          )}{' '}
          <span className="witness__note">
            {BRIEF_RECORD.PUBLIC
              ? 'The commit is the timestamp. Check it yourself.'
              : 'Committed to the brief record, which opens to the public alongside it.'}
          </span>
        </Reveal>
      </div>
    </section>
  )
}

function TrackRecordStrip() {
  const { right, wrong, scored } = recordCounts()
  const pending = nextPending()
  return (
    <section className="section section--tight" aria-label="Track record">
      <div className="container">
        <Reveal className="panel brief-record">
          {scored === 0 ? (
            <p className="brief-record__line">
              No calls graded yet.{' '}
              {pending ? `First scored brief pending the ${formatMediumDate(pending.date)} vote.` : ''}
            </p>
          ) : (
            <p className="brief-record__line">
              Track record: {right}–{wrong} across {scored} graded {scored === 1 ? 'call' : 'calls'}.
            </p>
          )}
          <ArrowLink href="/track-record/">See the full track record</ArrowLink>
        </Reveal>
      </div>
    </section>
  )
}
