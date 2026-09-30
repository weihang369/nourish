import {
  Activity,
  Bell,
  HeartPulse,
  LifeBuoy,
  Moon,
  type LucideIcon,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Sun,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { SegmentedControl } from '@/components/ui'
import { connectedApps } from '@/data/user'
import { cn } from '@/lib/cn'
import { type Theme, useAppStore } from '@/store/useAppStore'
import { ResetDemoSheet } from './ResetDemoSheet'
import { SettingsGroup, SettingsRow } from './SettingsGroup'
import { Toggle } from './Toggle'

const themeOptions: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const appIcons: Record<string, LucideIcon> = { health: HeartPulse, strava: Activity, oura: Moon }

const comingSoon = (what: string) => useAppStore.getState().showToast(`${what} opens in the full app`, 'sparkle')

export function SettingsList() {
  const navigate = useNavigate()
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const resetDemo = useAppStore((s) => s.resetDemo)
  const [notifications, setNotifications] = useState(true)
  const [connected, setConnected] = useState(() => Object.fromEntries(connectedApps.map((a) => [a.id, a.connected])))
  const [confirmReset, setConfirmReset] = useState(false)

  const toggleApp = (id: string, name: string) => {
    const next = !connected[id]
    setConnected((c) => ({ ...c, [id]: next }))
    useAppStore.getState().showToast(next ? `${name} connected` : `${name} disconnected`, next ? 'check' : 'trash')
  }

  const reset = () => {
    setConfirmReset(false)
    resetDemo()
    navigate('/welcome')
  }

  return (
    <div className="space-y-7">
      <SettingsGroup title="Preferences">
        <SettingsRow
          icon={theme === 'dark' ? <Moon /> : <Sun />}
          iconClass="bg-deep text-lime"
          label="Appearance"
          trailing={
            <SegmentedControl size="sm" className="w-[128px]" options={themeOptions} value={theme} onChange={setTheme} />
          }
        />
        <SettingsRow
          icon={<Bell />}
          iconClass="bg-ember/15 text-ember"
          label="Notifications"
          detail={notifications ? 'Meal nudges · 8am, 12:30, 7pm' : 'Off — we’ll stay quiet'}
          trailing={<Toggle checked={notifications} onChange={setNotifications} label="Notifications" />}
        />
        <SettingsRow
          icon={<Ruler />}
          iconClass="bg-water/15 text-water"
          label="Units"
          trailing={<span className="text-[14px] text-ink-3">Metric</span>}
          chevron
          onClick={() => comingSoon('Unit settings')}
        />
      </SettingsGroup>

      <SettingsGroup title="Connected apps">
        {connectedApps.map((app) => {
          const Icon = appIcons[app.id] ?? Activity
          const on = connected[app.id]
          return (
            <SettingsRow
              key={app.id}
              icon={<Icon />}
              label={app.name}
              detail={app.detail}
              onClick={() => toggleApp(app.id, app.name)}
              trailing={<AppStatusPill connected={on} />}
            />
          )
        })}
      </SettingsGroup>

      <SettingsGroup title="Support">
        <SettingsRow
          icon={<ShieldCheck />}
          iconClass="bg-brand-soft text-brand"
          label="Privacy"
          chevron
          onClick={() => comingSoon('Privacy')}
        />
        <SettingsRow
          icon={<LifeBuoy />}
          iconClass="bg-surface-2 text-ink-2"
          label="Help & feedback"
          chevron
          onClick={() => comingSoon('Help & feedback')}
        />
      </SettingsGroup>

      <SettingsGroup title="Demo">
        <SettingsRow icon={<RotateCcw />} label="Replay onboarding" chevron onClick={() => navigate('/welcome')} />
        <SettingsRow
          icon={<Trash2 />}
          iconClass="bg-ember/15 text-ember"
          label="Reset demo data"
          detail="Start fresh with the sample day"
          onClick={() => setConfirmReset(true)}
        />
      </SettingsGroup>

      <ResetDemoSheet open={confirmReset} onClose={() => setConfirmReset(false)} onConfirm={reset} />
    </div>
  )
}

/** Status is carried by the word; the dot only reinforces it. */
function AppStatusPill({ connected }: { connected: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[11.5px] font-semibold',
        connected ? 'bg-brand-soft text-brand' : 'bg-surface-2 text-ink-2',
      )}
    >
      <span className={cn('size-1.5 rounded-full', connected ? 'bg-brand' : 'bg-ink-3')} />
      {connected ? 'Connected' : 'Connect'}
    </span>
  )
}
