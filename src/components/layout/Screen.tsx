import type { ReactNode, Ref } from 'react'
import { cn } from '@/lib/cn'

interface ScreenProps {
  children: ReactNode
  className?: string
  /** Reserve space for the floating tab bar */
  withTabBar?: boolean
  ref?: Ref<HTMLDivElement>
}

/** A route's own scroll container. Every screen owns its scroll position. */
export function Screen({ children, className, withTabBar, ref }: ScreenProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'no-scrollbar h-full overflow-x-hidden overflow-y-auto overscroll-contain bg-canvas',
        withTabBar && 'pb-[calc(var(--sab)+104px)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
