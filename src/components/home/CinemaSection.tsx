import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Clock, Play } from 'lucide-react'
import { motion } from 'motion/react'
import { useMovieContent } from '@/hooks/useCmsContent'
import { ROUTES } from '@/lib/constants'
import type { Movie } from '@/types'
import { MovieTrailerModal } from '@/components/cinema/MovieTrailerModal'
import { trackAnalytics } from '@/lib/analytics'

export function CinemaSection() {
  const { currentMovies } = useMovieContent()
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null)
  const featuredMovies = useMemo(() => {
    const limit = 3
    const rated = currentMovies
      .filter((movie) => (movie.tmdb_rating ?? 0) > 0)
      .sort((a, b) => (b.tmdb_rating ?? 0) - (a.tmdb_rating ?? 0))
    const candidates = rated.slice(0, 20)
    const pool = [...(candidates.length > 0 ? candidates : currentMovies)]

    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }

    return pool
      .slice(0, limit)
      .sort((a, b) => (b.tmdb_rating ?? 0) - (a.tmdb_rating ?? 0))
  }, [currentMovies])
  return (
    <section className="bg-midnight py-24 lg:py-32" aria-labelledby="cinema-heading">
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
                Sinema
              </span>
            </motion.div>
            <motion.h2
              id="cinema-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl font-light leading-[1.05] text-silver lg:text-5xl"
            >
              Vizyondaki Filmler
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Link
              to={ROUTES.CINEMA}
              className="group hidden items-center gap-2 font-sans text-[13px] font-medium text-white/40 transition-all duration-300 hover:text-white/80 md:flex"
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 group-hover:after:w-full">
                Tüm Filmler
              </span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Movies Grid */}
        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {featuredMovies.map((movie, i) => (
            <motion.article
              key={movie.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
            >
              <div className="group flex flex-col overflow-hidden border border-white/[0.07] bg-white/[0.04] transition-all duration-500 hover:border-champagne/25 hover:bg-white/[0.07]">
                {/* Poster */}
                <button
                  type="button"
                  onClick={() => {
                    void trackAnalytics({ entityType: 'MOVIE', eventType: 'MOVIE_CLICK', entityId: movie.analytics_id, path: '/', source: 'home-cinema' })
                    setTrailerMovie(movie)
                  }}
                  aria-label={`${movie.title} fragmanını aç`}
                  className="group/poster relative block aspect-poster w-full overflow-hidden text-left"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="img-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {/* Stronger bottom gradient for info overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover/poster:bg-black/20 group-focus-visible/poster:bg-black/20">
                    <span className="flex h-14 w-14 translate-y-0 items-center justify-center rounded-full border border-white/55 bg-black/35 text-white opacity-100 shadow-[0_0_35px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-hover/poster:translate-y-0 md:group-hover/poster:opacity-100 md:group-focus-visible/poster:translate-y-0 md:group-focus-visible/poster:opacity-100">
                      <Play size={19} fill="currentColor" className="ml-0.5" />
                    </span>
                  </span>

                  {/* Rating Badge */}
                  {movie.tmdb_rating != null && movie.tmdb_rating > 0 ? (
                    <div className="absolute right-3 top-3">
                      <span className="border border-white/20 bg-black/50 px-2.5 py-1 font-sans text-[10px] font-medium tracking-wide text-white/70 backdrop-blur-sm">
                        ★ {movie.tmdb_rating.toFixed(1)}
                      </span>
                    </div>
                  ) : movie.rating ? (
                    <div className="absolute right-3 top-3">
                      <span className="border border-white/20 bg-black/50 px-2.5 py-1 font-sans text-[10px] font-medium tracking-wide text-white/70 backdrop-blur-sm">
                        {movie.rating}
                      </span>
                    </div>
                  ) : null}

                  {/* Genre tags overlaid on image bottom */}
                  {movie.genre && movie.genre.length > 0 && (
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                      {movie.genre.map((g) => (
                        <span
                          key={g}
                          className="border border-white/20 bg-black/40 px-2 py-0.5 font-sans text-[9px] font-medium uppercase tracking-[0.1em] text-white/60 backdrop-blur-sm"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </button>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Title */}
                  <button
                    type="button"
                    onClick={() => {
                      void trackAnalytics({ entityType: 'MOVIE', eventType: 'MOVIE_CLICK', entityId: movie.analytics_id, path: '/', source: 'home-cinema' })
                      setTrailerMovie(movie)
                    }}
                    className="mb-1 text-left font-display text-xl font-light leading-snug text-silver transition-colors hover:text-champagne focus-visible:text-champagne"
                  >
                    {movie.title}
                  </button>

                  {/* Director + Duration */}
                  <div className="mb-5 flex items-center gap-2.5 font-sans text-[11px] text-white/35">
                    {movie.director && <span>{movie.director}</span>}
                    {movie.director && movie.duration && (
                      <span className="text-white/20">·</span>
                    )}
                    {movie.duration && (
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {movie.duration} dk
                      </span>
                    )}
                  </div>

                  {/* Showtimes */}
                  {movie.showtimes && movie.showtimes.length > 0 && (
                    <div className="mb-5 flex flex-wrap gap-2">
                      {movie.showtimes.slice(0, 4).map((showtime) => (
                        <span
                          key={showtime.id}
                          className={
                            showtime.is_sold_out
                              ? 'border border-white/[0.08] px-3 py-1.5 font-sans text-[11px] font-medium text-white/20 line-through'
                              : 'border border-white/15 px-3 py-1.5 font-sans text-[11px] font-medium text-white/55 transition-all duration-200 hover:border-champagne/50 hover:text-champagne'
                          }
                        >
                          {showtime.time}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA — always at bottom */}
                  <div className="mt-auto pt-1">
                    <Link
                      to={ROUTES.CINEMA}
                      className="group/btn flex w-full items-center justify-center gap-2 border border-champagne/30 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-champagne/80 transition-all duration-300 hover:border-champagne hover:bg-champagne hover:text-white"
                    >
                      Seans Saatleri
                      <ArrowRight
                        size={13}
                        className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex justify-center md:hidden"
        >
          <Link
            to={ROUTES.CINEMA}
            className="group inline-flex items-center gap-2.5 border border-white/25 px-7 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-white/70 transition-all duration-300 hover:border-white/60 hover:text-white"
          >
            Tüm Filmler
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
      {trailerMovie && (
        <MovieTrailerModal movie={trailerMovie} onClose={() => setTrailerMovie(null)} />
      )}
    </section>
  )
}
