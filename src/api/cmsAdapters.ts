import type { Campaign, Event, EventCategory, Mall, MallService, Movie, Showtime, Slider, Store } from '@/types'
import { mall as demoMall } from '@/data/mall'
import type { CmsActiveMovie, CmsCampaign, CmsEvent, CmsMovieSession, CmsService, CmsSiteConfig, CmsSlider, CmsStore } from './cmsTypes'

function mediaUrl(media: { url: string } | null | undefined): string {
  return media?.url ?? ''
}

function tmdbPosterUrl(path: string | null | undefined): string {
  if (!path?.trim()) return ''
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `https://image.tmdb.org/t/p/w500${normalized}`
}

function toWorkingHours(value: unknown): { schedule: string; exceptions?: string } | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return { schedule: value }
  if (typeof value === 'object') {
    const hours = value as Record<string, unknown>
    if (typeof hours.schedule === 'string') {
      return { schedule: hours.schedule, exceptions: typeof hours.exceptions === 'string' ? hours.exceptions : undefined }
    }
    const schedule = Object.entries(hours)
      .map(([day, range]) => `${day}: ${typeof range === 'string' ? range : JSON.stringify(range)}`)
      .join(' · ')
    return schedule ? { schedule } : undefined
  }
  return undefined
}

function toStoreWorkingHours(value: unknown): Store['working_hours'] {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value !== 'object' || Array.isArray(value)) return undefined

  const hours = value as Record<string, unknown>
  if (typeof hours.schedule === 'string') return { schedule: hours.schedule }

  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const days = weekdays.flatMap((day) => {
    const slot = hours[day]
    if (!slot || typeof slot !== 'object' || Array.isArray(slot)) return []
    const data = slot as Record<string, unknown>
    if (typeof data.open !== 'boolean') return []
    return [{
      day,
      open: data.open,
      from: typeof data.from === 'string' ? data.from : undefined,
      to: typeof data.to === 'string' ? data.to : undefined,
    }]
  })

  return days.length ? { days } : undefined
}

function toServiceWorkingHours(value: unknown): MallService['working_hours'] {
  if (!value) return undefined
  if (typeof value === 'string') return { schedule: value }
  if (typeof value !== 'object' || Array.isArray(value)) return undefined

  const hours = value as Record<string, unknown>
  if (typeof hours.schedule === 'string') {
    return {
      schedule: hours.schedule,
      exceptions: typeof hours.exceptions === 'string' ? hours.exceptions : undefined,
    }
  }

  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const days = weekdays.flatMap((day) => {
    const slot = hours[day]
    if (!slot || typeof slot !== 'object' || Array.isArray(slot)) return []
    const data = slot as Record<string, unknown>
    if (typeof data.open !== 'boolean') return []
    return [{
      day,
      open: data.open,
      from: typeof data.from === 'string' ? data.from : undefined,
      to: typeof data.to === 'string' ? data.to : undefined,
    }]
  })

  if (days.length) {
    return {
      days,
      exceptions: typeof hours.exceptions === 'string' ? hours.exceptions : undefined,
    }
  }

  return toWorkingHours(value)
}

function toSocialLinks(value: unknown): Mall['social_links'] {
  if (Array.isArray(value)) {
    return Object.fromEntries(
      value
        .filter((item): item is { platform: string; url: string } => Boolean(item && typeof item.platform === 'string' && typeof item.url === 'string'))
        .map(({ platform, url }) => [platform.toLowerCase(), url]),
    )
  }
  if (value && typeof value === 'object') return value as Mall['social_links']
  return undefined
}

export function mapMall(config: CmsSiteConfig): Mall {
  const location = config.location
  if (!location) return demoMall
  const address = location.address
  const addressText = address
    ? [address.line1, address.line2, address.district, address.city, address.postalCode, address.country]
        .filter(Boolean)
        .join(', ')
    : demoMall.address
  const coordinates = location.coordinates
  return {
    ...demoMall,
    id: location.id,
    name: location.displayName || location.name || config.mallName || config.tenantName,
    stores_hero_image: mediaUrl(location.cover) || demoMall.stores_hero_image,
    address: addressText,
    phone: location.phone || demoMall.phone,
    email: location.supportEmail || demoMall.email,
    website: location.websiteUrl || undefined,
    google_maps_url: coordinates
      ? `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`
      : demoMall.google_maps_url,
    google_maps_embed_url: coordinates
      ? `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&output=embed`
      : demoMall.google_maps_embed_url,
    working_hours: toWorkingHours(location.workingHours) ?? demoMall.working_hours,
    social_links: toSocialLinks(location.socialLinks) ?? demoMall.social_links,
    meta: { title: config.mallName || config.tenantName },
  }
}

export function mapStore(item: CmsStore): Store {
  const logo = item.logo ?? item.globalStore.logo
  const socialLinks = Object.fromEntries(item.globalStore.socialLinks.map(({ platform, url }) => [platform.toLowerCase(), url]))
  return {
    id: item.id,
    analytics_id: item.id,
    slug: item.globalStore.slug,
    name: item.name || item.globalStore.name,
    logo: mediaUrl(logo) || undefined,
    cover_image: mediaUrl(logo) || undefined,
    category: item.category?.slug ?? '',
    category_label: item.category?.name || undefined,
    floor: item.floor?.id ?? item.floor?.name ?? '',
    floor_label: item.floor?.label || item.floor?.name || undefined,
    description: item.description || undefined,
    working_hours: toStoreWorkingHours(item.workingHours),
    phone: item.phone || undefined,
    website: item.globalStore.websiteUrl || undefined,
    email: item.email || undefined,
    social_links: socialLinks,
    is_featured: item.isFeatured,
    is_active: true,
  }
}

function campaignStatus(start?: string | null, end?: string | null): Campaign['status'] {
  const now = Date.now()
  const startTime = start ? new Date(start).getTime() : 0
  const endTime = end ? new Date(end).getTime() : Number.POSITIVE_INFINITY
  if (startTime > now) return 'upcoming'
  if (endTime < now) return 'expired'
  if (endTime - now <= 7 * 24 * 60 * 60 * 1000) return 'ending-soon'
  return 'active'
}

export function mapCampaign(item: CmsCampaign): Campaign {
  return {
    id: item.id,
    analytics_id: item.id,
    slug: item.slug,
    title: item.title,
    image: mediaUrl(item.image),
    short_description: item.shortDescription ?? undefined,
    description: item.description ?? undefined,
    terms: item.terms ?? undefined,
    discount_label: item.couponCode ?? undefined,
    store: item.store ? { ...item.store } : undefined,
    start_date: item.campaignStartAt ?? new Date().toISOString(),
    end_date: item.campaignEndAt ?? undefined,
    status: campaignStatus(item.campaignStartAt, item.campaignEndAt),
    is_active: campaignStatus(item.campaignStartAt, item.campaignEndAt) !== 'expired',
    is_featured: false,
    meta: undefined,
  }
}

const EVENT_CATEGORIES = new Set<EventCategory>([
  'culture', 'entertainment', 'kids', 'food', 'sports', 'other', 'concert', 'workshop', 'exhibition', 'festival',
])

export function mapEvent(item: CmsEvent): Event {
  const startsAt = item.eventStartAt ?? new Date().toISOString()
  const date = new Date(startsAt)
  const categoryKey = (item.category ?? '').toLowerCase() as EventCategory
  const gallery = (item.sliders ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((slide) => slide.url || mediaUrl(slide.image ?? slide.media ?? slide.coverMedia ?? slide.desktopMedia ?? slide.mobileMedia))
    .filter(Boolean)
  const image = mediaUrl(item.image ?? item.coverMedia) || gallery[0] || ''
  return {
    id: item.id,
    analytics_id: item.id,
    slug: item.slug,
    title: item.title,
    image,
    hero_image: mediaUrl(item.coverMedia) || gallery[0] || image || undefined,
    gallery,
    description: item.description ?? undefined,
    short_description: item.shortDescription ?? undefined,
    date: startsAt.slice(0, 10),
    time: Number.isNaN(date.getTime()) ? undefined : date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    end_date: item.eventEndAt?.slice(0, 10),
    location: item.location ?? undefined,
    organizer: item.organizer ?? undefined,
    is_free: item.isFree ?? undefined,
    ticket_price: item.ticketPrice === null || item.ticketPrice === undefined ? undefined : String(item.ticketPrice),
    ticket_url: item.ticketUrl || item.linkUrl || undefined,
    category: EVENT_CATEGORIES.has(categoryKey) ? categoryKey : 'other',
    meta: undefined,
  }
}

export function mapSliders(groups: CmsSlider[]): Slider[] {
  return groups.flatMap((group) => {
    const items = group.items?.length
      ? group.items.map((item) => {
          const media = item.image ?? item.desktopMedia ?? item.mobileImage ?? item.mobileMedia
          return {
            id: item.id,
            analytics_id: group.id,
            title: item.title || media?.caption || media?.alt || '',
            subtitle: item.subtitle || item.description || undefined,
            image: mediaUrl(media),
            cta_label: item.buttonText ?? undefined,
            cta_url: item.linkUrl || item.linkValue || undefined,
            order: (group.sortOrder ?? 0) * 100 + (item.sortOrder ?? 0),
            is_active: true,
          }
        })
      : (() => {
          const media = group.image ?? group.desktopMedia ?? group.mobileImage ?? group.mobileMedia
          return [{
            id: group.id,
            analytics_id: group.id,
            title: media?.caption || media?.alt || '',
            subtitle: group.subtitle || group.description || undefined,
            image: mediaUrl(media),
            cta_label: group.buttonText ?? undefined,
            cta_url: group.linkValue ?? undefined,
            order: group.sortOrder ?? 0,
            is_active: true,
          }]
        })()

    return items.filter((item) => item.image)
  })
}

export function mapMovieSessions(sessions: CmsMovieSession[]): Movie[] {
  const movies = new Map<string, Movie>()
  for (const session of sessions) {
    const source = session.movie
    const existing = movies.get(source.id)
    const showtime = mapShowtime(session)
    if (existing) {
      existing.showtimes?.push(showtime)
      continue
    }
    movies.set(source.id, {
      id: source.id,
      analytics_id: source.id,
      slug: source.slug,
      title: source.title,
      poster: mediaUrl(source.poster),
      synopsis: undefined,
      genre: source.categories.map((category) => category.name),
      duration: source.durationMinutes ?? undefined,
      release_date: source.releaseDate ?? undefined,
      status: 'now-showing',
      is_current: true,
      ticket_url: source.ticketUrl ?? session.ticketUrl ?? undefined,
      showtimes: [showtime],
    })
  }
  return [...movies.values()]
}

export function mapActiveMovies(items: CmsActiveMovie[]): Movie[] {
  const today = new Date().toISOString().slice(0, 10)
  return items.map((item) => {
    const isComingSoon = item.listingStatus
      ? item.listingStatus === 'UPCOMING'
      : Boolean(item.releaseDate && item.releaseDate.slice(0, 10) > today)
    return {
      id: item.id,
      analytics_id: item.id,
      slug: item.slug,
      title: item.title,
      poster: mediaUrl(item.poster) || tmdbPosterUrl(item.posterPath),
      synopsis: item.description ?? undefined,
      genre: item.categories.map((category) => category.name),
      tmdb_rating: item.tmdbVoteAverage ?? undefined,
      trailer: item.trailer ?? undefined,
      trailer_url: item.trailerUrl ?? undefined,
      duration: item.durationMinutes ?? undefined,
      release_date: item.releaseDate ?? undefined,
      status: isComingSoon ? 'coming-soon' : 'now-showing',
      is_current: !isComingSoon,
      ticket_url: item.ticketUrl ?? undefined,
    }
  })
}

export function mapShowtime(session: CmsMovieSession): Showtime {
  const startsAt = new Date(session.startsAt)
  return {
    id: session.id,
    date: Number.isNaN(startsAt.getTime()) ? session.startsAt.slice(0, 10) : startsAt.toISOString().slice(0, 10),
    time: Number.isNaN(startsAt.getTime()) ? '' : startsAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    hall: session.hallName ?? undefined,
    is_sold_out: false,
  }
}

export function mapService(item: CmsService): MallService {
  const hasCoordinates =
    typeof item.latitude === 'number' &&
    Number.isFinite(item.latitude) &&
    typeof item.longitude === 'number' &&
    Number.isFinite(item.longitude)

  return {
    id: item.id,
    name: item.name,
    description: item.description || undefined,
    icon: mediaUrl(item.icon) || undefined,
    icon_alt: item.icon?.alt || undefined,
    cover_image: mediaUrl(item.cover) || undefined,
    cover_alt: item.cover?.alt || undefined,
    category: item.category || undefined,
    floor: item.floor || undefined,
    unit_no: item.unitNo || undefined,
    phone: item.phone || undefined,
    email: item.email || undefined,
    website: item.websiteUrl || undefined,
    location_label: item.locationLabel || undefined,
    working_hours: toServiceWorkingHours(item.workingHours),
    latitude: hasCoordinates ? item.latitude! : undefined,
    longitude: hasCoordinates ? item.longitude! : undefined,
    map_url: hasCoordinates
      ? `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`
      : undefined,
    search_tags: item.searchTags?.length ? item.searchTags : undefined,
    is_soon: item.isSoon || undefined,
    sort_order: item.sortOrder ?? 0,
  }
}
