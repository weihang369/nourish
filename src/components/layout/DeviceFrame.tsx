import { type CSSProperties, type ReactNode, useEffect, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { PresenterPanel, DesignNotesPanel } from './PresenterPanels'
import { HomeIndicator, StatusBar } from './StatusBar'

const SCREEN_W = 390
const SCREEN_H = 844
const BEZEL = 11

function useFitScale() {
  const compute = () => Math.min(1, (window.innerHeight - 40) / (SCREEN_H + BEZEL * 2))
  const [scale, setScale] = useState(compute)
  useEffect(() => {
    const onResize = () => setScale(compute())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return scale
}

/**
 * On desktop the app is staged inside a realistic phone with presenter
 * panels either side. On a real phone it simply fills the viewport.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery('(min-width: 760px) and (min-height: 560px)')
  const showNotes = useMediaQuery('(min-width: 1280px)')
  const scale = useFitScale()

  if (!isDesktop) {
    const vars = {
      '--sat': 'max(env(safe-area-inset-top), 14px)',
      '--sab': 'max(env(safe-area-inset-bottom), 16px)',
    } as CSSProperties
    return (
      <div className="relative h-dvh w-full overflow-hidden bg-canvas" style={vars}>
        {children}
      </div>
    )
  }

  return (
    <div className="grain relative flex min-h-dvh items-center justify-center gap-14 overflow-hidden bg-canvas px-10 py-5">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -left-32 size-[560px] rounded-full bg-lime/35 blur-[120px] dark:bg-lime/10" />
        <div className="absolute -right-40 -bottom-48 size-[620px] rounded-full bg-brand/20 blur-[140px] dark:bg-brand/10" />
        <div className="absolute top-1/3 left-1/2 size-[380px] -translate-x-1/2 rounded-full bg-ember/10 blur-[120px]" />
      </div>

      <PresenterPanel />

      <div
        className="relative shrink-0"
        style={{ width: (SCREEN_W + BEZEL * 2) * scale, height: (SCREEN_H + BEZEL * 2) * scale }}
      >
        <div
          className="absolute top-0 left-0 origin-top-left rounded-[64px] bg-[#0d0f0e] shadow-[0_0_0_1.5px_#2a2e2c,0_0_0_4px_#0d0f0e,0_50px_100px_-30px_rgb(10_20_15/0.55),0_30px_60px_-40px_rgb(10_20_15/0.6)]"
          style={{ width: SCREEN_W + BEZEL * 2, height: SCREEN_H + BEZEL * 2, padding: BEZEL, transform: `scale(${scale})` }}
        >
          {/* Hardware buttons */}
          <span className="absolute top-[180px] -left-[4px] h-8 w-[4px] rounded-l-sm bg-[#1b1e1d]" />
          <span className="absolute top-[240px] -left-[4px] h-16 w-[4px] rounded-l-sm bg-[#1b1e1d]" />
          <span className="absolute top-[320px] -left-[4px] h-16 w-[4px] rounded-l-sm bg-[#1b1e1d]" />
          <span className="absolute top-[260px] -right-[4px] h-24 w-[4px] rounded-r-sm bg-[#1b1e1d]" />

          <div
            className="relative isolate h-full w-full overflow-hidden rounded-[53px] bg-canvas"
            style={{ '--sat': '54px', '--sab': '28px' } as CSSProperties}
          >
            <StatusBar />
            {children}
            <HomeIndicator />
          </div>
        </div>
      </div>

      {showNotes && <DesignNotesPanel />}
    </div>
  )
}
