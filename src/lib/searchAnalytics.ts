import { trackAnalytics } from '@/lib/analytics'
import type { SearchResult } from '@/lib/searchUtils'

/** Track the selected result without sending the visitor's query or result text. */
export function trackSearchClick(result: SearchResult): void {
  switch (result.type) {
    case 'store':
      void trackAnalytics({ entityType: 'STORE', eventType: 'STORE_CLICK', entityId: result.analyticsId, path: result.href, source: 'search' })
      break
    case 'campaign':
      void trackAnalytics({ entityType: 'CAMPAIGN', eventType: 'CAMPAIGN_CLICK', entityId: result.analyticsId, path: result.href, source: 'search' })
      break
    case 'event':
      void trackAnalytics({ entityType: 'EVENT', eventType: 'EVENT_CLICK', entityId: result.analyticsId, path: result.href, source: 'search' })
      break
    case 'movie':
      void trackAnalytics({ entityType: 'MOVIE', eventType: 'MOVIE_CLICK', entityId: result.analyticsId, path: result.href, source: 'search' })
      break
    case 'page':
    case 'service':
      void trackAnalytics({ entityType: 'CUSTOM', eventType: 'LINK_CLICK', path: result.href, source: 'search' })
      break
  }
}
