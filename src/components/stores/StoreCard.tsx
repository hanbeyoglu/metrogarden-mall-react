import { Link } from 'react-router'
import { motion } from 'motion/react'
import type { Store } from '@/types'
import { ROUTES } from '@/lib/constants'
import { formatCategory, formatFloor } from '@/lib/format'
import { cn } from '@/lib/cn'

const CATEGORY_INITIAL_BG: Record<string, string> = {
  fashion:             'bg-[#1a1514]',
  'food-and-beverage': 'bg-[#0f1a0f]',
  beauty:              'bg-[#1a0f1a]',
  electronics:         'bg-[#0f121a]',
  sports:              'bg-[#0f1a14]',
  kids:                'bg-[#1a1505]',
  'home-and-living':   'bg-[#1a0f0f]',
  entertainment:       'bg-[#0f0f1a]',
  services:            'bg-[#141414]',
}

const CATEGORY_BADGE: Record<string, string> = {
  fashion:             'bg-[#f5f0ea] text-[#7a5c1e]',
  'food-and-beverage': 'bg-[#ebf0e8] text-[#2d5a20]',
  beauty:              'bg-[#f5eef5] text-[#6b3d6b]',
  electronics:         'bg-[#e8edf5] text-[#1e3d7a]',
  sports:              'bg-[#e8f2ec] text-[#1e5a3d]',
  kids:                'bg-[#f5f0e0] text-[#7a5a1e]',
  'home-and-living':   'bg-[#f0e8e8] text-[#6b2d2d]',
  entertainment:       'bg-[#e8e8f5] text-[#3d3d8b]',
  services:            'bg-[#f0f0e0] text-[#5a5a1e]',
}

interface StoreCardProps {
  store: Store
  index?: number
}

export function StoreCard({ store, index = 0 }: StoreCardProps) {
  const initialBg = CATEGORY_INITIAL_BG[store.category] ?? 'bg-carbon'
  const badgeStyle = CATEGORY_BADGE[store.category] ?? 'bg-fog text-graphite'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.04, 0.32) }}
    >
      <Link
        to={ROUTES.STORE_DETAIL(store.slug)}
        className="group block overflow-hidden bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
      >
        {/* Cover Image or Initial */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
          {store.cover_image ? (
            <img
              src={store.cover_image}
              alt={store.name}
              className="img-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className={cn('flex h-full w-full items-center justify-center', initialBg)}>
              <span className="font-display text-6xl font-light text-white/60">
                {store.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

          {/* Floor badge — top right */}
          {store.floor && <div className="absolute right-3 top-3">
            <span className="border border-white/20 bg-black/50 px-2.5 py-1 font-sans text-[10px] font-medium tracking-wide text-white/80 backdrop-blur-sm">
              {formatFloor(store.floor, store.floor_label)}
            </span>
          </div>}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category label */}
          {store.category && <p className="mb-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-champagne">
            {formatCategory(store.category, store.category_label)}
          </p>}

          {/* Store Name */}
          <h3 className="mb-3 font-display text-xl font-light leading-snug text-carbon transition-colors duration-300 group-hover:text-champagne">
            {store.name}
          </h3>

          {/* Category badge */}
          {store.category && <span
            className={cn(
              'inline-block px-2.5 py-[3px] font-sans text-[10px] font-medium uppercase tracking-[0.1em]',
              badgeStyle,
            )}
          >
            {formatCategory(store.category, store.category_label)}
          </span>}
        </div>

        {/* Bottom accent */}
        <div className="h-[2px] w-0 bg-champagne transition-all duration-500 group-hover:w-full" />
      </Link>
    </motion.div>
  )
}
