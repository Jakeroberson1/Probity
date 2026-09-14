import type { ElementType, ReactNode } from 'react'
import { useInView } from '@/hooks/use-in-view'

type RevealProps = {
  as?: ElementType
  className?: string
  children?: ReactNode
  id?: string
}

/** Fades and lifts its content in the first time it scrolls into view. */
export function Reveal({ as: Tag = 'div', className, children, id }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <Tag ref={ref} id={id} className={['reveal', inView && 'is-visible', className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}
