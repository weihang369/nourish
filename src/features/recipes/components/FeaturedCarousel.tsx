import { Clock, Flame, Star } from 'lucide-react'
import { type MotionValue, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { type ReactNode, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { FoodImage } from '@/components/food'
import { Avatar } from '@/components/ui'
import { useElementWidth } from '@/hooks/useElementWidth'
import { cn } from '@/lib/cn'
import { formatInt } from '@/lib/format'
import { spring } from '@/lib/motion'
import type { Recipe } from '@/types/nutrition'
import { SaveHeart } from './SaveHeart'

const CARD_W = 300
const CARD_H = 380
const GAP = 12
const STEP = CARD_W + GAP
const GUTTER = 20

interface FeaturedCardProps {
  recipe: Recipe
  index: number
  scrollX: MotionValue<number>
  kicker: string
}

function GlassTag({ children }: { children: ReactNode }) {
  return (
    <span className="glass-dark inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11.5px] font-semibold text-white tabular ring-1 ring-white/15 ring-inset">
      {children}
    </span>
  )
}

function FeaturedCard({ recipe, index, scrollX, kicker }: FeaturedCardProps) {
  const navigate = useNavigate()
  const range = [(index - 1) * STEP, index * STEP, (index + 1) * STEP]
  // The card in the snap position sits at full size; neighbours recede slightly.
  const scale = useTransform(scrollX, range, [0.93, 1, 0.93])
  const imageX = useTransform(scrollX, range, [-24, 0, 24])

  return (
    <motion.article
      style={{ scale, width: CARD_W, height: CARD_H }}
      className="relative shrink-0 snap-start overflow-hidden rounded-[28px] bg-deep shadow-float"
    >
      <button
        type="button"
        aria-label={`${recipe.title} by ${recipe.author.name}`}
        onClick={() => navigate(`/recipes/${recipe.id}`)}
        className="peer absolute inset-0 z-[1]"
      />
      <div className="pointer-events-none absolute inset-0 transition-transform duration-500 ease-out-expo peer-active:scale-[1.03]">
        <motion.div className="absolute -inset-x-8 inset-y-0" style={{ x: imageX }}>
          <FoodImage photo={recipe.photo} emoji="🍽️" alt="" width={CARD_W + 64} height={CARD_H} priority={index < 2} className="size-full" />
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-black/30" />

      <div className="pointer-events-none relative z-[2] flex h-full flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <GlassTag>
              <Clock className="size-3.5" strokeWidth={2.4} />
              {recipe.minutes} min
            </GlassTag>
            <GlassTag>
              <Flame className="size-3.5" strokeWidth={2.4} />
              {formatInt(recipe.nutrients.kcal)} kcal
            </GlassTag>
          </div>
          <SaveHeart recipeId={recipe.id} title={recipe.title} className="pointer-events-auto" />
        </div>

        <div className="text-white">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">{kicker}</p>
          <h3 className="mt-1.5 font-display text-[27px] leading-[1.08] font-medium text-balance">{recipe.title}</h3>
          <div className="mt-4 flex items-center gap-2.5">
            <Avatar photo={recipe.author.photo} name={recipe.author.name} size={28} className="ring-2 ring-white/30" />
            <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-white/85">{recipe.author.name}</span>
            <span className="flex items-center gap-1 text-[12.5px] font-semibold tabular">
              <Star className="size-3.5 fill-current" strokeWidth={0} />
              {recipe.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

interface FeaturedCarouselProps {
  recipes: { recipe: Recipe; kicker: string }[]
}

/** Snap carousel of editor's picks; the centred card grows as it lands. */
export function FeaturedCarousel({ recipes }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [measureRef, width] = useElementWidth<HTMLDivElement>(390)
  const { scrollX } = useScroll({ container: scrollRef })
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollX, 'change', (x) => {
    setActive(Math.min(recipes.length - 1, Math.max(0, Math.round(x / STEP))))
  })

  // Lets the last card snap fully into the lead position instead of peeking.
  const tail = Math.max(0, width - GUTTER - CARD_W - GAP)

  return (
    <div ref={measureRef}>
      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory scroll-pl-5 gap-3 overflow-x-auto overscroll-x-contain py-3 pl-5"
        aria-label="Featured recipes"
        role="region"
      >
        {recipes.map(({ recipe, kicker }, i) => (
          <FeaturedCard key={recipe.id} recipe={recipe} index={i} scrollX={scrollX} kicker={kicker} />
        ))}
        <div aria-hidden className="shrink-0" style={{ width: tail }} />
      </div>

      <div aria-hidden className="flex h-6 items-center justify-center gap-1.5">
        {recipes.map(({ recipe }, i) => (
          <motion.span
            key={recipe.id}
            className={cn('block h-1.5 rounded-full transition-colors duration-300', i === active ? 'bg-ink' : 'bg-ink/20')}
            initial={false}
            animate={{ width: i === active ? 18 : 6 }}
            transition={spring.snappy}
          />
        ))}
      </div>
    </div>
  )
}
