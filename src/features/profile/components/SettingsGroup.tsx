import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** iOS inset-grouped list. Hairlines start after the icon and vanish on the first row. */
export function SettingsGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section>
      {title && (
        <h3 className="mb-2 px-4 text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">{title}</h3>
      )}
      <div className="overflow-hidden rounded-[22px] bg-surface shadow-card ring-1 ring-line ring-inset [&>*:first-child_.row-divider]:border-transparent">
        {children}
      </div>
    </section>
  )
}

interface SettingsRowProps {
  icon: ReactNode
  /** Tint classes for the icon tile, e.g. "bg-water/15 text-water" */
  iconClass?: string
  label: string
  detail?: string
  trailing?: ReactNode
  onClick?: () => void
  chevron?: boolean
}

export function SettingsRow({
  icon,
  iconClass = 'bg-surface-2 text-ink-2',
  label,
  detail,
  trailing,
  onClick,
  chevron,
}: SettingsRowProps) {
  const body = (
    <>
      <span className={cn('grid size-8 shrink-0 place-items-center rounded-[10px] [&_svg]:size-[17px]', iconClass)}>
        {icon}
      </span>
      <span className="row-divider flex min-h-[58px] flex-1 items-center gap-3 self-stretch border-t border-line py-2.5 pr-4">
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-[15px] font-medium text-ink">{label}</span>
          {detail && <span className="block truncate text-[12px] text-ink-3">{detail}</span>}
        </span>
        {trailing}
        {chevron && <ChevronRight className="size-4 shrink-0 text-ink-3" />}
      </span>
    </>
  )

  if (!onClick) return <div className="flex items-center gap-3.5 pl-4">{body}</div>

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ backgroundColor: 'var(--nr-surface-2)' }}
      className="flex w-full items-center gap-3.5 pl-4 transition-colors hover:bg-surface-2/50"
    >
      {body}
    </motion.button>
  )
}
