import { Layout } from '@/components/layout'
import { Reveal } from '@/components/reveal'
import { ArrowLink } from '@/components/section'
import { BRIEFS, briefHref, findBrief, type Brief } from '@/lib/briefs'
import { nextCall } from '@/lib/catalysts'
import { formatLongDate, formatMediumDate } from '@/lib/dates'
import { renderMarkdown } from '@/lib/markdown'
import { SUBSCRIBE_HREF } from '@/lib/site'

/** /briefs/ lists every published brief; /briefs/?b=<slug> shows one. */
export function BriefsPage() {
  const slug = new URLSearchParams(window.location.search).get('b')
  const brief = slug ? findBrief(slug) : undefined
  return <Layout>{brief ? <BriefView brief={brief} /> : <Archive missing={Boolean(slug)} />}</Layout>
}

function Archive({ missing }: { missing: boolean }) {
  const call = nextCall()
  return (
    <>
      <section className="hero page-hero page-hero--compact" aria-labelledby="briefs-title">
        <div className="container hero__inner">
          <Reveal as="p" className="badge">
            Briefs
          </Reveal>
          <Reveal as="h1" className="hero__title page-hero__title" id="briefs-title">
            Briefs
          </Reveal>
          <Reveal as="p" className="hero__sub">
            Each brief is published before its date and graded after.
          </Reveal>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="briefs-title">
        <div className="container">
          <Reveal className="panel briefs-panel">
            {missing && <p className="briefs-panel__note">That brief isn't here. These are the published ones.</p>}
            {BRIEFS.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state__title">
                  {call ? `First brief drops before ${formatLongDate(call.date)}.` : 'First brief drops soon.'}
                </p>
                <ArrowLink href={SUBSCRIBE_HREF}>Get it by email</ArrowLink>
              </div>
            ) : (
              <ol className="brief-list">
                {BRIEFS.map((b) => (
                  <li key={b.slug}>
                    <a className="brief-row" href={briefHref(b.slug)}>
                      <time className="brief-row__date" dateTime={b.date}>
                        {b.date ? formatMediumDate(b.date) : ''}
                      </time>
                      <span className="brief-row__title">{b.title}</span>
                      <span className="brief-row__event">{b.event}</span>
                      {b.verdict && <span className="pill">{b.verdict}</span>}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}

function BriefView({ brief }: { brief: Brief }) {
  return (
    <>
      <section className="hero page-hero page-hero--compact" aria-labelledby="brief-title">
        <div className="container hero__inner">
          <Reveal as="p" className="badge">
            {brief.date ? `Published ${formatMediumDate(brief.date)}` : 'Brief'}
          </Reveal>
          <Reveal as="h1" className="hero__title page-hero__title" id="brief-title">
            {brief.title}
          </Reveal>
          <Reveal as="p" className="hero__sub">
            {[brief.event, brief.verdict].filter(Boolean).join(' · ')}
          </Reveal>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="brief-title">
        <div className="container stack">
          <Reveal className="panel prose">
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(brief.body) }} />
          </Reveal>
          <ArrowLink href="/briefs/">All briefs</ArrowLink>
        </div>
      </section>
    </>
  )
}
