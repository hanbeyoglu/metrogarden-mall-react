import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useMeta } from '@/hooks'
import { useEventContent } from '@/hooks/useCmsContent'
import type { EventCategory } from '@/types'
import { PageHero } from '@/components/shared/PageHero'
import { EventFilterBar } from '@/components/events/EventFilterBar'
import type { EventTimeFilter } from '@/components/events/EventFilterBar'
import { getEventTimeStatus } from '@/lib/events'
import { EventCard } from '@/components/events/EventCard'

type SortOption = 'date' | 'newest' | 'az'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=85&fit=crop'

export function EventsPage() {
  const { t } = useTranslation()
  const { events: allEvents } = useEventContent()
  useMeta({ title: t('pages.events.heroTitle') })

  const [timeFilter, setTimeFilter] = useState<EventTimeFilter>('')
  const [category, setCategory] = useState<EventCategory | ''>('')
  const [sort, setSort] = useState<SortOption>('date')

  const filteredEvents = useMemo(() => {
    const result = allEvents.filter((event) => {
      const timeStatus = getEventTimeStatus(event.date, event.end_date)

      if (timeFilter) {
        if (timeFilter === 'upcoming') {
          if (timeStatus === 'past') return false
        } else if (timeFilter === 'this-month') {
          if (timeStatus !== 'this-week' && timeStatus !== 'this-month') return false
        } else {
          if (timeStatus !== timeFilter) return false
        }
      }

      if (category && event.category !== category) return false
      return true
    })

    return [...result].sort((a, b) => {
      switch (sort) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'az':
          return a.title.localeCompare(b.title, 'tr')
        default:
          return 0
      }
    })
  }, [allEvents, timeFilter, category, sort])

  return (
    <>
      <PageHero
        title={t('pages.events.heroTitle')}
        subtitle={t('pages.events.heroSubtitle')}
        image={HERO_IMAGE}
        breadcrumbs={[{ label: t('nav.events'), href: '/' }, { label: t('nav.events') }]}
      />

      <EventFilterBar
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        resultCount={filteredEvents.length}
        totalCount={allEvents.length}
      />

      <section className="bg-ivory py-10 lg:py-14" aria-label={t('pages.events.listAriaLabel')}>
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          {filteredEvents.length > 0 ? (
            <>
              {/* Mobile / Tablet: 2-column grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
                {filteredEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>

              {/* Desktop: editorial list */}
              <div className="hidden space-y-3 lg:block">
                {filteredEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center py-20 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center border border-mist bg-fog text-ash">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="mb-2 font-display text-2xl font-light text-carbon">
                {t('pages.events.emptyTitle')}
              </h3>
              <p className="mb-6 max-w-xs font-sans text-sm text-graphite">
                {t('pages.events.emptyDesc')}
              </p>
              <button
                onClick={() => { setTimeFilter(''); setCategory('') }}
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
