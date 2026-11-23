import { Link } from 'react-router'
import { ChevronRight, Film } from 'lucide-react'
import { motion } from 'motion/react'
import { ROUTES } from '@/lib/constants'

export function CinemaHero() {
  return (
    <section
      className="relative overflow-hidden bg-[#060606]"
      style={{ minHeight: '44vh' }}
      aria-label="Sinema"
    >
      {/* Ghost text background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
        <span className="whitespace-nowrap font-display text-[22vw] font-light tracking-[0.08em] text-white/[0.025]">
          SİNEMA
        </span>
      </div>

      {/* Horizontal accent lines */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.04]" />

      {/* Subtle vertical lines — film strip feel */}
      <div className="pointer-events-none absolute inset-y-0 left-[8vw] w-px bg-white/[0.03]" />
      <div className="pointer-events-none absolute inset-y-0 right-[8vw] w-px bg-white/[0.03]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-14 pt-[100px] lg:px-12 lg:pb-20 lg:pt-[108px]">
        {/* Breadcrumb */}
        <nav
          className="mb-10 flex items-center gap-1.5 font-sans text-[11px] text-white/25"
          aria-label="Sayfa konumu"
        >
          <Link to={ROUTES.HOME} className="transition-colors hover:text-white/50">
            Ana Sayfa
          </Link>
          <ChevronRight size={11} />
          <span className="text-white/40">Sinema</span>
        </nav>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 flex items-center gap-4"
        >
          <Film size={14} className="text-champagne/80" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-champagne/80">
            Metrogarden Sinema
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="mb-5 font-display text-6xl font-light tracking-tight text-white lg:text-8xl"
        >
          Sinema
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="max-w-lg font-sans text-[15px] font-light leading-relaxed text-white/40"
        >
          Vizyondaki filmleri keşfedin ve seans saatlerini görüntüleyin.
        </motion.p>
      </div>
    </section>
  )
}
