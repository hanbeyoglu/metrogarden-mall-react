import { useRef, useState, useCallback } from 'react'
import { Link } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useSliderContent } from '@/hooks/useCmsContent'
import { cn } from '@/lib/cn'
import { trackAnalytics } from '@/lib/analytics'

import 'swiper/css'
import 'swiper/css/effect-fade'

export function HeroSlider() {
  const sliders = useSliderContent()
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const activeSlider = sliders[activeIndex] ?? sliders[0]

  const handleDotClick = useCallback((i: number) => {
    swiperRef.current?.slideToLoop(i)
  }, [])

  if (!activeSlider) return null

  return (
    <section
      className="relative h-dvh min-h-[640px] w-full overflow-hidden bg-obsidian"
      aria-label="Öne çıkan içerikler"
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        speed={1400}
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="absolute inset-0 h-full w-full"
        allowTouchMove
      >
        {sliders.map((slide) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full">
            <img
              src={slide.image}
              alt=""
              aria-hidden
              className="img-cover"
              loading="eager"
              fetchPriority="high"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Cinematic overlay stack */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        {/* Deep bottom gradient — primary text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
        {/* Left gradient — content panel breathing room */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
      </div>

      {/* Slide Content */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-end">
        <div className="w-full px-6 pb-24 lg:px-12 lg:pb-32 xl:pb-36">
          <div className="mx-auto max-w-[1440px]">
            <div className="max-w-xl lg:max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Eyebrow */}
                  {activeSlider.eyebrow && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                      className="mb-5 flex items-center gap-3"
                    >
                      <span className="h-px w-8 bg-champagne" />
                      <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
                        {activeSlider.eyebrow}
                      </span>
                    </motion.div>
                  )}

                  {/* Title */}
                  {activeSlider.title && (
                    <motion.h1
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                      className="mb-5 font-display text-5xl font-light leading-[1.0] tracking-[-0.01em] text-white sm:text-6xl lg:text-7xl xl:text-8xl"
                    >
                      {activeSlider.title}
                    </motion.h1>
                  )}

                  {/* Subtitle */}
                  {activeSlider.subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                      className="mb-9 max-w-md font-sans text-[15px] font-light leading-[1.75] text-white/65"
                    >
                      {activeSlider.subtitle}
                    </motion.p>
                  )}

                  {/* CTA */}
                  {activeSlider.cta_label && activeSlider.cta_url && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                      className="pointer-events-auto"
                    >
                      <Link
                        to={activeSlider.cta_url}
                        data-analytics-event="SLIDER_CLICK"
                        onClick={() => void trackAnalytics({ entityType: 'SLIDER', eventType: 'SLIDER_CLICK', entityId: activeSlider.analytics_id, path: activeSlider.cta_url!, source: 'home-slider' })}
                        className="group inline-flex items-center gap-3 border border-white bg-transparent px-8 py-4 font-sans text-[13px] font-medium uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-white hover:text-carbon"
                      >
                        {activeSlider.cta_label}
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-10 px-6 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          {/* Slide Counter */}
          <div className="flex items-center gap-2.5 font-sans text-xs tabular-nums text-white/40">
            <span className="text-white/80">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="h-px w-8 bg-white/20" />
            <span>{String(sliders.length).padStart(2, '0')}</span>
          </div>

          {/* Progress Lines */}
          <div className="flex items-center gap-2">
            {sliders.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                aria-label={`Slide ${i + 1}`}
                className="group flex h-5 items-center"
              >
                <span
                  className={cn(
                    'block h-[2px] transition-all duration-500',
                    i === activeIndex
                      ? 'w-10 bg-white'
                      : 'w-5 bg-white/30 group-hover:bg-white/60',
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
