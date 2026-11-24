import { useEffect, useRef, type MouseEvent } from 'react'
import { useLocation } from 'react-router'
import { Outlet } from 'react-router'
import { ScrollToTop } from './ScrollToTop'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { SearchProvider } from '@/contexts/SearchContext'
import { SearchModal } from '@/components/shared/SearchModal'
import { useTranslation } from 'react-i18next'
import { cleanInternalPath, trackAnalytics } from '@/lib/analytics'
import { createLocationVisitGate } from '@/lib/analyticsCore'

function usePageViewTracking() {
  const location = useLocation()
  const locationVisitGate = useRef(createLocationVisitGate())

  useEffect(() => {
    if (!locationVisitGate.current.shouldTrack(location.key)) return
    void trackAnalytics({ entityType: 'PAGE', eventType: 'PAGE_VIEW', path: location.pathname, source: 'route' })
  }, [location.key, location.pathname])
}

function trackInternalLinkClick(event: MouseEvent<HTMLDivElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const target = event.target
  if (!(target instanceof Element)) return

  const explicit = target.closest<HTMLElement>('[data-analytics-event]')
  if (explicit) return

  const anchor = target.closest<HTMLAnchorElement>('a[href]')
  if (!anchor || anchor.target && anchor.target !== '_self' || anchor.hasAttribute('download')) return
  const path = cleanInternalPath(anchor.href, window.location.origin)
  if (!path || anchor.getAttribute('href')?.startsWith('#')) return

  const source = anchor.closest('header') ? 'header-menu' : anchor.closest('footer') ? 'footer-link' : anchor.closest('nav') ? 'header-menu' : 'site-link'
  void trackAnalytics({ entityType: 'CUSTOM', eventType: 'LINK_CLICK', path, source })
}

/**
 * Root layout wrapper rendered by every route.
 * The id="main-content" is the skip-link target (accessibility).
 */
export function PageLayout() {
  const { t } = useTranslation()
  usePageViewTracking()

  return (
    <SearchProvider>
      <div className="flex min-h-dvh flex-col bg-ivory" onClickCapture={trackInternalLinkClick}>
        {/* Skip to main content — visible only on keyboard focus */}
        <a href="#main-content" className="skip-link">
          {t('common.skipToContent')}
        </a>

        <Navbar />

        <main id="main-content" className="flex-1" tabIndex={-1}>
          <Outlet />
        </main>

        <Footer />

        <ScrollToTop />
      </div>

      {/* Search modal is portalled to document.body */}
      <SearchModal />
    </SearchProvider>
  )
}
