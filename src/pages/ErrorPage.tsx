import { useRouteError, isRouteErrorResponse, Link } from 'react-router'
import { RefreshCw, Home, AlertOctagon } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/lib/constants'

export function ErrorPage() {
  const { t } = useTranslation()
  const error = useRouteError()
  const is404 = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ivory px-6 py-20 text-center">
      {/* Ghost code */}
      <motion.span
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
        className="pointer-events-none absolute select-none font-display text-[22vw] font-light leading-none text-mist/40"
        style={{ letterSpacing: '-0.04em' }}
      >
        {is404 ? '404' : 'ERR'}
      </motion.span>

      <div className="relative z-10 flex max-w-md flex-col items-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex h-16 w-16 items-center justify-center border border-mist bg-white text-graphite"
        >
          <AlertOctagon size={28} strokeWidth={1} />
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mb-4 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-champagne" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">
            {is404 ? t('pages.error.eyebrow404') : t('pages.error.eyebrow')}
          </span>
          <span className="h-px w-8 bg-champagne" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mb-4 font-display text-4xl font-light text-carbon md:text-5xl"
        >
          {is404 ? t('pages.error.title404') : t('pages.error.title')}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mb-10 font-sans text-[14px] leading-relaxed text-graphite"
        >
          {is404 ? t('pages.error.desc404') : t('pages.error.desc')}
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {!is404 && (
            <button
              onClick={() => window.location.reload()}
              className="group flex items-center gap-2.5 border border-carbon bg-carbon px-6 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-transparent hover:text-carbon"
            >
              <RefreshCw size={14} className="transition-transform duration-500 group-hover:rotate-180" />
              {t('pages.error.reload')}
            </button>
          )}
          <Link
            to={ROUTES.HOME}
            className="group flex items-center gap-2.5 border border-mist bg-white px-6 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-carbon transition-all duration-300 hover:border-carbon"
          >
            <Home size={14} />
            {t('pages.error.backHome')}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
