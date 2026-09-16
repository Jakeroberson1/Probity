// ThreeUI components, configured for the Probity brand (light theme, navy accents).
import { useEffect, useRef, useState } from 'react'
import { ConstellationField } from '@designcodeio/threeui/components/ConstellationField'
import { PredictiveArcCanvas } from '@designcodeio/threeui/components/PredictiveArcCanvas'
import { RectangleButtons } from '@designcodeio/threeui/components/RectangleButtons'
import { StructureFlowCollection } from '@designcodeio/threeui/components/StructureFlowCollection'
import { TextAnimationCollection } from '@designcodeio/threeui/components/TextAnimationCollection'
import { useInView } from '@/hooks/use-in-view'
import { followHref } from '@/lib/scroll'

/**
 * Fixed field of drifting signal particles behind every page, spread evenly
 * across the viewport. It stays quietest while the hero is on screen and comes
 * up slightly once the visitor scrolls past it; pages without a hero always get
 * the stronger field.
 */
export function SiteBackground() {
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const hero = document.querySelector('.hero')
    if (!hero) {
      setPastHero(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setPastHero(entry.intersectionRatio < 0.4), {
      threshold: [0, 0.2, 0.4, 0.6, 1],
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={pastHero ? 'site-bg site-bg--strong' : 'site-bg'} aria-hidden="true">
      <PredictiveArcCanvas
        variant="signal-particles"
        mode="light"
        speed={0.55}
        size={0.85}
        length={0.8}
        density={0.9}
        opacity={1}
        hue={-25}
        saturation={0.9}
        brightness={1.06}
      />
    </div>
  )
}

/**
 * SVG filter that recolors canvas effects for the light theme: keeps each pixel's
 * alpha and paints it navy, so white particles show up on a light background.
 * (Iframe-based effects ignore SVG filters, so they use their own hue props instead.)
 */
export function InkFilters() {
  return (
    <svg className="ink-filters" aria-hidden="true" focusable="false">
      <defs>
        <filter id="probity-ink-alpha" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 0.071  0 0 0 0 0.161  0 0 0 0 0.302  0 0 0 1 0" />
        </filter>
      </defs>
    </svg>
  )
}

/** Slow-rotating point field behind the hero, inked navy. */
export function HeroField() {
  return (
    <div className="hero__flow" aria-hidden="true">
      <StructureFlowCollection
        variant="structure-flow"
        speed={0.55}
        pointSize={0.1}
        opacity={0.7}
        maskStart={0.12}
        maskSolid={0.62}
      />
    </div>
  )
}

/** Constellation network in light mode, its gold lines hue-shifted to blue. */
export function ConstellationBackdrop({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  // The effect renders in an iframe; keep it out of the tab order and accessibility tree.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tame = () => {
      const frame = el.querySelector('iframe')
      if (!frame) return false
      frame.tabIndex = -1
      frame.setAttribute('aria-hidden', 'true')
      return true
    }
    if (tame()) return
    const observer = new MutationObserver(() => tame() && observer.disconnect())
    observer.observe(el, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={['constellation', className].filter(Boolean).join(' ')} aria-hidden="true">
      <ConstellationField
        variant="constellation-field"
        mode="light"
        speed={0.45}
        density={0.7}
        size={0.7}
        hue={172}
        saturation={1.4}
        brightness={1.08}
      />
    </div>
  )
}

type CtaButtonProps = {
  label: string
  href: string
  variant?: 'primary' | 'ghost'
}

/** Lumen CTA from RectangleButtons, restyled to the brand in probity.css. */
export function CtaButton({ label, href, variant = 'primary' }: CtaButtonProps) {
  return (
    <span className="cta-slot">
      <RectangleButtons
        variant={variant === 'ghost' ? 'lumen-cta-ghost' : 'lumen-cta'}
        mode="light"
        label={label}
        className={`probity-cta probity-cta--${variant}`}
        onClick={() => followHref(href)}
      />
    </span>
  )
}

const ANATOMY = [
  { index: '01', title: 'Executive summary', meta: 'THE CALL · CONFIDENCE' },
  { index: '02', title: 'Evidence base', meta: 'EVERY CLAIM CITED' },
  { index: '03', title: 'Competitive landscape', meta: 'BY STAGE · READOUT' },
  { index: '04', title: 'Red flags', meta: 'SAFETY · DESIGN · IP' },
  { index: '05', title: 'Open questions & gaps', meta: 'FOR THE DATA ROOM' },
] as const

/** Brief anatomy headings that decode in when scrolled into view. */
export function BriefAnatomy() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  return (
    <div ref={ref} className="anatomy-stage">
      {inView && (
        <TextAnimationCollection
          variant="article-headings"
          mode="light"
          header={['BRIEF ANATOMY', '05 SECTIONS']}
          entries={ANATOMY}
          duration={720}
          stagger={170}
          scrambleLength={8}
          preserveChance={0.35}
          tailChance={0.12}
          className="probity-anatomy"
        />
      )}
    </div>
  )
}
