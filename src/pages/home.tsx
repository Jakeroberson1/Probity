import { useEffect } from 'react'
import { NextCallPanel } from '@/components/countdown'
import { Layout } from '@/components/layout'
import { Reveal } from '@/components/reveal'
import { ScoreboardStrip } from '@/components/scoreboard'
import { Accent, ArrowLink } from '@/components/section'
import { SubscribeForm } from '@/components/subscribe-form'
import { scrollToId } from '@/lib/scroll'
import { METHOD_VERSION } from '@/lib/site'

export function HomePage() {
  // Arriving from another page with a hash (e.g. /#subscribe): content renders after
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
      <Principles />
    </Layout>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <Reveal as="p" className="badge">
          <span>
            Method <span className="version">{METHOD_VERSION}</span> · Public track record
          </span>
        </Reveal>
        <Reveal as="h1" className="hero__title" id="hero-title">
          Every FDA catalyst, <Accent>called before the date.</Accent>
        </Reveal>
        <Reveal as="p" className="hero__sub">
          Probity scores every FDA advisory vote, drug approval decision, and trial readout. Each call is published
          before it happens and graded after. The briefs are free, and the track record and method are public.
        </Reveal>
        <Reveal className="panel call-card" id="subscribe">
          <NextCallPanel />
          <SubscribeForm />
        </Reveal>
        <Reveal className="hero__scoreboard">
          <ScoreboardStrip />
        </Reveal>
      </div>
    </section>
  )
}

const PRINCIPLES = [
  {
    title: 'Called before the date',
    body: "Every brief is published before the vote, timestamped, and can't be edited after.",
  },
  {
    title: 'Graded after',
    body: 'Right or wrong, the score goes on the public record.',
  },
  {
    title: 'One fixed method',
    body: 'Every call runs the same 7 evidence gates in the same order.',
    link: { href: '/method/', label: 'Read the method' },
  },
]

function Principles() {
  return (
    <section className="section" aria-label="How Probity works">
      <div className="container">
        <div className="cards">
          {PRINCIPLES.map((item, i) => (
            <Reveal as="article" className="card" key={item.title}>
              <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              {item.link && <ArrowLink href={item.link.href}>{item.link.label}</ArrowLink>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
