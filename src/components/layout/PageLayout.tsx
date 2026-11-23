import { Outlet } from 'react-router'
import { ScrollToTop } from './ScrollToTop'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { SearchProvider } from '@/contexts/SearchContext'
import { SearchModal } from '@/components/shared/SearchModal'

/**
 * Root layout wrapper rendered by every route.
 * The id="main-content" is the skip-link target (accessibility).
 */
export function PageLayout() {
  return (
    <SearchProvider>
      <div className="flex min-h-dvh flex-col bg-ivory">
        {/* Skip to main content — visible only on keyboard focus */}
        <a href="#main-content" className="skip-link">
          Ana içeriğe geç
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
