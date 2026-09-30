import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { ProgressRing } from '@/components/charts'
import { SectionHeader } from '@/components/ui'
import { type Achievement, type AchievementTone, achievements } from '@/data/user'
import { cn } from '@/lib/cn'
import { riseIn, stagger } from '@/lib/motion'

const toneTint: Record<AchievementTone, string> = {
  ember: 'bg-ember/15',
  protein: 'bg-protein/15',
  water: 'bg-water/15',
  fiber: 'bg-fiber/15',
  carbs: 'bg-carbs/15',
  fat: 'bg-fat/15',
}

export function AchievementsRail() {
  const unlocked = achievements.filter((a) => a.progress >= 1).length
  return (
    <section>
      <SectionHeader className="px-5" eyebrow={`${unlocked} of ${achievements.length} unlocked`} title="Achievements" />
      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        aria-label="Achievements"
        className="no-scrollbar snap-x mt-4 flex scroll-px-5 gap-3 overflow-x-auto px-5 pt-1 pb-3"
      >
        {achievements.map((a) => (
          <MedalTile key={a.id} achievement={a} />
        ))}
      </motion.ul>
    </section>
  )
}

function MedalTile({ achievement: a }: { achievement: Achievement }) {
  const done = a.progress >= 1
  const pct = Math.round(a.progress * 100)
  return (
    <motion.li
      variants={riseIn}
      className="flex w-[128px] shrink-0 flex-col items-center rounded-[22px] bg-surface px-3 pt-4 pb-3.5 text-center shadow-card ring-1 ring-line ring-inset"
      aria-label={`${a.title}: ${done ? 'unlocked' : `${pct}% complete`}`}
    >
      {done ? (
        <div className="relative">
          <div className={cn('grid size-16 place-items-center rounded-full ring-4 ring-surface-2', toneTint[a.tone])}>
            <span className="text-[30px] leading-none" aria-hidden>
              {a.emoji}
            </span>
          </div>
          <span className="absolute -right-0.5 -bottom-0.5 grid size-6 place-items-center rounded-full bg-lime text-[#14201a] ring-[3px] ring-surface">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        </div>
      ) : (
        <ProgressRing value={a.progress} size={64} stroke={4} color={`var(--nr-${a.tone})`} delay={0.3}>
          <span className="block text-[26px] leading-none opacity-60 grayscale-60" aria-hidden>
            {a.emoji}
          </span>
        </ProgressRing>
      )}
      <p className="mt-3 text-[12.5px] leading-tight font-semibold">{a.title}</p>
      <p className="mt-1 text-[11px] leading-snug text-ink-3">{a.detail}</p>
      <span
        className={cn(
          'mt-2.5 inline-flex h-5 items-center rounded-full px-2 text-[10.5px] font-semibold tabular',
          done ? 'bg-brand-soft text-brand' : 'bg-surface-2 text-ink-2',
        )}
      >
        {done ? 'Unlocked' : `${pct}%`}
      </span>
    </motion.li>
  )
}
