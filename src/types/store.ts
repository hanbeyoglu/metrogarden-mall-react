import type { MetaInfo, SocialLinks } from './mall'

/** Category slugs supplied by the CMS; demo data uses the built-in slugs below. */
export type StoreCategory = string

/** Floor IDs from CMS; demo data may continue using the legacy keys in STORE_FLOORS. */
export type StoreFloor = string

export interface StoreWorkingHoursDay {
  day: string
  open: boolean
  from?: string
  to?: string
}

export interface StoreWorkingHours {
  schedule?: string
  days?: StoreWorkingHoursDay[]
}

export interface StoreFilters {
  category?: StoreCategory
  floor?: StoreFloor
  featured?: boolean
  q?: string
  limit?: number
}

export interface Store {
  id: string
  slug: string
  name: string
  logo?: string
  cover_image?: string
  images?: string[]
  category: StoreCategory
  category_label?: string
  floor: StoreFloor
  floor_label?: string
  description?: string
  working_hours?: string | StoreWorkingHours
  phone?: string
  website?: string
  email?: string
  social_links?: SocialLinks
  is_featured: boolean
  is_active: boolean
  meta?: MetaInfo
}

/** Lightweight reference used when a store is embedded in another entity */
export type StoreRef = Pick<Store, 'id' | 'slug' | 'name' | 'logo'> & { category?: StoreCategory }
