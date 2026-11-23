import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'

export type CinemaGenre =
  | ''
  | 'Animasyon'
  | 'Aksiyon'
  | 'Komedi'
  | 'Dram'
  | 'Aile'
  | 'Bilim Kurgu'

export type CinemaSortOption = 'alpha' | 'release' | 'popularity'

interface CinemaFilterBarProps {
  genre: CinemaGenre
  onGenreChange: (g: CinemaGenre) => void
  sort: CinemaSortOption
  onSortChange: (s: CinemaSortOption) => void
  nowShowingCount: number
  comingSoonCount: number
}

const GENRE_VALUES: CinemaGenre[] = ['', 'Animasyon', 'Aksiyon', 'Komedi', 'Dram', 'Aile', 'Bilim Kurgu']

const SELECT_BG =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23666\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E") no-repeat right 10px center'

export function CinemaFilterBar({
  genre,
  onGenreChange,
  sort,
  onSortChange,
  nowShowingCount,
  comingSoonCount,
}: CinemaFilterBarProps) {
  const { t } = useTranslation()

  const SORT_OPTIONS: { value: CinemaSortOption; label: string }[] = [
    { value: 'popularity', label: t('sort.popularity') },
    { value: 'alpha', label: t('sort.az') },
    { value: 'release', label: t('sort.releaseDate') },
  ]

  return (
    <div className="sticky top-[116px] z-30 border-b border-white/[0.04] bg-[#0a0a0a]/95 backdrop-blur-md lg:top-[128px]">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-12">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          {/* Genre pills */}
          <div className="flex shrink-0 items-center gap-1.5">
            {GENRE_VALUES.map((g) => {
              const key = g === '' ? 'all' : g
              return (
                <button
                  key={g}
                  onClick={() => onGenreChange(g)}
                  className={cn(
                    'shrink-0 px-3.5 py-1.5 font-sans text-[11px] font-medium transition-all duration-200',
                    genre === g
                      ? 'bg-champagne text-white'
                      : 'border border-white/10 text-white/40 hover:border-white/25 hover:text-white/70',
                  )}
                >
                  {t(`cinemaGenres.${key}`)}
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="mx-2 h-5 w-px shrink-0 bg-white/10" />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as CinemaSortOption)}
            className="shrink-0 border border-white/10 bg-transparent py-1.5 pl-3 pr-7 font-sans text-[11px] text-white/50 focus:border-champagne/50 focus:outline-none appearance-none cursor-pointer"
            style={{ backgroundImage: SELECT_BG }}
            aria-label={t('common.sortBy')}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#111] text-white">
                {opt.label}
              </option>
            ))}
          </select>

          {/* Count info */}
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <span className="font-sans text-[11px] text-white/25">
              <span className="text-white/50">{nowShowingCount}</span>{' '}
              {t('status.nowShowing').toLowerCase()}
              {comingSoonCount > 0 && (
                <>
                  {' '}&middot;{' '}
                  <span className="text-white/50">{comingSoonCount}</span>{' '}
                  {t('status.comingSoon').toLowerCase()}
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
