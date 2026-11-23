import type { Store, StoreFilters } from '@/types'
import { getPublicData, getPublicList } from './public'
import { mapStore } from './cmsAdapters'
import type { CmsStore } from './cmsTypes'

export async function getStores(filters?: StoreFilters): Promise<Store[]> {
  const items = await getPublicList<CmsStore>(
    '/public/stores',
    { search: filters?.q, featuredOnly: filters?.featured ? true : undefined },
    100,
  )
  return items.map(mapStore)
}

export async function getStore(slug: string): Promise<Store> {
  return mapStore(await getPublicData<CmsStore>(`/public/stores/${encodeURIComponent(slug)}`))
}
