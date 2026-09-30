import { Leaf } from 'lucide-react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/cn'
import { easeOutExpo } from '@/lib/motion'
import { type ScoreBand, scoreBand } from '@/lib/nutrition'
import type { Food } from '@/types/nutrition'

const toneColor: Record<ScoreBand['tone'], string> = {
  excellent: 'var(--nr-fiber)',
  good: 'var(--nr-brand)',
  fair: 'var(--nr-carbs)',
  limit: 'var(--nr-protein)',
}

/** Bands as fractions of the 0–100 arc, drawn as a faint legend under the fill. */
const bands: { from: number; to: number; tone: ScoreBand['tone'] }[] = [
  { from: 0, to: 0.5, tone: 'limit' },
  { from: 0.5, to: 0.7, tone: 'fair' },
  { from: 0.7, to: 0.85, tone: 'good' },
  { from: 0.85, to: 1, tone: 'excellent' },
]

const W = 172
const STROKE = 12
const R = (W - STROKE) / 2 - 4
const CX = W / 2
const CY = R + STROKE / 2 + 4
const H = CY + 6

function point(t: number) {
  return { x: CX - R * Math.cos(Math.PI * t), y: CY - R * Math.sin(Math.PI * t) }
}

function arc(t0: number, t1: number) {
  const a = point(t0)
  const b = point(t1)
  return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`
}

function ScoreGauge({ score }: { score: number }) {
  const band = scoreBand(score)
  const color = toneColor[band.tone]
  const t = useMotionValue(0)
  const knobX = useTransform(t, (v) => point(v).x)
  const knobY = useTransform(t, (v) => point(v).y)

  useEffect(() => {
    const c = animate(t, score / 100, { duration: 1.3, delay: 0.2, ease: easeOutExpo })
    return () => c.stop()
  }, [t, score])

  return (
    <div className="relative shrink-0" style={{ width: W, height: H }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        {bands.map((b) => (
          <path
            key={b.tone}
            d={arc(b.from + 0.008, b.to - 0.008)}
            fill="none"
            stroke={toneColor[b.tone]}
            strokeOpacity={0.18}
            strokeWidth={STROKE}
          />
        ))}
        <motion.path
          d={arc(0, 1)}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: score / 100 }}
          transition={{ duration: 1.3, delay: 0.2, ease: easeOutExpo }}
        />
        <motion.circle cx={knobX} cy={knobY} r={9} fill="var(--nr-surface)" stroke={color} strokeWidth={3.5} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <p className="font-display text-[40px] leading-none font-medium tabular">{score}</p>
        <p className="mt-1 text-[10.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">of 100</p>
      </div>
    </div>
  )
}

interface Factor {
  label: string
  positive: boolean
}

/** Plain-language reasons behind the score, derived from the nutrition data. */
function scoreFactors(food: Food): Factor[] {
  const n = food.nutrients
  const out: Factor[] = []
  if (n.protein >= 20) out.push({ label: 'Protein-rich', positive: true })
  if (n.fiber >= 5) out.push({ label: 'High fiber', positive: true })
  if ((food.micros.omega3 ?? 0) >= 50) out.push({ label: 'Omega-3', positive: true })
  if (food.tags.includes('Whole food')) out.push({ label: 'Whole food', positive: true })
  if (n.sodium >= 800) out.push({ label: 'Mind the sodium', positive: false })
  if (n.satFat >= 6) out.push({ label: 'Rich in sat fat', positive: false })
  if (n.sugar >= 20) out.push({ label: 'On the sweet side', positive: false })
  return out.slice(0, 4)
}

export function ScoreCard({ food }: { food: Food }) {
  const band = scoreBand(food.score)
  const factors = scoreFactors(food)

  return (
    <Card>
      <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Nourish Score</p>
      <div className="mt-3 flex items-center gap-4">
        <ScoreGauge score={food.score} />
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-display text-[22px] leading-tight font-medium">
            <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: toneColor[band.tone] }} />
            {band.label}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{band.blurb}</p>
        </div>
      </div>
      {factors.length > 0 && (
        <ul aria-label="What shapes this score" className="mt-4 flex flex-wrap gap-1.5">
          {factors.map((f) => (
            <li
              key={f.label}
              className={cn(
                'inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-semibold',
                f.positive ? 'bg-brand-soft text-ink' : 'bg-surface-2 text-ink-2',
              )}
            >
              {f.positive ? (
                <Leaf aria-hidden className="size-3.5 text-brand" strokeWidth={2.4} />
              ) : (
                <span aria-hidden className="size-1.5 rounded-full bg-ember" />
              )}
              {f.label}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
