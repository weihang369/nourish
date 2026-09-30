import { useEffect, useRef } from 'react'
import { Chip } from '@/components/ui'
import { meals } from '@/data/diary'
import { cn } from '@/lib/cn'
import type { MealType } from '@/types/nutrition'

interface MealSwitcherProps {
  value: MealType
  onChange: (meal: MealType) => void
  size?: 'sm' | 'md'
  className?: string
}

/** Horizontal meal chips; keeps the selected one in view when space is tight. */
export function MealSwitcher({ value, onChange, size = 'md', className }: MealSwitcherProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const row = ref.current
    const chip = row?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!row || !chip) return
    const overflowRight = chip.offsetLeft + chip.offsetWidth - (row.scrollLeft + row.clientWidth)
    const overflowLeft = row.scrollLeft - chip.offsetLeft
    if (overflowRight > 0) row.scrollBy({ left: overflowRight + 20, behavior: 'smooth' })
    else if (overflowLeft > 0) row.scrollBy({ left: -overflowLeft - 20, behavior: 'smooth' })
  }, [value])

  return (
    <div ref={ref} role="group" aria-label="Meal" className={cn('no-scrollbar flex gap-2 overflow-x-auto', className)}>
      {meals.map((m) => (
        <Chip key={m.type} size={size} selected={m.type === value} onClick={() => onChange(m.type)}>
          {m.type === 'snack' ? 'Snack' : m.label}
        </Chip>
      ))}
    </div>
  )
}
