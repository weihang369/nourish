import { Soup } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { Screen, TopBar } from '@/components/layout'
import { Button } from '@/components/ui'
import { riseIn, stagger } from '@/lib/motion'
import { useStatusTone } from '@/store/useChromeStore'

export function RecipeNotFound() {
  const navigate = useNavigate()
  useStatusTone('dark')
  return (
    <Screen>
      <TopBar fallback="/recipes" />
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center px-10 pt-24 text-center"
      >
        <motion.div variants={riseIn} className="relative grid size-28 place-items-center">
          <span className="absolute inset-0 rounded-full bg-brand-soft" />
          <span className="absolute inset-4 rounded-full bg-surface shadow-card" />
          <Soup className="relative size-9 text-brand" strokeWidth={1.7} />
        </motion.div>
        <motion.p variants={riseIn} className="mt-7 text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
          Recipe not found
        </motion.p>
        <motion.h1 variants={riseIn} className="mt-2 font-display text-[28px] leading-tight font-medium">
          This one’s off the menu
        </motion.h1>
        <motion.p variants={riseIn} className="mt-2.5 max-w-[270px] text-[15px] leading-relaxed text-ink-2">
          The link may be old, or the recipe was retired. There’s plenty more worth cooking.
        </motion.p>
        <motion.div variants={riseIn} className="mt-7">
          <Button onClick={() => navigate('/recipes', { replace: true })}>Browse recipes</Button>
        </motion.div>
      </motion.div>
    </Screen>
  )
}
