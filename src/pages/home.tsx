import { useEffect, type CSSProperties } from 'react'
import { Layout } from '@/components/layout'
import { Reveal } from '@/components/reveal'
import { Accent, ArrowLink, SectionIntro } from '@/components/section'
import { BriefAnatomy, ConstellationBackdrop, CtaButton, HeroField } from '@/components/threeui'
import { scrollToId } from '@/lib/scroll'
import { EMAIL, PILOT_MAILTO, comingSoon } from '@/lib/site'

export function HomePage() {
  // Arriving from another page with a hash (e.g. /#pilot): content renders after
  // the browser's own hash jump, and the web font and lazily loaded ThreeUI
  // chunks shift layout afterwards. Keep the section aligned while the page
  // settles, and let go as soon as the visitor scrolls or the window elapses.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id || !document.getElementById(id)) return

    let frame = 0
    const align = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => scrollToId(id, 'auto'))
    }
    const observer = new ResizeObserver(align)
    const release = () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', release)
      window.removeEventListener('touchstart', release)
      window.removeEventListener('keydown', release)
    }
    observer.observe(document.body)
    window.addEventListener('wheel', release, { passive: true })
    window.addEventListener('touchstart', release, { passive: true })
    window.addEventListener('keydown', release)
    const timer = window.setTimeout(release, 2500)
    align()

    return () => {
      window.clearTimeout(timer)
      release()
    }
  }, [])

  // Hash changes within the page (typed URLs, Back/Forward over pushState entries).
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1)
      if (id) scrollToId(id)
      else window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('popstate', onHash)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('popstate', onHash)
    }
  }, [])

  return (
    <Layout>
      <Hero />
      <Evidence />
      <Problem />
      <HowItWorks />
      <InsideTheBrief />
      <TheStandard />
      <Pilot />
      <Faq />
    </Layout>
  )
}

const STATS = [
  { value: '100%', label: 'Claims cited to a primary source' },
  { value: '0', label: 'Fabricated sources, ever' },
  { value: '5', label: 'Sections in every brief' },
  { value: '30 min', label: 'Kickoff to scope the decision' },
]

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroField />
      <div className="container hero__inner">
        <Reveal as="p" className="badge">
          Evidence-backed diligence for biotech deals
        </Reveal>
        <Reveal as="h1" className="hero__title" id="hero-title">
          Know the asset <Accent>before you bet on it.</Accent>
        </Reveal>
        <Reveal as="p" className="hero__sub">
          Probity delivers cited, decision-grade diligence briefs on any biotech asset in days — so your team never
          walks into a deal decision with less evidence than the clock demanded.
        </Reveal>
        <Reveal className="hero__actions">
          <CtaButton label="Request a pilot brief" href={PILOT_MAILTO} />
          <ArrowLink href="#the-brief">See what's inside</ArrowLink>
        </Reveal>
        <Reveal as="ul" className="stats">
          {STATS.map((stat) => (
            <li className="stat" key={stat.label}>
              <span className="stat__value">{stat.value}</span>
              <span className="stat__label">{stat.label}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

const SOURCES = [
  { n: '01', title: 'Clinical trials', body: 'Designs, endpoints, and reported results.' },
  { n: '02', title: 'Regulatory filings', body: 'Agency documents and company disclosures.' },
  { n: '03', title: 'Patents', body: 'Claims, coverage, and expiry.' },
  { n: '04', title: 'Peer-reviewed literature', body: 'Published studies behind the mechanism and the data.' },
]

function Evidence() {
  return (
    <section className="section" id="evidence" aria-labelledby="evidence-title">
      <div className="container">
        <SectionIntro
          eyebrow="The evidence"
          id="evidence-title"
          title={
            <>
              Every claim in a Probity brief <Accent>traces to a primary source.</Accent>
            </>
          }
          sub="Every claim cited. Every gap flagged. No fabricated sources — ever."
        />
        <Reveal as="ol" className="panel manifesto">
          {SOURCES.map((source) => (
            <li key={source.n}>
              <p className="eyebrow">{source.n}</p>
              <h3 className="manifesto__claim">{source.title}</h3>
              <p>{source.body}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

const PROBLEMS = [
  {
    title: 'The clock',
    body: 'Exclusivity windows close. Board meetings get scheduled. Neither waits for a four-week consultant engagement.',
  },
  {
    title: 'The cost of thin evidence',
    body: 'Weak assets advance because no one found the red flag in time. Strong ones get passed over for the same reason.',
  },
  {
    title: 'The options all fail',
    body: "Internal teams are stretched across the pipeline. Consultants are slow and cost five figures. Generic AI doesn't cite.",
  },
]

function Problem() {
  return (
    <section className="section" aria-labelledby="problem-title">
      <div className="container">
        <SectionIntro
          eyebrow="The problem"
          id="problem-title"
          title={
            <>
              Deals move faster <Accent>than diligence.</Accent>
            </>
          }
        />
        <div className="cards">
          {PROBLEMS.map((problem, i) => (
            <Reveal as="article" className="card" key={problem.title}>
              <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
              <h3>{problem.title}</h3>
              <p>{problem.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  {
    label: 'Step 01 · 30 minutes',
    title: 'Scope the decision',
    body: 'The asset, the decision, the deadline, and the questions that matter. Agreed before any research starts.',
  },
  {
    label: 'Step 02 · Days, not weeks',
    title: 'The evidence build',
    body: 'Multi-source research across trials, filings, patents, and literature. Every claim traced to a primary source.',
  },
  {
    label: 'Step 03 · Live readout',
    title: 'The brief + readout',
    body: 'A decision-grade brief, walked through live with your team. Open questions flagged, not hidden.',
  },
]

function HowItWorks() {
  return (
    <section className="section section--surface" id="how-it-works" aria-labelledby="how-title">
      <div className="container">
        <SectionIntro
          eyebrow="How it works"
          id="how-title"
          title={
            <>
              From question <Accent>to decision-grade brief.</Accent>
            </>
          }
        />
        <ol className="steps">
          {STEPS.map((step) => (
            <Reveal as="li" className="card step" key={step.title}>
              <p className="eyebrow">{step.label}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function InsideTheBrief() {
  return (
    <section className="section" id="the-brief" aria-labelledby="brief-title">
      <div className="container">
        <SectionIntro
          eyebrow="Inside the brief"
          id="brief-title"
          title={
            <>
              Five sections. <Accent>Same order, every time.</Accent>
            </>
          }
          sub="The summary reads in two minutes. Every citation can be checked by your scientific reviewers."
        />

        <Reveal className="panel brief">
          <div className="brief__copy">
            <BriefAnatomy />
            <CtaButton label="Sample brief (redacted)" href={comingSoon('sample-brief')} variant="ghost" />
          </div>

          <figure className="doc">
            <div
              className="doc__paper"
              role="img"
              aria-label="Illustrative layout of a Probity diligence brief, with asset details redacted"
            >
              <div className="doc__top">
                <span className="doc__logo">
                  PROBITY<span className="logo__dot">.</span>
                </span>
                <span className="doc__stamp">Sample · Redacted</span>
              </div>
              <p className="doc__kind">Diligence brief</p>
              <dl className="doc__meta">
                <div>
                  <dt>Asset</dt>
                  <dd>
                    <span className="redact" style={{ width: 88 }} />
                  </dd>
                </div>
                <div>
                  <dt>Decision</dt>
                  <dd>In-license · go / no-go</dd>
                </div>
                <div>
                  <dt>Sources</dt>
                  <dd>47 primary</dd>
                </div>
              </dl>

              <div className="doc__sec">
                <p className="doc__h">1 · Executive summary</p>
                <p className="doc__line">
                  Recommendation: <strong>proceed to data room, conditional</strong>
                  <sup>[1–3]</sup>
                </p>
                <span className="redact" style={{ width: '92%' }} />
                <span className="redact" style={{ width: '74%' }} />
              </div>
              <div className="doc__sec">
                <p className="doc__h">2 · Evidence base</p>
                <p className="doc__line">
                  <span className="redact redact--inline" style={{ width: '40%' }} /> primary endpoint met
                  <sup>[14]</sup>
                </p>
                <span className="redact" style={{ width: '84%' }} />
              </div>
              <div className="doc__sec">
                <p className="doc__h">3 · Competitive landscape</p>
                <div className="doc__bars" aria-hidden="true">
                  <span style={{ '--w': '78%' } as CSSProperties} />
                  <span style={{ '--w': '54%' } as CSSProperties} />
                  <span style={{ '--w': '31%' } as CSSProperties} />
                </div>
              </div>
              <div className="doc__sec">
                <p className="doc__h">4 · Red flags</p>
                <p className="doc__line">
                  <span className="chip chip--warn">Evidence thin · 1 source</span>
                </p>
              </div>
              <div className="doc__sec doc__sec--last">
                <p className="doc__h">5 · Open questions &amp; gaps</p>
                <p className="doc__line">3 questions for the data room</p>
              </div>
            </div>
            <figcaption className="doc__caption">Illustrative layout. Asset details redacted.</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

const COMMITMENTS = [
  {
    n: 'I.',
    claim: "If we can't source it, we say so.",
    body: "Unsourced claims don't appear in the brief. Where the public record runs out, the brief says where.",
  },
  {
    n: 'II.',
    claim: 'One fabricated citation fails the engagement.',
    body: 'Every reference is checked against its primary source before delivery. There is no acceptable error rate for invented sources.',
  },
  {
    n: 'III.',
    claim: 'Gaps are flagged, never papered over.',
    body: 'Thin evidence is labeled thin. The confidence level sits next to the claim, not in a footnote.',
  },
]

function TheStandard() {
  return (
    <section className="section section--surface" id="the-standard" aria-labelledby="standard-title">
      <div className="container">
        <SectionIntro
          eyebrow="The standard"
          id="standard-title"
          title={
            <>
              Probity means integrity. <Accent>These are the terms.</Accent>
            </>
          }
        />
        <Reveal as="ol" className="panel manifesto">
          {COMMITMENTS.map((item) => (
            <li key={item.n}>
              <p className="eyebrow">{item.n}</p>
              <h3 className="manifesto__claim">{item.claim}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

const TERMS = [
  { term: 'One asset', detail: "A program you're actively evaluating." },
  { term: 'One real decision', detail: 'Scoped to the call your team has to make.' },
  { term: 'One-page agreement', detail: 'No master services negotiation to get started.' },
  { term: 'Fixed fee', detail: 'Credited toward a brief package.' },
]

function Pilot() {
  return (
    <section className="section" id="pilot" aria-labelledby="pilot-title">
      <div className="container split">
        <Reveal className="split__copy">
          <SectionIntro
            align="start"
            eyebrow="Pilot"
            id="pilot-title"
            title={
              <>
                Start with <Accent>one live asset.</Accent>
              </>
            }
            sub="Bring an asset your team is evaluating now. We scope it, build the evidence, and walk you through the brief."
          />
          <div className="split__actions">
            <CtaButton label="Request a pilot brief" href={PILOT_MAILTO} />
            <p className="split__note">
              Or email{' '}
              <a className="inline-link" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </p>
          </div>
        </Reveal>

        <Reveal className="panel pilot-card">
          <ConstellationBackdrop className="pilot__field" />
          <dl className="terms">
            {TERMS.map((t) => (
              <div className="terms__row" key={t.term}>
                <dt>{t.term}</dt>
                <dd>{t.detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

const QUESTIONS = [
  {
    q: 'What does Probity deliver?',
    a: 'A cited, decision-grade diligence brief on one biotech asset: executive summary, evidence base, competitive landscape, red flags, and open questions. Every claim is traced to a primary source.',
  },
  {
    q: 'How long does a brief take?',
    a: 'Days, not weeks. It starts with a 30-minute kickoff to scope the asset, the decision, and the deadline, and ends with a live readout with your team.',
  },
  {
    q: 'What happens when the evidence is thin?',
    a: "The brief says so. Unsourced claims don't appear, thin evidence is labeled next to the claim, and open questions are listed for the data room.",
  },
  {
    q: 'How does a pilot work?',
    a: 'One asset your team is evaluating now, one real decision, a one-page agreement, and a fixed fee credited toward a brief package.',
  },
]

function Faq() {
  return (
    <section className="section section--surface" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <SectionIntro eyebrow="Questions" id="faq-title" title="Common questions" />
        <Reveal className="panel faq">
          {QUESTIONS.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary>
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
