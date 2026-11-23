import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'

interface ServiceFilterBarProps {
  categories: string[]
  category: string
  onCategoryChange: (value: string) => void
  resultCount: number
  totalCount: number
}

export function ServiceFilterBar({
  categories,
  category,
  onCategoryChange,
  resultCount,
  totalCount,
}: ServiceFilterBarProps) {
  const { t } = useTranslation()

  if (categories.length === 0) return null

  return (
    <div className="sticky top-[68px] z-40 border-b border-mist/60 bg-white/96 backdrop-blur-md lg:top-[76px]">
      <div className="mx-auto max-w-[1440px] px-6 py-4 lg:px-12">
        <div
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
          role="group"
          aria-label={t('pages.services.filterAriaLabel')}
        >
          <button
            type="button"
            onClick={() => onCategoryChange('')}
            className={cn(
              'shrink-0 px-4 py-2 font-sans text-[12px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne',
              category === ''
                ? 'bg-carbon text-ivory'
                : 'border border-mist bg-white text-graphite hover:border-carbon hover:text-carbon',
            )}
            aria-pressed={category === ''}
          >
            {t('common.allCategories')}
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
              className={cn(
                'shrink-0 px-4 py-2 font-sans text-[12px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne',
                category === item
                  ? 'bg-carbon text-ivory'
                  : 'border border-mist bg-white text-graphite hover:border-carbon hover:text-carbon',
              )}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mt-3 font-sans text-[12px] text-ash" aria-live="polite">
          {t('pages.services.resultsCount', { result: resultCount, total: totalCount })}
        </p>
      </div>
    </div>
  )
}
