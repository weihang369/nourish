import { ArrowRight, Camera } from 'lucide-react'
import {
  type MotionValue,
  type Variants,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui'
import { photos, photoUrl } from '@/data/photos'
import { cn } from '@/lib/cn'
import { easeOutExpo, riseIn, spring } from '@/lib/motion'

const copyStagger: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.3, staggerChildren: 0.07 } },
}

interface HeroStepProps {
  onStart: () => void
  onSignIn: () => void
}

interface TileProps {
  photo: string
  alt: string
  className: string
  imgClassName: string
  /** Parallax travel in px at the edge of the screen */
  depth: number
  rotate: number
  delay: number
  float: number
  px: MotionValue<number>
  py: MotionValue<number>
  children?: ReactNode
}

function Tile({ photo, alt, className, imgClassName, depth, rotate, delay, float, px, py, children }: TileProps) {
  const reduced = useReducedMotion()
  const x = useTransform(px, (v) => v * depth)
  const y = useTransform(py, (v) => v * depth)

  return (
    <motion.div className={cn('absolute', className)} style={{ x, y }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 40, rotate: rotate * 2.5 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate }}
        transition={{ ...spring.gentle, delay }}
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: float, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.6 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[26px] bg-white/5 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.85)] ring-1 ring-white/15">
            <img
              src={photoUrl(photo, 420, 420)}
              alt={alt}
              draggable={false}
              className={cn('block object-cover select-none', imgClassName)}
            />
          </div>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function GlassChip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'glass-dark absolute flex items-center gap-1.5 rounded-full py-1.5 pr-3 pl-2 text-[12px] font-semibold whitespace-nowrap text-white ring-1 ring-white/15',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Step 0 — dark, photographic welcome with a floating food collage. */
export function HeroStep({ onStart, onSignIn }: HeroStepProps) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 90, damping: 20 })
  const py = useSpring(my, { stiffness: 90, damping: 20 })

  // Ratio-based so it stays correct when the phone frame is CSS-scaled.
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onPointerLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden bg-[#0c1510] text-white"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* Backdrop: market photo, slow settle, heavy scrim */}
      <motion.img
        src={photoUrl(photos.vegetableMarket, 800, 1700)}
        alt=""
        aria-hidden
        draggable={false}
        initial={{ scale: 1.14, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 2.4, ease: easeOutExpo }}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-b from-[#0c1510]/55 via-[#0c1510]/75 to-[#0c1510]" />
      <div className="pointer-events-none absolute top-[18%] left-1/2 size-[380px] -translate-x-1/2 rounded-full bg-lime/15 blur-[100px]" />

      {/* Collage */}
      <div aria-hidden className="relative min-h-[320px] flex-1">
        <Tile
          photo={photos.salmonPokeBowl}
          alt=""
          className="top-[15%] right-[5%] z-0"
          imgClassName="size-[152px]"
          depth={-26}
          rotate={6}
          delay={0.15}
          float={6.5}
          px={px}
          py={py}
        />
        <Tile
          photo={photos.rainbowBuddhaBowl}
          alt=""
          className="top-[21%] left-[7%] z-10"
          imgClassName="h-[224px] w-[180px]"
          depth={16}
          rotate={-5}
          delay={0.05}
          float={7}
          px={px}
          py={py}
        >
          <GlassChip className="-bottom-4 left-4">
            <span className="size-2 rounded-full bg-lime" />
            32 g protein
          </GlassChip>
        </Tile>
        <Tile
          photo={photos.berryOatBowl}
          alt=""
          className="top-[55%] right-[10%] z-10"
          imgClassName="size-[128px]"
          depth={30}
          rotate={-3}
          delay={0.25}
          float={5.6}
          px={px}
          py={py}
        >
          <GlassChip className="-top-4 -left-10">
            <span className="grid size-5 place-items-center rounded-full bg-lime text-[#14201a]">
              <Camera className="size-3" strokeWidth={2.6} />
            </span>
            Logged in 2s
          </GlassChip>
        </Tile>
        <Tile
          photo={photos.avocado}
          alt=""
          className="top-[76%] left-[5%] z-20"
          imgClassName="size-[88px]"
          depth={-38}
          rotate={8}
          delay={0.35}
          float={6}
          px={px}
          py={py}
        />
      </div>

      {/* Copy + actions */}
      <motion.div
        variants={copyStagger}
        initial="hidden"
        animate="show"
        className="relative px-6 pb-[calc(var(--sab)+6px)]"
      >
        <motion.div variants={riseIn}>
          <Logo size={30} className="text-white" />
        </motion.div>
        <motion.h1 variants={riseIn} className="mt-5 font-display text-[50px] leading-[0.98] font-medium">
          Eat with <em className="font-normal text-lime">intention</em>.
        </motion.h1>
        <motion.p variants={riseIn} className="mt-4 max-w-[310px] text-[15.5px] leading-relaxed text-white/70">
          Calm, photo-first tracking that learns what makes you feel your best.
        </motion.p>
        <motion.div variants={riseIn} className="mt-8">
          <Button
            variant="lime"
            size="lg"
            block
            onClick={onStart}
            trailing={<ArrowRight className="size-5" strokeWidth={2.4} />}
            className="shadow-[0_14px_36px_-12px_rgb(198_238_107/0.55)]"
          >
            Get started
          </Button>
        </motion.div>
        <motion.div variants={riseIn}>
          <button
            type="button"
            onClick={onSignIn}
            className="mt-1.5 h-12 w-full rounded-full text-[14px] font-semibold text-white/75 transition-colors hover:text-white"
          >
            I already have an account
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
