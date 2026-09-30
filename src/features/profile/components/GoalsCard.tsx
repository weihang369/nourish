import { Droplet, Pencil, Target } from 'lucide-react'
import { motion } from 'motion/react'
import { AnimatedNumber, Card, ProgressBar } from '@/components/ui'
import { formatGrams, formatLiters, formatOneDp } from '@/lib/format'
import { spring } from '@/lib/motion'
import { macroKeys, macroMeta } from '@/lib/nutrition'
import { useAppStore } from '@/store/useAppStore'

export function GoalsCard({ onEdit }: { onEdit: () => void }) {
  const goals = useAppStore((s) => s.goals)
  const span = goals.startWeightKg - goals.targetWeightKg
  const progress = span > 0 ? (goals.startWeightKg - goals.currentWeightKg) / span : 1
  const toGo = Math.max(0, goals.currentWeightKg - goals.targetWeightKg)

  return (
    <Card tone="deep" className="overflow-hidden">
      <span aria-hidden className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-lime/15 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-on-deep/60 uppercase">Daily goals</p>
        <motion.button
          type="button"
          onClick={onEdit}
          whileTap={{ scale: 0.94 }}
          transition={spring.snappy}
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-on-deep/10 px-4 text-[13px] font-semibold text-on-deep ring-1 ring-on-deep/15 ring-inset transition-colors hover:bg-on-deep/15"
        >
          <Pencil className="size-3.5" />
          Edit
        </motion.button>
      </div>

      <p className="relative mt-1 flex items-baseline gap-1.5">
        <AnimatedNumber value={goals.kcal} className="font-display text-[48px] leading-none font-medium" />
        <span className="text-[14px] font-semibold text-on-deep/60">kcal / day</span>
      </p>

      <div className="relative mt-5 grid grid-cols-3 gap-2">
        {macroKeys.map((k) => (
          <div key={k} className="rounded-[18px] bg-on-deep/[0.06] px-3 py-2.5">
            <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-on-deep/70">
              <span className="size-2 rounded-full" style={{ background: macroMeta[k].color }} />
              {macroMeta[k].label}
            </p>
            <p className="mt-1 text-[17px] font-semibold tabular">
              {formatGrams(goals[k])}
              <span className="ml-0.5 text-[12px] font-medium text-on-deep/60">g</span>
            </p>
          </div>
        ))}
      </div>

      <div className="relative mt-5 space-y-4 border-t border-on-deep/10 pt-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-water/20 text-water">
            <Droplet className="size-4" />
          </span>
          <p className="flex-1 text-[13.5px] font-medium text-on-deep/80">Water</p>
          <p className="text-[15px] font-semibold tabular">{formatLiters(goals.waterMl)}</p>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-lime/20 text-lime">
              <Target className="size-4" />
            </span>
            <p className="flex-1 text-[13.5px] font-medium text-on-deep/80">Weight target</p>
            <p className="text-[15px] font-semibold tabular">
              {formatOneDp(goals.currentWeightKg)} <span className="text-on-deep/50">→</span>{' '}
              {formatOneDp(goals.targetWeightKg)} kg
            </p>
          </div>
          <ProgressBar
            value={progress}
            color="var(--nr-lime)"
            trackClassName="bg-on-deep/15"
            className="mt-3 h-2"
            label="Progress toward target weight"
            delay={0.2}
          />
          <p className="mt-2 text-[12px] text-on-deep/60 tabular">
            {Math.round(progress * 100)}% there · {formatOneDp(toGo)} kg to go
          </p>
        </div>
      </div>
    </Card>
  )
}
