import { motion } from 'motion/react'
import { Screen } from '@/components/layout'
import { stagger } from '@/lib/motion'
import { ActivityCard } from './components/ActivityCard'
import { CalorieHero } from './components/CalorieHero'
import { CoachInsightCard } from './components/CoachInsightCard'
import { HydrationCard } from './components/HydrationCard'
import { MacroCards } from './components/MacroCards'
import { MealsSection } from './components/MealsSection'
import { TodayHeader } from './components/TodayHeader'
import { WeekStrip } from './components/WeekStrip'

export function TodayScreen() {
  return (
    <Screen withTabBar>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <TodayHeader />
        <WeekStrip />

        <motion.div variants={stagger} className="mt-4 px-5">
          <CalorieHero />
        </motion.div>
        <MacroCards />

        <motion.div variants={stagger} className="px-5">
          <HydrationCard />
        </motion.div>

        <MealsSection />

        <motion.div variants={stagger} className="px-5">
          <CoachInsightCard />
          <ActivityCard />
        </motion.div>
      </motion.div>
    </Screen>
  )
}
