import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Clock, Film, Play, Star, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Movie } from '@/types'

interface MovieTrailerModalProps {
  movie: Movie
  onClose: () => void
}

function getYouTubeEmbedUrl(value?: string): string | undefined {
  if (!value) return undefined

  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')
    let videoId: string | undefined

    if (host === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0]
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') videoId = url.searchParams.get('v') ?? undefined
      else if (/^\/(embed|shorts)\//.test(url.pathname)) videoId = url.pathname.split('/')[2]
    }

    if (!videoId || !/^[\w-]{11}$/.test(videoId)) return undefined
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
  } catch {
    return undefined
  }
}

function formatDuration(duration: number | undefined, t: (key: string, options?: Record<string, number>) => string) {
  if (!duration) return undefined
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  return hours
    ? `${t('pages.cinema.durationHoursOnly', { hours })}${minutes ? ` ${t('pages.cinema.durationMinutes', { minutes })}` : ''}`
    : t('pages.cinema.durationMinutes', { minutes })
}

export function MovieTrailerModal({ movie, onClose }: MovieTrailerModalProps) {
  const { t } = useTranslation()
  const embedUrl = (() => {
    const providedEmbedUrl = movie.trailer?.provider === 'YOUTUBE' ? movie.trailer.embedUrl : undefined
    const candidate = providedEmbedUrl ?? getYouTubeEmbedUrl(movie.trailer_url)
    if (!candidate) return undefined

    try {
      const url = new URL(candidate)
      const host = url.hostname.replace(/^www\./, '')
      if (
        url.protocol !== 'https:' ||
        !['youtube-nocookie.com', 'youtube.com'].includes(host) ||
        !url.pathname.startsWith('/embed/')
      ) return undefined
      url.searchParams.set('autoplay', '1')
      url.searchParams.set('playsinline', '1')
      url.searchParams.set('rel', '0')
      return url.toString()
    } catch {
      return undefined
    }
  })()

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-md sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-trailer-title"
        className="relative my-auto w-full max-w-5xl overflow-hidden border border-white/10 bg-[#10100f] shadow-[0_30px_120px_rgba(0,0,0,0.7)]"
      >
        <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-champagne/80 to-transparent" />

        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-champagne/25 bg-champagne/[0.08] text-champagne">
              <Film size={16} />
            </span>
            <div className="min-w-0">
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.24em] text-champagne/75">{t('pages.cinema.trailer')}</p>
              <h2 id="movie-trailer-title" className="truncate font-display text-lg font-light text-white sm:text-xl">
                {movie.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('pages.cinema.closeTrailer')}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 text-white/55 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-black">
          <div className="relative aspect-video w-full">
            {embedUrl ? (
              <iframe
                key={embedUrl}
                src={embedUrl}
                title={t('pages.cinema.trailerTitle', { title: movie.title })}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img src={movie.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 blur-xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-champagne/10" />
                <div className="relative flex max-w-sm flex-col items-center px-6 text-center">
                  <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-champagne/40 bg-black/30 text-champagne shadow-[0_0_45px_rgba(201,164,95,0.12)]">
                    {movie.trailer_url ? <Film size={23} /> : <Play size={23} fill="currentColor" className="ml-1" />}
                  </span>
                  <p className="font-display text-2xl font-light text-white">{t('pages.cinema.trailerUnavailableTitle')}</p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-white/45">
                    {movie.trailer || movie.trailer_url
                      ? t('pages.cinema.trailerUnsupported')
                      : t('pages.cinema.trailerMissing')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-5 sm:px-7 sm:py-6">
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {movie.status === 'coming-soon' && (
              <span className="border border-champagne/30 bg-champagne/[0.08] px-2.5 py-1 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-champagne">
                {t('pages.cinema.comingSoonBadge')}
              </span>
            )}
            {movie.genre?.slice(0, 3).map((genre) => (
              <span key={genre} className="font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">
                {t(`cinemaGenres.${genre}`, { defaultValue: genre })}
              </span>
            ))}
            {formatDuration(movie.duration, t) && (
              <span className="flex items-center gap-1.5 font-sans text-[11px] text-white/40">
                <Clock size={12} /> {formatDuration(movie.duration, t)}
              </span>
            )}
            {movie.tmdb_rating != null && movie.tmdb_rating > 0 && (
              <span className="flex items-center gap-1.5 font-sans text-[11px] font-medium text-champagne">
                <Star size={12} fill="currentColor" /> {movie.tmdb_rating.toFixed(1)}
              </span>
            )}
          </div>
          {movie.synopsis && (
            <p className="max-w-3xl font-sans text-[13px] leading-6 text-white/55">{movie.synopsis}</p>
          )}
        </div>
      </section>
    </div>
  )

  return createPortal(modal, document.body)
}
