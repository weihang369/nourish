import { AnimatePresence, motion, type Variants } from 'motion/react'
import { type ReactElement, Suspense, useRef, useState } from 'react'
import { useLocation, useOutlet } from 'react-router'
import { tabPaths } from '@/components/layout'
import { easeOutExpo } from '@/lib/motion'

type Kind = 'push' | 'pop' | 'tab' | 'fade'
interface Direction {
  kind: Kind
  /** +1 / -1 for lateral tab moves */
  sign: number
}

/** Navigation depth drives iOS-style push/pop; tabs cross-fade laterally. */
function depthOf(path: string) {
  if (path === '/welcome') return -1
  if (tabPaths.includes(path)) return 0
  if (path.startsWith('/food/')) return 2
  return 1
}

function directionFor(from: string, to: string): Direction {
  const a = depthOf(from)
  const b = depthOf(to)
  if (a < 0 || b < 0) return { kind: 'fade', sign: 0 }
  if (b > a) return { kind: 'push', sign: 1 }
  if (b < a) return { kind: 'pop', sign: -1 }
  if (a === 0) return { kind: 'tab', sign: Math.sign(tabPaths.indexOf(to) - tabPaths.indexOf(from)) || 1 }
  return { kind: 'push', sign: 1 }
}

const slide = { type: 'tween', duration: 0.52, ease: easeOutExpo } as const
const soft = { type: 'tween', duration: 0.38, ease: easeOutExpo } as const

const variants: Variants = {
  enter: (d: Direction) => {
    switch (d.kind) {
      case 'push':
        return { x: '100%', zIndex: 2, opacity: 1 }
      case 'pop':
        return { x: '-24%', zIndex: 1, opacity: 1 }
      case 'tab':
        return { x: 28 * d.sign, opacity: 0, zIndex: 2 }
      default:
        return { opacity: 0, scale: 1.015, zIndex: 2 }
    }
  },
  center: (d: Direction) => ({
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: d.kind === 'pop' ? 1 : 2,
    transition: d.kind === 'push' || d.kind === 'pop' ? slide : soft,
  }),
  exit: (d: Direction) => {
    switch (d.kind) {
      case 'push':
        return { x: '-24%', zIndex: 1, transition: slide }
      case 'pop':
        return { x: '100%', zIndex: 2, transition: slide }
      case 'tab':
        return { x: -20 * d.sign, opacity: 0, zIndex: 1, transition: { duration: 0.2 } }
      default:
        return { opacity: 0, zIndex: 1, transition: { duration: 0.3 } }
    }
  },
}

/** Keeps the outgoing route's element alive while it animates away. */
function Frozen({ children }: { children: ReactElement | null }) {
  const [frozen] = useState(children)
  return frozen
}

export function AnimatedOutlet() {
  const location = useLocation()
  const outlet = useOutlet()
  const prev = useRef(location.pathname)
  const dir = useRef<Direction>({ kind: 'fade', sign: 0 })

  if (prev.current !== location.pathname) {
    dir.current = directionFor(prev.current, location.pathname)
    prev.current = location.pathname
  }

  return (
    <AnimatePresence initial={false} custom={dir.current}>
      <motion.div
        key={location.pathname}
        custom={dir.current}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        className="absolute inset-0 overflow-hidden bg-canvas shadow-[-16px_0_40px_-20px_rgb(0_0_0/0.25)]"
      >
        <Suspense fallback={null}>
          <Frozen>{outlet}</Frozen>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}
