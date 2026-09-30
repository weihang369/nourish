import { motion } from 'motion/react'
import { easeOutExpo } from '@/lib/motion'

/** Deterministic bar widths (1–3 units) so the faux EAN-13 looks real. */
const widths = '1113121211331221121311211121312131112211321121312211231112111'.split('').map(Number)

function Bars() {
  let x = 0
  const rects: { x: number; w: number }[] = []
  widths.forEach((w, i) => {
    if (i % 2 === 0) rects.push({ x, w })
    x += w
  })
  return (
    <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" className="h-14 w-full">
      {rects.map((r) => (
        <rect key={r.x} x={r.x} y={0} width={r.w} height={40} fill="#111" />
      ))}
    </svg>
  )
}

/** A carton label under the lens — soft until the camera focuses. */
export function BarcodeArt({ focused }: { focused: boolean }) {
  return (
    <motion.div
      className="w-[214px] -rotate-2 rounded-[14px] bg-[#f6f3ec] px-4 pt-3 pb-2 shadow-[0_20px_40px_-12px_rgb(0_0_0/0.6)]"
      initial={false}
      animate={{ filter: focused ? 'blur(0px)' : 'blur(5px)' }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
    >
      <Bars />
      <p className="mt-1 flex justify-between font-mono text-[11px] tracking-[0.2em] text-[#111]">
        <span>7</span>
        <span>394376</span>
        <span>616037</span>
      </p>
    </motion.div>
  )
}
