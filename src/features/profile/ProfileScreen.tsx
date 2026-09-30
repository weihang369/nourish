import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { LogoMark } from '@/components/brand/Logo'
import { Screen } from '@/components/layout'
import { user } from '@/data/user'
import { riseIn, stagger } from '@/lib/motion'
import { AchievementsRail } from './components/AchievementsRail'
import { EditGoalsSheet } from './components/EditGoalsSheet'
import { GoalsCard } from './components/GoalsCard'
import { ProfileHeader } from './components/ProfileHeader'
import { ProfileStats } from './components/ProfileStats'
import { SettingsList } from './components/SettingsList'

export function ProfileScreen() {
  const [editing, setEditing] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  return (
    <Screen withTabBar>
      <ProfileHeader onOpenSettings={() => settingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />

      <motion.div variants={stagger} initial="hidden" animate="show" className="mt-6 space-y-4 px-5">
        <motion.div variants={riseIn}>
          <ProfileStats />
        </motion.div>
        <motion.div variants={riseIn}>
          <GoalsCard onEdit={() => setEditing(true)} />
        </motion.div>
      </motion.div>

      <div className="mt-8">
        <AchievementsRail />
      </div>

      <div ref={settingsRef} className="mt-6 scroll-mt-4 px-5">
        <h2 className="mb-4 font-display text-[22px] leading-tight font-medium">Settings</h2>
        <SettingsList />
      </div>

      <footer className="mt-10 flex flex-col items-center gap-2 pb-2 text-center">
        <LogoMark size={28} />
        <p className="text-[12px] font-medium text-ink-3">Nourish 0.1 · Made with care</p>
        <p className="text-[11px] text-ink-3/80">Member since {user.memberSince}</p>
      </footer>

      <EditGoalsSheet open={editing} onClose={() => setEditing(false)} />
    </Screen>
  )
}
