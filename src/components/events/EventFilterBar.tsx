import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { EventCategory } from '@/types'
import { cn } from '@/lib/cn'

export type EventTimeFilter = '' | 'upcoming' | 'this-week' | 'this-month' | 'past'
type SortOption = 'date' | 'newest' | 'az'

interface EventFilterBarProps {
  timeFilter: EventTimeFilter
  onTimeFilterChange: (v: EventTimeFilter) => void
  category: EventCategory | ''
  onCategoryChange: (v: EventCategory | '') => void
  sort: SortOption
  onSortChange: (v: SortOption) => void
  resultCount: number
  totalCount: number
}

const SELECT_STYLE =
  'border border-mist bg-white py-2.5 pl-3 pr-8 font-sans text-sm text-carbon focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne appearance-none cursor-pointer'
const SELECT_BG =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%237a7a7a\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E") no-repeat right 10px center'

export function EventFilterBar({
  timeFilter,
  onTimeFilterChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  resultCount,
  totalCount,
}: EventFilterBarProps) {
  const { t } = useTranslation()
  const hasFilters = timeFilter !== '' || category !== ''

  const TIME_OPTIONS: { value: EventTimeFilter; label: string }[] = [
    { value: '', label: t('common.all') },
    { value: 'upcoming', label: t('status.upcoming') },
    { value: 'this-week', label: t('status.thisWeek') },
    { value: 'this-month', label: t('status.thisMonth') },
    { value: 'past', label: t('status.past') },
  ]

  const CATEGORY_OPTIONS: { value: EventCategory | ''; label: string }[] = [
    { value: '', label: t('eventCategories.all') },
    { value: 'kids', label: t('eventCategories.kids') },
    { value: 'entertainment', label: t('eventCategories.entertainment') },
    { value: 'concert', label: t('eventCategories.concert') },
    { value: 'workshop', label: t('eventCategories.workshop') },
    { value: 'exhibition', label: t('eventCategories.exhibition') },
    { value: 'festival', label: t('eventCategories.festival') },
    { value: 'culture', label: t('eventCategories.culture') },
    { value: 'food', label: t('eventCategories.food') },
    { value: 'sports', label: t('eventCategories.sports') },
  ]

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'date', label: t('sort.byDate') },
    { value: 'newest', label: t('sort.newlyAdded') },
    { value: 'az', label: t('sort.az') },
  ]

  return (
    <div className="sticky top-[68px] z-40 border-b border-mist/60 bg-white/96 backdrop-blur-md lg:top-[76px]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Time filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onTimeFilterChange(opt.value)}
              className={cn(
                'shrink-0 px-4 py-2 font-sans text-[12px] font-medium transition-all duration-200',
                timeFilter === opt.value
                  ? 'bg-carbon text-ivory'
                  : 'border border-mist bg-white text-graphite hover:border-carbon hover:text-carbon',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Category + Sort + count */}
        <div className="flex flex-wrap items-center gap-3 pb-4">
          <SlidersHorizontal size={14} className="shrink-0 text-ash" />

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as EventCategory | '')}
            className={SELECT_STYLE}
            style={{ backgroundImage: SELECT_BG }}
            aria-label={t('common.allCategories')}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

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

          <div className="ml-auto flex items-center gap-3">
            <span className="font-sans text-[12px] text-ash">
              {resultCount === totalCount
                ? t('pages.events.eventCount', { count: totalCount })
                : t('pages.events.resultsCount', { result: resultCount, total: totalCount })}
            </span>
            {hasFilters && (
              <button
                onClick={() => { onTimeFilterChange(''); onCategoryChange('') }}
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
