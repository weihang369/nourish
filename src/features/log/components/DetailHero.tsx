import { motion, useScroll, useTransform } from 'motion/react'
import type { RefObject } from 'react'
import { FoodImage } from '@/components/food'
import type { Food } from '@/types/nutrition'

export const HERO_HEIGHT = 392

interface DetailHeroProps {
  food: Food
  scrollRef: RefObject<HTMLDivElement | null>
}

/** Full-bleed photo that drifts slower than the page and gently zooms as you scroll. */
export function DetailHero({ food, scrollRef }: DetailHeroProps) {
  const { scrollY } = useScroll({ container: scrollRef })
  const y = useTransform(scrollY, [0, HERO_HEIGHT], [0, HERO_HEIGHT * 0.42])
  const scale = useTransform(scrollY, [0, HERO_HEIGHT], [1, 1.14])
  const dim = useTransform(scrollY, [0, HERO_HEIGHT * 0.8], [0, 0.45])

  return (
    <div className="relative overflow-hidden bg-deep" style={{ height: HERO_HEIGHT }}>
      <motion.div style={{ y, scale }} className="absolute inset-0 origin-bottom">
        {food.photo ? (
          <FoodImage photo={food.photo} emoji={food.emoji} alt={food.name} width={390} height={HERO_HEIGHT} priority className="size-full" />
        ) : (
          <div role="img" aria-label={food.name} className="grain relative grid size-full place-items-center overflow-hidden bg-deep">
            <span aria-hidden className="absolute top-1/3 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/25 blur-3xl" />
            <span aria-hidden className="absolute -right-16 -bottom-10 size-56 rounded-full bg-brand/40 blur-3xl" />
            <span className="relative -mt-6 text-[120px] leading-none drop-shadow-[0_20px_30px_rgb(0_0_0/0.35)] select-none">
              {food.emoji}
            </span>
          </div>
        )}
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/50 to-transparent" />
      <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />
    </div>
  )
}
