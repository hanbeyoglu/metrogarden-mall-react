import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useMeta } from '@/hooks'
import { useMovieContent } from '@/hooks/useCmsContent'
import { CinemaHero } from '@/components/cinema/CinemaHero'
import { DateSelector } from '@/components/cinema/DateSelector'
import { CinemaFilterBar } from '@/components/cinema/CinemaFilterBar'
import type { CinemaGenre, CinemaSortOption } from '@/components/cinema/CinemaFilterBar'
import { MovieRow } from '@/components/cinema/MovieRow'

const MOVIES_PER_PAGE = 10

function CinemaPagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (page: number) => void }) {
  const { t } = useTranslation()
  if (pageCount <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-5 py-8" aria-label={t('pages.cinema.pagination')}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="border border-white/15 px-4 py-2 font-sans text-xs text-white/70 transition-colors hover:border-champagne hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        {t('pages.cinema.previousPage')}
      </button>
      <span className="font-sans text-xs tabular-nums text-white/50">
        {t('pages.cinema.pageOf', { page, totalPages: pageCount })}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        className="border border-white/15 px-4 py-2 font-sans text-xs text-white/70 transition-colors hover:border-champagne hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        {t('pages.cinema.nextPage')}
      </button>
    </nav>
  )
}

export function CinemaPage() {
  const { movies: allMovies } = useMovieContent()
  const { t } = useTranslation()
  useMeta({ title: t('pages.cinema.heroTitle') })

  const [selectedDay, setSelectedDay] = useState(0)
  const [genre, setGenre] = useState<CinemaGenre>('')
  const [sort, setSort] = useState<CinemaSortOption>('popularity')
  const [movieStatus, setMovieStatus] = useState<'now-showing' | 'coming-soon'>('now-showing')
  const [nowShowingPage, setNowShowingPage] = useState(1)
  const [comingSoonPage, setComingSoonPage] = useState(1)

  const { nowShowing, comingSoon } = useMemo(() => {
    const filtered = allMovies.filter((movie) => {
      if (!genre) return true
      return movie.genre?.includes(genre) ?? false
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'alpha':
          return a.title.localeCompare(b.title, 'tr')
        case 'release':
          return new Date(a.release_date ?? '').getTime() - new Date(b.release_date ?? '').getTime()
        case 'popularity':
        default:
          if ((a.tmdb_rating ?? 0) !== (b.tmdb_rating ?? 0)) {
            return (b.tmdb_rating ?? 0) - (a.tmdb_rating ?? 0)
          }
          if (a.is_featured && !b.is_featured) return -1
          if (!a.is_featured && b.is_featured) return 1
          return 0
      }
    })

    return {
      nowShowing: sorted.filter((m) => m.status === 'now-showing'),
      comingSoon: sorted.filter((m) => m.status === 'coming-soon'),
    }
  }, [allMovies, genre, sort])

  const nowShowingPageCount = Math.ceil(nowShowing.length / MOVIES_PER_PAGE)
  const comingSoonPageCount = Math.ceil(comingSoon.length / MOVIES_PER_PAGE)
  const currentNowShowingPage = Math.min(nowShowingPage, Math.max(nowShowingPageCount, 1))
  const currentComingSoonPage = Math.min(comingSoonPage, Math.max(comingSoonPageCount, 1))
  const visibleNowShowing = nowShowing.slice(
    (currentNowShowingPage - 1) * MOVIES_PER_PAGE,
    currentNowShowingPage * MOVIES_PER_PAGE,
  )
  const visibleComingSoon = comingSoon.slice(
    (currentComingSoonPage - 1) * MOVIES_PER_PAGE,
    currentComingSoonPage * MOVIES_PER_PAGE,
  )
  const selectedMovies = movieStatus === 'now-showing' ? nowShowing : comingSoon
  const selectedPage = movieStatus === 'now-showing' ? currentNowShowingPage : currentComingSoonPage
  const selectedPageCount = movieStatus === 'now-showing' ? nowShowingPageCount : comingSoonPageCount
  const selectedHeading = movieStatus === 'now-showing'
    ? t('pages.cinema.nowShowing')
    : t('pages.cinema.comingSoon')
  const visibleMovies = movieStatus === 'now-showing' ? visibleNowShowing : visibleComingSoon

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <CinemaHero />

      <DateSelector selectedDay={selectedDay} onDayChange={setSelectedDay} />

      <CinemaFilterBar
        genre={genre}
        onGenreChange={(value) => {
          setGenre(value)
          setNowShowingPage(1)
          setComingSoonPage(1)
        }}
        sort={sort}
        onSortChange={(value) => {
          setSort(value)
          setNowShowingPage(1)
          setComingSoonPage(1)
        }}
        nowShowingCount={nowShowing.length}
        comingSoonCount={comingSoon.length}
      />

      <section aria-labelledby="cinema-movies-heading" className="pb-16">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 pb-5 pt-10 lg:px-12">
          <h2
            id="cinema-movies-heading"
            className="flex items-center gap-4 font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35"
          >
            <span className="h-px w-6 bg-champagne/50" />
            {selectedHeading}
            <span className="text-champagne/60">({selectedMovies.length})</span>
          </h2>
          <label className="flex items-center gap-3">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              {t('pages.cinema.movieStatus')}
            </span>
            <select
              value={movieStatus}
              onChange={(event) => setMovieStatus(event.target.value as 'now-showing' | 'coming-soon')}
              className="min-w-44 appearance-none border border-white/15 bg-[#111] px-4 py-2.5 font-sans text-xs text-white/80 outline-none transition-colors focus:border-champagne/60"
            >
              <option value="now-showing" className="bg-[#111] text-white">
                {t('pages.cinema.nowShowing')} ({nowShowing.length})
              </option>
              <option value="coming-soon" className="bg-[#111] text-white">
                {t('pages.cinema.comingSoon')} ({comingSoon.length})
              </option>
            </select>
          </label>
        </div>

        {selectedMovies.length > 0 ? (
          <div className="mx-auto max-w-[1440px] px-4 lg:px-12">
            <div className="overflow-hidden">
              {visibleMovies.map((movie, i) => (
                <MovieRow key={movie.id} movie={movie} selectedDay={selectedDay} index={i} />
              ))}
            </div>
            <CinemaPagination
              page={selectedPage}
              pageCount={selectedPageCount}
              onChange={movieStatus === 'now-showing' ? setNowShowingPage : setComingSoonPage}
            />
          </div>
        ) : (
        <div className="flex flex-col items-center py-24 text-center">
          <p className="mb-2 font-display text-2xl font-light text-white/20">
            {t('pages.cinema.noMovies')}
          </p>
          <button
            onClick={() => setGenre('')}
            className="border border-white/15 px-5 py-2.5 font-sans text-[12px] text-white/30 transition-all hover:border-white/30 hover:text-white/60"
          >
            {t('common.clear')}
          </button>
        </div>
        )}
      </section>
    </div>
  )
}
