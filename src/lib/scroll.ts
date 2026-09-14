import type { MouseEvent } from 'react'

/** Scroll a section into place below the sticky nav and move focus to it. */
export function scrollToId(id: string, behavior?: ScrollBehavior): boolean {
  const target = document.getElementById(id)
  if (!target) return false
  const nav = document.querySelector<HTMLElement>('.nav')
  const top = target.getBoundingClientRect().top + window.scrollY - (nav?.offsetHeight ?? 0)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: Math.max(0, top), behavior: behavior ?? (reduce ? 'auto' : 'smooth') })
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
  return true
}

/** Resolve an href: same-page hashes scroll, everything else navigates. */
export function followHref(href: string) {
  const url = new URL(href, window.location.href)
  if (url.protocol === 'mailto:') {
    window.location.href = href
    return
  }
  if (url.pathname === window.location.pathname && url.hash && scrollToId(url.hash.slice(1))) {
    if (window.location.hash !== url.hash) history.pushState(null, '', url.hash)
    return
  }
  window.location.href = url.href
}

/** onClick for <a> elements that may point at a section on the current page. */
export function onHashLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const url = new URL(e.currentTarget.href)
  if (url.pathname !== window.location.pathname || !url.hash) return
  if (!scrollToId(url.hash.slice(1))) return
  e.preventDefault()
  if (window.location.hash !== url.hash) history.pushState(null, '', url.hash)
}
