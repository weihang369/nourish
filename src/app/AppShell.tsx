import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { DeviceFrame, TabBar } from '@/components/layout'
import { OVERLAY_ROOT_ID, ToastHost } from '@/components/ui'
import { QuickAddSheet } from '@/features/quick-add/QuickAddSheet'
import { useAppStore } from '@/store/useAppStore'
import { AnimatedOutlet } from './AnimatedOutlet'

function useThemeSync() {
  const theme = useAppStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0e0c' : '#f3efe6')
  }, [theme])
}

/** First visit lands on onboarding; afterwards the app opens on Today. */
function useFirstRunRedirect() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  useEffect(() => {
    if (!useAppStore.getState().onboarded && pathname === '/') navigate('/welcome', { replace: true })
    // Only on first mount.
  }, [])
}

export function AppShell() {
  useThemeSync()
  useFirstRunRedirect()

  return (
    <DeviceFrame>
      <div className="absolute inset-0">
        <AnimatedOutlet />
      </div>
      <TabBar />
      <QuickAddSheet />
      <div id={OVERLAY_ROOT_ID} className="pointer-events-none absolute inset-0 z-50" />
      <ToastHost />
    </DeviceFrame>
  )
}
