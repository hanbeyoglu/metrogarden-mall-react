import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Search, X, ArrowRight, ShoppingBag, Calendar, Film, Phone } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useMeta } from '@/hooks'
import { ROUTES } from '@/lib/constants'

export function NotFoundPage() {
  const { t } = useTranslation()
  useMeta({ title: t('pages.notFound.title') })
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const QUICK_LINKS = [
    { label: t('pages.notFound.links.home'), href: ROUTES.HOME, icon: ArrowRight },
    { label: t('pages.notFound.links.stores'), href: ROUTES.STORES, icon: ShoppingBag },
    { label: t('pages.notFound.links.events'), href: ROUTES.EVENTS, icon: Calendar },
    { label: t('pages.notFound.links.cinema'), href: ROUTES.CINEMA, icon: Film },
    { label: t('pages.notFound.links.contact'), href: ROUTES.CONTACT, icon: Phone },
  ]

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`${ROUTES.STORES}?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ivory px-6 py-20">
      {/* Ghost 404 */}
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
        className="pointer-events-none absolute select-none font-display text-[28vw] font-light leading-none text-mist/50"
        style={{ letterSpacing: '-0.04em' }}
      >
        404
      </motion.span>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-5 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-champagne" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">
            {t('pages.notFound.eyebrow')}
          </span>
          <span className="h-px w-8 bg-champagne" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="mb-4 font-display text-4xl font-light text-carbon md:text-5xl"
        >
          {t('pages.notFound.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mb-10 max-w-sm font-sans text-[14px] leading-relaxed text-graphite"
        >
          {t('pages.notFound.desc')}
        </motion.p>

        {/* Search box */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSearch}
          className="mb-10 w-full"
        >
          <div className="relative flex">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ash">
              <Search size={16} />
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('pages.notFound.searchPlaceholder')}
              className="w-full border border-mist bg-white py-4 pl-11 pr-12 font-sans text-[14px] text-carbon placeholder:text-ash focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-ash hover:text-carbon"
                aria-label={t('common.clear')}
              >
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-0 top-0 flex h-full w-12 items-center justify-center bg-carbon text-white transition-colors hover:bg-champagne"
              aria-label={t('pages.notFound.searchButton')}
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.form>

        {/* Quick links */}
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          aria-label={t('pages.notFound.quickLinks')}
        >
          <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ash">
            {t('pages.notFound.quickLinks')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="group flex items-center gap-2 border border-mist bg-white px-4 py-2.5 font-sans text-[12px] font-medium text-graphite transition-all duration-200 hover:border-carbon hover:text-carbon"
              >
                <link.icon size={13} className="text-ash transition-colors group-hover:text-champagne" />
                {link.label}
              </Link>
            ))}
          </div>
        </motion.nav>
      </div>
    </div>
  )
}
