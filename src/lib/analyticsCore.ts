export type AnalyticsEntityType = 'PAGE' | 'STORE' | 'EVENT' | 'CAMPAIGN' | 'CINEMA' | 'MOVIE' | 'MOVIE_SESSION' | 'SLIDER' | 'CUSTOM'

export type AnalyticsEventType =
  | 'PAGE_VIEW'
  | 'STORE_CLICK' | 'STORE_VIEW'
  | 'EVENT_CLICK' | 'EVENT_VIEW'
  | 'CAMPAIGN_CLICK' | 'CAMPAIGN_VIEW'
  | 'CINEMA_CLICK' | 'CINEMA_VIEW'
  | 'MOVIE_CLICK' | 'MOVIE_VIEW'
  | 'MOVIE_SESSION_CLICK'
  | 'SLIDER_CLICK'
  | 'LINK_CLICK'

export interface AnalyticsPayload {
  clientEventId: string
  entityType: AnalyticsEntityType
  entityId?: string
  eventType: AnalyticsEventType
  path: string
  locale: string
  metadataJson: { source: string }
}


export function createAnalyticsTransport(
  post: (path: string, body: AnalyticsPayload, options: { keepalive: true }) => Promise<{ success?: boolean; data?: { accepted?: boolean } }>,
) {
  return async (payload: AnalyticsPayload): Promise<{ accepted: boolean }> => {
    const response = await post('/public/analytics/track', payload, { keepalive: true })
    return { accepted: response?.success === true && response.data?.accepted === true }
  }
}

export function createLocationVisitGate() {
  let lastKey: string | null = null
  return {
    shouldTrack(key: string): boolean {
      if (lastKey === key) return false
      lastKey = key
      return true
    },
  }
}

type AnalyticsInputBase = { path: string; source: string }
export type AnalyticsInput =
  | (AnalyticsInputBase & { entityType: 'PAGE'; eventType: 'PAGE_VIEW'; entityId?: never })
  | (AnalyticsInputBase & { entityType: 'CUSTOM'; eventType: 'LINK_CLICK'; entityId?: never })
  | (AnalyticsInputBase & { entityType: 'STORE'; eventType: 'STORE_CLICK' | 'STORE_VIEW'; entityId?: string })
  | (AnalyticsInputBase & { entityType: 'EVENT'; eventType: 'EVENT_CLICK' | 'EVENT_VIEW'; entityId?: string })
  | (AnalyticsInputBase & { entityType: 'CAMPAIGN'; eventType: 'CAMPAIGN_CLICK' | 'CAMPAIGN_VIEW'; entityId?: string })
  | (AnalyticsInputBase & { entityType: 'CINEMA'; eventType: 'CINEMA_CLICK' | 'CINEMA_VIEW'; entityId?: string })
  | (AnalyticsInputBase & { entityType: 'MOVIE'; eventType: 'MOVIE_CLICK' | 'MOVIE_VIEW'; entityId?: string })
  | (AnalyticsInputBase & { entityType: 'MOVIE_SESSION'; eventType: 'MOVIE_SESSION_CLICK'; entityId?: string })
  | (AnalyticsInputBase & { entityType: 'SLIDER'; eventType: 'SLIDER_CLICK'; entityId?: string })

export type AnalyticsViewInput =
  | { entityType: 'STORE'; eventType: 'STORE_VIEW'; entityId?: string; source: string }
  | { entityType: 'EVENT'; eventType: 'EVENT_VIEW'; entityId?: string; source: string }
  | { entityType: 'CAMPAIGN'; eventType: 'CAMPAIGN_VIEW'; entityId?: string; source: string }
  | { entityType: 'CINEMA'; eventType: 'CINEMA_VIEW'; entityId?: string; source: string }
  | { entityType: 'MOVIE'; eventType: 'MOVIE_VIEW'; entityId?: string; source: string }

interface AnalyticsTrackerOptions {
  hasConsent: () => boolean
  send: (payload: AnalyticsPayload) => Promise<{ accepted: boolean; status?: number }>
  getLocale: () => string
  getOrigin: () => string
  makeId: () => string
}

export function cleanInternalPath(target: string, origin: string): string | null {
  try {
    const url = new URL(target, origin)
    if (url.origin !== origin) return null
    return url.pathname || '/'
  } catch {
    return null
  }
}

export function createAnalyticsTracker(options: AnalyticsTrackerOptions) {
  let rateLimited = false

  return async (input: AnalyticsInput): Promise<void> => {
    try {
      if (rateLimited || !options.hasConsent()) return

      // Entity-specific records must carry the public CMS record ID. PAGE and
      // CUSTOM are intentionally the only event categories without an entity ID.
      if (!['PAGE', 'CUSTOM'].includes(input.entityType) && !input.entityId) return

      const path = cleanInternalPath(input.path, options.getOrigin())
      if (!path) return

      const payload: AnalyticsPayload = {
        clientEventId: options.makeId(),
        entityType: input.entityType,
        ...(input.entityId ? { entityId: input.entityId } : {}),
        eventType: input.eventType,
        path,
        locale: options.getLocale(),
        metadataJson: { source: input.source },
      }

      const result = await options.send(payload)
      if (result.status === 429) rateLimited = true
    } catch {
      // Analytics must never affect site navigation or interaction.
    }
  }
}
