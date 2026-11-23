import { ApiError, apiClient } from './client'
import type { CmsEnvelope } from './cmsTypes'

export function getCmsLocale(): string {
  if (typeof window !== 'undefined') {
    const selected = window.localStorage.getItem('metrogarden_language')
    if (selected === 'tr' || selected === 'en') return selected
  }
  return import.meta.env.VITE_CMS_LOCALE || 'tr'
}

export interface CmsPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

function withLocale(params?: Record<string, string | number | boolean | undefined>): string {
  const query = new URLSearchParams()
  query.set('locale', getCmsLocale())
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) query.set(key, String(value))
  }
  return query.toString()
}

export async function getPublicData<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const envelope = await apiClient.get<CmsEnvelope<T>>(`${path}?${withLocale(params)}`)
  if (!envelope?.success || !('data' in envelope)) {
    throw new ApiError(502, 'CMS API yanıtı beklenen biçimde değil.')
  }
  return envelope.data
}

export async function getPublicList<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
  limit = 50,
): Promise<T[]> {
  const firstQuery = withLocale({ ...params, page: 1, limit })
  const first = await apiClient.get<CmsEnvelope<T[]>>(`${path}?${firstQuery}`)
  if (!first?.success || !Array.isArray(first.data)) {
    throw new ApiError(502, 'CMS API liste yanıtı beklenen biçimde değil.')
  }

  const totalPages = first.pagination?.totalPages ?? 1
  if (totalPages <= 1) return first.data

  const items = [...first.data]
  for (let page = 2; page <= totalPages; page += 1) {
    const query = withLocale({ ...params, page, limit })
    const envelope = await apiClient.get<CmsEnvelope<T[]>>(`${path}?${query}`)
    if (!envelope?.success || !Array.isArray(envelope.data)) {
      throw new ApiError(502, 'CMS API sayfalı liste yanıtı beklenen biçimde değil.')
    }
    items.push(...envelope.data)
  }
  return items
}
