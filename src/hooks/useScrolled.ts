import { type RefObject, useEffect, useState } from 'react'

/** True once the given scroll container has scrolled past `threshold` px. */
export function useScrolled(ref: RefObject<HTMLElement | null>, threshold = 8) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > threshold)
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [ref, threshold])

  return scrolled
}
