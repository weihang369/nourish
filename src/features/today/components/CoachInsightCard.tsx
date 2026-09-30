import { ArrowUpRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router'
import { ProgressRing } from '@/components/charts'
import { Button, Card } from '@/components/ui'
import { useDiary } from '@/hooks/useDiary'
import { formatInt } from '@/lib/format'
import { riseIn } from '@/lib/motion'

/** A single, specific nudge computed from today's numbers. */
function useProteinInsight() {
  const { total, goals } = useDiary()
  const eaten = total.protein
  const gap = Math.round(goals.protein - eaten)
  const share = goals.protein > 0 ? eaten / goals.protein : 0

  if (gap <= 0) {
    return {
      share,
      title: 'Protein goal reached',
      body: 'Nicely done. Round out the day with colourful veg for fibre and micronutrients.',
    }
  }
  return {
    share,
    title: `You're ${formatInt(gap)} g short on protein`,
    body:
      gap > 40
        ? 'Make dinner the anchor: a 150 g salmon fillet adds ~34 g, and Greek yogurt later closes the rest.'
        : 'A Greek yogurt or two boiled eggs this evening would close the gap comfortably.',
  }
}

export function CoachInsightCard() {
  const navigate = useNavigate()
  const insight = useProteinInsight()

  return (
    <Card variants={riseIn} tone="deep" className="mt-8 overflow-hidden grain">
      <div aria-hidden className="pointer-events-none absolute -top-16 -right-12 size-48 rounded-full bg-lime/25 blur-3xl" />

      <div className="relative flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-lime uppercase">
            <Sparkles className="size-3.5" strokeWidth={2.4} />
            Coach insight
          </p>
          <h3 className="mt-2.5 font-display text-[22px] leading-[1.15] font-medium">{insight.title}</h3>
        </div>
        <ProgressRing
          value={insight.share}
          size={58}
          stroke={5}
          color="var(--nr-lime)"
          trackColor="rgb(255 255 255 / 0.12)"
          delay={0.4}
          label={`Protein ${Math.round(insight.share * 100)}% of goal`}
        >
          <span className="text-[13px] font-semibold tabular">{Math.round(insight.share * 100)}%</span>
        </ProgressRing>
      </div>

      <p className="relative mt-2 text-[14px] leading-relaxed text-on-deep/75">{insight.body}</p>

      <Button
        variant="lime"
        size="sm"
        className="relative mt-5 h-10"
        onClick={() => navigate('/coach')}
        trailing={<ArrowUpRight className="size-4" strokeWidth={2.4} />}
      >
        Ask Nourish Coach
      </Button>
    </Card>
  )
}
