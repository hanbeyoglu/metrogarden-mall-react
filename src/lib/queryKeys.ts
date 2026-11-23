import type { StoreFilters, CampaignFilters, EventFilters, MovieFilters, ServiceFilters } from '@/types'

/**
 * Centralized query key factory.
 * Keys are typed tuples — changes here propagate everywhere via inference.
 * Each key is unique, cache-friendly, and supports partial invalidation.
 */
export const queryKeys = {
  home: (locale?: string) => ['cms', 'home', locale] as const,
  mall: (locale?: string) => ['mall', locale] as const,

  sliders: (locale?: string) => ['sliders', locale] as const,

  stores: {
    all: (locale?: string) => ['stores', locale] as const,
    list: (filters?: StoreFilters) => ['stores', 'list', filters] as const,
    detail: (slug: string, locale?: string) => ['stores', 'detail', slug, locale] as const,
  },

  campaigns: {
    all: (locale?: string) => ['campaigns', locale] as const,
    list: (filters?: CampaignFilters) => ['campaigns', 'list', filters] as const,
    detail: (slug: string, locale?: string) => ['campaigns', 'detail', slug, locale] as const,
  },

  events: {
    all: (locale?: string) => ['events', locale] as const,
    list: (filters?: EventFilters) => ['events', 'list', filters] as const,
    detail: (slug: string, locale?: string) => ['events', 'detail', slug, locale] as const,
  },

  movies: {
    all: (locale?: string) => ['movies', locale] as const,
    list: (filters?: MovieFilters) => ['movies', 'list', filters] as const,
    detail: (slug: string, locale?: string) => ['movies', 'detail', slug, locale] as const,
    showtimes: (slug: string, date: string, locale?: string) => ['movies', 'showtimes', slug, date, locale] as const,
  },

  services: {
    all: (locale?: string) => ['services', locale] as const,
    list: (filters?: ServiceFilters) => ['services', 'list', filters] as const,
    detail: (id: string, locale?: string) => ['services', 'detail', id, locale] as const,
  },

  pages: {
    detail: (slug: string, locale?: string) => ['pages', slug, locale] as const,
  },
}
