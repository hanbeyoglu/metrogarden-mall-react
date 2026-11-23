import type { Event, EventFilters } from '@/types'
import { getPublicData, getPublicList } from './public'
import { mapEvent } from './cmsAdapters'
import type { CmsEvent } from './cmsTypes'

export async function getEvents(filters?: EventFilters): Promise<Event[]> {
  const items = await getPublicList<CmsEvent>('/public/events', {}, 50)
  const events = items.map(mapEvent)
  return events.filter((event) => {
    if (filters?.category && event.category !== filters.category) return false
    const timestamp = new Date(event.date).getTime()
    if (filters?.upcoming && timestamp < Date.now()) return false
    if (filters?.past && timestamp >= Date.now()) return false
    return true
  })
}

export async function getEvent(slug: string): Promise<Event> {
  return mapEvent(await getPublicData<CmsEvent>(`/public/events/${encodeURIComponent(slug)}`))
}
