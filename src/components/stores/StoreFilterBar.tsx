import { useRef } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { StoreCategory, StoreFloor } from '@/types'
import { cn } from '@/lib/cn'

type SortOption = 'az' | 'za' | 'category' | 'floor'

interface StoreFilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  category: StoreCategory | ''
  categoryOptions: { value: StoreCategory; label: string }[]
  onCategoryChange: (v: StoreCategory | '') => void
  floor: StoreFloor | ''
  floorOptions: { value: StoreFloor; label: string }[]
  onFloorChange: (v: StoreFloor | '') => void
  sort: SortOption
  onSortChange: (v: SortOption) => void
  resultCount: number
  totalCount: number
}

export function StoreFilterBar({
  search,
  onSearchChange,
  category,
  categoryOptions,
  onCategoryChange,
  floor,
  floorOptions,
  onFloorChange,
  sort,
  onSortChange,
  resultCount,
  totalCount,
}: StoreFilterBarProps) {
  const { t } = useTranslation()
  const searchRef = useRef<HTMLInputElement>(null)
  const hasFilters = search !== '' || category !== '' || floor !== ''

  const CATEGORY_OPTIONS: { value: StoreCategory | ''; label: string }[] = [
    { value: '', label: t('storeCategoriesShort.all') },
    ...categoryOptions,
  ]

  const FLOOR_OPTIONS: { value: StoreFloor | ''; label: string }[] = [
    { value: '', label: t('floors.all') },
    ...floorOptions,
  ]

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'az', label: t('sort.az') },
    { value: 'za', label: t('sort.za') },
    { value: 'category', label: t('sort.byCategory') },
    { value: 'floor', label: t('sort.byFloor') },
  ]

  return (
    <div className="sticky top-[68px] z-40 border-b border-mist/60 bg-white/96 backdrop-blur-md lg:top-[76px]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Top row: Search + Sort */}
        <div className="flex items-center gap-4 py-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ash"
            />
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('pages.stores.searchPlaceholder')}
              className="w-full border border-mist bg-fog py-2.5 pl-9 pr-9 font-sans text-sm text-carbon placeholder:text-ash focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
            />
            {search && (
              <button
                onClick={() => { onSearchChange(''); searchRef.current?.focus() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ash transition-colors hover:text-carbon"
                aria-label={t('pages.stores.clearSearch')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal size={14} className="text-ash" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="border border-mist bg-white py-2.5 pl-3 pr-7 font-sans text-sm text-carbon focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne appearance-none cursor-pointer"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%237a7a7a\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              aria-label={t('common.sortBy')}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onCategoryChange(opt.value as StoreCategory | '')}
              className={cn(
                'shrink-0 px-3.5 py-1.5 font-sans text-[12px] font-medium transition-all duration-200',
                category === opt.value
                  ? 'bg-carbon text-ivory'
                  : 'border border-mist bg-white text-graphite hover:border-carbon hover:text-carbon',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Floor pills + result count */}
        <div className="flex items-center justify-between gap-4 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {FLOOR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onFloorChange(opt.value as StoreFloor | '')}
                className={cn(
                  'shrink-0 px-3.5 py-1.5 font-sans text-[12px] font-medium transition-all duration-200',
                  floor === opt.value
                    ? 'bg-champagne text-white'
                    : 'border border-mist bg-white text-graphite hover:border-champagne/60 hover:text-carbon',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Result count + clear */}
          <div className="flex shrink-0 items-center gap-3">
            <span className="font-sans text-[12px] text-ash">
              {resultCount === totalCount
                ? t('pages.stores.storeCount', { count: totalCount })
                : t('pages.stores.resultsCount', { result: resultCount, total: totalCount })}
            </span>
            {hasFilters && (
              <button
                onClick={() => {
                  onSearchChange('')
                  onCategoryChange('')
                  onFloorChange('')
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
