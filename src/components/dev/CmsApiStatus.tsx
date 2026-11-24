import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getMall } from '@/api'
import { hasPublicApiConfig } from '@/api/client'
import { queryKeys } from '@/lib/queryKeys'

/** Development-only signal that makes the local demo fallback visible during CMS setup. */
export function CmsApiStatus() {
  const { i18n, t } = useTranslation()
  const locale = i18n.language.toLowerCase().startsWith('en') ? 'en' : 'tr'
  const configured = hasPublicApiConfig(true)
  const query = useQuery({
    queryKey: queryKeys.mall(locale),
    queryFn: getMall,
    enabled: configured,
    retry: false,
    staleTime: 60_000,
  })

  if (!import.meta.env.DEV) return null

  const message = !configured
    ? t('dev.cmsConfigMissing')
    : query.isPending
      ? t('dev.cmsConnecting')
      : query.isError
        ? t('dev.cmsConnectionFailed')
        : t('dev.cmsConnected')

  const isError = configured && query.isError
  const isSuccess = configured && query.isSuccess

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-[100] max-w-[min(92vw,36rem)] rounded-md border px-3 py-2 text-xs shadow-lg"
      style={{
        background: 'var(--color-carbon)',
        color: 'var(--color-ivory)',
        borderColor: isError ? '#ef4444' : isSuccess ? '#22c55e' : '#eab308',
      }}
    >
      {message}
    </div>
  )
}
