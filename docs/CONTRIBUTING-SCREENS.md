# Building screens in Nourish

The rules every feature screen follows. The foundations (tokens, primitives, charts, layout, data, store) are already in place, so compose them instead of re-inventing them.

## Stack (pinned, current majors)

| Concern | Library | Import from |
|---|---|---|
| UI | React 19 | `react` (ref is a normal prop, no `forwardRef`) |
| Routing | React Router 8 | `react-router` (`useNavigate`, `useParams`, `useSearchParams`, `useLocation`) |
| Motion | Motion 13 | `motion/react` (`motion`, `AnimatePresence`, `useScroll`, `useTransform`…) |
| Styling | Tailwind CSS v4 (CSS-first, tokens in `src/styles/index.css`) | classes |
| Icons | lucide-react 1.x | `lucide-react` |
| State | zustand 5 | `@/store/useAppStore` |

TypeScript is strict with `verbatimModuleSyntax`, so use `import type` for type-only imports. Use named exports only. Use `@/` path aliases. Do not add dependencies.

## Design direction: “calm, editorial, warm”

- **Canvas:** warm paper (`bg-canvas`). Cards are `bg-surface` with `shadow-card ring-1 ring-inset ring-line`, radius **28px** (`rounded-[28px]`). Use `rounded-[22px]` for inner or smaller tiles.
- **Type:** `font-display` (Fraunces serif) for screen titles, hero numbers and card titles, usually `font-medium`. Everything else is Inter. Use `tabular` on changing numbers. Eyebrows are `text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-3`.
- **Ink:** `text-ink` for primary text, `text-ink-2` for secondary, `text-ink-3` for tertiary and captions.
- **Brand:** `bg-brand text-brand-ink` is the primary CTA (forest in light, soft lime-green in dark). `bg-deep text-on-deep` is for rich feature cards. `bg-lime` is the energetic highlight (text on lime is always `text-[#14201a]`). `ember` is for streaks and calories-burned accents. `water` is for hydration.
- **Macros:** `protein`, `carbs`, `fat`, `fiber` (bg-, text-, fill-, ring-, `/15` opacity all work). These are validated for colour-blind separation. A macro colour **always** appears with a text label, and text never wears the macro colour except tiny figures next to a dot.
- **Spacing:** screen gutter `px-5`, section rhythm `mt-7`/`mt-8`, card padding `p-5`. The phone is 390px wide, so design for it.
- **Dark mode:** automatic through tokens. Never hard-code light-only colours, except white text or overlays on photos and `#0f1411`-style black tooltips.
- **Motion:** entrance uses `variants={stagger}` on a container and `variants={riseIn}` on children (`@/lib/motion`). Taps use `whileTap={{ scale: 0.97 }}`. Springs come from `spring.snappy|smooth|gentle|bouncy`. Avoid gratuitous motion; every animation should explain a change.
- **Voice:** guidance, not judgment. Say “Enjoy mindfully”, never “bad”. Copy is short, warm and specific, with real numbers.

## Screen anatomy

```tsx
export function ThingScreen() {
  return (
    <Screen withTabBar /* tab screens only */>
      <header className="px-5 pt-safe"> … </header>
      …
    </Screen>
  )
}
```

- `Screen` is the route's scroll container. Top content must clear the status bar with `pt-safe`.
- Pushed (non-tab) screens start with `<TopBar title fallback="/parent" />`, which is sticky and has a back button with a history-aware fallback. Over a hero photo, use `<TopBar overlay scrolled={scrolled} />` with `const scrolled = useScrolled(scrollRef, 200)`, and set the status-bar ink with `useStatusTone(scrolled ? 'dark' : 'light')` from `@/store/useChromeStore`.
- For a sticky bottom CTA, wrap as `<div className="relative h-full"> <Screen className="pb-40">…</Screen> <div className="absolute inset-x-0 bottom-0 z-20 px-5 pt-3 pb-safe bg-linear-to-t from-canvas via-canvas to-transparent">…</div></div>`.
- Sheets use `<Sheet open onClose title>` from `@/components/ui`. It portals into the phone.
- Toasts: `useAppStore.getState().showToast('Added to dinner', 'check' | 'water' | 'heart' | 'sparkle' | 'trash', { label, onClick }?)`.

## Building blocks

- `@/components/ui`: Button (primary, secondary, ghost, deep, lime, outline, glass; sizes sm, md, lg; `leading`, `trailing`, `block`), IconButton (`label` required), Card (tone surface, deep, soft, brand-soft; `interactive`), Chip / Tag, SegmentedControl, Sheet, Stepper, AnimatedNumber, ProgressBar, SectionHeader, Avatar.
- `@/components/food`: FoodImage (`photo`, `emoji`, `alt`, `width`, shimmer and emoji fallback), ScoreBadge, MacroLine.
- `@/components/charts`: ProgressRing, MacroDonut, CalorieBarChart, WeightLineChart, AdherenceHeatmap, MacroSplitBars, ChartTooltip.
- `@/components/layout`: Screen, TopBar, useBack.
- `@/hooks`: useDiary (today's totals, byMeal, remaining, budget, burned, goals), useScrolled, useElementWidth, useMediaQuery.
- `@/lib`: cn, format (formatInt, formatGrams, formatOneDp, formatServings, formatLiters), nutrition (scaleNutrients, sumEntries, macroEnergySplit, macroMeta, macroKeys, microMeta, scoreBand), date, motion.
- `@/data`: foods (getFood, recentFoodIds, favoriteFoodIds, savedMeals), recipes (getRecipe, filterRecipes, recipeFilters), diary (meals meta, mealLabel, suggestMealForNow), user (user, activity, achievements, connectedApps), insights, coach, photos (photoUrl).
- `@/services/mockApi`: analyzeMealPhoto, searchFoods, askCoach. These are async with realistic latency, so design the loading states.

## Routes

`/welcome` · `/` (Today) · `/log?meal=dinner` · `/food/:foodId?meal=…` · `/scan?mode=meal|barcode` · `/recipes` · `/recipes/:recipeId` · `/insights` · `/coach` · `/profile`

## Definition of done

1. `npx tsc -b` reports no errors.
2. `npx vite build` succeeds.
3. Every interactive element has an accessible name. Tap targets are at least 40px.
4. The screen works in both themes and at 390px wide, with no horizontal overflow.
