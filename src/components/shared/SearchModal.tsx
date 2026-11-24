import {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import {
  Search, X, ArrowRight, Clock, Sparkles,
  ShoppingBag, Tag, Calendar, Film, FileText,
  MapPin, CornerDownLeft, ChevronUp, ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useSearch } from '@/contexts/SearchContext'
import { useStoreContent, useCampaignContent, useEventContent, useMovieContent, useServiceContent } from '@/hooks/useCmsContent'
import {
  searchAll, getRecentSearches, addRecentSearch, clearRecentSearches,
  type SearchResult, type GroupedResults,
} from '@/lib/searchUtils'
import { trackSearchClick } from '@/lib/searchAnalytics'
import { cn } from '@/lib/cn'

/* ── Type icon map ──────────────────────────────────── */
const TYPE_ICONS = {
  store: ShoppingBag,
  campaign: Tag,
  event: Calendar,
  movie: Film,
  service: MapPin,
  page: FileText,
} as const

type SectionKey = keyof GroupedResults

/* ─────────────────────────────────────────────────────── */
/* SearchResultItem                                        */
/* ─────────────────────────────────────────────────────── */

interface SearchResultItemProps {
  result: SearchResult
  isActive: boolean
  onClick: () => void
}

const SearchResultItem = forwardRef<HTMLButtonElement, SearchResultItemProps>(
  ({ result, isActive, onClick }, ref) => {
    const Icon = TYPE_ICONS[result.type]
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150',
          isActive ? 'bg-fog' : 'hover:bg-fog/60',
        )}
        tabIndex={-1}
        data-active={isActive}
        aria-label={`${result.title}${result.subtitle ? ` — ${result.subtitle}` : ''}`}
      >
        {/* Thumbnail / Icon */}
        <div className="relative h-9 w-9 shrink-0 overflow-hidden bg-fog">
          {result.thumbnail ? (
            <img src={result.thumbnail} alt="" className="img-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ash">
              <Icon size={16} strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-[13px] font-medium text-carbon">
            {result.title}
          </p>
          {result.subtitle && (
            <p className="truncate font-sans text-[11px] text-ash">{result.subtitle}</p>
          )}
        </div>

        {/* Category badge */}
        {result.categoryLabel && (
          <span className="shrink-0 font-sans text-[10px] font-medium text-champagne">
            {result.categoryLabel}
          </span>
        )}

        {/* Arrow */}
        <ArrowRight
          size={13}
          className={cn(
            'shrink-0 transition-all duration-200',
            isActive ? 'translate-x-0.5 text-champagne' : 'text-mist',
          )}
        />
      </button>
    )
  },
)
SearchResultItem.displayName = 'SearchResultItem'

/* ─────────────────────────────────────────────────────── */
/* SearchSkeleton                                          */
/* ─────────────────────────────────────────────────────── */

function SearchSkeleton() {
  return (
    <div className="px-4 py-4">
      {[3, 2, 2].map((count, sectionIdx) => (
        <div key={sectionIdx} className="mb-5">
          <div className="mb-2 h-3 w-16 animate-pulse rounded-sm bg-mist" />
          <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-none bg-fog" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-2/3 animate-pulse rounded-sm bg-mist" />
                  <div className="h-2.5 w-1/2 animate-pulse rounded-sm bg-fog" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/* SearchEmptyState                                        */
/* ─────────────────────────────────────────────────────── */

function SearchEmptyState({ query, onSuggest }: { query: string; onSuggest: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-4 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center border border-mist text-ash">
        <Search size={20} strokeWidth={1} />
      </div>
      <div>
        <p className="font-display text-xl font-light text-carbon">{t('search.noResults')}</p>
        <p className="mt-1 font-sans text-[13px] text-graphite">
          <span className="font-medium text-carbon">&ldquo;{query}&rdquo;</span>{' '}
          {t('search.noResultsDesc')}
        </p>
      </div>
      <button
        onClick={onSuggest}
        className="flex items-center gap-2 font-sans text-[12px] font-medium text-champagne underline-offset-2 hover:underline"
      >
        <ShoppingBag size={13} />
        {t('search.suggestStores')}
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/* SearchModal                                             */
/* ─────────────────────────────────────────────────────── */

export function SearchModal() {
  const { isOpen, close } = useSearch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { stores } = useStoreContent()
  const { campaigns } = useCampaignContent()
  const { events } = useEventContent()
  const { movies } = useMovieContent()
  const { services } = useServiceContent()

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([])

  /* Section config — built inside component to use t() */
  const SECTIONS: { key: SectionKey; label: string }[] = [
    { key: 'stores', label: t('search.sections.stores') },
    { key: 'campaigns', label: t('search.sections.campaigns') },
    { key: 'events', label: t('search.sections.events') },
    { key: 'movies', label: t('search.sections.movies') },
    { key: 'services', label: t('search.sections.services') },
    { key: 'pages', label: t('search.sections.pages') },
  ]

  /* ── Reset when closing ───────────────────────────── */
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setQuery('')
        setDebouncedQuery('')
        setIsSearching(false)
        setActiveIndex(-1)
      }, 250)
    } else {
      setRecentSearches(getRecentSearches())
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  /* ── Debounce query ───────────────────────────────── */
  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery('')
      setIsSearching(false)
      setActiveIndex(-1)
      return
    }
    setIsSearching(true)
    setActiveIndex(-1)
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      setIsSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  /* ── Compute results ──────────────────────────────── */
  const groupedResults = useMemo<GroupedResults | null>(() => {
    if (!debouncedQuery.trim()) return null
    return searchAll(debouncedQuery, { stores, campaigns, events, movies, services })
  }, [debouncedQuery, stores, campaigns, events, movies, services])

  const flatResults = useMemo<SearchResult[]>(() => {
    if (!groupedResults) return []
    return [
      ...groupedResults.stores,
      ...groupedResults.campaigns,
      ...groupedResults.events,
      ...groupedResults.movies,
      ...groupedResults.services,
      ...groupedResults.pages,
    ]
  }, [groupedResults])

  const totalResults = flatResults.length
  const hasQuery = debouncedQuery.trim().length > 0

  const suggestedSearches = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const candidates = [
      ...stores.filter((store) => store.is_active).slice(0, 2).map((store) => store.name),
      ...campaigns.filter((campaign) => campaign.is_active).slice(0, 1).map((campaign) => campaign.title),
      ...events.filter((event) => new Date(event.end_date ?? event.date) >= today).slice(0, 1).map((event) => event.title),
      ...movies.slice(0, 1).map((movie) => movie.title),
      ...services.slice(0, 1).map((service) => service.name),
    ]
    return [...new Set(candidates.filter((value) => value.trim()))].slice(0, 6)
  }, [stores, campaigns, events, movies, services])

  /* ── Scroll active item into view ─────────────────── */
  useEffect(() => {
    if (activeIndex >= 0 && resultRefs.current[activeIndex]) {
      resultRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeIndex])

  /* ── Navigate to a result ─────────────────────────── */
  const selectResult = useCallback(
    (result: SearchResult) => {
      addRecentSearch(query || debouncedQuery)
      trackSearchClick(result)
      close()
      navigate(result.href)
    },
    [query, debouncedQuery, close, navigate],
  )

  /* ── Apply a search term (recent / popular) ───────── */
  const applyTerm = useCallback((term: string) => {
    setQuery(term)
    inputRef.current?.focus()
  }, [])

  /* ── Keyboard handler ─────────────────────────────── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((prev) => (prev < totalResults - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalResults - 1))
          break
        case 'Enter':
          if (activeIndex >= 0 && flatResults[activeIndex]) {
            e.preventDefault()
            selectResult(flatResults[activeIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          close()
          break
        default:
          break
      }
    },
    [totalResults, activeIndex, flatResults, selectResult, close],
  )

  /* ── Helpers for grouped rendering ───────────────── */
  function getFlatStartIndex(sectionKey: SectionKey): number {
    let idx = 0
    for (const s of SECTIONS) {
      if (s.key === sectionKey) return idx
      idx += (groupedResults?.[s.key].length ?? 0)
    }
    return idx
  }

  /* ─────────────────────────────────────────────────── */

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center px-4 pt-[10vh] md:pt-[12vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-carbon/70 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-modal-title"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex w-full max-w-[720px] flex-col overflow-hidden border border-mist/60 bg-white shadow-2xl"
            style={{ maxHeight: '82vh' }}
            onKeyDown={handleKeyDown}
          >
            {/* Hidden title for screen readers */}
            <h2 id="search-modal-title" className="sr-only">
              {t('nav.search')}
            </h2>

            {/* ── Input row ─────────────────────────────── */}
            <div className="flex shrink-0 items-center gap-3 border-b border-mist/60 px-4 py-3.5">
              <Search size={17} className="shrink-0 text-ash" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="min-w-0 flex-1 bg-transparent font-sans text-[15px] text-carbon placeholder:text-ash/60 focus:outline-none"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                role="combobox"
                aria-expanded={totalResults > 0}
                aria-autocomplete="list"
                aria-controls="search-results"
              />

              <kbd className="hidden shrink-0 items-center gap-1 border border-mist bg-fog px-1.5 py-0.5 font-sans text-[10px] text-ash sm:flex">
                {t('search.escHint')}
              </kbd>

              {query ? (
                <button
                  onClick={() => { setQuery(''); inputRef.current?.focus() }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center text-ash transition-colors hover:text-carbon"
                  aria-label={t('search.clearLabel')}
                >
                  <X size={14} />
                </button>
              ) : (
                <button
                  onClick={close}
                  className="flex h-7 w-7 shrink-0 items-center justify-center text-ash transition-colors hover:text-carbon"
                  aria-label={t('search.closeLabel')}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* ── Content area ──────────────────────────── */}
            <div
              id="search-results"
              role="listbox"
              aria-label={t('nav.search')}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            >
              {/* Loading */}
              {isSearching && <SearchSkeleton />}

              {/* Results */}
              {!isSearching && groupedResults && totalResults > 0 && (
                <div>
                  {SECTIONS.map((section) => {
                    const sectionResults = groupedResults[section.key]
                    if (sectionResults.length === 0) return null
                    const startIdx = getFlatStartIndex(section.key)

                    return (
                      <motion.div
                        key={section.key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-b border-mist/40 bg-fog px-4 py-2">
                          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-ash">
                            {section.label}
                          </span>
                          <span className="ml-2 font-sans text-[10px] text-mist">
                            {sectionResults.length}
                          </span>
                        </div>

                        {sectionResults.map((result, i) => {
                          const flatIdx = startIdx + i
                          return (
                            <SearchResultItem
                              key={result.id}
                              ref={(el) => { resultRefs.current[flatIdx] = el }}
                              result={result}
                              isActive={activeIndex === flatIdx}
                              onClick={() => selectResult(result)}
                            />
                          )
                        })}
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {/* No results */}
              {!isSearching && hasQuery && totalResults === 0 && (
                <SearchEmptyState
                  query={debouncedQuery}
                  onSuggest={() => { close(); navigate('/stores') }}
                />
              )}

              {/* Initial state */}
              {!isSearching && !hasQuery && (
                <div className="px-4 py-5">
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-ash" />
                          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">
                            {t('search.recentSearches')}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            clearRecentSearches()
                            setRecentSearches([])
                          }}
                          className="font-sans text-[10px] text-ash underline-offset-2 hover:text-graphite hover:underline"
                        >
                          {t('search.clearHistory')}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => applyTerm(term)}
                            className="flex items-center gap-1.5 border border-mist bg-fog px-3 py-1.5 font-sans text-[12px] text-graphite transition-all hover:border-champagne/50 hover:text-carbon"
                          >
                            <Clock size={10} className="text-ash" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles size={12} className="text-champagne" />
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">
                        {t('search.suggestedSearches')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSearches.length > 0 ? suggestedSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => applyTerm(term)}
                          className="border border-mist bg-white px-3 py-1.5 font-sans text-[12px] text-graphite transition-all hover:border-champagne hover:text-champagne"
                        >
                          {term}
                        </button>
                      )) : (
                        <p className="font-sans text-[12px] text-ash">{t('search.noSuggestions')}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Bottom keyboard hints ─────────────────── */}
            <div className="flex shrink-0 items-center gap-5 border-t border-mist/50 bg-fog px-4 py-2.5">
              <span className="flex items-center gap-1.5 font-sans text-[10px] text-ash">
                <kbd className="flex items-center gap-0.5 border border-mist bg-white px-1.5 py-0.5 text-[9px]">
                  <ChevronDown size={9} /><ChevronUp size={9} />
                </kbd>
                {t('search.navigateHint')}
              </span>
              <span className="flex items-center gap-1.5 font-sans text-[10px] text-ash">
                <kbd className="flex items-center gap-0.5 border border-mist bg-white px-1.5 py-0.5 text-[9px]">
                  <CornerDownLeft size={9} />
                </kbd>
                {t('search.selectHint')}
              </span>
              <span className="flex items-center gap-1.5 font-sans text-[10px] text-ash">
                <kbd className="border border-mist bg-white px-1.5 py-0.5 text-[9px]">{t('search.escHint')}</kbd>
                {t('search.closeHint')}
              </span>
              {totalResults > 0 && (
                <span className="ml-auto font-sans text-[10px] text-ash">
                  {t('search.resultsCount', { count: totalResults })}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
