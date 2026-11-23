import { Link } from 'react-router'
import { MapPin, Clock, Ticket, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import type { Event } from '@/types'
import { ROUTES, EVENT_CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/cn'

interface EventCardProps {
  event: Event
  index?: number
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    day: d.toLocaleDateString('tr-TR', { day: 'numeric' }),
    month: d.toLocaleDateString('tr-TR', { month: 'short' }).replace('.', '').toUpperCase(),
    weekday: d.toLocaleDateString('tr-TR', { weekday: 'short' }).toUpperCase(),
    full: d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
  }
}

function isPastEvent(event: Event): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = event.end_date ? new Date(event.end_date) : new Date(event.date)
  return end < today
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const dateInfo = formatDate(event.date)
  const isPast = isPastEvent(event)
  const categoryLabel = event.category ? (EVENT_CATEGORIES[event.category] ?? event.category) : null

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.07, 0.35) }}
      className={cn(isPast && 'opacity-60')}
    >
      <Link
        to={ROUTES.EVENT_DETAIL(event.slug)}
        className="group block overflow-hidden bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
        aria-label={event.title}
      >
        {/* ── Mobile / Tablet Card Layout ───────────────────── */}
        <div className="lg:hidden">
          {/* Image */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img
              src={event.image}
              alt={event.title}
              className={cn(
                'img-cover transition-transform duration-600 group-hover:scale-[1.04]',
                isPast && 'grayscale',
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/20" />

            {/* Date badge */}
            <div className="absolute left-0 top-0 flex flex-col items-center bg-carbon px-3.5 py-2.5 text-center">
              <span className="font-display text-xl font-light leading-none text-ivory">{dateInfo.day}</span>
              <span className="mt-1 font-sans text-[9px] font-semibold tracking-[0.14em] text-champagne">{dateInfo.month}</span>
            </div>

            {/* Free badge */}
            {event.is_free !== undefined && (
              <div className="absolute right-0 top-0">
                <span className={cn(
                  'block px-3 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-white',
                  event.is_free ? 'bg-[#2d6a4f]' : 'bg-champagne',
                )}>
                  {event.is_free ? 'Ücretsiz' : 'Ücretli'}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {categoryLabel && (
              <p className="mb-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">
                {categoryLabel}
              </p>
            )}
            <h3 className={cn(
              'mb-2.5 font-display text-xl font-light leading-snug text-carbon transition-colors duration-300',
              !isPast && 'group-hover:text-champagne',
            )}>
              {event.title}
            </h3>
            {event.short_description && (
              <p className="mb-4 line-clamp-2 font-sans text-[13px] leading-[1.7] text-graphite">
                {event.short_description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 border-t border-mist/60 pt-3.5">
              {event.location && (
                <span className="flex items-center gap-1 font-sans text-[11px] text-ash">
                  <MapPin size={11} className="shrink-0" />{event.location}
                </span>
              )}
              {event.time && (
                <span className="flex items-center gap-1 font-sans text-[11px] text-ash">
                  <Clock size={11} className="shrink-0" />{event.time}
                </span>
              )}
              {!event.is_free && event.ticket_price && (
                <span className="flex items-center gap-1 font-sans text-[11px] text-ash">
                  <Ticket size={11} className="shrink-0" />{event.ticket_price}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Desktop Editorial List Layout ─────────────────── */}
        <div className="hidden transition-all duration-500 hover:-translate-y-0.5 lg:flex lg:items-stretch">
          {/* Image column */}
          <div className="relative w-[260px] shrink-0 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className={cn(
                'img-cover h-full transition-transform duration-600 group-hover:scale-[1.04]',
                isPast && 'grayscale',
              )}
            />
            {event.is_free !== undefined && (
              <div className="absolute right-0 top-0">
                <span className={cn(
                  'block px-2.5 py-1.5 font-sans text-[9px] font-semibold uppercase tracking-wide text-white',
                  event.is_free ? 'bg-[#2d6a4f]' : 'bg-champagne',
                )}>
                  {event.is_free ? 'Ücretsiz' : 'Ücretli'}
                </span>
              </div>
            )}
          </div>

          {/* Date column */}
          <div className="flex w-[80px] shrink-0 flex-col items-center justify-center border-r border-mist/60 px-4 py-6 text-center">
            <span className="font-display text-3xl font-light leading-none text-carbon">{dateInfo.day}</span>
            <span className="mt-1.5 font-sans text-[10px] font-semibold tracking-[0.14em] text-champagne">{dateInfo.month}</span>
            <span className="mt-2 font-sans text-[9px] font-medium uppercase tracking-wider text-ash">{dateInfo.weekday}</span>
          </div>

          {/* Info column */}
          <div className="flex flex-1 flex-col justify-center px-7 py-6">
            {categoryLabel && (
              <p className="mb-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">
                {categoryLabel}
              </p>
            )}
            <h3 className={cn(
              'mb-2 font-display text-2xl font-light leading-snug text-carbon transition-colors duration-300',
              !isPast && 'group-hover:text-champagne',
            )}>
              {event.title}
            </h3>
            {event.short_description && (
              <p className="mb-4 line-clamp-2 max-w-xl font-sans text-[13px] leading-[1.7] text-graphite">
                {event.short_description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              {event.location && (
                <span className="flex items-center gap-1.5 font-sans text-[12px] text-ash">
                  <MapPin size={12} className="shrink-0" />{event.location}
                </span>
              )}
              {event.time && (
                <span className="flex items-center gap-1.5 font-sans text-[12px] text-ash">
                  <Clock size={12} className="shrink-0" />
                  {event.time}{event.end_time ? ` – ${event.end_time}` : ''}
                </span>
              )}
              {!event.is_free && event.ticket_price && (
                <span className="flex items-center gap-1.5 font-sans text-[12px] text-ash">
                  <Ticket size={12} className="shrink-0" />{event.ticket_price}
                </span>
              )}
            </div>
          </div>

          {/* CTA column */}
          <div className="flex w-[140px] shrink-0 items-center justify-center border-l border-mist/60 px-5">
            <span className={cn(
              'flex flex-col items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.1em] transition-all duration-300',
              isPast ? 'text-ash' : 'text-graphite group-hover:text-champagne',
            )}>
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
              Detayları Gör
            </span>
          </div>
        </div>

        {/* Bottom accent */}
        {!isPast && (
          <div className="h-[2px] w-0 bg-champagne transition-all duration-500 group-hover:w-full" />
        )}
      </Link>
    </motion.article>
  )
}
