import { Layout } from '@/components/layout'
import { Reveal } from '@/components/reveal'
import { CtaButton, HeroField } from '@/components/threeui'
import { PILOT_MAILTO } from '@/lib/site'

export function AboutPage() {
  return (
    <Layout>
      <section className="hero page-hero" aria-labelledby="about-title">
        <HeroField />
        <div className="container hero__inner page-hero__inner">
          <Reveal as="p" className="eyebrow eyebrow--dark">
            About
          </Reveal>
          <Reveal as="h1" className="page-hero__title" id="about-title">
            Diligence you can check<span className="accent">.</span>
          </Reveal>
          <Reveal as="p" className="hero__sub">
            Probity builds evidence-backed diligence briefs on biotech assets for BD teams, biotech investors, and
            pharma scouts. Every claim is traced to a primary source, and every gap in the public record is flagged,
            so a deal decision rests on what is actually known.
          </Reveal>
          <Reveal className="hero__actions">
            <CtaButton label="Request a pilot brief" href={PILOT_MAILTO} />
            <CtaButton label="How it works" href="/#how-it-works" variant="ghost" />
          </Reveal>
        </div>
      </section>
    </Layout>
  )
}
