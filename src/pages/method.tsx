import method from '../../content/method-v1.0.md?raw'
import { Layout } from '@/components/layout'
import { Reveal } from '@/components/reveal'
import { Accent } from '@/components/section'
import { renderMarkdown } from '@/lib/markdown'
import { METHOD_VERSION } from '@/lib/site'

// The source opens with "# The Probity Method v1.0" and an italic tagline; the
// page hero shows those, and the rest renders as the method body.
const lines = method.split('\n')
const taglineIndex = lines.findIndex((line) => /^\*[^*].*\*$/.test(line.trim()))
const TAGLINE = taglineIndex >= 0 ? lines[taglineIndex].trim().slice(1, -1) : ''
const BODY_HTML = renderMarkdown(lines.slice(taglineIndex + 1).join('\n'))

export function MethodPage() {
  return (
    <Layout>
      <section className="hero page-hero page-hero--compact" aria-labelledby="method-title">
        <div className="container hero__inner">
          <Reveal as="p" className="badge">
            <span className="version">{METHOD_VERSION}</span>
          </Reveal>
          <Reveal as="h1" className="hero__title page-hero__title" id="method-title">
            The Probity <Accent>Method</Accent>
          </Reveal>
          {TAGLINE && (
            <Reveal as="p" className="hero__sub">
              {TAGLINE}
            </Reveal>
          )}
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="method-title">
        <div className="container stack">
          <Reveal className="panel prose">
            <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
          </Reveal>

          <Reveal as="section" className="panel changelog" id="changelog">
            <p className="eyebrow">Changelog</p>
            <p className="changelog__entry">
              <strong>v1.0</strong>, September 2026. The first calibration comes after 10 scored events.
            </p>
          </Reveal>
        </div>
      </section>
    </Layout>
  )
}
