import type { StoreCategory, StoreFloor, EventCategory } from '@/types'
import { STORE_CATEGORIES, STORE_FLOORS, EVENT_CATEGORIES, ENDING_SOON_DAYS } from './constants'

const TR_LOCALE = 'tr-TR'

/** Full date: "15 Temmuz 2026" */
export function formatDateFull(dateString: string): string {
  return new Date(dateString).toLocaleDateString(TR_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Short date: "15 Tem" */
export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString(TR_LOCALE, {
    day: 'numeric',
    month: 'short',
  })
}

/** Day number: "15" */
export function formatDay(dateString: string): string {
  return new Date(dateString).toLocaleDateString(TR_LOCALE, { day: 'numeric' })
}

/** Month name: "Temmuz" */
export function formatMonth(dateString: string): string {
  return new Date(dateString).toLocaleDateString(TR_LOCALE, { month: 'long' })
}

/** Short month: "Tem" */
export function formatMonthShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString(TR_LOCALE, { month: 'short' })
}

/** Year: "2026" */
export function formatYear(dateString: string): string {
  return new Date(dateString).toLocaleDateString(TR_LOCALE, { year: 'numeric' })
}

/** Month + Year: "Temmuz 2026" */
export function formatMonthYear(dateString: string): string {
  return new Date(dateString).toLocaleDateString(TR_LOCALE, {
    month: 'long',
    year: 'numeric',
  })
}

/** Date range: "15 Temmuz – 30 Ağustos 2026" */
export function formatDateRange(start: string, end?: string): string {
  if (!end) return formatDateFull(start)
  const startDate = new Date(start)
  const endDate = new Date(end)
  const sameYear = startDate.getFullYear() === endDate.getFullYear()
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth()

  if (sameMonth) {
    return `${formatDay(start)} – ${formatDateFull(end)}`
  }
  if (sameYear) {
    return `${formatDateShort(start)} – ${formatDateFull(end)}`
  }
  return `${formatDateFull(start)} – ${formatDateFull(end)}`
}

/** Duration in minutes to "1s 45dk" */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}dk`
  if (m === 0) return `${h}s`
  return `${h}s ${m}dk`
}

/** Days until a date. Negative means in the past. */
export function daysUntil(dateString: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateString)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function isExpired(dateString: string): boolean {
  return daysUntil(dateString) < 0
}

export function isEndingSoon(dateString: string, days = ENDING_SOON_DAYS): boolean {
  const remaining = daysUntil(dateString)
  return remaining >= 0 && remaining <= days
}

/** "Tümü" → "tumü" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Get initials: "Metrogarden AVM" → "MA" */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}

export function formatFloor(floor: StoreFloor, label?: string): string {
  return label?.trim() || STORE_FLOORS[floor] || floor
}

export function formatCategory(category: StoreCategory, label?: string): string {
  return label?.trim() || STORE_CATEGORIES[category] || category
}

export function formatEventCategory(category: EventCategory): string {
  return EVENT_CATEGORIES[category] ?? category
}

/** Format genre array: ["Drama", "Action"] → "Drama · Aksiyon" */
export function formatGenres(genres: string[]): string {
  return genres.join(' · ')
}
