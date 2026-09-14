import type { ReactNode } from 'react'
import { Footer } from '@/components/footer'
import { Nav } from '@/components/nav'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
