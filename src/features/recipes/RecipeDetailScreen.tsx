import { CookingPot, Share } from 'lucide-react'
import { AnimatePresence, motion, useScroll } from 'motion/react'
import { useRef, useState } from 'react'
import { useParams } from 'react-router'
import { Screen, TopBar } from '@/components/layout'
import { Button, IconButton, SegmentedControl } from '@/components/ui'
import { getRecipe } from '@/data/recipes'
import { useScrolled } from '@/hooks/useScrolled'
import { easeOutExpo, riseIn, stagger } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import { useStatusTone } from '@/store/useChromeStore'
import type { Recipe } from '@/types/nutrition'
import { CookModeSheet } from './components/CookModeSheet'
import { IngredientList } from './components/IngredientList'
import { LogMealSheet } from './components/LogMealSheet'
import { MacroBreakdown } from './components/MacroBreakdown'
import { MethodSteps } from './components/MethodSteps'
import { NutritionTable } from './components/NutritionTable'
import { HERO_H, RecipeHero } from './components/RecipeHero'
import { RecipeHeader } from './components/RecipeHeader'
import { RecipeNotFound } from './components/RecipeNotFound'
import { RecipeStats } from './components/RecipeStats'
import { SaveHeart } from './components/SaveHeart'

type Tab = 'ingredients' | 'method' | 'nutrition'

const tabOptions: { value: Tab; label: string }[] = [
  { value: 'ingredients', label: 'Ingredients' },
  { value: 'method', label: 'Method' },
  { value: 'nutrition', label: 'Nutrition' },
]

async function shareRecipe(recipe: Recipe) {
  const { showToast } = useAppStore.getState()
  try {
    await navigator.clipboard?.writeText(window.location.href)
  } catch {
    // Clipboard can be blocked (permissions, insecure origin) — the prototype still confirms.
  }
  showToast(`Link to “${recipe.title.split(' ').slice(0, 3).join(' ')}…” copied`, 'sparkle')
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: scrollRef })
  // Flip to a solid bar as the content sheet reaches the top bar.
  const scrolled = useScrolled(scrollRef, HERO_H - 120)
  useStatusTone(scrolled ? 'dark' : 'light')

  const [tab, setTab] = useState<Tab>('ingredients')
  const [servings, setServings] = useState(recipe.servings)
  const [checked, setChecked] = useState<Set<number>>(() => new Set())
  const [cookOpen, setCookOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)

  const toggleIngredient = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  const chrome = scrolled ? 'surface' : 'glass'

  return (
    <div className="relative h-full">
      <Screen ref={scrollRef} className="pb-40">
        <TopBar
          overlay
          scrolled={scrolled}
          title={recipe.title}
          fallback="/recipes"
          right={
            <>
              <SaveHeart recipeId={recipe.id} title={recipe.title} variant={chrome} />
              <IconButton label="Share recipe" variant={chrome} onClick={() => shareRecipe(recipe)}>
                <Share strokeWidth={2.2} />
              </IconButton>
            </>
          }
        />

        <RecipeHero recipe={recipe} scrollY={scrollY} />

        <motion.article
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 -mt-8 rounded-t-[32px] bg-canvas px-5 pt-7 shadow-[0_-12px_32px_-18px_rgb(0_0_0/0.35)]"
        >
          <RecipeHeader recipe={recipe} />
          <RecipeStats recipe={recipe} />
          <MacroBreakdown nutrients={recipe.nutrients} />

          <motion.div
            variants={riseIn}
            className="sticky top-[calc(var(--sat)+56px)] z-20 -mx-5 mt-7 bg-canvas/85 px-5 py-2.5 backdrop-blur-xl"
          >
            <SegmentedControl options={tabOptions} value={tab} onChange={setTab} />
          </motion.div>

          <div className="mt-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                role="tabpanel"
                aria-label={tabOptions.find((t) => t.value === tab)?.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: easeOutExpo }}
              >
                {tab === 'ingredients' && (
                  <IngredientList
                    ingredients={recipe.ingredients}
                    baseServings={recipe.servings}
                    servings={servings}
                    onServingsChange={setServings}
                    checked={checked}
                    onToggle={toggleIngredient}
                  />
                )}
                {tab === 'method' && <MethodSteps steps={recipe.steps} />}
                {tab === 'nutrition' && <NutritionTable nutrients={recipe.nutrients} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.article>
      </Screen>

      <motion.div
        initial={{ y: 96, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25, ease: easeOutExpo }}
        className="absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-canvas via-canvas to-transparent px-5 pt-8 pb-safe"
      >
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="bg-surface px-5 shadow-card ring-1 ring-line ring-inset"
            leading={<CookingPot className="size-5" strokeWidth={2.1} />}
            onClick={() => setCookOpen(true)}
          >
            Start cooking
          </Button>
          <Button size="lg" className="flex-1 px-5" onClick={() => setLogOpen(true)}>
            Log this meal
          </Button>
        </div>
      </motion.div>

      <CookModeSheet recipe={recipe} open={cookOpen} onClose={() => setCookOpen(false)} />
      <LogMealSheet recipe={recipe} open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  )
}

export function RecipeDetailScreen() {
  const { recipeId = '' } = useParams()
  const recipe = getRecipe(recipeId)
  if (!recipe) return <RecipeNotFound />
  return <RecipeDetail key={recipe.id} recipe={recipe} />
}
