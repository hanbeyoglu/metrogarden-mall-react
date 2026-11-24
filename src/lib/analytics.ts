import i18n from '@/i18n/i18n'
import { ApiError, apiClient, hasPublicApiConfig } from '@/api/client'
import { createAnalyticsTracker, createAnalyticsTransport, type AnalyticsPayload, type AnalyticsInput } from './analyticsCore'

// No consent manager currently writes this key. Tracking stays disabled until
// a real consent UI records an explicit analytics opt-in here.
export const ANALYTICS_CONSENT_STORAGE_KEY = 'metrogarden-cookie-consent'

export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY) === 'accepted'
  } catch {
    return false
  }
}

function currentLocale(): string {
  return i18n.resolvedLanguage?.toLowerCase().startsWith('en') || i18n.language?.toLowerCase().startsWith('en')
    ? 'en'
    : 'tr'
}

const analyticsTransport = createAnalyticsTransport((path, payload, options) => apiClient.post<{ success?: boolean; data?: { accepted?: boolean } }>(path, payload, options))

async function sendAnalytics(payload: AnalyticsPayload): Promise<{ accepted: boolean; status?: number }> {
  try {
    return await analyticsTransport(payload)
  } catch (error) {
    if (error instanceof ApiError) return { accepted: false, status: error.status }
    throw error
  }
}

const tracker = createAnalyticsTracker({
  hasConsent: () => hasPublicApiConfig(true) && hasAnalyticsConsent(),
  send: sendAnalytics,
  getLocale: currentLocale,
  getOrigin: () => window.location.origin,
  makeId: () => crypto.randomUUID(),
})

export function trackAnalytics(input: AnalyticsInput): Promise<void> {
  return tracker(input)
}

export { cleanInternalPath } from './analyticsCore'
