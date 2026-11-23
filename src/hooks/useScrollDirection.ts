import { useState, useEffect, useRef } from 'react'

type ScrollDirection = 'up' | 'down' | 'idle'

export function useScrollDirection(): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>('idle')
  const lastScrollY = useRef(0)

  useEffect(() => {
    const THRESHOLD = 8 // px — prevents jitter on micro-scrolls

    const handleScroll = () => {
      const currentY = window.scrollY
      const diff = currentY - lastScrollY.current

      if (Math.abs(diff) < THRESHOLD) return

      setDirection(diff > 0 ? 'down' : 'up')
      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return direction
}
