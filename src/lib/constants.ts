import type { StoreCategory, StoreFloor, EventCategory } from '@/types'

export const ROUTES = {
  HOME: '/',
  STORES: '/stores',
  STORE_DETAIL: (slug: string) => `/stores/${slug}`,
  CAMPAIGNS: '/campaigns',
  CAMPAIGN_DETAIL: (slug: string) => `/campaigns/${slug}`,
  EVENTS: '/events',
  EVENT_DETAIL: (slug: string) => `/events/${slug}`,
  CINEMA: '/cinema',
  SERVICES: '/hizmetler',
  ABOUT: '/about',
  CONTACT: '/contact',
  KVKK: '/legal/kvkk',
  PRIVACY: '/legal/privacy',
  COOKIE_POLICY: '/legal/cookie-policy',
} as const

export const STORE_CATEGORIES: Record<StoreCategory, string> = {
  fashion: 'Moda & Giyim',
  'food-and-beverage': 'Yeme & İçme',
  beauty: 'Güzellik & Kozmetik',
  entertainment: 'Eğlence',
  electronics: 'Elektronik',
  'home-and-living': 'Ev & Yaşam',
  kids: 'Çocuk',
  sports: 'Spor',
  services: 'Hizmetler',
}

export const STORE_FLOORS: Record<StoreFloor, string> = {
  b1: 'B1 Kat',
  ground: 'Zemin Kat',
  '1f': '1. Kat',
  '2f': '2. Kat',
  '3f': '3. Kat',
}

export const EVENT_CATEGORIES: Record<EventCategory, string> = {
  culture: 'Kültür & Sanat',
  entertainment: 'Eğlence',
  kids: 'Çocuk',
  food: 'Yeme & İçme',
  sports: 'Spor',
  other: 'Diğer',
  concert: 'Konser',
  workshop: 'Workshop',
  exhibition: 'Sergi',
  festival: 'Festival',
}

export const STALE_TIMES = {
  MALL: 10 * 60 * 1000,      // 10 minutes — mall identity rarely changes
  SLIDERS: 5 * 60 * 1000,    // 5 minutes
  STORES: 5 * 60 * 1000,     // 5 minutes
  CAMPAIGNS: 5 * 60 * 1000,  // 5 minutes
  EVENTS: 5 * 60 * 1000,     // 5 minutes
  MOVIES: 30 * 60 * 1000,    // 30 minutes — showtimes change less often
  SERVICES: 5 * 60 * 1000,   // 5 minutes
  PAGES: 10 * 60 * 1000,     // 10 minutes
} as const

export const GC_TIME = 30 * 60 * 1000  // 30 minutes garbage collection

export const DEFAULT_RETRY_COUNT = 2

export const SEARCH_DEBOUNCE_MS = 200

export const ENDING_SOON_DAYS = 7

export const META_DEFAULTS = {
  SITE_NAME: 'Metrogarden AVM',
  TITLE_SUFFIX: ' | Metrogarden AVM',
  DESCRIPTION:
    'Sur Yapı Metrogarden AVM — İstanbul\'un kalbinde premium alışveriş deneyimi.',
} as const
