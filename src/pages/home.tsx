import { useEffect, type CSSProperties } from 'react'
import { Layout } from '@/components/layout'
import { Reveal } from '@/components/reveal'
import { BriefAnatomy, ConstellationBackdrop, CtaButton, HeroField } from '@/components/threeui'
import { scrollToId } from '@/lib/scroll'
import { PILOT_MAILTO, comingSoon } from '@/lib/site'

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
      <Problem />
      <HowItWorks />
      <InsideTheBrief />
      <TheStandard />
      <Pilot />
    </Layout>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroField />
      <div className="container hero__inner">
        <Reveal as="p" className="eyebrow eyebrow--dark">
          Evidence-backed diligence for biotech deals
        </Reveal>
        <Reveal as="h1" className="hero__title" id="hero-title">
          Know the asset before you bet on it<span className="accent">.</span>
        </Reveal>
        <Reveal as="p" className="hero__sub">
          Probity delivers cited, decision-grade diligence briefs on any biotech asset in days — so your team never
          walks into a deal decision with less evidence than the clock demanded.
        </Reveal>
        <Reveal className="hero__actions">
          <CtaButton label="Request a pilot brief" href={PILOT_MAILTO} />
          <CtaButton label="See what's inside" href="#the-brief" variant="ghost" />
        </Reveal>
        <Reveal as="p" className="hero__trust">
          <span className="rule" aria-hidden="true" />
          Every claim cited. Every gap flagged. No fabricated sources — ever.
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
    <section className="section section--light" aria-labelledby="problem-title">
      <div className="container">
        <Reveal as="header" className="section__head">
          <p className="eyebrow">The problem</p>
          <h2 id="problem-title">Deals move faster than diligence.</h2>
        </Reveal>
        <div className="cards">
          {PROBLEMS.map((problem, i) => (
            <Reveal as="article" className="card" key={problem.title}>
              <span className="card__index">{String(i + 1).padStart(2, '0')}</span>
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
    meta: 'Kickoff · 30 minutes',
    title: 'Scope the decision',
    body: 'The asset, the decision, the deadline, and the questions that matter. Agreed before any research starts.',
  },
  {
    meta: 'Research · days, not weeks',
    title: 'The evidence build',
    body: 'Multi-source research across trials, filings, patents, and literature. Every claim traced to a primary source.',
  },
  {
    meta: 'Delivery · live readout',
    title: 'The brief + readout',
    body: 'A decision-grade brief, walked through live with your team. Open questions flagged, not hidden.',
  },
]

function HowItWorks() {
  return (
    <section className="section section--tint" id="how-it-works" aria-labelledby="how-title">
      <div className="container">
        <Reveal as="header" className="section__head">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title">From question to decision-grade brief.</h2>
        </Reveal>
        <ol className="steps">
          {STEPS.map((step, i) => (
            <Reveal as="li" className="step" key={step.title}>
              <span className="step__num" aria-hidden="true">
                {i + 1}
              </span>
              <p className="step__meta">{step.meta}</p>
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
    <section className="section section--dark" id="the-brief" aria-labelledby="brief-title">
      <div className="container brief">
        <div className="brief__copy">
          <Reveal as="p" className="eyebrow eyebrow--dark">
            Inside the brief
          </Reveal>
          <Reveal as="h2" id="brief-title">
            Five sections. Same order, every time.
          </Reveal>
          <Reveal as="p" className="lede">
            The summary reads in two minutes. Every citation can be checked by your scientific reviewers.
          </Reveal>
          <BriefAnatomy />
          <Reveal>
            <CtaButton label="Sample brief (redacted)" href={comingSoon('sample-brief')} variant="ghost" />
          </Reveal>
        </div>

        <Reveal
          as="figure"
          className="doc"
        >
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
                <span className="redact redact--inline" style={{ width: '40%' }} /> primary endpoint met<sup>[14]</sup>
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
    <section className="section section--light" id="the-standard" aria-labelledby="standard-title">
      <div className="container">
        <Reveal as="header" className="section__head">
          <p className="eyebrow">The standard</p>
          <h2 id="standard-title">Probity means integrity. These are the terms.</h2>
        </Reveal>
        <ol className="manifesto">
          {COMMITMENTS.map((item) => (
            <Reveal as="li" key={item.n}>
              <span className="manifesto__n">{item.n}</span>
              <div>
                <p className="manifesto__claim">{item.claim}</p>
                <p>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
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
    <section className="section section--light section--flush-top" id="pilot" aria-labelledby="pilot-title">
      <div className="container">
        <Reveal className="pilot">
          <ConstellationBackdrop className="pilot__field" />
          <div className="pilot__inner">
            <div className="pilot__copy">
              <p className="eyebrow eyebrow--dark">Pilot</p>
              <h2 id="pilot-title">Start with one live asset.</h2>
              <p className="lede">
                Bring an asset your team is evaluating now. We scope it, build the evidence, and walk you through the
                brief.
              </p>
              <div className="pilot__cta">
                <CtaButton label="Request a pilot brief" href={PILOT_MAILTO} />
              </div>
            </div>
            <dl className="terms">
              {TERMS.map((t) => (
                <div className="terms__row" key={t.term}>
                  <dt>{t.term}</dt>
                  <dd>{t.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
