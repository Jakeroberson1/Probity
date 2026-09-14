import { Layout } from '@/components/layout'
import { Reveal } from '@/components/reveal'
import { ConstellationBackdrop, CtaButton } from '@/components/threeui'
import { COMING_SOON_PAGES, EMAIL, PILOT_MAILTO } from '@/lib/site'

function pageLabel() {
  const key = new URLSearchParams(window.location.search).get('page')
  return key && key in COMING_SOON_PAGES ? COMING_SOON_PAGES[key as keyof typeof COMING_SOON_PAGES] : 'This page'
}

export function ComingSoonPage() {
  const label = pageLabel()

  return (
    <Layout>
      <section className="hero page-hero page-hero--soon" aria-labelledby="soon-title">
        <ConstellationBackdrop className="page-hero__field" />
        <div className="container hero__inner page-hero__inner">
          <Reveal as="p" className="eyebrow eyebrow--dark">
            Coming soon
          </Reveal>
          <Reveal as="h1" className="page-hero__title" id="soon-title">
            {label} isn't published yet<span className="accent">.</span>
          </Reveal>
          <Reveal as="p" className="hero__sub">
            We would rather publish it right than publish it early. Until then, reach us at{' '}
            <a className="inline-link" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            .
          </Reveal>
          <Reveal className="hero__actions">
            <CtaButton label="Request a pilot brief" href={PILOT_MAILTO} />
            <CtaButton label="Back to home" href="/" variant="ghost" />
          </Reveal>
        </div>
      </section>
    </Layout>
  )
}
