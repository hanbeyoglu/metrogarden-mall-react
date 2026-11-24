import { useState } from 'react'
import { Clock, Ticket, ExternalLink, Star, Play } from 'lucide-react'
import { motion } from 'motion/react'
import type { Movie } from '@/types'
import { cn } from '@/lib/cn'
import { MovieTrailerModal } from './MovieTrailerModal'
import { trackAnalytics } from '@/lib/analytics'

interface MovieRowProps {
  movie: Movie
  selectedDay: number
  index?: number
}

/* ── Helpers ─────────────────────────────────────────────── */
const RATING_STYLE: Record<string, string> = {
  '18+': 'bg-red-900/80 text-red-200',
  '13+': 'bg-orange-900/70 text-orange-200',
  '7+': 'bg-yellow-900/60 text-yellow-200',
  'Genel İzleyici': 'bg-green-900/60 text-green-200',
}

function formatDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h} sa ${m > 0 ? `${m} dk` : ''}`.trim() : `${m} dk`
}

export function MovieRow({ movie, selectedDay, index = 0 }: MovieRowProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [trailerOpen, setTrailerOpen] = useState(false)

  /* Reset selected time when day changes */
  const [lastDay, setLastDay] = useState(selectedDay)
  if (lastDay !== selectedDay) {
    setLastDay(selectedDay)
    setSelectedTime(null)
  }

  const isComingSoon = movie.status === 'coming-soon'
  const times = isComingSoon ? [] : (movie.daily_times ?? [])
  const ratingStyle = movie.rating ? (RATING_STYLE[movie.rating] ?? 'bg-white/10 text-white/60') : ''
  const openTrailer = () => {
    void trackAnalytics({ entityType: 'MOVIE', eventType: 'MOVIE_CLICK', entityId: movie.analytics_id, path: '/cinema', source: 'cinema-list' })
    setTrailerOpen(true)
  }
  const trackSessionClick = (time: string) => {
    const session = movie.showtimes?.find((item) => item.time === time)
    void trackAnalytics({ entityType: 'MOVIE_SESSION', eventType: 'MOVIE_SESSION_CLICK', entityId: session?.id, path: '/cinema', source: 'cinema-list' })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.06, 0.3) }}
      className="group border-b border-white/[0.05] bg-[#0f0f0f] transition-colors duration-300 hover:bg-[#141414]"
    >
      {/* ── Mobile layout ────────────────────────────────── */}
      <div className="lg:hidden">
        {/* Cover image */}
        <button
          type="button"
          onClick={openTrailer}
          aria-label={`${movie.title} fragmanını aç`}
          className="group/trailer relative block w-full overflow-hidden text-left"
          style={{ aspectRatio: '16/9' }}
        >
          <img
            src={movie.cover_image ?? movie.poster}
            alt={movie.title}
            className="img-cover transition-transform duration-700 group-hover/trailer:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover/trailer:bg-black/25">
            <span className="flex items-center gap-2 border border-white/40 bg-black/45 px-4 py-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-lg backdrop-blur-sm transition group-hover/trailer:border-champagne group-hover/trailer:text-champagne">
              <Play size={12} fill="currentColor" /> Fragmanı izle
            </span>
          </span>

          {/* Status badge */}
          {isComingSoon && (
            <div className="absolute right-3 top-3">
              <span className="bg-champagne px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                Yakında
              </span>
            </div>
          )}
          {movie.is_featured && !isComingSoon && (
            <div className="absolute left-3 top-3">
              <span className="flex items-center gap-1 bg-black/50 px-2 py-1 font-sans text-[9px] font-medium text-champagne backdrop-blur-sm">
                <Star size={9} fill="currentColor" /> Öne Çıkan
              </span>
            </div>
          )}
        </button>

        {/* Info */}
        <div className="px-4 pb-2 pt-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {movie.rating && (
              <span className={cn('px-2 py-0.5 font-sans text-[9px] font-bold', ratingStyle)}>
                {movie.rating}
              </span>
            )}
            {movie.tmdb_rating != null && movie.tmdb_rating > 0 && (
              <span className="flex items-center gap-1 border border-champagne/20 px-2 py-0.5 font-sans text-[9px] font-semibold text-champagne/80">
                <Star size={9} fill="currentColor" /> {movie.tmdb_rating.toFixed(1)}
              </span>
            )}
            {movie.genre?.slice(0, 2).map((g) => (
              <span key={g} className="font-sans text-[10px] font-medium uppercase tracking-wide text-champagne/70">
                {g}
              </span>
            ))}
            {movie.duration && (
              <span className="flex items-center gap-1 font-sans text-[10px] text-white/30">
                <Clock size={10} /> {formatDuration(movie.duration)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setTrailerOpen(true)}
            className="mb-2 block text-left font-display text-xl font-light text-white transition-colors hover:text-champagne focus-visible:text-champagne"
          >
            {movie.title}
          </button>

          <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
            {movie.director && (
              <p className="font-sans text-[11px] text-white/30">
                <span className="text-white/20">Yönetmen</span> {movie.director}
              </p>
            )}
            {movie.subtitle && (
              <span className="border border-white/10 px-2 py-0.5 font-sans text-[9px] text-white/30">
                {movie.subtitle}
              </span>
            )}
          </div>

          {movie.synopsis && (
            <p className="mb-4 line-clamp-2 font-sans text-[12px] leading-relaxed text-white/35">
              {movie.synopsis}
            </p>
          )}

          {/* Showtimes mobile */}
          {!isComingSoon && times.length > 0 && (
            <ShowtimeSection
              times={times}
              selectedTime={selectedTime}
              onSelect={setSelectedTime}
              ticketUrl={movie.ticket_url}
              onSessionClick={trackSessionClick}
            />
          )}
        </div>
      </div>

      {/* ── Desktop layout ───────────────────────────────── */}
      <div className="hidden lg:flex lg:items-stretch">
        {/* Poster */}
        <button
          type="button"
          onClick={openTrailer}
          aria-label={`${movie.title} fragmanını aç`}
          className="group/trailer relative block w-[100px] shrink-0 overflow-hidden text-left xl:w-[110px]"
        >
          <img
            src={movie.poster}
            alt={movie.title}
            className="img-cover h-full transition-transform duration-700 group-hover/trailer:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover/trailer:bg-black/35">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/55 bg-black/45 text-white transition group-hover/trailer:border-champagne group-hover/trailer:text-champagne">
              <Play size={14} fill="currentColor" className="ml-0.5" />
            </span>
          </span>
          {isComingSoon && (
            <div className="absolute inset-0 bg-black/30" />
          )}
        </button>

        {/* Movie info */}
        <div className="flex flex-1 flex-col justify-center px-6 py-5 xl:px-7">
          {/* Title row */}
          <div className="mb-2 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={openTrailer}
              className="font-display text-left text-[22px] font-light leading-snug text-white transition-colors duration-300 hover:text-champagne focus-visible:text-champagne"
            >
              {movie.title}
            </button>
            {isComingSoon && (
              <span className="bg-champagne px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                Yakında
              </span>
            )}
            {movie.is_featured && !isComingSoon && (
              <span className="flex items-center gap-1 border border-champagne/30 px-2 py-0.5 font-sans text-[9px] font-medium text-champagne">
                <Star size={9} fill="currentColor" /> Öne Çıkan
              </span>
            )}
            {movie.rating && (
              <span className={cn('px-2 py-0.5 font-sans text-[9px] font-bold', ratingStyle)}>
                {movie.rating}
              </span>
            )}
            {movie.tmdb_rating != null && movie.tmdb_rating > 0 && (
              <span className="flex items-center gap-1 border border-champagne/20 px-2 py-0.5 font-sans text-[9px] font-semibold text-champagne/80">
                <Star size={9} fill="currentColor" /> {movie.tmdb_rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Meta row */}
          <div className="mb-2.5 flex flex-wrap items-center gap-3">
            {movie.genre?.slice(0, 3).map((g) => (
              <span key={g} className="font-sans text-[11px] font-medium uppercase tracking-wide text-champagne/60">
                {g}
              </span>
            ))}
            {movie.genre && movie.genre.length > 0 && (
              <span className="text-white/15">·</span>
            )}
            {movie.duration && (
              <span className="flex items-center gap-1.5 font-sans text-[11px] text-white/30">
                <Clock size={10} /> {formatDuration(movie.duration)}
              </span>
            )}
            {movie.language && (
              <>
                <span className="text-white/15">·</span>
                <span className="font-sans text-[11px] text-white/30">{movie.language}</span>
              </>
            )}
            {movie.subtitle && (
              <span className="border border-white/10 px-2 py-0.5 font-sans text-[9px] text-white/30">
                {movie.subtitle}
              </span>
            )}
          </div>

          {/* Director + cast */}
          {movie.director && (
            <p className="mb-1 font-sans text-[11px] text-white/25">
              <span className="mr-1 text-white/15">Yönetmen</span>{movie.director}
            </p>
          )}
          {movie.cast && movie.cast.length > 0 && (
            <p className="mb-2.5 font-sans text-[11px] text-white/20">
              <span className="mr-1 text-white/12">Oyuncular</span>
              {movie.cast.slice(0, 4).join(', ')}
            </p>
          )}

          {/* Synopsis */}
          {movie.synopsis && (
            <p className="max-w-xl font-sans text-[12px] leading-[1.7] text-white/30 line-clamp-2">
              {movie.synopsis}
            </p>
          )}
        </div>

        {/* Showtimes column */}
        <div className="flex w-[260px] shrink-0 flex-col justify-center border-l border-white/[0.05] px-6 py-5 xl:w-[280px]">
          {isComingSoon ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-px w-10 bg-champagne/30" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-white/20">
                Yakında Vizyonda
              </span>
              {movie.release_date && (
                <span className="font-sans text-[13px] text-champagne/50">
                  {new Date(movie.release_date).toLocaleDateString('tr-TR', {
                    day: 'numeric', month: 'long'
                  })}
                </span>
              )}
            </div>
          ) : times.length > 0 ? (
            <ShowtimeSection
              times={times}
              selectedTime={selectedTime}
              onSelect={setSelectedTime}
              ticketUrl={movie.ticket_url}
              onSessionClick={trackSessionClick}
            />
          ) : (
            <span className="text-center font-sans text-[11px] text-white/20">Seans bilgisi yok</span>
          )}
        </div>
      </div>
      {trailerOpen && <MovieTrailerModal movie={movie} onClose={() => setTrailerOpen(false)} />}
    </motion.article>
  )
}

/* ── ShowtimeSection sub-component ──────────────────────── */
function ShowtimeSection({
  times,
  selectedTime,
  onSelect,
  ticketUrl,
  onSessionClick,
}: {
  times: string[]
  selectedTime: string | null
  onSelect: (t: string | null) => void
  ticketUrl?: string
  onSessionClick: (time: string) => void
}) {
  return (
    <div>
      {/* Time grid */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {times.map((time) => (
          <button
            key={time}
            onClick={() => {
              onSelect(selectedTime === time ? null : time)
              onSessionClick(time)
            }}
            className={cn(
              'px-3 py-2 font-sans text-[12px] font-medium transition-all duration-200',
              selectedTime === time
                ? 'bg-champagne text-white'
                : 'border border-white/12 text-white/45 hover:border-champagne/40 hover:text-white/80',
            )}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Bilet Al — shows when a time is selected */}
      {selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <a
            href={ticketUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2.5 bg-champagne py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
            onClick={(e) => {
              if (!ticketUrl || ticketUrl === '#') e.preventDefault()
              else onSessionClick(selectedTime)
            }}
          >
            <Ticket size={12} />
            Bilet Al — {selectedTime}
            <ExternalLink size={10} className="opacity-60" />
          </a>
        </motion.div>
      )}
    </div>
  )
}
