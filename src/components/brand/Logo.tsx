import { cn } from '@/lib/cn'

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="19" fill="var(--nr-deep)" />
      <path d="M20 40c0-12 9-21 24-22-1 15-10 24-22 24" fill="var(--nr-lime)" />
      <path d="M20 44c4-8 9-13 16-17" stroke="var(--nr-deep)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      <span className="font-display text-[22px] font-semibold tracking-[-0.03em]">nourish</span>
    </span>
  )
}
