import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { trackAnalytics } from '@/lib/analytics'
import type { AnalyticsViewInput } from '@/lib/analyticsCore'

export function useAnalyticsView(input: AnalyticsViewInput) {
  const location = useLocation()
  const lastEventKey = useRef<string | null>(null)

  useEffect(() => {
    if (!input.entityId) return
    const key = `${location.key}:${input.entityType}:${input.entityId}:${input.eventType}`
    if (lastEventKey.current === key) return
    lastEventKey.current = key
    void trackAnalytics({ ...input, path: location.pathname })
  }, [input, location.key, location.pathname])
}
