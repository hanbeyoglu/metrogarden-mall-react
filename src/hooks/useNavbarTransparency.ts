import { useState, useEffect } from 'react'

/**
 * Returns true when the navbar should be in its transparent state
 * (over a hero, at the top of the page).
 * Transitions to false once scrollY exceeds the threshold.
 */
export function useNavbarTransparency(threshold = 80): boolean {
  const [isTransparent, setIsTransparent] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsTransparent(window.scrollY < threshold)
    }

    // Set initial state without delay
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return isTransparent
}
