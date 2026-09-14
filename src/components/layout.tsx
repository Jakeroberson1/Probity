import type { ReactNode } from 'react'
import { Footer } from '@/components/footer'
import { Nav } from '@/components/nav'
import { InkFilters, SiteBackground } from '@/components/threeui'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <InkFilters />
      <SiteBackground />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
