import { buildApiRequestHeaders } from '@/lib/apiHeaders'

/**
 * API Client — typed, normalized, and error-aware.
 *
 * Uses native fetch. No axios. Every response is typed via generics.
 * All errors are normalized to ApiError so callers have a consistent shape.
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
    // Restore prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  get isNotFound(): boolean {
    return this.status === 404
  }

  get isServerError(): boolean {
    return this.status >= 500
  }

  get isNetworkError(): boolean {
    return this.status === 0
  }
}
interface ErrorPayload {
  message?: string | string[]
  code?: string
  title?: string
  detail?: string
  error?: string | { message?: string | string[]; code?: string }
}

function errorMessage(payload: ErrorPayload, fallback: string): string {
  const message = typeof payload.error === 'object' ? payload.error.message : undefined
  const candidate = message ?? payload.message ?? payload.detail ?? payload.error ?? payload.title
  if (Array.isArray(candidate)) return candidate.join(', ')
  return typeof candidate === 'string' && candidate.length > 0 ? candidate : fallback
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
  keepalive?: boolean
}

function getBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (!url) {
    throw new Error('VITE_API_URL is not set. Check your .env.local file.')
  }
  return url.replace(/\/+$/, '')
}

export function hasPublicApiConfig(requireMall = false): boolean {
  return Boolean(
    import.meta.env.VITE_API_URL &&
      import.meta.env.VITE_CMS_PUBLIC_API_KEY &&
      import.meta.env.VITE_CMS_TENANT_ID &&
      (!requireMall || import.meta.env.VITE_CMS_MALL_ID),
  )
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, signal, keepalive } = options

  let response: Response

  try {
    const publicApiKey = import.meta.env.VITE_CMS_PUBLIC_API_KEY
    const tenantId = import.meta.env.VITE_CMS_TENANT_ID
    const mallId = import.meta.env.VITE_CMS_MALL_ID
    response = await fetch(`${getBaseUrl()}${path}`, {
      method,
      // CMS content is edited independently from this website. Avoid serving
      // a previously cached GET response after an admin publishes a change.
      cache: 'no-store',
      headers: buildApiRequestHeaders({ publicApiKey, tenantId, mallId }, body !== undefined, headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
      keepalive,
    })
  } catch (error) {
    // Network failure (offline, CORS, DNS, etc.)
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new ApiError(0, 'Ağ bağlantısı kurulamadı. İnternet bağlantınızı kontrol edin.')
  }

  if (!response.ok) {
    const payload: ErrorPayload = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      errorMessage(payload, response.statusText || 'Bir hata oluştu.'),
      (typeof payload.error === 'object' ? payload.error.code : undefined) ?? payload.code,
    )
  }

  // 204 No Content — return undefined cast to T
  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<T> => request<T>(path, { ...options, method: 'POST', body }),

  put: <T>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<T> => request<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<T> => request<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
