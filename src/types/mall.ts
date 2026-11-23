export interface MetaInfo {
  title?: string
  description?: string
  og_image?: string
}

export interface SocialLinks {
  instagram?: string
  facebook?: string
  twitter?: string
  youtube?: string
}

export interface WorkingHours {
  schedule: string
  exceptions?: string
}

export interface MallStats {
  store_count: number
  floor_count: number
  parking_capacity: number
  operating_days: number
}

export interface Mall {
  id: string
  name: string
  tagline?: string
  description?: string
  editorial_statement?: string
  editorial_image?: string
  stores_hero_image?: string
  address: string
  phone: string
  email: string
  website?: string
  google_maps_embed_url?: string
  google_maps_url?: string
  working_hours?: WorkingHours
  social_links?: SocialLinks
  stats?: MallStats
  meta?: MetaInfo
}
