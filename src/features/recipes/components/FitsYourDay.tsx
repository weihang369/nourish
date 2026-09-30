import { motion } from 'motion/react'
import { type ReactNode, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { FoodImage } from '@/components/food'
import { SectionHeader } from '@/components/ui'
import { useDiary } from '@/hooks/useDiary'
import { formatInt } from '@/lib/format'
import { riseIn, stagger } from '@/lib/motion'
import type { Recipe } from '@/types/nutrition'
import { type DayFit, rankForDay } from '../lib/dayFit'

function ReasonChip({ children, dot }: { children: ReactNode; dot?: string }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-surface-2 px-2 text-[11px] font-semibold whitespace-nowrap text-ink-2 tabular">
      {dot && <span className={`size-1.5 rounded-full ${dot}`} />}
      {children}
    </span>
  )
}

function FitCard({ fit, remaining, mode }: { fit: DayFit; remaining: number; mode: 'fits' | 'light' }) {
  const navigate = useNavigate()
  const { recipe, kcalShare } = fit
  const share = Math.min(1, Math.max(0, kcalShare))

  return (
    <motion.button
      type="button"
      variants={riseIn}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      className="flex w-[284px] shrink-0 snap-start gap-3 rounded-[22px] bg-surface p-2.5 text-left shadow-card ring-1 ring-line ring-inset"
    >
      <FoodImage photo={recipe.photo} emoji="🍽️" alt="" width={84} height={108} className="h-[108px] w-[84px] shrink-0 rounded-[16px]" />
      <div className="flex min-w-0 flex-1 flex-col py-0.5 pr-1">
        <h3 className="line-clamp-2 font-display text-[15.5px] leading-[1.2] font-medium text-ink">{recipe.title}</h3>
        <div className="mt-2 flex flex-wrap gap-1">
          {mode === 'fits' ? (
            <ReasonChip>Fits {formatInt(remaining)} kcal</ReasonChip>
          ) : (
            <ReasonChip>{formatInt(recipe.nutrients.kcal)} kcal</ReasonChip>
          )}
          <ReasonChip dot="bg-protein">+{formatInt(recipe.nutrients.protein)} g protein</ReasonChip>
        </div>
        <div className="mt-auto pt-2">
          <div className="h-1 overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className="h-full rounded-full bg-brand"
              initial={{ width: 0 }}
              whileInView={{ width: `${share * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <p className="mt-1 text-[10.5px] font-medium text-ink-3 tabular">
            {mode === 'fits'
              ? `Uses ${Math.round(kcalShare * 100)}% of what's left`
              : `${recipe.minutes} min · light & satisfying`}
          </p>
        </div>
      </div>
    </motion.button>
  )
}

/** Recipes ranked against what's left of today's energy and protein. */
export function FitsYourDay({ recipes }: { recipes: Recipe[] }) {
  const { remaining, goals, total } = useDiary()
  const proteinLeft = Math.max(0, Math.round(goals.protein - total.protein))
  const { mode, picks } = useMemo(
    () => rankForDay(recipes, remaining, proteinLeft),
    [recipes, remaining, proteinLeft],
  )

  if (picks.length === 0) return null

  const eyebrow =
    mode === 'fits'
      ? `${formatInt(remaining)} kcal · ${proteinLeft} g protein left`
      : 'Today’s budget is nearly met'

  return (
    <section className="mt-7">
      <SectionHeader className="px-5" eyebrow={eyebrow} title={mode === 'fits' ? 'Fits your day' : 'Light & easy'} />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="no-scrollbar mt-3.5 flex snap-x snap-mandatory scroll-pl-5 gap-3 overflow-x-auto overscroll-x-contain px-5 pt-0.5 pb-3"
      >
        {picks.map((fit) => (
          <FitCard key={fit.recipe.id} fit={fit} remaining={remaining} mode={mode} />
        ))}
        <div aria-hidden className="w-2 shrink-0" />
      </motion.div>
    </section>
  )
}
