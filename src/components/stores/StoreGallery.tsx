import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'

interface StoreGalleryProps {
  images: string[]
  storeName: string
}

export function StoreGallery({ images, storeName }: StoreGalleryProps) {
  const { t } = useTranslation()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : null))
  }, [])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? Math.min(images.length - 1, i + 1) : null))
  }, [images.length])

  /* Keyboard navigation */
  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, closeLightbox, prev, next])

  /* Body scroll lock */
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  if (images.length === 0) return null

  const gridCols =
    images.length === 1 ? 'grid-cols-1' :
    images.length === 2 ? 'grid-cols-2' :
    images.length === 3 ? 'grid-cols-3' :
    'grid-cols-2 sm:grid-cols-4'

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid gap-3 ${gridCols}`}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i)}
            className="group relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
            aria-label={t('pages.stores.galleryImage', { name: storeName, number: i + 1 })}
            style={{ aspectRatio: images.length <= 2 ? '16/10' : '1/1' }}
          >
            <img
              src={src}
              alt={`${storeName} — ${i + 1}`}
              className="img-cover transition-transform duration-600 group-hover:scale-[1.06]"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
              <ZoomIn
                size={22}
                className="scale-75 text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Portal */}
      {lightboxIndex !== null &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95"
              onClick={closeLightbox}
              role="dialog"
              aria-modal
              aria-label={t('common.openImage')}
            >
              {/* Counter */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 font-sans text-xs tabular-nums text-white/40">
                {lightboxIndex + 1} / {images.length}
              </div>

              {/* Close */}
              <button
                onClick={closeLightbox}
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                aria-label={t('common.closeWithEscape')}
              >
                <X size={20} />
              </button>

              {/* Image */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-[88vh] max-w-[92vw] items-center justify-center"
              >
                <img
                  src={images[lightboxIndex]}
                  alt={`${storeName} — ${lightboxIndex + 1}`}
                  className="max-h-[88vh] max-w-[92vw] object-contain shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
                />
              </motion.div>

              {/* Previous */}
              {lightboxIndex > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); prev() }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center border border-white/20 bg-black/50 text-white/70 backdrop-blur-sm transition-all hover:border-white/50 hover:text-white focus-visible:outline-none"
                  aria-label={t('common.previousImage')}
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              {/* Next */}
              {lightboxIndex < images.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); next() }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center border border-white/20 bg-black/50 text-white/70 backdrop-blur-sm transition-all hover:border-white/50 hover:text-white focus-visible:outline-none"
                  aria-label={t('common.nextImage')}
                >
                  <ChevronRight size={20} />
                </button>
              )}

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                      className={`h-[3px] transition-all duration-300 ${
                        i === lightboxIndex ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/60'
                      }`}
                      aria-label={t('common.imageNumber', { number: i + 1 })}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
