import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SectionHeaderProps {
  title: string
  eyebrow?: string
  action?: string
  onAction?: () => void
  trailing?: ReactNode
  className?: string
}

export function SectionHeader({ title, eyebrow, action, onAction, trailing, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div>
        {eyebrow && <p className="mb-0.5 text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">{eyebrow}</p>}
        <h2 className="font-display text-[22px] leading-tight font-medium">{title}</h2>
      </div>
      {trailing}
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-0.5 pb-0.5 text-[13px] font-semibold text-ink-2 transition-colors hover:text-ink"
        >
          {action}
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  )
}
