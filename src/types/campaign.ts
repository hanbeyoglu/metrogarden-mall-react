import type { MetaInfo } from './mall'
import type { StoreRef, StoreCategory } from './store'

export interface CampaignFilters {
  status?: CampaignStatus
  store_slug?: string
  category?: StoreCategory
  limit?: number
}

export type CampaignStatus = 'active' | 'ending-soon' | 'expired' | 'upcoming'

export interface Campaign {
  id: string
  /** Public CMS record ID; absent for local demo content. */
  analytics_id?: string
  slug: string
  title: string
  /** Card / thumbnail image */
  image: string
  /** Full-width hero image for detail page (falls back to image) */
  hero_image?: string
  /** Optional additional gallery images */
  images?: string[]
  /** One-liner for card previews */
  short_description?: string
  /** Full marketing description */
  description?: string
  /** Terms & conditions text */
  terms?: string
  discount_label?: string
  store?: StoreRef
  /** Inherited from store.category for filtering */
  category?: StoreCategory
  start_date: string
  end_date?: string
  /** Explicit status — mirrors what CMS will provide */
  status: CampaignStatus
  is_active: boolean
  is_featured: boolean
  meta?: MetaInfo
}
