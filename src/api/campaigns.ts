import type { Campaign, CampaignFilters } from '@/types'
import { getPublicData, getPublicList } from './public'
import { mapCampaign } from './cmsAdapters'
import type { CmsCampaign } from './cmsTypes'

export async function getCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
  const items = await getPublicList<CmsCampaign>('/public/campaigns', {}, 50)
  const campaigns = items.map(mapCampaign)
  return filters?.status ? campaigns.filter((campaign) => campaign.status === filters.status) : campaigns
}

export async function getCampaign(slug: string): Promise<Campaign> {
  return mapCampaign(await getPublicData<CmsCampaign>(`/public/campaigns/${encodeURIComponent(slug)}`))
}
