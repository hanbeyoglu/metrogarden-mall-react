import { getPublicData } from './public'
import type { CmsHome } from './cmsTypes'

export function getHomeContent(): Promise<CmsHome> {
  return getPublicData<CmsHome>('/public/home')
}
