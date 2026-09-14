import { onHashLinkClick } from '@/lib/scroll'
import { EMAIL, comingSoon } from '@/lib/site'

const COLUMNS = [
  {
    title: 'Service',
    links: [
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Inside the brief', href: '/#the-brief' },
      { label: 'Pilot', href: '/#pilot' },
      { label: 'Sample brief', href: comingSoon('sample-brief') },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'The standard', href: '/#the-standard' },
      { label: 'Contact', href: `mailto:${EMAIL}` },
      { label: 'LinkedIn', href: comingSoon('linkedin') },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: comingSoon('privacy') },
      { label: 'Terms', href: comingSoon('terms') },
    ],
  },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a className="logo" href="/" aria-label="Probity home">
            PROBITY<span className="logo__dot">.</span>
          </a>
          <p>Know the asset before you bet on it.</p>
          <a className="footer__email" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          {COLUMNS.map((column) => (
            <div key={column.title} className="footer__col">
              <h2 className="footer__heading">{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} onClick={onHashLinkClick}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="container footer__base">
        <span>© 2026 Probity</span>
        <span>probity.bio</span>
      </div>
    </footer>
  )
}
