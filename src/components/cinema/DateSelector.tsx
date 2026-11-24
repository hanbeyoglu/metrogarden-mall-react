import { cn } from '@/lib/cn'
import { useTranslation } from 'react-i18next'

interface DateSelectorProps {
  selectedDay: number
  onDayChange: (day: number) => void
}

function buildDays() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })
}

export function DateSelector({ selectedDay, onDayChange }: DateSelectorProps) {
  const { t, i18n } = useTranslation()
  const locale = (i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en-US' : 'tr-TR'
  const days = buildDays()

  return (
    <div
      className="sticky top-[68px] z-40 border-b border-white/[0.06] bg-[#0d0d0d]/95 backdrop-blur-md lg:top-[76px]"
      role="tablist"
      aria-label={t('pages.cinema.dateSelector')}
    >
      <div className="mx-auto max-w-[1440px] px-4 lg:px-12">
        <div className="flex overflow-x-auto py-1 scrollbar-hide">
          {days.map((day, offset) => {
            const isToday = offset === 0
            const isSelected = selectedDay === offset
            return (
              <button
                key={offset}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onDayChange(offset)}
                className={cn(
                  'group flex min-w-[80px] flex-col items-center gap-0.5 px-3 py-3.5 transition-all duration-200 lg:min-w-[90px]',
                  isSelected
                    ? 'text-champagne'
                    : 'text-white/30 hover:text-white/70',
                )}
              >
                {/* Day label */}
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em]">
                  {isToday ? t('pages.cinema.today') : new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(day)}
                </span>

                {/* Date number */}
                <span
                  className={cn(
                    'font-display text-2xl font-light leading-none transition-all duration-200',
                    isSelected ? 'text-white' : 'text-white/50 group-hover:text-white/80',
                  )}
                >
                  {day.getDate()}
                </span>

                {/* Month */}
                <span className="font-sans text-[9px] uppercase tracking-wider">
                  {new Intl.DateTimeFormat(locale, { month: 'short' }).format(day)}
                </span>

                {/* Active indicator */}
                <span
                  className={cn(
                    'mt-1 h-[2px] w-6 rounded-full bg-champagne transition-all duration-300',
                    isSelected ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
