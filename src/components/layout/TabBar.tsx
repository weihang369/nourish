import { ChartNoAxesColumn, ChefHat, House, Plus, UserRound } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useNavigate } from 'react-router'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'

export const tabs = [
  { path: '/', label: 'Today', icon: House },
  { path: '/recipes', label: 'Recipes', icon: ChefHat },
  { path: '/insights', label: 'Insights', icon: ChartNoAxesColumn },
  { path: '/profile', label: 'Profile', icon: UserRound },
] as const

export const tabPaths: string[] = tabs.map((t) => t.path)

function TabButton({ tab, active }: { tab: (typeof tabs)[number]; active: boolean }) {
  const navigate = useNavigate()
  const Icon = tab.icon
  return (
    <button
      type="button"
      onClick={() => !active && navigate(tab.path)}
      aria-current={active ? 'page' : undefined}
      className="relative flex h-full flex-1 flex-col items-center justify-center gap-1"
    >
      {active && (
        <motion.span
          layoutId="tab-indicator"
          transition={spring.snappy}
          className="absolute top-[9px] h-8 w-12 rounded-full bg-ink/[0.07] dark:bg-white/[0.08]"
        />
      )}
      <motion.span animate={{ y: active ? 1 : 0, scale: active ? 1.05 : 1 }} transition={spring.snappy}>
        <Icon
          className={cn('size-[22px] transition-colors', active ? 'text-ink' : 'text-ink-3')}
          strokeWidth={active ? 2.3 : 1.9}
        />
      </motion.span>
      <span className={cn('text-[10.5px] font-semibold transition-colors', active ? 'text-ink' : 'text-ink-3')}>
        {tab.label}
      </span>
    </button>
  )
}

export function TabBar() {
  const { pathname } = useLocation()
  const quickAddOpen = useAppStore((s) => s.quickAddOpen)
  const setQuickAddOpen = useAppStore((s) => s.setQuickAddOpen)
  const visible = tabPaths.includes(pathname)

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Primary"
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={spring.smooth}
          className="absolute inset-x-0 bottom-0 z-40 px-4 pb-[max(10px,calc(var(--sab)-10px))]"
        >
          {/* Fade content out beneath the bar */}
          <div className="pointer-events-none absolute inset-x-0 -top-10 bottom-0 bg-linear-to-t from-canvas via-canvas/85 to-transparent" />
          <div className="glass relative flex h-[68px] items-center rounded-[26px] px-1 shadow-float ring-1 ring-line">
            <TabButton tab={tabs[0]} active={pathname === tabs[0].path} />
            <TabButton tab={tabs[1]} active={pathname === tabs[1].path} />
            <div className="flex w-[76px] justify-center">
              <motion.button
                type="button"
                aria-label={quickAddOpen ? 'Close quick add' : 'Quick add'}
                aria-expanded={quickAddOpen}
                onClick={() => setQuickAddOpen(!quickAddOpen)}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: quickAddOpen ? 45 : 0 }}
                transition={spring.bouncy}
                className="-mt-7 grid size-[60px] place-items-center rounded-[22px] bg-brand text-brand-ink shadow-glow ring-4 ring-canvas"
              >
                <Plus className="size-7" strokeWidth={2.4} />
              </motion.button>
            </div>
            <TabButton tab={tabs[2]} active={pathname === tabs[2].path} />
            <TabButton tab={tabs[3]} active={pathname === tabs[3].path} />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
