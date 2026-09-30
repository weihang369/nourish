import { motion } from 'motion/react'
import { useState } from 'react'
import { isSameDay } from '@/lib/date'
import { cn } from '@/lib/cn'

interface AdherenceHeatmapProps {
  days: { date: Date; level: number }[]
}

/** Sequential single-hue scale: surface → brand. Level 0 = no data. */
const levelFill = [
  'var(--nr-surface-2)',
  'color-mix(in oklab, var(--nr-brand) 22%, var(--nr-surface-2))',
  'color-mix(in oklab, var(--nr-brand) 48%, var(--nr-surface-2))',
  'color-mix(in oklab, var(--nr-brand) 74%, var(--nr-surface-2))',
  'var(--nr-brand)',
]

const levelLabel = ['No log', 'Off track', 'Close', 'On track', 'Nailed it']
const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

export function AdherenceHeatmap({ days }: AdherenceHeatmapProps) {
  const today = new Date()
  const [selected, setSelected] = useState(days.length - 1)

  // Pad the front so the first column is Monday.
  const lead = (days[0].date.getDay() + 6) % 7
  const cells: ({ date: Date; level: number; index: number } | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...days.map((d, index) => ({ ...d, index })),
  ]

  const sel = days[selected]

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {weekdays.map((w, i) => (
          <div key={i} className="pb-1 text-center text-[10.5px] font-semibold text-ink-3">
            {w}
          </div>
        ))}
        {cells.map((cell, i) =>
          cell ? (
            <motion.button
              key={i}
              type="button"
              aria-label={`${fmt.format(cell.date)}: ${levelLabel[cell.level]}`}
              onClick={() => setSelected(cell.index)}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.012, duration: 0.35 }}
              className={cn(
                'aspect-square rounded-[9px] transition-shadow',
                cell.index === selected && 'ring-2 ring-ink ring-offset-2 ring-offset-surface',
                isSameDay(cell.date, today) && cell.index !== selected && 'ring-1 ring-ink-3 ring-offset-1 ring-offset-surface',
              )}
              style={{ background: levelFill[cell.level] }}
            />
          ) : (
            <span key={i} />
          ),
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-ink-3">
        <span>
          <span className="font-semibold text-ink">{fmt.format(sel.date)}</span> · {levelLabel[sel.level]}
        </span>
        <span className="flex items-center gap-1">
          Less
          {levelFill.slice(1).map((f) => (
            <span key={f} className="size-2.5 rounded-[3px]" style={{ background: f }} />
          ))}
          More
        </span>
      </div>
    </div>
  )
}
