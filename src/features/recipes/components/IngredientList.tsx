import { ShoppingBasket } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Button, Stepper } from '@/components/ui'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import type { Ingredient } from '@/types/nutrition'
import { scaleIngredient } from '../lib/fractions'

function CheckCircle({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        'grid size-6 shrink-0 place-items-center rounded-full transition-colors duration-300',
        checked ? 'bg-brand text-brand-ink' : 'ring-[1.5px] ring-ink/20 ring-inset',
      )}
    >
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </span>
  )
}

interface IngredientRowProps {
  ingredient: Ingredient
  factor: number
  checked: boolean
  onToggle: () => void
}

function IngredientRow({ ingredient, factor, checked, onToggle }: IngredientRowProps) {
  const amount = scaleIngredient(ingredient, factor)
  return (
    <li>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={`${amount.label} ${ingredient.name}`}
        onClick={onToggle}
        className="flex min-h-14 w-full items-center gap-3.5 py-3 text-left"
      >
        <CheckCircle checked={checked} />
        <span className="min-w-0 flex-1">
          {/* Background-drawn strike so the line "writes" across, even over two lines */}
          <span
            className={cn('text-[15px] font-medium transition-colors duration-300', checked ? 'text-ink-3' : 'text-ink')}
            style={{
              backgroundImage: 'linear-gradient(currentColor, currentColor)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0 58%',
              backgroundSize: checked ? '100% 1.5px' : '0% 1.5px',
              transition: 'background-size 0.45s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s',
            }}
          >
            {ingredient.name}
          </span>
          {ingredient.note && <span className="mt-0.5 block text-[12px] text-ink-3">{ingredient.note}</span>}
        </span>
        <span className="relative shrink-0 overflow-hidden text-right">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={amount.label}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={spring.snappy}
              className={cn('block text-[14px] whitespace-nowrap tabular transition-colors', checked ? 'text-ink-3' : 'text-ink')}
            >
              <span className="font-semibold">{amount.qty}</span> <span className="text-ink-3">{amount.unit}</span>
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    </li>
  )
}

interface IngredientListProps {
  ingredients: Ingredient[]
  baseServings: number
  servings: number
  onServingsChange: (value: number) => void
  checked: Set<number>
  onToggle: (index: number) => void
}

/** Servings scale amounts live; ticking an item means "I already have this". */
export function IngredientList({ ingredients, baseServings, servings, onServingsChange, checked, onToggle }: IngredientListProps) {
  const factor = servings / baseServings
  const missing = ingredients.length - checked.size

  const addToList = () =>
    useAppStore
      .getState()
      .showToast(`${missing} ${missing === 1 ? 'item' : 'items'} added to your list`, 'check')

  return (
    <div>
      <div className="flex items-center justify-between gap-4 rounded-[22px] bg-surface py-2 pr-2 pl-4 shadow-card ring-1 ring-line ring-inset">
        <div>
          <p className="text-[14px] font-semibold text-ink">Servings</p>
          <p className="text-[12px] text-ink-3">Amounts scale as you go</p>
        </div>
        <Stepper value={servings} onChange={onServingsChange} min={1} max={12} />
      </div>

      <div className="mt-5 flex items-baseline justify-between">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
          {ingredients.length} ingredients
        </p>
        <p className="text-[12px] text-ink-3 tabular">
          {checked.size > 0 ? `${checked.size} of ${ingredients.length} in your kitchen` : 'Tick what you already have'}
        </p>
      </div>

      <ul className="mt-1 divide-y divide-line">
        {ingredients.map((ingredient, i) => (
          <IngredientRow
            key={ingredient.name}
            ingredient={ingredient}
            factor={factor}
            checked={checked.has(i)}
            onToggle={() => onToggle(i)}
          />
        ))}
      </ul>

      <Button
        variant="secondary"
        block
        className="mt-4"
        disabled={missing === 0}
        onClick={addToList}
        leading={<ShoppingBasket className="size-[18px]" strokeWidth={2.2} />}
      >
        {missing === 0 ? 'You have everything' : `Add ${missing} to shopping list`}
      </Button>
    </div>
  )
}
