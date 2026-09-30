import { Camera } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Screen, TopBar, useBack } from '@/components/layout'
import { Button, SegmentedControl, Sheet } from '@/components/ui'
import { getFood, recentFoodIds, savedMeals } from '@/data/foods'
import { mealLabel } from '@/data/diary'
import { pluralize } from '@/lib/format'
import { easeOutExpo, stagger } from '@/lib/motion'
import { sumEntries } from '@/lib/nutrition'
import { useAppStore } from '@/store/useAppStore'
import type { Food, MealType } from '@/types/nutrition'
import { EmptyState } from './components/EmptyState'
import { FoodList, FoodListSkeleton } from './components/FoodList'
import { MealSwitcher } from './components/MealSwitcher'
import { QuickActions } from './components/QuickActions'
import { QuickAddKcalSheet } from './components/QuickAddKcalSheet'
import { SavedMealCard } from './components/SavedMealCard'
import { SearchField } from './components/SearchField'
import { TrayBar } from './components/TrayBar'
import { TraySheetContent } from './components/TraySheet'
import { logWithUndo, mealWord, parseMeal } from './logging'
import { useFoodSearch } from './useFoodSearch'
import { useTray } from './useTray'

type LibraryTab = 'recent' | 'favorites' | 'meals'

const tabs: { value: LibraryTab; label: string }[] = [
  { value: 'recent', label: 'Recent' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'meals', label: 'My meals' },
]

const suggestions = ['salmon', 'oats', 'avocado', 'bowl']

const toFoods = (ids: string[]) => ids.map(getFood).filter((f): f is Food => !!f)

const swap = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutExpo } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
}

export function LogFoodScreen() {
  const [params, setParams] = useSearchParams()
  const meal = parseMeal(params.get('meal'))
  const navigate = useNavigate()
  const back = useBack('/')

  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<LibraryTab>('recent')
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)

  const favoriteIds = useAppStore((s) => s.favoriteFoodIds)
  const trayIds = useTray((s) => s.ids)
  const { toggle, addMany, removeMany, clear } = useTray.getState()

  const { results, loading } = useFoodSearch(query)
  const searching = query.trim().length > 0

  const trayFoods = useMemo(() => toFoods(trayIds), [trayIds])
  const trayKcal = useMemo(() => sumEntries(trayIds.map((foodId) => ({ foodId, servings: 1 }))).kcal, [trayIds])

  const setMeal = (next: MealType) => setParams({ meal: next }, { replace: true })
  const openFood = (id: string) => navigate(`/food/${id}?meal=${meal}`)

  const logTray = () => {
    const count = trayIds.length
    logWithUndo(
      meal,
      trayIds.map((foodId) => ({ foodId, servings: 1 })),
      `${pluralize(count, 'item')} added to ${mealWord(meal)}`,
    )
    setReviewOpen(false)
    clear()
    back()
  }

  const listProps = { trayIds, onToggle: toggle, onOpen: openFood }

  return (
    <div className="relative h-full">
      <Screen className="pb-44">
        <TopBar title={`Add to ${mealLabel[meal]}`} fallback="/">
          <div className="space-y-3 px-5 pt-1 pb-3">
            <MealSwitcher value={meal} onChange={setMeal} className="-mx-5 px-5" />
            <SearchField value={query} onChange={setQuery} />
          </div>
        </TopBar>

        <div className="px-5 pt-3">
          <AnimatePresence mode="wait" initial={false}>
            {searching ? (
              <motion.section key="search" aria-label="Search results" {...swap}>
                <p aria-live="polite" className="mb-3 px-1 text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
                  {loading ? 'Searching…' : results.length ? `${pluralize(results.length, 'match', 'matches')}` : 'No matches'}
                </p>
                {loading ? (
                  <FoodListSkeleton />
                ) : results.length ? (
                  <FoodList foods={results} highlight={query} label="Results" {...listProps} />
                ) : (
                  <EmptyState
                    emoji="🥕"
                    title={`Nothing for “${query.trim()}” yet`}
                    body="Try a simpler word — or snap a photo and we’ll recognise the dish for you."
                  >
                    <Button size="sm" variant="deep" leading={<Camera className="size-4" />} onClick={() => navigate('/scan')}>
                      Snap it instead
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setQuickAddOpen(true)}>
                      Quick add kcal
                    </Button>
                  </EmptyState>
                )}
              </motion.section>
            ) : (
              <motion.div key="library" {...swap}>
                <QuickActions
                  onSnap={() => navigate('/scan')}
                  onBarcode={() => navigate('/scan?mode=barcode')}
                  onQuickAdd={() => setQuickAddOpen(true)}
                />

                <SegmentedControl options={tabs} value={tab} onChange={setTab} className="mt-7" />

                <div className="mt-4">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={tab} {...swap}>
                      {tab === 'recent' && <FoodList foods={toFoods(recentFoodIds)} label="Recent foods" {...listProps} />}

                      {tab === 'favorites' &&
                        (favoriteIds.length ? (
                          <FoodList foods={toFoods(favoriteIds)} label="Favorite foods" {...listProps} />
                        ) : (
                          <EmptyState
                            emoji="🤍"
                            title="No favorites yet"
                            body="Tap the heart on any food and it will wait for you here."
                          />
                        ))}

                      {tab === 'meals' && (
                        <motion.ul variants={stagger} initial="hidden" animate="show" aria-label="My meals" className="space-y-3">
                          {savedMeals.map((m) => {
                            const inTray = m.foodIds.every((id) => trayIds.includes(id))
                            return (
                              <SavedMealCard
                                key={m.id}
                                name={m.name}
                                foodIds={m.foodIds}
                                inTray={inTray}
                                onToggleAll={() => (inTray ? removeMany(m.foodIds) : addMany(m.foodIds))}
                              />
                            )
                          })}
                        </motion.ul>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[12.5px] text-ink-3">
                  <span>Try searching</span>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQuery(s)}
                      className="h-8 rounded-full bg-surface-2 px-3 font-semibold text-ink-2 transition-colors hover:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Screen>

      <TrayBar foods={trayFoods} kcal={trayKcal} meal={meal} onReview={() => setReviewOpen(true)} onLog={logTray} />

      <QuickAddKcalSheet open={quickAddOpen} onClose={() => setQuickAddOpen(false)} meal={meal} />

      <Sheet open={reviewOpen && trayFoods.length > 0} onClose={() => setReviewOpen(false)} title="Your plate">
        <TraySheetContent
          foods={trayFoods}
          meal={meal}
          onRemove={(id) => {
            if (trayIds.length === 1) setReviewOpen(false)
            toggle(id)
          }}
          onLog={logTray}
        />
      </Sheet>
    </div>
  )
}
