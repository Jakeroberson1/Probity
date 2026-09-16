import type { ReactNode } from 'react'
import { Reveal } from '@/components/reveal'
import { onHashLinkClick } from '@/lib/scroll'

type SectionIntroProps = {
  eyebrow: string
  title: ReactNode
  sub?: ReactNode
  /** id for the heading, so the section can reference it with aria-labelledby. */
  id?: string
  align?: 'center' | 'start'
}

/** Eyebrow, heading, and optional subtitle that open a section. */
export function SectionIntro({ eyebrow, title, sub, id, align = 'center' }: SectionIntroProps) {
  return (
    <Reveal as="header" className={`intro intro--${align}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="intro__title">
        {title}
      </h2>
      {sub && <p className="intro__sub">{sub}</p>}
    </Reveal>
  )
}

/** Accent-colored run of text inside a heading. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="accent">{children}</span>
}

/** Quiet secondary action: text with a trailing arrow. */
export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="arrow-link" href={href} onClick={onHashLinkClick}>
      {children}
      <span aria-hidden="true">→</span>
    </a>
  )
}
