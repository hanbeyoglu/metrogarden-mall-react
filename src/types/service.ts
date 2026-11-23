export interface ServiceFilters {
  q?: string
  category?: string
}

export interface ServiceWorkingHoursDay {
  day: string
  open: boolean
  from?: string
  to?: string
}

export interface ServiceWorkingHours {
  schedule?: string
  exceptions?: string
  days?: ServiceWorkingHoursDay[]
}

/** Mall amenity / facility mapped from the CMS public services API. */
export interface MallService {
  id: string
  name: string
  description?: string
  icon?: string
  icon_alt?: string
  cover_image?: string
  cover_alt?: string
  category?: string
  floor?: string
  unit_no?: string
  phone?: string
  email?: string
  website?: string
  location_label?: string
  working_hours?: ServiceWorkingHours
  latitude?: number
  longitude?: number
  map_url?: string
  search_tags?: string[]
  is_soon?: boolean
  sort_order: number
}
