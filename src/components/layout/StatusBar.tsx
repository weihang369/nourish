import { useLocation } from 'react-router'
import { cn } from '@/lib/cn'
import { useChromeStore } from '@/store/useChromeStore'

/** Faux iOS status bar + dynamic island. Only rendered inside the desktop device frame. */
export function StatusBar() {
  const { pathname } = useLocation()
  const tone = useChromeStore((s) => s.tones[pathname]) ?? 'dark'
  const ink = tone === 'light' ? 'text-white' : 'text-ink'

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 z-[55] flex h-[54px] items-center justify-between px-8 pt-1 transition-colors duration-300',
        ink,
      )}
    >
      <span className="w-[54px] text-center text-[16px] font-semibold tracking-[-0.01em]">9:41</span>
      <span className="absolute top-[11px] left-1/2 h-[35px] w-[122px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .6C5.2.6 2.7 1.7.8 3.5L2 4.8a8.6 8.6 0 0 1 6-2.4Zm0 3.5c1.3 0 2.5.5 3.5 1.4l1.2-1.3A6.8 6.8 0 0 0 8 4.1a6.8 6.8 0 0 0-4.7 1.9l1.2 1.3c1-.9 2.2-1.4 3.5-1.4Zm0 3.4c.4 0 .8.2 1.1.4L8 11 6.9 9.7c.3-.2.7-.4 1.1-.4Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="17" height="9" rx="2.5" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity="0.5" />
        </svg>
      </span>
    </div>
  )
}

/** iOS home indicator; follows the same ink as the status bar. */
export function HomeIndicator() {
  const { pathname } = useLocation()
  const tone = useChromeStore((s) => s.tones[pathname]) ?? 'dark'
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute bottom-2 left-1/2 z-[70] h-[5px] w-[134px] -translate-x-1/2 rounded-full transition-colors duration-300',
        tone === 'light' ? 'bg-white/90' : 'bg-ink/85',
      )}
    />
  )
}
