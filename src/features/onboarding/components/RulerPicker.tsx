import { type KeyboardEvent, type PointerEvent, useEffect, useLayoutEffect, useRef } from 'react'
import { useElementWidth } from '@/hooks/useElementWidth'
import { cn } from '@/lib/cn'

interface RulerPickerProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  /** Accessible name, e.g. "Current weight" */
  label: string
  unit?: string
  className?: string
}

/** Layout px between 0.1-unit ticks. Scroll positions are in layout px, so CSS scaling never skews the math. */
const SPACING = 9
/** Ticks rendered either side of the current one (virtualised: the visible window is ~22 each way). */
const WINDOW = 34

const toTenths = (v: number) => Math.round(v * 10)
const fromTenths = (t: number) => Math.round(t) / 10

/**
 * Horizontal ruler with a fixed centre indicator. Native horizontal scroll
 * drives it (touch, trackpad); mouse drag is emulated with fling; it snaps to
 * the nearest 0.1 once motion settles. Keyboard: ←/→ ±0.1, Shift ±1.
 */
export function RulerPicker({ value, onChange, min = 35, max = 200, label, unit = 'kg', className }: RulerPickerProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>(350)
  const minT = toTenths(min)
  const maxT = toTenths(max)
  const count = maxT - minT

  const emitted = useRef(value)
  const interacting = useRef(false)
  const settleTimer = useRef<number | undefined>(undefined)
  const fling = useRef<number | undefined>(undefined)
  const drag = useRef<{ x: number; scroll: number; ratio: number; lastX: number; lastT: number; v: number } | null>(
    null,
  )

  const offsetFor = (v: number) => (toTenths(v) - minT) * SPACING

  // Sync scroll position from outside changes (mount, keyboard, resets) — not from our own emissions.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (Math.abs(value - emitted.current) > 1e-6 || Math.abs(el.scrollLeft - offsetFor(value)) > SPACING) {
      if (!interacting.current) el.scrollLeft = offsetFor(value)
      emitted.current = value
    }
  }, [value, width])

  useEffect(
    () => () => {
      window.clearTimeout(settleTimer.current)
      if (fling.current) cancelAnimationFrame(fling.current)
    },
    [],
  )

  const snap = () => {
    const el = ref.current
    if (!el) return
    const target = Math.round(el.scrollLeft / SPACING) * SPACING
    if (Math.abs(target - el.scrollLeft) > 0.5) el.scrollTo({ left: target, behavior: 'smooth' })
  }

  const scheduleSnap = () => {
    window.clearTimeout(settleTimer.current)
    settleTimer.current = window.setTimeout(() => {
      if (!interacting.current && !fling.current) snap()
    }, 110)
  }

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    const t = Math.min(maxT, Math.max(minT, minT + Math.round(el.scrollLeft / SPACING)))
    const next = fromTenths(t)
    if (next !== emitted.current) {
      emitted.current = next
      onChange(next)
    }
    scheduleSnap()
  }

  // ── Mouse drag (touch & pens use native scrolling) ──
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = ref.current
    if (!el) return
    if (fling.current) cancelAnimationFrame(fling.current)
    fling.current = undefined
    // The phone may be CSS-scaled on desktop: convert screen px → layout px.
    const ratio = el.getBoundingClientRect().width / el.offsetWidth || 1
    drag.current = { x: e.clientX, scroll: el.scrollLeft, ratio, lastX: e.clientX, lastT: e.timeStamp, v: 0 }
    interacting.current = true
    el.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = ref.current
    if (!d || !el) return
    el.scrollLeft = d.scroll - (e.clientX - d.x) / d.ratio
    const dt = e.timeStamp - d.lastT
    if (dt > 0) d.v = 0.8 * ((d.lastX - e.clientX) / d.ratio / dt) + 0.2 * d.v
    d.lastX = e.clientX
    d.lastT = e.timeStamp
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = ref.current
    if (!d || !el) return
    drag.current = null
    interacting.current = false
    el.releasePointerCapture(e.pointerId)
    // Stale velocity (paused before release) shouldn't fling.
    let v = e.timeStamp - d.lastT > 80 ? 0 : d.v * 16
    if (Math.abs(v) < 1) return snap()
    const step = () => {
      v *= 0.93
      el.scrollLeft += v
      if (Math.abs(v) > 0.4) fling.current = requestAnimationFrame(step)
      else {
        fling.current = undefined
        snap()
      }
    }
    fling.current = requestAnimationFrame(step)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = Math.min(max, Math.max(min, fromTenths(toTenths(value) + delta * (e.shiftKey ? 10 : 1))))
    onChange(next)
  }

  const current = toTenths(value) - minT
  const from = Math.max(0, current - WINDOW)
  const to = Math.min(count, current + WINDOW)
  const ticks: number[] = []
  for (let i = from; i <= to; i++) ticks.push(i)

  const fade = 'linear-gradient(to right, transparent, #000 22%, #000 78%, transparent)'

  return (
    <div className={cn('relative', className)}>
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value.toFixed(1)} ${unit}`}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={() => (interacting.current = true)}
        onTouchEnd={() => {
          interacting.current = false
          scheduleSnap()
        }}
        className="no-scrollbar relative h-[76px] cursor-grab overflow-x-auto overflow-y-hidden overscroll-x-contain select-none focus-visible:rounded-[18px] active:cursor-grabbing"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        <div className="relative h-full" style={{ width: count * SPACING + width }}>
          {ticks.map((i) => {
            const tenths = minT + i
            const major = tenths % 10 === 0
            const half = tenths % 5 === 0
            return (
              <span key={i} className="absolute top-2" style={{ left: width / 2 + i * SPACING }}>
                <span
                  className={cn(
                    'absolute left-0 w-[2px] -translate-x-1/2 rounded-full',
                    major ? 'h-8 bg-ink-2' : half ? 'h-5 bg-ink-3' : 'h-3.5 bg-ink-3/55',
                  )}
                />
                {major && (
                  <span className="absolute top-10 left-0 -translate-x-1/2 text-[12px] font-semibold text-ink-3 tabular">
                    {tenths / 10}
                  </span>
                )}
              </span>
            )
          })}
        </div>
      </div>

      {/* Fixed centre indicator */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 flex -translate-x-1/2 flex-col items-center">
        <span className="size-2 rounded-full bg-brand" />
        <span className="-mt-0.5 h-11 w-[3px] rounded-full bg-brand shadow-[0_0_0_3px_var(--nr-surface)]" />
      </div>
    </div>
  )
}
