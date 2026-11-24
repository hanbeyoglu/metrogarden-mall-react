import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

export interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeroProps {
  title: string
  subtitle?: string
  image: string
  breadcrumbs?: Breadcrumb[]
  height?: 'sm' | 'md' | 'lg'
}

const HEIGHT_CLASSES = {
  sm: 'min-h-[320px] lg:min-h-[380px]',
  md: 'min-h-[380px] lg:min-h-[480px]',
  lg: 'min-h-[480px] lg:min-h-[600px]',
}

export function PageHero({
  title,
  subtitle,
  image,
  breadcrumbs,
  height = 'md',
}: PageHeroProps) {
  const { t } = useTranslation()
  return (
    <section
      className={`relative flex w-full items-end overflow-hidden bg-obsidian ${HEIGHT_CLASSES[height]}`}
      aria-label={title}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          aria-hidden
          className="img-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Overlay layers */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 pb-12 lg:px-12 lg:pb-16">
        <div className="mx-auto max-w-[1440px]">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <motion.nav
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 flex items-center gap-1.5 font-sans text-[11px] text-white/45"
              aria-label={t('common.breadcrumb')}
            >
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight size={11} className="text-white/30" />}
                  {crumb.href ? (
                    <Link
                      to={crumb.href}
                      className="transition-colors hover:text-white/80"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white/70">{crumb.label}</span>
                  )}
                </span>
              ))}
            </motion.nav>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="font-display text-5xl font-light leading-[1.0] text-white lg:text-6xl xl:text-7xl"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="mt-4 max-w-lg font-sans text-[15px] font-light leading-relaxed text-white/60"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
