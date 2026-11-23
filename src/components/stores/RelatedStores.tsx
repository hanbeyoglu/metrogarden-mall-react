import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import type { Store } from '@/types'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { formatCategory, formatFloor } from '@/lib/format'

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

interface RelatedStoresProps {
  stores: Store[]
}

export function RelatedStores({ stores }: RelatedStoresProps) {
  if (stores.length === 0) return null

  return (
    <section className="bg-fog py-20 lg:py-28" aria-labelledby="related-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
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
                Benzer Mağazalar
              </span>
            </motion.div>
            <motion.h2
              id="related-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl font-light text-carbon lg:text-4xl"
            >
              Aynı Kategoriden
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to={ROUTES.STORES}
              className="group hidden items-center gap-2 font-sans text-[13px] font-medium text-graphite transition-all duration-300 hover:text-carbon md:flex"
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-carbon after:transition-all after:duration-300 group-hover:after:w-full">
                Tüm Mağazalar
              </span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Related Stores Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {stores.map((store, i) => {
            const initialBg = CATEGORY_INITIAL_BG[store.category] ?? 'bg-carbon'
            return (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={ROUTES.STORE_DETAIL(store.slug)}
                  className="group flex flex-col overflow-hidden border border-mist/60 bg-white transition-all duration-400 hover:-translate-y-1 hover:border-champagne/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.09)]"
                >
                  {/* Image */}
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: '3/2' }}
                  >
                    {store.cover_image ? (
                      <img
                        src={store.cover_image}
                        alt={store.name}
                        className="img-cover transition-transform duration-600 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className={cn('flex h-full w-full items-center justify-center', initialBg)}>
                        <span className="font-display text-5xl font-light text-white/50">
                          {store.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Floor badge */}
                    {store.floor && <div className="absolute right-2.5 top-2.5">
                      <span className="border border-white/20 bg-black/50 px-2 py-0.5 font-sans text-[9px] font-medium tracking-wide text-white/80 backdrop-blur-sm">
                        {formatFloor(store.floor, store.floor_label)}
                      </span>
                    </div>}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    {store.category && <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-champagne">
                      {formatCategory(store.category, store.category_label)}
                    </p>}
                    <h3 className="font-display text-lg font-light text-carbon transition-colors duration-300 group-hover:text-champagne">
                      {store.name}
                    </h3>
                  </div>

                  <div className="h-[2px] w-0 bg-champagne transition-all duration-500 group-hover:w-full" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
