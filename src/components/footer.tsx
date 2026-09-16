import { onHashLinkClick } from '@/lib/scroll'
import { EMAIL, comingSoon } from '@/lib/site'

const PRIMARY = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'The brief', href: '/#the-brief' },
  { label: 'The standard', href: '/#the-standard' },
  { label: 'Pilot', href: '/#pilot' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'About', href: '/about/' },
]

const SECONDARY = [
  { label: 'Sample brief', href: comingSoon('sample-brief') },
  { label: 'LinkedIn', href: comingSoon('linkedin') },
  { label: 'Privacy', href: comingSoon('privacy') },
  { label: 'Terms', href: comingSoon('terms') },
  { label: 'Contact', href: `mailto:${EMAIL}` },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a className="logo" href="/" aria-label="Probity home">
          PROBITY<span className="logo__dot">.</span>
        </a>
        <p className="footer__tagline">Know the asset before you bet on it.</p>

        <nav className="footer__nav" aria-label="Footer">
          <ul className="footer__row">
            {PRIMARY.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={onHashLinkClick}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="footer__row footer__row--secondary">
            {SECONDARY.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={onHashLinkClick}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="footer__legal">
          © 2026 Probity · probity.bio ·{' '}
          <a href={`mailto:${EMAIL}`} className="footer__email">
            {EMAIL}
          </a>
        </p>
      </div>
    </footer>
  )
}
