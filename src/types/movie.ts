import type { MetaInfo } from './mall'

export interface MovieFilters {
  current?: boolean
  limit?: number
}

export interface ShowtimeFilters {
  date: string
}

export interface Showtime {
  id: string
  date: string
  time: string
  hall?: string
  is_sold_out: boolean
}

export type MovieStatus = 'now-showing' | 'coming-soon'

export interface MovieTrailer {
  provider: 'YOUTUBE'
  videoId: string
  url: string
  embedUrl: string
}

export type MovieGenre =
  | 'Animasyon'
  | 'Aksiyon'
  | 'Komedi'
  | 'Dram'
  | 'Aile'
  | 'Bilim Kurgu'
  | 'Gerilim'
  | 'Korku'
  | 'Macera'
  | 'Müzikal'
  | 'Romantik'
  | 'Suç'
  | 'Biyografi'

export interface Movie {
  id: string
  slug: string
  title: string
  /** Portrait poster 2:3 */
  poster: string
  /** Wide cover image 16:9 */
  cover_image?: string
  gallery?: string[]
  synopsis?: string
  genre?: string[]
  director?: string
  cast?: string[]
  language?: string
  subtitle?: string
  rating?: string
  /** Rating supplied by the CMS movie provider (TMDB vote average). */
  tmdb_rating?: number
  trailer?: MovieTrailer | null
  /** Legacy raw URL retained for CMS responses that predate normalized trailer data. */
  trailer_url?: string
  duration?: number
  release_date?: string
  status: MovieStatus
  is_current: boolean
  is_featured?: boolean
  /** Times shown for every selected day (dummy data) */
  daily_times?: string[]
  /** Legacy: date-specific showtimes (kept for backward compat) */
  showtimes?: Showtime[]
  ticket_url?: string
  meta?: MetaInfo
}
