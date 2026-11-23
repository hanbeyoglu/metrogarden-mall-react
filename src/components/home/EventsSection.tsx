import { Link } from 'react-router'
import { ArrowRight, MapPin, Ticket } from 'lucide-react'
import { motion } from 'motion/react'
import { useEventContent } from '@/hooks/useCmsContent'
import { ROUTES, EVENT_CATEGORIES } from '@/lib/constants'

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr)
  return {
    day: date.toLocaleDateString('tr-TR', { day: '2-digit' }),
    month: date.toLocaleDateString('tr-TR', { month: 'short' }).toUpperCase(),
  }
}

export function EventsSection() {
  const { upcomingEvents } = useEventContent()
  return (
    <section className="bg-ivory py-24 lg:py-32" aria-labelledby="events-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-14 flex items-end justify-between">
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
                Takvim
              </span>
            </motion.div>
            <motion.h2
              id="events-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl font-light leading-[1.05] text-carbon lg:text-5xl"
            >
              Yaklaşan Etkinlikler
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
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

        {/* Events Grid */}
        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {upcomingEvents.map((event, i) => {
            const dateInfo = formatEventDate(event.date)
            return (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              >
                <Link
                  to={ROUTES.EVENT_DETAIL(event.slug)}
                  className="group block overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
                    <img
                      src={event.image}
                      alt={event.title}
                      className="img-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    {/* Gradient for badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />

                    {/* Date Badge — top left, dark card */}
                    <div className="absolute left-0 top-0 flex flex-col items-center bg-carbon px-4 py-3 text-center">
                      <span className="font-display text-[22px] font-light leading-none text-ivory">
                        {dateInfo.day}
                      </span>
                      <span className="mt-1 font-sans text-[9px] font-semibold tracking-[0.16em] text-champagne">
                        {dateInfo.month}
                      </span>
                    </div>

                    {/* Free Badge — top right */}
                    {event.is_free && (
                      <div className="absolute right-0 top-0">
                        <span className="block bg-[#2d6a4f] px-3 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                          Ücretsiz
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    {event.category && (
                      <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">
                        {EVENT_CATEGORIES[event.category]}
                      </p>
                    )}

                    {/* Title */}
                    <h3 className="mb-3 font-display text-2xl font-light leading-snug text-carbon transition-colors duration-300 group-hover:text-champagne">
                      {event.title}
                    </h3>

                    {/* Description */}
                    {event.short_description && (
                      <p className="mb-5 line-clamp-2 font-sans text-[13px] leading-[1.7] text-graphite">
                        {event.short_description}
                      </p>
                    )}

                    {/* Meta footer */}
                    <div className="flex flex-wrap items-center gap-4 border-t border-mist/60 pt-4">
                      {event.location && (
                        <span className="flex items-center gap-1.5 font-sans text-[11px] text-ash">
                          <MapPin size={11} className="shrink-0" />
                          {event.location}
                        </span>
                      )}
                      {event.ticket_url && !event.is_free && (
                        <span className="flex items-center gap-1.5 font-sans text-[11px] text-ash">
                          <Ticket size={11} className="shrink-0" />
                          Bilet Gerekli
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="h-[2px] w-0 bg-champagne transition-all duration-500 group-hover:w-full" />
                </Link>
              </motion.article>
            )
          })}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 flex justify-center md:hidden"
        >
          <Link
            to={ROUTES.EVENTS}
            className="group inline-flex items-center gap-2.5 border border-carbon px-7 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-carbon transition-all duration-300 hover:bg-carbon hover:text-ivory"
          >
            Tüm Etkinlikler
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
