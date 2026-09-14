// ThreeUI components, configured for the Probity brand.
import { useEffect, useRef } from 'react'
import { ConstellationField } from '@designcodeio/threeui/components/ConstellationField'
import { RectangleButtons } from '@designcodeio/threeui/components/RectangleButtons'
import { StructureFlowCollection } from '@designcodeio/threeui/components/StructureFlowCollection'
import { TextAnimationCollection } from '@designcodeio/threeui/components/TextAnimationCollection'
import { useInView } from '@/hooks/use-in-view'
import { followHref } from '@/lib/scroll'

/** Slow-rotating point field behind the hero. */
export function HeroField() {
  return (
    <div className="hero__flow" aria-hidden="true">
      <StructureFlowCollection
        variant="structure-flow"
        speed={0.55}
        pointSize={0.07}
        opacity={0.42}
        maskStart={0.12}
        maskSolid={0.62}
      />
    </div>
  )
}

/** Constellation network, hue-shifted from gold toward the brand blue. */
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
        mode="dark"
        speed={0.45}
        density={0.7}
        size={0.7}
        hue={172}
        saturation={0.9}
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
        mode="dark"
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
          mode="dark"
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
