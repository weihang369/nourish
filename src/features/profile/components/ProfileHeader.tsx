import { MapPin, Settings, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Avatar, IconButton } from '@/components/ui'
import { user } from '@/data/user'
import { riseIn, stagger } from '@/lib/motion'

export function ProfileHeader({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <motion.header variants={stagger} initial="hidden" animate="show" className="px-5 pt-safe">
      <motion.div variants={riseIn} className="flex h-14 items-center justify-between pt-2">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Profile</p>
        <IconButton label="Settings" onClick={onOpenSettings}>
          <Settings />
        </IconButton>
      </motion.div>

      <motion.div variants={riseIn} className="mt-3 flex items-center gap-4">
        {/* Gradient ring echoes the logo: lime leaf on deep forest */}
        <div className="shrink-0 rounded-full bg-linear-to-br from-lime via-brand to-deep p-[3px] shadow-glow">
          <div className="rounded-full bg-canvas p-[3px]">
            <Avatar photo={user.photo} name={`${user.firstName} ${user.lastName}`} size={84} />
          </div>
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-[30px] leading-[1.05] font-medium">
            {user.firstName} {user.lastName}
          </h1>
          <p className="mt-1 flex items-center gap-1 truncate text-[13px] text-ink-2">
            {user.handle}
            <span className="text-ink-3">·</span>
            <MapPin className="size-3.5 shrink-0 text-ink-3" />
            {user.location}
          </p>
          <span className="mt-2.5 inline-flex h-7 items-center gap-1.5 rounded-full bg-lime px-3 text-[12px] font-semibold text-[#14201a]">
            <Sparkles className="size-3.5" strokeWidth={2.4} />
            {user.plan}
          </span>
        </div>
      </motion.div>
    </motion.header>
  )
}
