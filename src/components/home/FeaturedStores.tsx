import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useStoreContent } from '@/hooks/useCmsContent'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { formatCategory } from '@/lib/format'

const CATEGORY_STYLES: Record<string, { bg: string; text: string; initial: string }> = {
  fashion:           { bg: 'bg-[#f5f0ea]', text: 'text-[#7a5c1e]', initial: 'bg-[#1a1a1a]' },
  'food-and-beverage': { bg: 'bg-[#ebf0e8]', text: 'text-[#2d5a20]', initial: 'bg-[#2d4a1e]' },
  beauty:            { bg: 'bg-[#f5eef5]', text: 'text-[#6b3d6b]', initial: 'bg-[#4a2d4a]' },
  electronics:       { bg: 'bg-[#e8edf5]', text: 'text-[#1e3d7a]', initial: 'bg-[#1e2d5a]' },
  sports:            { bg: 'bg-[#e8f2ec]', text: 'text-[#1e5a3d]', initial: 'bg-[#1e3d2d]' },
  kids:              { bg: 'bg-[#f5f0e0]', text: 'text-[#7a5a1e]', initial: 'bg-[#5a4014]' },
  'home-and-living': { bg: 'bg-[#f0e8e8]', text: 'text-[#6b2d2d]', initial: 'bg-[#4a1e1e]' },
  entertainment:     { bg: 'bg-[#e8e8f5]', text: 'text-[#3d3d8b]', initial: 'bg-[#2d2d5a]' },
  services:          { bg: 'bg-[#f0f0e0]', text: 'text-[#5a5a1e]', initial: 'bg-[#3d3d14]' },
}

export function FeaturedStores() {
  const { featuredStores } = useStoreContent()
  return (
    <section className="bg-ivory py-24 lg:py-32" aria-labelledby="stores-heading">
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
                Öne Çıkan Mağazalar
              </span>
            </motion.div>
            <motion.h2
              id="stores-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl font-light leading-[1.05] text-carbon lg:text-5xl"
            >
              180 Dünya Markası
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Link
              to={ROUTES.STORES}
              className="group hidden items-center gap-2 font-sans text-[13px] font-medium text-graphite transition-all duration-300 hover:text-carbon md:flex"
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-carbon after:transition-all after:duration-300 group-hover:after:w-full">
                Tüm Mağazaları Gör
              </span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-5">
          {featuredStores.map((store, i) => {
            const style = CATEGORY_STYLES[store.category] ?? {
              bg: 'bg-fog',
              text: 'text-graphite',
              initial: 'bg-carbon',
            }
            return (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.55, delay: i * 0.05 }}
              >
                <Link
                  to={ROUTES.STORE_DETAIL(store.slug)}
                  className="group relative flex flex-col items-center gap-4 overflow-hidden border border-mist/60 bg-white px-4 py-7 text-center transition-all duration-500 hover:border-champagne/40 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:px-5 sm:py-8"
                >
                  {/* Initial Badge */}
                  <div
                    className={cn(
                      'flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center transition-transform duration-500 group-hover:scale-105',
                      style.initial,
                    )}
                  >
                    <span className="font-display text-3xl font-light text-white">
                      {store.name.charAt(0)}
                    </span>
                  </div>

                  {/* Name + Category */}
                  <div className="space-y-1.5">
                    <p className="font-sans text-[13px] font-semibold leading-tight tracking-wide text-carbon transition-colors duration-300 group-hover:text-champagne">
                      {store.name}
                    </p>
                    <span
                      className={cn(
                        'inline-block px-2.5 py-[3px] font-sans text-[10px] font-medium uppercase tracking-[0.1em]',
                        style.bg,
                        style.text,
                      )}
                    >
                      {formatCategory(store.category, store.category_label)}
                    </span>
                  </div>

                  {/* Hover bottom accent */}
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-champagne transition-all duration-500 group-hover:w-full" />
                </Link>
              </motion.div>
            )
          })}
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
            to={ROUTES.STORES}
            className="group inline-flex items-center gap-2.5 border border-carbon px-7 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-carbon transition-all duration-300 hover:bg-carbon hover:text-ivory"
          >
            Tüm Mağazaları Gör
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
