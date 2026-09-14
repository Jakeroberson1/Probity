import { useEffect, useRef, useState } from 'react'

/** True once the element has entered the viewport; stays true. */
export function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const rootMargin = options?.rootMargin ?? '0px 0px -8% 0px'
  const threshold = options?.threshold ?? 0.08

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView, rootMargin, threshold])

  return [ref, inView] as const
}
