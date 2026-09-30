import { cn } from '@/lib/cn'
import { scoreBand } from '@/lib/nutrition'

const toneClass = {
  excellent: 'bg-fiber',
  good: 'bg-brand',
  fair: 'bg-carbs',
  limit: 'bg-protein',
} as const

/** Compact Nourish Score pill — the dot color is always paired with the number. */
export function ScoreBadge({ score, className, showLabel }: { score: number; className?: string; showLabel?: boolean }) {
  const band = scoreBand(score)
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full bg-surface-2 pr-2.5 pl-2 text-[11px] font-bold text-ink tabular',
        className,
      )}
      title={`Nourish Score ${score} · ${band.label}`}
    >
      <span className={cn('size-1.5 rounded-full', toneClass[band.tone])} />
      {score}
      {showLabel && <span className="font-semibold text-ink-2">{band.label}</span>}
    </span>
  )
}

export { toneClass as scoreToneClass }
