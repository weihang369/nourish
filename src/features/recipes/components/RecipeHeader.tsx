import { BadgeCheck, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { Avatar, Tag } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatInt } from '@/lib/format'
import { riseIn } from '@/lib/motion'
import type { Recipe } from '@/types/nutrition'

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i))
        return (
          <span key={i} className="relative size-4">
            <Star className="absolute inset-0 size-4 text-ink/15" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="size-4 text-ink" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        )
      })}
    </span>
  )
}

/** Tags, title, blurb, rating and author — the "masthead" of the recipe. */
export function RecipeHeader({ recipe }: { recipe: Recipe }) {
  return (
    <>
      <motion.div variants={riseIn} className="flex flex-wrap gap-1.5">
        {recipe.tags.slice(0, 3).map((tag, i) => (
          <Tag key={tag} className={cn(i === 0 && 'bg-brand-soft text-ink')}>
            {tag}
          </Tag>
        ))}
      </motion.div>

      <motion.h1 variants={riseIn} className="mt-3 font-display text-[31px] leading-[1.06] font-medium text-balance">
        {recipe.title}
      </motion.h1>

      <motion.p variants={riseIn} className="mt-2.5 text-[15px] leading-relaxed text-ink-2">
        {recipe.blurb}
      </motion.p>

      <motion.div
        variants={riseIn}
        className="mt-3.5 flex items-center gap-2"
        aria-label={`Rated ${recipe.rating} out of 5 from ${formatInt(recipe.reviews)} reviews`}
        role="img"
      >
        <RatingStars rating={recipe.rating} />
        <span className="text-[13.5px] font-semibold text-ink tabular">{recipe.rating.toFixed(1)}</span>
        <span className="text-[13px] text-ink-3 tabular">({formatInt(recipe.reviews)} reviews)</span>
      </motion.div>

      <motion.div variants={riseIn} className="mt-5 flex items-center gap-3 border-y border-line py-3.5">
        <Avatar photo={recipe.author.photo} name={recipe.author.name} size={44} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[14.5px] font-semibold text-ink">
            {recipe.author.name}
            <BadgeCheck className="size-4 text-brand" strokeWidth={2.2} aria-label="Verified" />
          </p>
          <p className="text-[12.5px] text-ink-3">{recipe.author.role}</p>
        </div>
      </motion.div>
    </>
  )
}
