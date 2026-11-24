import { Link } from 'react-router'
import { ArrowRight, MapPin, Clock } from 'lucide-react'
import { motion } from 'motion/react'
import type { Event } from '@/types'
import { ROUTES, EVENT_CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { trackAnalytics } from '@/lib/analytics'

interface RelatedEventsProps {
  events: Event[]
}

function isPastEvent(event: Event): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = event.end_date ? new Date(event.end_date) : new Date(event.date)
  return end < today
}

export function RelatedEvents({ events }: RelatedEventsProps) {
  if (events.length === 0) return null

  return (
    <section className="bg-fog py-20 lg:py-28" aria-labelledby="related-events-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="mb-3 flex items-center gap-3"
            >
              <span className="h-px w-8 bg-champagne" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-champagne">
                İlgili Etkinlikler
              </span>
            </motion.div>
            <motion.h2
              id="related-events-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl font-light text-carbon lg:text-4xl"
            >
              Benzer Etkinlikler
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to={ROUTES.EVENTS}
              className="group hidden items-center gap-2 font-sans text-[13px] font-medium text-graphite transition-all duration-300 hover:text-carbon md:flex"
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-carbon after:transition-all after:duration-300 group-hover:after:w-full">
                Tüm Etkinlikler
              </span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Grid — 3 columns max */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {events.map((event, i) => {
            const isPast = isPastEvent(event)
            const dateInfo = {
              day: new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric' }),
              month: new Date(event.date).toLocaleDateString('tr-TR', { month: 'short' }).replace('.', '').toUpperCase(),
            }
            const categoryLabel = event.category ? (EVENT_CATEGORIES[event.category] ?? '') : ''
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className={cn(isPast && 'opacity-60')}
              >
                <Link
                  to={ROUTES.EVENT_DETAIL(event.slug)}
                  data-analytics-event="EVENT_CLICK"
                  onClick={() => void trackAnalytics({ entityType: 'EVENT', eventType: 'EVENT_CLICK', entityId: event.analytics_id, path: ROUTES.EVENT_DETAIL(event.slug), source: 'related-events' })}
                  className={cn(
                    'group block overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-500',
                    !isPast && 'hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]',
                  )}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
                    <img
                      src={event.image}
                      alt={event.title}
                      className={cn(
                        'img-cover transition-transform duration-600',
                        !isPast && 'group-hover:scale-[1.04]',
                        isPast && 'grayscale',
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/15" />

                    {/* Date badge */}
                    <div className="absolute left-0 top-0 flex flex-col items-center bg-carbon px-3 py-2.5 text-center">
                      <span className="font-display text-[18px] font-light leading-none text-ivory">{dateInfo.day}</span>
                      <span className="mt-1 font-sans text-[8px] font-semibold tracking-[0.12em] text-champagne">{dateInfo.month}</span>
                    </div>

                    {event.is_free && (
                      <div className="absolute right-0 top-0">
                        <span className="block bg-[#2d6a4f] px-2.5 py-1.5 font-sans text-[8px] font-semibold uppercase tracking-wide text-white">
                          Ücretsiz
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {categoryLabel && (
                      <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-champagne">
                        {categoryLabel}
                      </p>
                    )}
                    <h3 className={cn(
                      'mb-2 font-display text-lg font-light leading-snug text-carbon transition-colors duration-300',
                      !isPast && 'group-hover:text-champagne',
                    )}>
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {event.location && (
                        <span className="flex items-center gap-1 font-sans text-[10px] text-ash">
                          <MapPin size={10} className="shrink-0" />{event.location}
                        </span>
                      )}
                      {event.time && (
                        <span className="flex items-center gap-1 font-sans text-[10px] text-ash">
                          <Clock size={10} className="shrink-0" />{event.time}
                        </span>
                      )}
                    </div>
                  </div>

                  {!isPast && (
                    <div className="h-[2px] w-0 bg-champagne transition-all duration-500 group-hover:w-full" />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
