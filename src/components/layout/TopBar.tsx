import { ChevronLeft } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { IconButton } from '@/components/ui'
import { cn } from '@/lib/cn'

interface TopBarProps {
  title?: string
  /** Over a hero image: glass buttons, title hidden until scrolled */
  overlay?: boolean
  scrolled?: boolean
  fallback?: string
  right?: ReactNode
  className?: string
  children?: ReactNode
}

/** Navigate back when there is in-app history, otherwise to a sensible parent. */
export function useBack(fallback = '/') {
  const navigate = useNavigate()
  return () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate(fallback, { replace: true })
  }
}

export function TopBar({ title, overlay, scrolled, fallback, right, className, children }: TopBarProps) {
  const back = useBack(fallback)
  const solid = !overlay || scrolled
  const btn = solid ? 'surface' : 'glass'

  return (
    <header
      className={cn(
        'sticky top-0 z-30 pt-safe transition-[background-color,box-shadow] duration-300',
        overlay && '-mb-[calc(var(--sat)+56px)]',
        solid && (overlay ? 'glass shadow-[0_1px_0_var(--nr-line)]' : 'bg-canvas/90 backdrop-blur-xl'),
        className,
      )}
    >
      <div className="flex h-14 items-center gap-3 px-4">
        <IconButton label="Back" variant={btn} onClick={back}>
          <ChevronLeft strokeWidth={2.4} />
        </IconButton>
        <div className="min-w-0 flex-1 text-center">
          <AnimatePresence initial={false}>
            {title && solid && (
              <motion.h1
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="truncate text-[15px] font-semibold"
              >
                {title}
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        <div className="flex min-w-10 items-center justify-end gap-2">{right}</div>
      </div>
      {children}
    </header>
  )
}
