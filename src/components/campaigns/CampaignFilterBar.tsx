import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Campaign, CampaignStatus, StoreCategory } from '@/types'
import { cn } from '@/lib/cn'

type SortOption = 'newest' | 'oldest' | 'ending' | 'az'

interface CampaignFilterBarProps {
  status: CampaignStatus | ''
  onStatusChange: (v: CampaignStatus | '') => void
  storeSlug: string
  onStoreSlugChange: (v: string) => void
  category: StoreCategory | ''
  onCategoryChange: (v: StoreCategory | '') => void
  sort: SortOption
  onSortChange: (v: SortOption) => void
  resultCount: number
  totalCount: number
  campaigns: Campaign[]
}

const SELECT_STYLE =
  'border border-mist bg-white py-2.5 pl-3 pr-8 font-sans text-sm text-carbon focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne appearance-none cursor-pointer'
const SELECT_BG =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%237a7a7a\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E") no-repeat right 10px center'

export function CampaignFilterBar({
  status,
  onStatusChange,
  storeSlug,
  onStoreSlugChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  resultCount,
  totalCount,
  campaigns,
}: CampaignFilterBarProps) {
  const { t } = useTranslation()

  const STATUS_OPTIONS: { value: CampaignStatus | ''; label: string }[] = [
    { value: '', label: t('common.all') },
    { value: 'active', label: t('status.active') },
    { value: 'ending-soon', label: t('status.endingSoon') },
    { value: 'expired', label: t('status.expired') },
  ]

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t('sort.newest') },
    { value: 'oldest', label: t('sort.oldest') },
    { value: 'ending', label: t('sort.byEndDate') },
    { value: 'az', label: t('sort.az') },
  ]

  const CATEGORY_LABELS: Partial<Record<StoreCategory, string>> = {
    fashion: t('storeCategoriesShort.fashion'),
    'food-and-beverage': t('storeCategoriesShort.food-and-beverage'),
    beauty: t('storeCategoriesShort.beauty'),
    electronics: t('storeCategoriesShort.electronics'),
    sports: t('storeCategoriesShort.sports'),
    kids: t('storeCategoriesShort.kids'),
    entertainment: t('storeCategoriesShort.entertainment'),
    'home-and-living': t('storeCategoriesShort.home-and-living'),
    services: t('storeCategoriesShort.services'),
  }

  /* Derive unique stores from campaigns */
  const uniqueStores = Array.from(
    new Map(
      campaigns
        .filter((c) => c.store)
        .map((c) => [c.store!.slug, { slug: c.store!.slug, name: c.store!.name }]),
    ).values(),
  ).sort((a, b) => a.name.localeCompare(b.name, 'tr'))

  /* Derive unique categories */
  const uniqueCategories = Array.from(
    new Set(campaigns.filter((c) => c.category).map((c) => c.category as StoreCategory)),
  ).sort()

  const hasFilters = status !== '' || storeSlug !== '' || category !== ''

  return (
    <div className="sticky top-[68px] z-40 border-b border-mist/60 bg-white/96 backdrop-blur-md lg:top-[76px]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Status pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={cn(
                'shrink-0 px-4 py-2 font-sans text-[12px] font-medium transition-all duration-200',
                status === opt.value
                  ? 'bg-carbon text-ivory'
                  : 'border border-mist bg-white text-graphite hover:border-carbon hover:text-carbon',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Dropdowns + result count */}
        <div className="flex flex-wrap items-center gap-3 pb-4">
          <SlidersHorizontal size={14} className="shrink-0 text-ash" />

          {/* Store filter */}
          <select
            value={storeSlug}
            onChange={(e) => onStoreSlugChange(e.target.value)}
            className={SELECT_STYLE}
            style={{ backgroundImage: SELECT_BG }}
            aria-label={t('common.allStores')}
          >
            <option value="">{t('common.allStores')}</option>
            {uniqueStores.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>

          {/* Category filter */}
          {uniqueCategories.length > 1 && (
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value as StoreCategory | '')}
              className={SELECT_STYLE}
              style={{ backgroundImage: SELECT_BG }}
              aria-label={t('common.allCategories')}
            >
              <option value="">{t('common.allCategories')}</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat] ?? cat}</option>
              ))}
            </select>
          )}

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className={SELECT_STYLE}
            style={{ backgroundImage: SELECT_BG }}
            aria-label={t('common.sortBy')}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Result count + clear */}
          <div className="ml-auto flex items-center gap-3">
            <span className="font-sans text-[12px] text-ash">
              {resultCount === totalCount
                ? t('pages.campaigns.campaignCount', { count: totalCount })
                : t('pages.campaigns.resultsCount', { result: resultCount, total: totalCount })}
            </span>
            {hasFilters && (
              <button
                onClick={() => {
                  onStatusChange('')
                  onStoreSlugChange('')
                  onCategoryChange('')
                }}
                className="font-sans text-[11px] font-medium text-champagne underline-offset-2 hover:underline"
              >
                {t('common.clear')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
