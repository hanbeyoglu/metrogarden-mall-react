import type { Slider } from '@/types'
import { getPublicData } from './public'
import { mapSliders } from './cmsAdapters'
import type { CmsSlider } from './cmsTypes'

export async function getSliders(): Promise<Slider[]> {
  const groups = await getPublicData<CmsSlider[]>('/public/sliders', { placement: 'HOME', channel: 'WEB' })
  return mapSliders(groups)
}
