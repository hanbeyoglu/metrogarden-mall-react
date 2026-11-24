import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getCmsPage, getHomeContent, getMall, getSliders, getStores, getStore, getCampaigns, getCampaign, getEvents, getEvent, getMovies, getServices } from '@/api'
import { mall as demoMall, sliders as demoSliders, allStores, allCampaigns, allEvents, allMovies } from '@/data'
import { hasPublicApiConfig } from '@/api/client'
import { mapCampaign, mapEvent, mapStore } from '@/api/cmsAdapters'
import { queryKeys } from '@/lib/queryKeys'
import type { CmsPage } from '@/types'

const apiConfigured = hasPublicApiConfig(true)
if (import.meta.env.DEV && !apiConfigured) {
  console.info('[CMS API] Add the public key, tenant ID, and mall ID to .env.local to load live content.')
}

function cmsRequest<T>(label: string, request: () => Promise<T>): () => Promise<T> {
  return async () => {
    try {
      return await request()
    } catch (error) {
      if (import.meta.env.DEV) console.error(`[CMS API] ${label} failed; using local demo content.`, error)
      throw error
    }
  }
}

const LIVE_CONTENT_QUERY_OPTIONS = {
  staleTime: 0,
  refetchOnMount: 'always' as const,
  refetchOnWindowFocus: true,
}

function useCmsLocale(): string {
  const { i18n } = useTranslation()
  return i18n.language.toLowerCase().startsWith('en') ? 'en' : 'tr'
}

export function useCmsHomeContent() {
  const locale = useCmsLocale()
  const query = useQuery({
    queryKey: queryKeys.home(locale), queryFn: cmsRequest('home', getHomeContent), enabled: apiConfigured,
    ...LIVE_CONTENT_QUERY_OPTIONS, retry: false,
  })
  return query.data
}

export function useCmsPageContent(slug?: string): CmsPage | undefined {
  const locale = useCmsLocale()
  const query = useQuery({
    queryKey: queryKeys.pages.detail(slug ?? '', locale),
    queryFn: cmsRequest(`page:${slug}`, () => getCmsPage(slug!)),
    enabled: Boolean(slug) && apiConfigured,
    ...LIVE_CONTENT_QUERY_OPTIONS,
    retry: false,
  })
  return query.data
}

export function useStoreDetailContent(slug?: string) {
  const locale = useCmsLocale()
  const query = useQuery({
    queryKey: queryKeys.stores.detail(slug ?? '', locale),
    queryFn: cmsRequest(`store:${slug}`, () => getStore(slug!)),
    enabled: Boolean(slug) && apiConfigured,
    ...LIVE_CONTENT_QUERY_OPTIONS,
    retry: false,
  })
  return query
}

export function useCampaignDetailContent(slug?: string) {
  const locale = useCmsLocale()
  const query = useQuery({
    queryKey: queryKeys.campaigns.detail(slug ?? '', locale),
    queryFn: cmsRequest(`campaign:${slug}`, () => getCampaign(slug!)),
    enabled: Boolean(slug) && apiConfigured,
    ...LIVE_CONTENT_QUERY_OPTIONS,
    retry: false,
  })
  return query
}

export function useEventDetailContent(slug?: string) {
  const locale = useCmsLocale()
  const query = useQuery({
    queryKey: queryKeys.events.detail(slug ?? '', locale),
    queryFn: cmsRequest(`event:${slug}`, () => getEvent(slug!)),
    enabled: Boolean(slug) && apiConfigured,
    ...LIVE_CONTENT_QUERY_OPTIONS,
    refetchInterval: 15_000,
    retry: false,
  })
  return query
}

/** Public website content is read from the CMS API, with local sample data as a fallback. */
export function useMallContent() {
  const locale = useCmsLocale()
  const query = useQuery({
    queryKey: queryKeys.mall(locale), queryFn: cmsRequest('site-config', getMall), enabled: apiConfigured,
    ...LIVE_CONTENT_QUERY_OPTIONS,
    retry: false,
  })
  return query.data ?? demoMall
}

export function useSliderContent() {
  const locale = useCmsLocale()
  const query = useQuery({
    queryKey: queryKeys.sliders(locale), queryFn: cmsRequest('sliders', getSliders), enabled: apiConfigured,
    ...LIVE_CONTENT_QUERY_OPTIONS, retry: false,
  })
  // When the CMS is configured, don't flash local sample slides while its request is loading
  // or failed. Keep demo content only for projects without a public API configuration.
  return query.data ?? (apiConfigured ? [] : demoSliders)
}

export function useStoreContent() {
  const locale = useCmsLocale()
  const query = useQuery({
    queryKey: queryKeys.stores.all(locale), queryFn: cmsRequest('stores', () => getStores()), enabled: apiConfigured,
    ...LIVE_CONTENT_QUERY_OPTIONS, retry: false,
  })
  const home = useCmsHomeContent()
  const stores = query.data ?? (apiConfigured ? [] : allStores)
  const featuredStores = home?.featuredStores.map(mapStore) ?? stores.filter((store) => store.is_active && store.is_featured)
  return { stores, featuredStores }
}

export function useCampaignContent() {
  const locale = useCmsLocale()
  const query = useQuery({
    queryKey: queryKeys.campaigns.all(locale), queryFn: cmsRequest('campaigns', () => getCampaigns()), enabled: apiConfigured,
    ...LIVE_CONTENT_QUERY_OPTIONS, retry: false,
  })
  const home = useCmsHomeContent()
  // Use local sample campaigns only when no public CMS API is configured.
  // With a configured API, empty/loading/error states must not show stale demo records.
  const campaigns = query.data ?? (apiConfigured ? [] : allCampaigns)
  return {
    campaigns,
    featuredCampaigns: home?.activeCampaigns.map(mapCampaign) ?? campaigns.filter((campaign) => campaign.is_active && campaign.is_featured),
  }
}

export function useEventContent() {
  const locale = useCmsLocale()
  const query = useQuery({
    queryKey: queryKeys.events.all(locale), queryFn: cmsRequest('events', () => getEvents()), enabled: apiConfigured,
    ...LIVE_CONTENT_QUERY_OPTIONS,
    refetchInterval: 15_000,
    retry: false,
  })
  const home = useCmsHomeContent()
  // When CMS credentials exist, show only CMS events (including an empty result).
  // Local samples remain available only for an unconfigured demo setup.
  const events = query.data ?? (apiConfigured ? [] : allEvents)
  return {
    events,
    upcomingEvents: home?.upcomingEvents.map(mapEvent) ?? events.filter((event) => new Date(event.date).getTime() >= Date.now()),
  }
}

export function useMovieContent() {
  const locale = useCmsLocale()
  const query = useQuery({
    queryKey: queryKeys.movies.all(locale), queryFn: cmsRequest('movie-sessions', () => getMovies()), enabled: apiConfigured,
    ...LIVE_CONTENT_QUERY_OPTIONS, retry: false,
  })
  const movies = query.data ?? (apiConfigured ? [] : allMovies)
  const currentMovies = useMemo(
    () => movies.filter((movie) => movie.status === 'now-showing'),
    [movies],
  )
  return { movies, currentMovies }
}

/** Location amenities from GET /public/services — no local demo fallback. */
export function useServiceContent() {
  const locale = useCmsLocale()
  const query = useQuery({
    queryKey: queryKeys.services.all(locale),
    queryFn: cmsRequest('services', () => getServices()),
    enabled: apiConfigured,
    ...LIVE_CONTENT_QUERY_OPTIONS,
    retry: false,
  })

  const services = useMemo(() => {
    const items = query.data ?? []
    return [...items]
      .filter((service) => Boolean(service.name?.trim()))
      .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, 'tr'))
  }, [query.data])

  return {
    services,
    isLoading: apiConfigured && query.isPending,
    isError: apiConfigured && query.isError,
    isConfigured: apiConfigured,
  }
}
