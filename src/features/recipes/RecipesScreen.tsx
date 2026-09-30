import { Heart, SlidersHorizontal } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useDeferredValue, useMemo, useState } from 'react'
import { Screen } from '@/components/layout'
import { Chip, IconButton, SectionHeader } from '@/components/ui'
import { filterRecipes, getRecipe, type RecipeFilter, recipeFilters, recipes } from '@/data/recipes'
import { cn } from '@/lib/cn'
import { pluralize } from '@/lib/format'
import { easeOutExpo, riseIn, stagger } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import type { Recipe } from '@/types/nutrition'
import { EmptyResults } from './components/EmptyResults'
import { FeaturedCarousel } from './components/FeaturedCarousel'
import { FitsYourDay } from './components/FitsYourDay'
import { RecipeGrid } from './components/RecipeGrid'
import { RefineSheet } from './components/RefineSheet'
import { SearchField } from './components/SearchField'
import { applyRefinement, defaultRefinement, isRefined, sortOptions } from './lib/refine'

type ListFilter = RecipeFilter | 'Saved'

const featuredPicks: { id: string; kicker: string }[] = [
  { id: 'lemon-herb-salmon', kicker: 'Editor’s pick' },
  { id: 'weeknight-thai-curry', kicker: 'Weeknight hero' },
  { id: 'rainbow-buddha-bowl', kicker: 'Plant-powered' },
  { id: 'garlic-shrimp-spaghetti', kicker: 'Family favourite' },
]

const featured = featuredPicks.flatMap(({ id, kicker }) => {
  const recipe = getRecipe(id)
  return recipe ? [{ recipe, kicker }] : []
})

function useResults(filter: ListFilter, query: string, savedIds: string[], refine: typeof defaultRefinement): Recipe[] {
  return useMemo(() => {
    const base =
      filter === 'Saved'
        ? filterRecipes('For you', query).filter((r) => savedIds.includes(r.id))
        : filterRecipes(filter, query)
    return applyRefinement(base, refine)
  }, [filter, query, savedIds, refine])
}

export function RecipesScreen() {
  const [filter, setFilter] = useState<ListFilter>('For you')
  const [query, setQuery] = useState('')
  const [refine, setRefine] = useState(defaultRefinement)
  const [refineOpen, setRefineOpen] = useState(false)
  const savedIds = useAppStore((s) => s.savedRecipeIds)

  const deferredQuery = useDeferredValue(query)
  const results = useResults(filter, deferredQuery, savedIds, refine)
  const trimmed = deferredQuery.trim()
  const refined = isRefined(refine)
  // Editorial sections only when browsing; any narrowing jumps straight to results.
  const browsing = filter === 'For you' && !trimmed && !refined

  const reset = () => {
    setFilter('For you')
    setQuery('')
    setRefine(defaultRefinement)
  }

  const gridTitle = trimmed ? 'Results' : filter === 'For you' ? 'All recipes' : filter
  const sortLabel = refine.sort !== 'recommended' ? sortOptions.find((o) => o.value === refine.sort)?.label : undefined
  const gridEyebrow = [pluralize(results.length, 'recipe'), sortLabel].filter(Boolean).join(' · ')

  return (
    <Screen withTabBar>
      <header className="px-5 pt-safe">
        <motion.div variants={stagger} initial="hidden" animate="show" className="pt-4">
          <motion.p variants={riseIn} className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
            Discover
          </motion.p>
          <motion.h1 variants={riseIn} className="mt-1 font-display text-[34px] leading-[1.05] font-medium">
            What sounds <em className="font-normal text-brand italic">good?</em>
          </motion.h1>
        </motion.div>

        <div className="mt-5 flex items-center gap-2.5">
          <SearchField value={query} onChange={setQuery} />
          <IconButton size="lg" label="Sort and filter" badge={refined} onClick={() => setRefineOpen(true)}>
            <SlidersHorizontal strokeWidth={2.2} />
          </IconButton>
        </div>
      </header>

      <div
        role="group"
        aria-label="Recipe filters"
        className="no-scrollbar mt-4 flex items-center gap-2 overflow-x-auto overscroll-x-contain px-5 py-1"
      >
        <Chip
          selected={filter === 'Saved'}
          onClick={() => setFilter(filter === 'Saved' ? 'For you' : 'Saved')}
          icon={<Heart className={cn('size-3.5', savedIds.length > 0 && 'fill-current')} strokeWidth={2.4} />}
        >
          Saved
          <span className={cn('tabular', filter === 'Saved' ? 'text-canvas/60' : 'text-ink-3')}>{savedIds.length}</span>
        </Chip>
        <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-line" />
        {recipeFilters.map((f) => (
          <Chip key={f} selected={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
        <span aria-hidden className="w-3 shrink-0" />
      </div>

      <AnimatePresence initial={false}>
        {browsing && (
          <motion.div
            key="browse"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="overflow-hidden"
          >
            <section className="mt-6">
              <SectionHeader className="px-5" eyebrow="This week" title="Editor’s picks" />
              <div className="mt-1">
                <FeaturedCarousel recipes={featured} />
              </div>
            </section>
            <FitsYourDay recipes={recipes} />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="mt-7 px-5">
        <SectionHeader eyebrow={gridEyebrow} title={gridTitle} />
        <div className="mt-4">
          {results.length > 0 ? (
            <RecipeGrid recipes={results} />
          ) : (
            <EmptyResults
              key={filter === 'Saved' ? 'saved' : 'search'}
              kind={filter === 'Saved' && !trimmed ? 'saved' : 'search'}
              query={trimmed}
              onReset={reset}
            />
          )}
        </div>
      </section>

      <RefineSheet
        open={refineOpen}
        onClose={() => setRefineOpen(false)}
        value={refine}
        onChange={setRefine}
        resultCount={results.length}
      />
    </Screen>
  )
}
