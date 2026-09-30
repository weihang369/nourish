import { Droplet, Plus } from 'lucide-react'
import { AnimatedNumber, Button, Card } from '@/components/ui'
import { formatLiters } from '@/lib/format'
import { riseIn } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import { WaterGlass } from './WaterGlass'

export const GLASS_ML = 250

const liters = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })

/** One glass per 250 ml of the daily goal (8–12 glasses). */
function glassCount(goalMl: number) {
  return Math.max(8, Math.min(12, Math.round(goalMl / GLASS_ML)))
}

export function HydrationCard() {
  const waterMl = useAppStore((s) => s.waterMl)
  const goalMl = useAppStore((s) => s.goals.waterMl)
  const addWater = useAppStore((s) => s.addWater)
  const count = glassCount(goalMl)
  const glassesLeft = Math.max(0, Math.ceil((goalMl - waterMl) / GLASS_ML))

  const logGlass = () => {
    addWater(GLASS_ML)
    useAppStore.getState().showToast('Water logged', 'water')
  }

  /** Tap a glass to fill up to it; tap the top full glass again to pour it back. */
  const tapGlass = (index: number) => {
    const upTo = (index + 1) * GLASS_ML
    const target = waterMl >= upTo && waterMl < upTo + GLASS_ML ? index * GLASS_ML : upTo
    addWater(target - waterMl)
  }

  return (
    <Card variants={riseIn} className="mt-3 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-20 size-56 rounded-full bg-water/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-[16px] bg-water/12 text-water">
            <Droplet className="size-5 fill-current" strokeWidth={2} />
          </span>
          <div>
            <h3 className="font-display text-[19px] leading-tight font-medium">Hydration</h3>
            <p className="mt-0.5 text-[13px] text-ink-2">
              <AnimatedNumber
                value={waterMl / 1000}
                format={(v) => liters.format(v)}
                className="font-semibold text-ink"
              />
              <span className="font-semibold text-ink"> L</span> of {formatLiters(goalMl)}
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="h-10"
          onClick={logGlass}
          leading={<Plus className="size-4" strokeWidth={2.6} />}
          aria-label="Add 250 ml of water"
        >
          250 ml
        </Button>
      </div>

      <div className="relative mt-4 flex justify-between gap-0.5" role="group" aria-label="Glasses of water">
        {Array.from({ length: count }, (_, i) => (
          <WaterGlass
            key={i}
            fill={(waterMl - i * GLASS_ML) / GLASS_ML}
            label={`Glass ${i + 1}, ${(i + 1) * GLASS_ML} ml`}
            onClick={() => tapGlass(i)}
          />
        ))}
      </div>

      <p className="relative mt-2 text-[12.5px] text-ink-3">
        {glassesLeft === 0
          ? 'Goal reached — beautifully hydrated today.'
          : `${glassesLeft} more ${glassesLeft === 1 ? 'glass' : 'glasses'} to reach your goal. A glass before dinner helps.`}
      </p>
    </Card>
  )
}
