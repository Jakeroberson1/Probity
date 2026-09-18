import { Layout } from '@/components/layout'
import { Reveal } from '@/components/reveal'
import { Accent } from '@/components/section'

export function MethodPage() {
  return (
    <Layout>
      <section className="hero page-hero page-hero--compact" aria-labelledby="method-title">
        <div className="container hero__inner">
          <Reveal as="h1" className="hero__title page-hero__title" id="method-title">
            The Probity <Accent>Method</Accent>
          </Reveal>
          <Reveal as="p" className="hero__sub">
            Every Probity call goes through the same fixed, versioned method. It weighs the evidence behind an FDA
            decision, turns it into one published probability, and stamps the version that made the call. Every call
            is graded in public after the date, and the method is revised when the record shows where it went wrong.
          </Reveal>
        </div>
      </section>
    </Layout>
  )
}
