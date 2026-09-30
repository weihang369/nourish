import { Flame } from 'lucide-react'
import type { ReactNode } from 'react'
import { AnimatedNumber } from '@/components/ui'
import { user } from '@/data/user'
import { formatOneDp } from '@/lib/format'
import { useAppStore } from '@/store/useAppStore'

export function ProfileStats() {
  const goals = useAppStore((s) => s.goals)
  const lost = Math.max(0, goals.startWeightKg - goals.currentWeightKg)

  return (
    <div className="grid grid-cols-3 divide-x divide-line rounded-[28px] bg-surface py-4 shadow-card ring-1 ring-line ring-inset">
      <Stat label="Day streak" icon={<Flame className="size-4 fill-ember/25 text-ember" aria-hidden />}>
        <AnimatedNumber value={user.streakDays} />
      </Stat>
      <Stat label="Days logged">
        <AnimatedNumber value={user.daysLogged} />
      </Stat>
      <Stat label="Kg lost">
        <AnimatedNumber value={lost} format={formatOneDp} />
      </Stat>
    </div>
  )
}

function Stat({ label, icon, children }: { label: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-2 text-center">
      <p className="flex items-center gap-1 font-display text-[26px] leading-none font-medium">
        {icon}
        {children}
      </p>
      <p className="mt-1.5 text-[11.5px] font-medium text-ink-3">{label}</p>
    </div>
  )
}
