import type { Mall } from '@/types'
import { getPublicData } from './public'
import { mapMall } from './cmsAdapters'
import type { CmsSiteConfig } from './cmsTypes'

export async function getMall(): Promise<Mall> {
  return mapMall(await getPublicData<CmsSiteConfig>('/public/site-config'))
}
