import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useMeta } from '@/hooks'
import { useCampaignContent } from '@/hooks/useCmsContent'
import type { CampaignStatus, StoreCategory } from '@/types'
import { PageHero } from '@/components/shared/PageHero'
import { CampaignFilterBar } from '@/components/campaigns/CampaignFilterBar'
import { CampaignCard } from '@/components/campaigns/CampaignCard'

type SortOption = 'newest' | 'oldest' | 'ending' | 'az'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=85&fit=crop'

export function CampaignsPage() {
  const { t } = useTranslation()
  const { campaigns: allCampaigns } = useCampaignContent()
  useMeta({ title: t('pages.campaigns.heroTitle') })

  const [status, setStatus] = useState<CampaignStatus | ''>('')
  const [storeSlug, setStoreSlug] = useState('')
  const [category, setCategory] = useState<StoreCategory | ''>('')
  const [sort, setSort] = useState<SortOption>('newest')

  const filteredCampaigns = useMemo(() => {
    const result = allCampaigns.filter((c) => {
      if (status && c.status !== status) return false
      if (storeSlug && c.store?.slug !== storeSlug) return false
      if (category && c.category !== category) return false
      return true
    })

    return [...result].sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        case 'oldest':
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        case 'ending': {
          const aEnd = a.end_date ? new Date(a.end_date).getTime() : Infinity
          const bEnd = b.end_date ? new Date(b.end_date).getTime() : Infinity
          return aEnd - bEnd
        }
        case 'az':
          return a.title.localeCompare(b.title, 'tr')
        default:
          return 0
      }
    })
  }, [allCampaigns, status, storeSlug, category, sort])

  return (
    <>
      <PageHero
        title={t('pages.campaigns.heroTitle')}
        subtitle={t('pages.campaigns.heroSubtitle')}
        image={HERO_IMAGE}
        breadcrumbs={[{ label: t('nav.campaigns'), href: '/' }, { label: t('nav.campaigns') }]}
      />

      <CampaignFilterBar
        status={status}
        onStatusChange={setStatus}
        storeSlug={storeSlug}
        onStoreSlugChange={setStoreSlug}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        resultCount={filteredCampaigns.length}
        totalCount={allCampaigns.length}
        campaigns={allCampaigns}
      />

      <section className="bg-ivory py-12 lg:py-16" aria-label="Kampanya listesi">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          {filteredCampaigns.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {filteredCampaigns.map((campaign, i) => (
                <CampaignCard key={campaign.id} campaign={campaign} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center py-20 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center border border-mist bg-fog text-ash">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" />
                  <path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
              </div>
              <h3 className="mb-2 font-display text-2xl font-light text-carbon">
                {t('pages.campaigns.emptyTitle')}
              </h3>
              <p className="mb-6 max-w-xs font-sans text-sm text-graphite">
                {t('pages.campaigns.emptyDesc')}
              </p>
              <button
                onClick={() => { setStatus(''); setStoreSlug(''); setCategory('') }}
                className="border border-carbon px-6 py-3 font-sans text-sm font-medium text-carbon transition-all duration-300 hover:bg-carbon hover:text-ivory"
              >
                {t('common.clearFilters')}
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
