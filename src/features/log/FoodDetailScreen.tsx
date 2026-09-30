import { BadgeCheck, Heart } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { ScoreBadge } from '@/components/food'
import { Screen, TopBar, useBack } from '@/components/layout'
import { AnimatedNumber, Button, IconButton, Tag } from '@/components/ui'
import { mealLabel } from '@/data/diary'
import { getFood } from '@/data/foods'
import { useDiary } from '@/hooks/useDiary'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/cn'
import { formatGrams, formatServings } from '@/lib/format'
import { riseIn, spring, stagger } from '@/lib/motion'
import { scaleNutrients } from '@/lib/nutrition'
import { useAppStore } from '@/store/useAppStore'
import { useStatusTone } from '@/store/useChromeStore'
import type { Food, MealType } from '@/types/nutrition'
import { DayFitCard } from './components/DayFitCard'
import { DetailHero, HERO_HEIGHT } from './components/DetailHero'
import { EnergyCard } from './components/EnergyCard'
import { FoodNotFound } from './components/FoodNotFound'
import { MicronutrientList } from './components/MicronutrientList'
import { NutritionFacts } from './components/NutritionFacts'
import { ScoreCard } from './components/ScoreCard'
import { gramStep, ServingCard, type ServingUnit } from './components/ServingCard'
import { logWithUndo, mealWord, parseMeal } from './logging'
import { useTray } from './useTray'

export function FoodDetailScreen() {
  const { foodId = '' } = useParams()
  const food = getFood(foodId)
  return food ? <FoodDetail key={food.id} food={food} /> : <FoodNotFound />
}

function FavoriteButton({ food, overlay }: { food: Food; overlay: boolean }) {
  const isFav = useAppStore((s) => s.favoriteFoodIds.includes(food.id))

  const toggle = () => {
    const { toggleFavoriteFood, showToast } = useAppStore.getState()
    const nowFav = toggleFavoriteFood(food.id)
    showToast(nowFav ? 'Saved to favorites' : 'Removed from favorites', 'heart')
  }

  return (
    <IconButton
      label={isFav ? 'Remove from favorites' : 'Save to favorites'}
      aria-pressed={isFav}
      variant={overlay ? 'glass' : 'surface'}
      onClick={toggle}
    >
      <motion.span
        key={String(isFav)}
        initial={{ scale: isFav ? 0.4 : 1 }}
        animate={{ scale: 1 }}
        transition={spring.bouncy}
        className="grid place-items-center"
      >
        <Heart className={cn(isFav && 'fill-current')} strokeWidth={2.2} />
      </motion.span>
    </IconButton>
  )
}

function FoodDetail({ food }: { food: Food }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrolled = useScrolled(scrollRef, HERO_HEIGHT - 110)
  useStatusTone(scrolled ? 'dark' : 'light')

  const [params, setParams] = useSearchParams()
  const meal = parseMeal(params.get('meal'))
  const back = useBack(`/log?meal=${meal}`)
  const diary = useDiary()

  const [servings, setServings] = useState(1)
  const [unit, setUnit] = useState<ServingUnit>('serving')
  const nutrients = useMemo(() => scaleNutrients(food.nutrients, servings), [food, servings])

  const changeUnit = (next: ServingUnit) => {
    if (next === unit) return
    if (next === 'serving') {
      setServings(Math.max(0.25, Math.round(servings * 4) / 4))
    } else {
      const step = gramStep(food.serving.grams)
      const grams = Math.max(step, Math.round((servings * food.serving.grams) / step) * step)
      setServings(grams / food.serving.grams)
    }
    setUnit(next)
  }

  const setMeal = (next: MealType) => setParams({ meal: next }, { replace: true })

  const add = () => {
    logWithUndo(
      meal,
      [{ foodId: food.id, servings: Math.round(servings * 100) / 100 }],
      `${food.name} added to ${mealWord(meal)}`,
    )
    useTray.getState().removeMany([food.id])
    back()
  }

  const portionLabel =
    unit === 'serving'
      ? `${formatServings(servings)} × ${food.serving.label}`
      : `${formatGrams(servings * food.serving.grams)} g`

  return (
    <div className="relative h-full">
      <Screen ref={scrollRef} className="pb-40">
        <TopBar
          overlay
          scrolled={scrolled}
          title={food.name}
          fallback={`/log?meal=${meal}`}
          right={<FavoriteButton food={food} overlay={!scrolled} />}
        />

        <DetailHero food={food} scrollRef={scrollRef} />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 -mt-9 space-y-4 rounded-t-[32px] bg-canvas px-5 pt-7"
        >
          <motion.header variants={riseIn} className="px-1 pb-2">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
              {food.brand ? `${food.brand} · ` : ''}
              {food.category}
            </p>
            <h1 className="mt-1.5 font-display text-[32px] leading-[1.05] font-medium text-balance">{food.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-[13.5px] text-ink-2 tabular">
              {/\d\s?g$/.test(food.serving.label) ? food.serving.label : `${food.serving.label} · ${food.serving.grams} g`}
              {food.verified && (
                <span className="ml-1 inline-flex items-center gap-1 font-semibold text-ink">
                  <BadgeCheck className="size-4 fill-brand text-canvas" strokeWidth={2.2} />
                  Verified
                </span>
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <ScoreBadge score={food.score} showLabel className="bg-surface shadow-card ring-1 ring-line" />
              {food.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </motion.header>

          <motion.div variants={riseIn}>
            <ScoreCard food={food} />
          </motion.div>
          <motion.div variants={riseIn}>
            <ServingCard
              food={food}
              servings={servings}
              unit={unit}
              meal={meal}
              onServingsChange={setServings}
              onUnitChange={changeUnit}
              onMealChange={setMeal}
            />
          </motion.div>
          <motion.div variants={riseIn}>
            <EnergyCard nutrients={nutrients} />
          </motion.div>
          <motion.div variants={riseIn}>
            <DayFitCard eaten={diary.total.kcal} adding={nutrients.kcal} budget={diary.budget} mealName={mealWord(meal)} />
          </motion.div>
          <motion.div variants={riseIn}>
            <NutritionFacts nutrients={nutrients} portionLabel={portionLabel} />
          </motion.div>
          <motion.div variants={riseIn}>
            <MicronutrientList micros={food.micros} servings={servings} />
          </motion.div>
        </motion.div>
      </Screen>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-canvas via-canvas to-transparent px-5 pt-8 pb-safe">
        <Button block size="lg" onClick={add}>
          <span>
            Add to {mealLabel[meal]} · <AnimatedNumber value={nutrients.kcal} from={nutrients.kcal} duration={0.5} /> kcal
          </span>
        </Button>
      </div>
    </div>
  )
}
