import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Scrolls to the top of the page on every route change.
 * Renders nothing — pure side-effect component.
 *
 * Placed inside PageLayout so it runs on every navigation.
 * Uses 'instant' (not 'smooth') to avoid disorienting the user.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
