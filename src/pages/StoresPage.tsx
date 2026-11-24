import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useMeta } from '@/hooks'
import { useStoreContent, useMallContent } from '@/hooks/useCmsContent'
import type { StoreCategory, StoreFloor } from '@/types'
import { PageHero } from '@/components/shared/PageHero'
import { StoreFilterBar } from '@/components/stores/StoreFilterBar'
import { StoreCard } from '@/components/stores/StoreCard'
import { formatCategory, formatFloor } from '@/lib/format'

type SortOption = 'az' | 'za' | 'category' | 'floor'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1920&q=85&fit=crop'

/** Turkish-aware normalization for search */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
}

function floorRank(label: string): number {
  const normalized = label.toLowerCase().replaceAll('ı', 'i')
  if (/(^|\b)(b\d+|basement|bodrum)/.test(normalized)) {
    const level = normalized.match(/b(\d+)/)?.[1]
    return level ? -Number(level) : -1
  }
  if (normalized.includes('zemin') || normalized.includes('ground')) return 0
  const number = normalized.match(/-?\d+/)?.[0]
  return number ? Number(number) : Number.POSITIVE_INFINITY
}

function compareFloors(a: string, b: string): number {
  const rankDifference = floorRank(a) - floorRank(b)
  return Number.isNaN(rankDifference) || !Number.isFinite(rankDifference) || rankDifference === 0
    ? a.localeCompare(b, 'tr', { numeric: true })
    : rankDifference
}

export function StoresPage() {
  const { t } = useTranslation()
  const { stores: allStores } = useStoreContent()
  const mall = useMallContent()
  const activeStores = useMemo(() => allStores.filter((s) => s.is_active), [allStores])
  const categoryOptions = useMemo(() => {
    const categories = new Map<string, string>()
    activeStores.forEach((store) => {
      if (store.category) categories.set(store.category, formatCategory(store.category, store.category_label))
    })
    return [...categories].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label, 'tr'))
  }, [activeStores])
  const floorOptions = useMemo(() => {
    const floors = new Map<string, string>()
    activeStores.forEach((store) => {
      if (store.floor) floors.set(store.floor, formatFloor(store.floor, store.floor_label))
    })
    return [...floors].map(([value, label]) => ({ value, label })).sort((a, b) => compareFloors(a.label, b.label))
  }, [activeStores])
  useMeta({ title: t('pages.stores.heroTitle') })

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<StoreCategory | ''>('')
  const [floor, setFloor] = useState<StoreFloor | ''>('')
  const [sort, setSort] = useState<SortOption>('az')

  const filteredStores = useMemo(() => {
    const q = normalize(search.trim())

    const result = activeStores.filter((s) => {
      if (q) {
        const nameMatch = normalize(s.name).includes(q)
        const descMatch = s.description ? normalize(s.description).includes(q) : false
        if (!nameMatch && !descMatch) return false
      }
      if (category && s.category !== category) return false
      if (floor && s.floor !== floor) return false
      return true
    })

    return [...result].sort((a, b) => {
      switch (sort) {
        case 'az': return a.name.localeCompare(b.name, 'tr')
        case 'za': return b.name.localeCompare(a.name, 'tr')
        case 'category': return formatCategory(a.category, a.category_label).localeCompare(formatCategory(b.category, b.category_label), 'tr')
        case 'floor': return compareFloors(formatFloor(a.floor, a.floor_label), formatFloor(b.floor, b.floor_label))
        default: return 0
      }
    })
  }, [activeStores, search, category, floor, sort])

  return (
    <>
      <PageHero
        title={t('pages.stores.heroTitle')}
        subtitle={t('pages.stores.heroSubtitle')}
        image={mall.stores_hero_image || HERO_IMAGE}
        breadcrumbs={[{ label: t('nav.stores'), href: '/' }, { label: t('nav.stores') }]}
      />

      <StoreFilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        categoryOptions={categoryOptions}
        onCategoryChange={setCategory}
        floor={floor}
        floorOptions={floorOptions}
        onFloorChange={setFloor}
        sort={sort}
        onSortChange={setSort}
        resultCount={filteredStores.length}
        totalCount={activeStores.length}
      />

      <section className="bg-ivory py-12 lg:py-16" aria-label={t('pages.stores.listAriaLabel')}>
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          {filteredStores.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5 xl:gap-6">
              {filteredStores.map((store, i) => (
                <StoreCard key={store.id} store={store} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center py-20 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center border border-mist bg-fog text-ash">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <h3 className="mb-2 font-display text-2xl font-light text-carbon">
                {t('pages.stores.emptyTitle')}
              </h3>
              <p className="mb-6 max-w-xs font-sans text-sm text-graphite">
                {t('pages.stores.emptyDesc')}
              </p>
              <button
                onClick={() => { setSearch(''); setCategory(''); setFloor('') }}
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
