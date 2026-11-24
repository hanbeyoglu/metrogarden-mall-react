import type { MetaInfo } from './mall'

export type EventCategory =
  | 'culture'
  | 'entertainment'
  | 'kids'
  | 'food'
  | 'sports'
  | 'other'
  | 'concert'
  | 'workshop'
  | 'exhibition'
  | 'festival'

export interface EventFilters {
  upcoming?: boolean
  past?: boolean
  category?: EventCategory
  limit?: number
}

export interface Event {
  id: string
  /** Public CMS record ID; absent for local demo content. */
  analytics_id?: string
  slug: string
  title: string
  /** Card / thumbnail image */
  image: string
  /** Full-width hero image for detail page */
  hero_image?: string
  /** Gallery images */
  gallery?: string[]
  description?: string
  short_description?: string
  /** Start date YYYY-MM-DD */
  date: string
  /** Start time HH:MM */
  time?: string
  /** End date YYYY-MM-DD */
  end_date?: string
  /** End time HH:MM */
  end_time?: string
  location?: string
  organizer?: string
  is_free?: boolean
  ticket_url?: string
  ticket_price?: string
  is_featured?: boolean
  category?: EventCategory
  tags?: string[]
  meta?: MetaInfo
}
