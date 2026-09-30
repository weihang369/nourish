import { ArrowUpRight, Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { useLocation, useNavigate } from 'react-router'
import { Logo } from '@/components/brand/Logo'
import { cn } from '@/lib/cn'
import { spring } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'

const screens = [
  { label: 'Welcome & onboarding', path: '/welcome' },
  { label: 'Today', path: '/' },
  { label: 'Log food', path: '/log' },
  { label: 'Food detail', path: '/food/salmon-poke-bowl' },
  { label: 'Snap a meal (AI)', path: '/scan' },
  { label: 'Recipes', path: '/recipes' },
  { label: 'Recipe detail', path: '/recipes/lemon-herb-salmon' },
  { label: 'Insights', path: '/insights' },
  { label: 'Nourish Coach', path: '/coach' },
  { label: 'Profile', path: '/profile' },
]

function isActive(path: string, pathname: string) {
  if (path === '/') return pathname === '/'
  if (path.startsWith('/food/')) return pathname.startsWith('/food/')
  if (path.startsWith('/recipes/')) return pathname.startsWith('/recipes/')
  return pathname === path
}

/** Left rail on desktop: brand, story and a jump-list for reviewers. */
export function PresenterPanel() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  return (
    <aside className="relative z-10 hidden w-[300px] shrink-0 flex-col lg:flex">
      <Logo />
      <p className="mt-10 text-[11px] font-semibold tracking-[0.18em] text-ink-3 uppercase">Mobile prototype · v0.1</p>
      <h1 className="mt-3 font-display text-[46px] leading-[1.02] font-medium">
        Eat with <em className="font-normal text-brand">intention.</em>
      </h1>
      <p className="mt-4 max-w-[280px] text-[14px] leading-relaxed text-ink-2">
        A calm, guidance-first nutrition tracker. Every screen is interactive and runs on mock data.
      </p>

      <nav aria-label="Screens" className="mt-8">
        <p className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-ink-3 uppercase">Jump to screen</p>
        <ul className="space-y-0.5">
          {screens.map((s, i) => {
            const active = isActive(s.path, pathname)
            return (
              <li key={s.path}>
                <button
                  type="button"
                  onClick={() => navigate(s.path)}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[13.5px] font-medium transition-colors',
                    active ? 'text-ink' : 'text-ink-2 hover:text-ink',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="presenter-active"
                      transition={spring.snappy}
                      className="absolute inset-0 rounded-xl bg-surface shadow-card ring-1 ring-line"
                    />
                  )}
                  <span className="relative w-5 text-[11px] font-semibold text-ink-3 tabular">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative flex-1">{s.label}</span>
                  <ArrowUpRight className="relative size-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <button
        type="button"
        onClick={toggleTheme}
        className="mt-8 flex w-fit items-center gap-2.5 rounded-full bg-surface py-2 pr-4 pl-2 text-[13px] font-semibold shadow-card ring-1 ring-line"
      >
        <span className="grid size-7 place-items-center rounded-full bg-ink text-canvas">
          {theme === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        </span>
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>
    </aside>
  )
}

const brandSwatches = [
  { name: 'Forest', token: '--nr-brand' },
  { name: 'Deep', token: '--nr-deep' },
  { name: 'Lime', token: '--nr-lime' },
  { name: 'Ember', token: '--nr-ember' },
]

const macroSwatches = [
  { name: 'Protein', token: '--nr-protein' },
  { name: 'Carbs', token: '--nr-carbs' },
  { name: 'Fat', token: '--nr-fat' },
  { name: 'Fiber', token: '--nr-fiber' },
]

const principles = [
  ['Calm by default', 'Warm paper tones and generous space keep daily logging from feeling clinical.'],
  ['Numbers you can feel', 'Every metric pairs a figure with a shape — rings, bars, trends.'],
  ['Guidance, not judgment', 'We say what to do next. Never “bad food”, only “enjoy mindfully”.'],
]

/** Right rail on wide screens: a compact spec sheet of the design system. */
export function DesignNotesPanel() {
  return (
    <aside className="relative z-10 flex w-[280px] shrink-0 flex-col gap-7">
      <section>
        <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-ink-3 uppercase">Palette</p>
        <div className="grid grid-cols-4 gap-2">
          {[...brandSwatches, ...macroSwatches].map((s) => (
            <div key={s.name}>
              <div className="aspect-square rounded-2xl ring-1 ring-line" style={{ background: `var(${s.token})` }} />
              <p className="mt-1.5 text-[11px] font-medium text-ink-2">{s.name}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
          Macro hues are validated for colour-blind separation in both themes, and always ship with a text label.
        </p>
      </section>

      <section>
        <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-ink-3 uppercase">Type</p>
        <div className="flex items-end gap-5">
          <div>
            <span className="font-display text-[56px] leading-none font-medium">Aa</span>
            <p className="mt-1 text-[11px] font-medium text-ink-2">Fraunces · display</p>
          </div>
          <div>
            <span className="text-[56px] leading-none font-semibold tracking-[-0.04em]">Aa</span>
            <p className="mt-1 text-[11px] font-medium text-ink-2">Inter · interface</p>
          </div>
        </div>
      </section>

      <section>
        <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-ink-3 uppercase">Principles</p>
        <ol className="space-y-3.5">
          {principles.map(([title, body], i) => (
            <li key={title} className="flex gap-3">
              <span className="font-display text-[15px] text-ink-3 italic">{i + 1}</span>
              <div>
                <p className="text-[13.5px] font-semibold">{title}</p>
                <p className="text-[12.5px] leading-relaxed text-ink-2">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  )
}
