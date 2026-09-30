import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { cn } from '@/lib/cn'
import { formatInt } from '@/lib/format'
import { easeOutExpo } from '@/lib/motion'

interface AnimatedNumberProps {
  value: number
  from?: number
  format?: (value: number) => string
  duration?: number
  className?: string
}

/** Counts up/down to `value` with tabular figures so width never jitters. */
export function AnimatedNumber({ value, from = 0, format = formatInt, duration = 1.1, className }: AnimatedNumberProps) {
  const mv = useMotionValue(from)
  const text = useTransform(mv, (v) => format(v))

  useEffect(() => {
    const controls = animate(mv, value, { duration, ease: easeOutExpo })
    return () => controls.stop()
  }, [mv, value, duration])

  return <motion.span className={cn('tabular', className)}>{text}</motion.span>
}
