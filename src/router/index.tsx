import { createBrowserRouter } from 'react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { ErrorPage } from '@/pages/ErrorPage'
import { HomePage } from '@/pages/HomePage'
import { StoresPage } from '@/pages/StoresPage'
import { StoreDetailPage } from '@/pages/StoreDetailPage'
import { CampaignsPage } from '@/pages/CampaignsPage'
import { CampaignDetailPage } from '@/pages/CampaignDetailPage'
import { EventsPage } from '@/pages/EventsPage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { CinemaPage } from '@/pages/CinemaPage'
import { ServicesPage } from '@/pages/ServicesPage'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { LegalPage } from '@/pages/LegalPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * Application router.
 *
 * Architecture:
 * - Root route renders PageLayout (shared chrome — Navbar/Footer in Sprint 2)
 * - errorElement on root catches all unhandled errors in child routes
 * - path: '*' catches 404s within the layout (preserves Navbar/Footer)
 * - All routes are statically imported for Sprint 1
 *   → Sprint 2+ will add React.lazy() for code splitting
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'stores',
        element: <StoresPage />,
      },
      {
        path: 'stores/:slug',
        element: <StoreDetailPage />,
      },
      {
        path: 'campaigns',
        element: <CampaignsPage />,
      },
      {
        path: 'campaigns/:slug',
        element: <CampaignDetailPage />,
      },
      {
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'events/:slug',
        element: <EventDetailPage />,
      },
      {
        path: 'cinema',
        element: <CinemaPage />,
      },
      {
        path: 'hizmetler',
        element: <ServicesPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'legal/:slug',
        element: <LegalPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
