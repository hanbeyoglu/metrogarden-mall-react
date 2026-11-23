import { RouterProvider } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { router } from './router'
import { queryClient } from './lib/queryClient'

/**
 * Application root.
 *
 * Provider order (outer → inner):
 *   QueryClientProvider — server state
 *   RouterProvider     — navigation + page rendering
 *   Toaster            — global notifications (renders as portal, order doesn't matter)
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-carbon)',
            color: 'var(--color-ivory)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
          },
        }}
      />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
