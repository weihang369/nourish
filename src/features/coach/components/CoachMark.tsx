import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'

/** The coach's avatar: a lime spark on deep forest, echoing the logo. */
export function CoachMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('grid shrink-0 place-items-center rounded-full bg-deep text-lime ring-1 ring-line', className)}
      style={{ width: size, height: size }}
    >
      <Sparkles style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2.2} />
    </span>
  )
}
