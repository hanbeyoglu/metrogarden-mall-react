export function buildApiRequestHeaders(
  credentials: { publicApiKey?: string; tenantId?: string; mallId?: string },
  hasBody: boolean,
  extraHeaders: Record<string, string> = {},
): Record<string, string> {
  return {
    Accept: 'application/json',
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(credentials.publicApiKey ? { 'x-api-key': credentials.publicApiKey } : {}),
    ...(credentials.tenantId ? { 'x-tenant-id': credentials.tenantId } : {}),
    ...(credentials.mallId ? { 'x-mall-id': credentials.mallId } : {}),
    ...extraHeaders,
  }
}
