import { Bell, Flame } from 'lucide-react'
import { motion } from 'motion/react'
import { Avatar, IconButton } from '@/components/ui'
import { user } from '@/data/user'
import { greeting } from '@/lib/date'
import { riseIn } from '@/lib/motion'

export function TodayHeader() {
  return (
    <motion.header variants={riseIn} className="flex items-center gap-3 px-5 pt-safe">
      <div className="mt-3 flex min-w-0 flex-1 items-center gap-3">
        <Avatar photo={user.photo} name={`${user.firstName} ${user.lastName}`} size={46} />
        <div className="min-w-0">
          <p className="text-[13px] leading-tight font-medium text-ink-3">{greeting()},</p>
          <h1 className="font-display text-[27px] leading-[1.1] font-medium">{user.firstName}</h1>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-surface pr-3.5 pl-2.5 shadow-card ring-1 ring-line ring-inset"
          aria-label={`${user.streakDays}-day logging streak`}
          title={`${user.streakDays}-day logging streak`}
        >
          <span className="grid size-6 place-items-center rounded-full bg-ember/15">
            <Flame className="size-3.5 fill-ember text-ember" strokeWidth={2.2} />
          </span>
          <span className="text-[14px] font-semibold tabular">{user.streakDays}</span>
        </span>
        <IconButton label="Notifications, 2 unread" badge>
          <Bell />
        </IconButton>
      </div>
    </motion.header>
  )
}
