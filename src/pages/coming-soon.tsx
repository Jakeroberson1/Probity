import { Layout } from '@/components/layout'
import { Reveal } from '@/components/reveal'
import { Accent, ArrowLink } from '@/components/section'
import { ConstellationBackdrop, CtaButton } from '@/components/threeui'
import { COMING_SOON_PAGES, EMAIL, SUBSCRIBE_HREF } from '@/lib/site'

function pageLabel() {
  const key = new URLSearchParams(window.location.search).get('page')
  return key && key in COMING_SOON_PAGES ? COMING_SOON_PAGES[key as keyof typeof COMING_SOON_PAGES] : 'This page'
}

export function ComingSoonPage() {
  const label = pageLabel()

  return (
    <Layout>
      <section className="hero page-hero" aria-labelledby="soon-title">
        <ConstellationBackdrop className="page-hero__field" />
        <div className="container hero__inner">
          <Reveal as="p" className="badge">
            Coming soon
          </Reveal>
          <Reveal as="h1" className="hero__title page-hero__title" id="soon-title">
            {label} <Accent>isn't published yet.</Accent>
          </Reveal>
          <Reveal as="p" className="hero__sub">
            We would rather publish it right than publish it early. Until then, reach us at{' '}
            <a className="inline-link" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            .
          </Reveal>
          <Reveal className="hero__actions">
            <CtaButton label="Send me the briefs" href={SUBSCRIBE_HREF} />
            <ArrowLink href="/">Back to home</ArrowLink>
          </Reveal>
        </div>
      </section>
    </Layout>
  )
}
