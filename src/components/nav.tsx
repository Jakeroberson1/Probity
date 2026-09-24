import { useEffect, useState } from 'react'
import { onHashLinkClick } from '@/lib/scroll'
import { SUBSCRIBE_HREF } from '@/lib/site'

const LINKS = [
  { href: '/method/', label: 'Method' },
  { href: '/briefs/', label: 'Briefs' },
  { href: '/calendar/', label: 'Calendar' },
  { href: '/track-record/', label: 'Track record' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const desktop = window.matchMedia('(min-width: 900px)')
    const onResize = () => desktop.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [open])

  return (
    <header className={['nav', open && 'is-open', scrolled && 'is-scrolled'].filter(Boolean).join(' ')}>
      <div className="nav__bar">
        <a className="logo" href="/" aria-label="Probity home">
          PROBITY<span className="logo__dot">.</span>
        </a>

        <button
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">Menu</span>
          <span className="nav__toggle-bar" aria-hidden="true" />
          <span className="nav__toggle-bar" aria-hidden="true" />
        </button>

        <nav className="nav__menu" id="nav-menu" aria-label="Primary">
          <ul className="nav__links">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    setOpen(false)
                    onHashLinkClick(e)
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            className="btn btn--primary btn--sm"
            href={SUBSCRIBE_HREF}
            onClick={(e) => {
              setOpen(false)
              onHashLinkClick(e)
            }}
          >
            Get the briefs
          </a>
        </nav>
      </div>
    </header>
  )
}
