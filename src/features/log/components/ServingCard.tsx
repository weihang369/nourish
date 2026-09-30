import { Card, Chip, Stepper } from '@/components/ui'
import { formatGrams, formatInt, formatServings } from '@/lib/format'
import type { Food, MealType } from '@/types/nutrition'
import { MealSwitcher } from './MealSwitcher'

export type ServingUnit = 'serving' | 'grams'

interface ServingCardProps {
  food: Food
  servings: number
  unit: ServingUnit
  meal: MealType
  onServingsChange: (servings: number) => void
  onUnitChange: (unit: ServingUnit) => void
  onMealChange: (meal: MealType) => void
}

/** Gram step that feels natural for the portion size (a tbsp vs. a bowl). */
export function gramStep(servingGrams: number) {
  if (servingGrams < 40) return 2
  if (servingGrams < 150) return 5
  return 10
}

export function ServingCard({ food, servings, unit, meal, onServingsChange, onUnitChange, onMealChange }: ServingCardProps) {
  const perServing = food.serving.grams
  const grams = servings * perServing
  const step = gramStep(perServing)

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Portion</p>
        <div role="group" aria-label="Unit" className="flex gap-1.5">
          <Chip size="sm" selected={unit === 'serving'} onClick={() => onUnitChange('serving')}>
            {food.serving.label}
          </Chip>
          <Chip size="sm" selected={unit === 'grams'} onClick={() => onUnitChange('grams')}>
            Grams
          </Chip>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold">{unit === 'serving' ? 'Servings' : 'Weight'}</p>
          <p className="mt-0.5 text-[12.5px] text-ink-3 tabular">
            {unit === 'serving'
              ? `${formatGrams(grams)} g in total`
              : `≈ ${formatServings(Math.round(servings * 4) / 4 || 0.25)} × ${food.serving.label}`}
          </p>
        </div>
        {unit === 'serving' ? (
          <Stepper
            value={servings}
            onChange={onServingsChange}
            min={0.25}
            max={10}
            step={0.25}
            format={formatServings}
          />
        ) : (
          <Stepper
            value={Math.round(grams)}
            onChange={(g) => onServingsChange(g / perServing)}
            min={step}
            max={Math.max(perServing * 6, 200)}
            step={step}
            format={(v) => `${formatInt(v)}g`}
          />
        )}
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <p className="mb-2.5 text-[12.5px] font-medium text-ink-2">Log to</p>
        <MealSwitcher value={meal} onChange={onMealChange} size="sm" className="-mx-5 px-5" />
      </div>
    </Card>
  )
}
