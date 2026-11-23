import type { MallService, ServiceFilters } from '@/types'
import { getPublicData, getPublicList } from './public'
import { mapService } from './cmsAdapters'
import type { CmsService } from './cmsTypes'

export async function getServices(filters?: ServiceFilters): Promise<MallService[]> {
  const items = await getPublicList<CmsService>(
    '/public/services',
    { search: filters?.q },
    100,
  )
  return items.map(mapService)
}

export async function getService(id: string): Promise<MallService> {
  return mapService(await getPublicData<CmsService>(`/public/services/${encodeURIComponent(id)}`))
}
