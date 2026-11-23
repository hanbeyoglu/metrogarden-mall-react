import { allStores, allCampaigns, allEvents, allMovies } from '@/data'
import { ROUTES, EVENT_CATEGORIES } from '@/lib/constants'
import type { Store, Campaign, Event, Movie } from '@/types'
import { formatCategory, formatFloor } from '@/lib/format'

/* ── Turkish character normalization ────────────────────── */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim()
}

export function matches(haystack: string | undefined | null, needle: string): boolean {
  if (!haystack) return false
  return normalize(haystack).includes(normalize(needle))
}

/* ── Result types ─────────────────────────────────────── */
export type SearchResultType = 'store' | 'campaign' | 'event' | 'movie' | 'page'

export interface SearchResult {
  type: SearchResultType
  id: string
  title: string
  subtitle?: string
  categoryLabel?: string
  thumbnail?: string
  href: string
}

export interface GroupedResults {
  stores: SearchResult[]
  campaigns: SearchResult[]
  events: SearchResult[]
  movies: SearchResult[]
  pages: SearchResult[]
}

/* ── Static pages index ──────────────────────────────── */
interface StaticPage {
  id: string
  label: string
  description: string
  href: string
  keywords: string[]
}

const STATIC_PAGES: StaticPage[] = [
  { id: 'home', label: 'Ana Sayfa', description: 'Metrogarden AVM anasayfası', href: ROUTES.HOME, keywords: ['ana sayfa', 'anasayfa', 'home'] },
  { id: 'stores', label: 'Mağazalar', description: 'Tüm mağazaları keşfedin', href: ROUTES.STORES, keywords: ['mağaza', 'dükkan', 'alışveriş', 'shop'] },
  { id: 'campaigns', label: 'Kampanyalar', description: 'Güncel fırsatlar ve indirimler', href: ROUTES.CAMPAIGNS, keywords: ['kampanya', 'indirim', 'fırsat', 'discount'] },
  { id: 'events', label: 'Etkinlikler', description: 'Yaklaşan etkinlikler', href: ROUTES.EVENTS, keywords: ['etkinlik', 'event', 'konser', 'workshop'] },
  { id: 'cinema', label: 'Sinema', description: 'Vizyondaki filmler ve seans saatleri', href: ROUTES.CINEMA, keywords: ['sinema', 'film', 'bilet', 'seans'] },
  { id: 'services', label: 'Hizmetler', description: 'AVM hizmetleri ve ziyaretçi olanakları', href: ROUTES.SERVICES, keywords: ['hizmet', 'hizmetler', 'otopark', 'danışma', 'services', 'amenities'] },
  { id: 'about', label: 'Hakkımızda', description: 'Metrogarden AVM hakkında bilgi', href: ROUTES.ABOUT, keywords: ['hakkımızda', 'tarih', 'hakkında', 'about'] },
  { id: 'contact', label: 'İletişim', description: 'Bize ulaşın', href: ROUTES.CONTACT, keywords: ['iletişim', 'adres', 'telefon', 'email', 'contact'] },
  { id: 'kvkk', label: 'KVKK Aydınlatma Metni', description: 'Kişisel verilerin korunması', href: ROUTES.KVKK, keywords: ['kvkk', 'kişisel veri', 'gizlilik'] },
  { id: 'privacy', label: 'Gizlilik Politikası', description: 'Gizlilik ve veri politikası', href: ROUTES.PRIVACY, keywords: ['gizlilik', 'privacy', 'veri'] },
  { id: 'cookie', label: 'Çerez Politikası', description: 'Çerez kullanımı hakkında', href: ROUTES.COOKIE_POLICY, keywords: ['çerez', 'cookie'] },
]

/* ── Per-type limits ─────────────────────────────────── */
const MAX_PER_TYPE = 5

/* ── Main search function ────────────────────────────── */
export function searchAll(
  query: string,
  content: { stores: Store[]; campaigns: Campaign[]; events: Event[]; movies: Movie[] } = {
    stores: allStores,
    campaigns: allCampaigns,
    events: allEvents,
    movies: allMovies,
  },
): GroupedResults {
  const q = query.trim()
  if (!q) return { stores: [], campaigns: [], events: [], movies: [], pages: [] }

  /* Stores */
  const stores: SearchResult[] = content.stores
    .filter((s) =>
      matches(s.name, q) ||
      matches(formatCategory(s.category, s.category_label), q) ||
      matches(s.description, q),
    )
    .slice(0, MAX_PER_TYPE)
    .map((s) => ({
      type: 'store',
      id: s.id,
      title: s.name,
      subtitle: [s.category ? formatCategory(s.category, s.category_label) : '', s.floor ? formatFloor(s.floor, s.floor_label) : ''].filter(Boolean).join(' · '),
      thumbnail: s.cover_image,
      href: ROUTES.STORE_DETAIL(s.slug),
    }))

  /* Campaigns */
  const campaigns: SearchResult[] = content.campaigns
    .filter((c) =>
      matches(c.title, q) ||
      matches(c.short_description, q) ||
      matches(c.store?.name, q) ||
      matches(c.discount_label, q),
    )
    .slice(0, MAX_PER_TYPE)
    .map((c) => ({
      type: 'campaign',
      id: c.id,
      title: c.title,
      subtitle: c.store?.name ?? undefined,
      categoryLabel: c.discount_label ?? undefined,
      thumbnail: c.image,
      href: ROUTES.CAMPAIGN_DETAIL(c.slug),
    }))

  /* Events */
  const events: SearchResult[] = content.events
    .filter((e) =>
      matches(e.title, q) ||
      matches(e.short_description, q) ||
      matches(e.category ? EVENT_CATEGORIES[e.category] : undefined, q) ||
      matches(e.organizer, q) ||
      matches(e.location, q),
    )
    .slice(0, MAX_PER_TYPE)
    .map((e) => ({
      type: 'event',
      id: e.id,
      title: e.title,
      subtitle: e.location ?? undefined,
      categoryLabel: e.category ? EVENT_CATEGORIES[e.category] : undefined,
      thumbnail: e.image,
      href: ROUTES.EVENT_DETAIL(e.slug),
    }))

  /* Movies */
  const movies: SearchResult[] = content.movies
    .filter((m) =>
      matches(m.title, q) ||
      matches(m.synopsis, q) ||
      matches(m.director, q) ||
      m.genre?.some((g) => matches(g, q)),
    )
    .slice(0, MAX_PER_TYPE)
    .map((m) => ({
      type: 'movie',
      id: m.id,
      title: m.title,
      subtitle: m.director ? `Yön: ${m.director}` : undefined,
      categoryLabel: m.genre?.[0] ?? undefined,
      thumbnail: m.poster,
      href: ROUTES.CINEMA,
    }))

  /* Static Pages */
  const pages: SearchResult[] = STATIC_PAGES
    .filter((p) =>
      matches(p.label, q) ||
      matches(p.description, q) ||
      p.keywords.some((k) => matches(k, q)),
    )
    .slice(0, MAX_PER_TYPE)
    .map((p) => ({
      type: 'page',
      id: p.id,
      title: p.label,
      subtitle: p.description,
      href: p.href,
    }))

  return { stores, campaigns, events, movies, pages }
}

/* ── Recent searches (localStorage) ─────────────────── */
const RECENT_KEY = 'metrogarden_search_recent'
const MAX_RECENT = 8

export function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

export function addRecentSearch(query: string): void {
  const trimmed = query.trim()
  if (!trimmed) return
  const searches = getRecentSearches().filter((s) => normalize(s) !== normalize(trimmed))
  searches.unshift(trimmed)
  localStorage.setItem(RECENT_KEY, JSON.stringify(searches.slice(0, MAX_RECENT)))
}

export function clearRecentSearches(): void {
  localStorage.removeItem(RECENT_KEY)
}

/* ── Popular searches (dummy) ────────────────────────── */
export const POPULAR_SEARCHES = [
  'Nike',
  'Apple',
  'Starbucks',
  'Sinema',
  'Zara',
  'Çocuk Atölyesi',
]
