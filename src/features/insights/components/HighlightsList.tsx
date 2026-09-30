import { motion } from 'motion/react'
import { SectionHeader } from '@/components/ui'
import { highlights } from '@/data/insights'
import { cn } from '@/lib/cn'
import { riseIn, stagger } from '@/lib/motion'

type HighlightTone = (typeof highlights)[number]['tone']

/**
 * Tinted tile + a solid dot carries the tone; the figure itself stays in ink.
 * The weekend-calories insight is tagged `carbs` in data, but it's about energy,
 * so it wears ember (the calorie accent) rather than mislabel the carbs hue.
 */
const toneClass: Record<HighlightTone, { tile: string; dot: string; label: string }> = {
  fiber: { tile: 'bg-fiber/15', dot: 'bg-fiber', label: 'Fiber' },
  protein: { tile: 'bg-protein/15', dot: 'bg-protein', label: 'Protein' },
  carbs: { tile: 'bg-ember/15', dot: 'bg-ember', label: 'Kcal' },
}

export function HighlightsList() {
  return (
    <section className="px-5">
      <SectionHeader eyebrow="This week" title="Highlights" />
      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-4 space-y-3"
      >
        {highlights.map((h) => {
          const tone = toneClass[h.tone]
          return (
            <motion.li
              key={h.id}
              variants={riseIn}
              className="flex gap-4 rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-line ring-inset"
            >
              <div className={cn('flex size-[68px] shrink-0 flex-col justify-between rounded-[18px] p-2.5', tone.tile)}>
                <span className="flex items-center gap-1 text-[9.5px] font-semibold tracking-[0.08em] text-ink-2 uppercase">
                  <span className={cn('size-1.5 rounded-full', tone.dot)} />
                  {tone.label}
                </span>
                <span className="font-display text-[20px] leading-none font-semibold text-ink tabular">{h.stat}</span>
              </div>
              <div className="min-w-0 pt-0.5">
                <h3 className="text-[15px] leading-snug font-semibold">{h.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{h.body}</p>
              </div>
            </motion.li>
          )
        })}
      </motion.ul>
    </section>
  )
}
