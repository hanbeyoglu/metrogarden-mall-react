export interface CmsEnvelope<T> {
  success: true
  data: T
  locale?: string | null
  tenant?: { id: string; mallId: string | null }
  pagination?: { page: number; limit: number; total: number; totalPages: number }
}

export interface CmsMedia {
  id: string
  url: string
  alt: string | null
  caption?: string | null
}

export interface CmsSiteConfig {
  tenantId: string
  tenantName: string
  tenantSlug: string
  mallId: string | null
  mallName: string | null
  mallSlug: string | null
  defaultLocale: string | null
  activeLocale: string | null
  location: {
    id: string
    name: string
    displayName: string | null
    slug: string
    websiteUrl: string | null
    phone: string | null
    supportEmail: string | null
    logo: CmsMedia | null
    cover: CmsMedia | null
    address: {
      line1: string | null
      line2: string | null
      city: string | null
      district: string | null
      country: string | null
      postalCode: string | null
    } | null
    coordinates: { latitude: number; longitude: number } | null
    workingHours: unknown
    socialLinks: unknown
  } | null
}

export interface CmsSliderItem {
  id: string
  title?: string | null
  description?: string | null
  subtitle?: string | null
  buttonText?: string | null
  linkUrl?: string | null
  linkValue?: string | null
  image?: CmsMedia | null
  mobileImage?: CmsMedia | null
  desktopMedia?: CmsMedia | null
  mobileMedia?: CmsMedia | null
  sortOrder?: number
}

export interface CmsSlider {
  id: string
  title: string
  placementType: string
  sortOrder?: number
  items?: CmsSliderItem[]
  subtitle?: string | null
  description?: string | null
  buttonText?: string | null
  linkValue?: string | null
  image?: CmsMedia | null
  mobileImage?: CmsMedia | null
  desktopMedia?: CmsMedia | null
  mobileMedia?: CmsMedia | null
}

export interface CmsStore {
  id: string
  name: string
  description: string | null
  floor: { id: string; name: string; label: string } | null
  phone: string | null
  email: string | null
  workingHours: unknown
  isFeatured: boolean
  isSoon: boolean
  logo: CmsMedia | null
  category: { id: string; slug: string; name: string } | null
  globalStore: {
    id: string
    name: string
    slug: string
    websiteUrl: string | null
    logo: CmsMedia | null
    socialLinks: { platform: string; url: string }[]
  }
}

export interface CmsCampaign {
  id: string
  slug: string
  title: string
  shortDescription: string | null
  description: string | null
  image: CmsMedia | null
  campaignStartAt: string | null
  campaignEndAt: string | null
  terms: string | null
  couponCode: string | null
  buttonText: string | null
  linkUrl: string | null
  store: { id: string; name: string; slug: string } | null
}

export interface CmsEvent {
  id: string
  slug: string
  title: string
  shortDescription: string | null
  description: string | null
  image: CmsMedia | null
  coverMedia?: CmsMedia | null
  /** Optional event gallery/slider images returned by the public event API. */
  sliders?: CmsEventSlide[] | null
  eventStartAt: string | null
  eventEndAt: string | null
  location: string | null
  category: string | null
  organizer?: string | null
  isFree?: boolean | null
  ticketPrice?: string | number | null
  ticketUrl?: string | null
  buttonText?: string | null
  linkUrl?: string | null
}

export interface CmsEventSlide {
  id?: string
  url?: string
  image?: CmsMedia | null
  media?: CmsMedia | null
  coverMedia?: CmsMedia | null
  desktopMedia?: CmsMedia | null
  mobileMedia?: CmsMedia | null
  sortOrder?: number
}

export interface CmsMovieSession {
  id: string
  cinema: { id: string; name: string; slug: string }
  movie: {
    id: string
    title: string
    slug: string
    durationMinutes: number | null
    releaseDate: string | null
    ticketUrl: string | null
    poster: CmsMedia | null
    categories: { id: string; name: string; slug: string }[]
  }
  hallName: string | null
  startsAt: string
  endsAt: string | null
  language: string | null
  subtitle: string | null
  ticketUrl: string | null
}

/** Active movie returned by the public CMS movie-list endpoint. */
export interface CmsActiveMovie {
  id: string
  listingStatus?: 'NOW_PLAYING' | 'UPCOMING' | 'OTHER'
  title: string
  slug: string
  description: string | null
  durationMinutes: number | null
  releaseDate: string | null
  ticketUrl: string | null
  trailer?: {
    provider: 'YOUTUBE'
    videoId: string
    url: string
    embedUrl: string
  } | null
  trailerUrl?: string | null
  tmdbVoteAverage?: number | null
  poster: CmsMedia | null
  /** Original TMDB poster path, used when no CMS media asset is attached. */
  posterPath?: string | null
  categories: { id: string; name: string; slug: string }[]
}

export interface CmsHome {
  sliders: CmsSlider[]
  featuredStores: CmsStore[]
  upcomingEvents: CmsEvent[]
  activeCampaigns: CmsCampaign[]
  todayMovieSessions: CmsMovieSession[]
}

export interface CmsPageData {
  id: string
  slug: string
  title: string
  type: string
  contentHtml: string | null
  renderMode: string
  seoTitle: string | null
  seoDescription: string | null
  publishedAt: string | null
  blocks: { id: string; type: string; title: string | null; dataJson: unknown; sortOrder: number }[]
}

/** Location amenity / facility from GET /public/services. */
export interface CmsService {
  id: string
  mallId: string
  name: string
  description: string | null
  icon: CmsMedia | null
  cover: CmsMedia | null
  category: string | null
  floor: string | null
  unitNo: string | null
  phone: string | null
  email: string | null
  websiteUrl: string | null
  locationLabel: string | null
  workingHours?: unknown
  latitude: number | null
  longitude: number | null
  searchTags: string[]
  isSoon: boolean
  sortOrder: number
}
