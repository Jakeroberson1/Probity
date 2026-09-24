import { useEffect } from 'react'
import { scrollToId } from '@/lib/scroll'

/**
 * Keep a page aligned to the section named in its URL hash.
 *
 * Landing on /briefs/?b=slug#postmortem or /#subscribe, the browser does its own hash jump
 * before React has rendered the section, so it lands nowhere. The web font and the lazily
 * loaded ThreeUI chunks then move the layout underneath it. So the alignment is re-applied
 * while the page settles, and let go the moment the visitor scrolls or 2.5s passes, whichever
 * comes first. Fighting a visitor for control of the scroll position is worse than a bad jump.
 */
export function useHashScroll() {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id || !document.getElementById(id)) return

    let frame = 0
    const align = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => scrollToId(id, 'auto'))
    }
    const observer = new ResizeObserver(align)
    const release = () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', release)
      window.removeEventListener('touchstart', release)
      window.removeEventListener('keydown', release)
    }
    observer.observe(document.body)
    window.addEventListener('wheel', release, { passive: true })
    window.addEventListener('touchstart', release, { passive: true })
    window.addEventListener('keydown', release)
    const timer = window.setTimeout(release, 2500)
    align()

    return () => {
      window.clearTimeout(timer)
      release()
    }
  }, [])

  // Hash changes within the page (typed URLs, Back/Forward over pushState entries).
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1)
      if (id) scrollToId(id)
      else window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('popstate', onHash)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('popstate', onHash)
    }
  }, [])
}
