import { QueryClient } from '@tanstack/react-query'
import { STALE_TIMES, GC_TIME, DEFAULT_RETRY_COUNT } from './constants'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIMES.STORES,
      gcTime: GC_TIME,
      retry: DEFAULT_RETRY_COUNT,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      // Do not refetch on window focus — avoids jarring content shifts
      // when users switch tabs and return
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
})
