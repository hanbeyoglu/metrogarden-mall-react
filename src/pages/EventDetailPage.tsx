import { useNavigate, useParams, Link } from 'react-router'
import { useEffect, useState } from 'react'
import {
  MapPin, Clock, Ticket, ExternalLink, ChevronRight, ArrowLeft,
  Share2, Twitter, Facebook, Link as LinkIcon, Check,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useMeta } from '@/hooks'
import { useEventContent, useEventDetailContent } from '@/hooks/useCmsContent'
import { ROUTES, EVENT_CATEGORIES } from '@/lib/constants'
import { formatDateFull, formatDateRange } from '@/lib/format'
import { cn } from '@/lib/cn'
import { StoreGallery } from '@/components/stores/StoreGallery'
import { RelatedEvents } from '@/components/events/RelatedEvents'
import { Autoplay, EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-fade'

export function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { events: allEvents } = useEventContent()
  const eventDetail = useEventDetailContent(slug)
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const event = eventDetail.data ?? allEvents.find((e) => e.slug === slug)

  useMeta({
    title: event?.title,
    description: event?.short_description ?? event?.description?.slice(0, 160),
    ogImage: event?.hero_image ?? event?.image,
  })

  useEffect(() => {
    if (!event && !eventDetail.isLoading) navigate(ROUTES.EVENTS, { replace: true })
  }, [event, eventDetail.isLoading, navigate])

  if (!event) return null

  const isPast = (() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const end = event.end_date ? new Date(event.end_date) : new Date(event.date)
    return end < today
  })()

  const gallery = event.gallery ?? []
  const heroImages = [...new Set([event.hero_image, ...gallery, event.image].filter((image): image is string => Boolean(image)))]
  const categoryLabel = event.category ? (EVENT_CATEGORIES[event.category] ?? '') : ''

  /* Related: same category, exclude self, max 3 */
  const related = allEvents
    .filter((e) => e.id !== event.id && e.category === event.category)
    .slice(0, 3)

  /* Date display */
  const dateDisplay = event.end_date
    ? formatDateRange(event.date, event.end_date)
    : formatDateFull(event.date)

  /* Share handlers */
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `${event.title} — Metrogarden AVM`

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className={cn('relative min-h-[52vh] overflow-hidden bg-obsidian', isPast && 'opacity-80')}
        aria-label={event.title}
      >
        <div className="absolute inset-0">
          {heroImages.length > 1 ? (
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop
              className="h-full w-full"
              aria-label={`${event.title} görselleri`}
            >
              {heroImages.map((image, index) => (
                <SwiperSlide key={`${image}-${index}`}>
                  <img
                    src={image}
                    alt={`${event.title} — ${index + 1}`}
                    className={cn('img-cover', isPast && 'grayscale')}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : heroImages[0] ? (
            <img
              src={heroImages[0]}
              alt={event.title}
              className={cn('img-cover', isPast && 'grayscale')}
              loading="eager"
              fetchPriority="high"
            />
          ) : null}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute left-0 right-0 top-0 z-10 px-6 pt-[90px] lg:px-12 lg:pt-[100px]">
          <div className="mx-auto max-w-[1440px]">
            <nav className="flex items-center gap-1.5 font-sans text-[11px] text-white/40" aria-label="Sayfa konumu">
              <Link to={ROUTES.HOME} className="transition-colors hover:text-white/70">Ana Sayfa</Link>
              <ChevronRight size={11} className="text-white/25" />
              <Link to={ROUTES.EVENTS} className="transition-colors hover:text-white/70">Etkinlikler</Link>
              <ChevronRight size={11} className="text-white/25" />
              <span className="line-clamp-1 text-white/65">{event.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero content — bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 lg:px-12 lg:pb-14">
          <div className="mx-auto max-w-[1440px]">
            {/* Status / date badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-3 flex flex-wrap items-center gap-3"
            >
              {isPast ? (
                <span className="bg-[#4a4a4a] px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-white/60">
                  Geçmiş Etkinlik
                </span>
              ) : event.is_free !== undefined ? (
                <span className={cn(
                  'px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-white',
                  event.is_free ? 'bg-[#2d6a4f]' : 'bg-champagne',
                )}>
                  {event.is_free ? 'Ücretsiz' : 'Ücretli'}
                </span>
              ) : null}
              {categoryLabel && (
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne/90">
                  {categoryLabel}
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="max-w-3xl font-display text-4xl font-light text-white lg:text-5xl xl:text-6xl"
            >
              {event.title}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────── */}
      <section className="bg-ivory py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">

            {/* Left col — Description + Gallery */}
            <div className="lg:col-span-2">
              <Link
                to={ROUTES.EVENTS}
                className="group mb-8 inline-flex items-center gap-2 font-sans text-[13px] text-graphite transition-colors hover:text-carbon"
              >
                <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
                Tüm Etkinlikler
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-champagne" />
                  <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-champagne">
                    Etkinlik Hakkında
                  </span>
                </div>
                <h2 className="mb-6 font-display text-2xl font-light text-carbon lg:text-3xl">
                  {event.title}
                </h2>
                {event.description && (
                  <p className="font-sans text-[15px] leading-[1.85] text-graphite">
                    {event.description}
                  </p>
                )}
              </motion.div>

              {/* Gallery */}
              {gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-12"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-px w-8 bg-champagne" />
                    <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-champagne">
                      Galeri
                    </span>
                  </div>
                  <StoreGallery images={gallery} storeName={event.title} />
                </motion.div>
              )}
            </div>

            {/* Right col — Sidebar */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="sticky top-[92px]">
                <div className="border border-mist/60 bg-white p-6 lg:p-7">
                  <h3 className="mb-6 border-b border-mist/60 pb-5 font-display text-xl font-light text-carbon">
                    Etkinlik Özeti
                  </h3>

                  <div className="space-y-5">
                    {/* Date */}
                    <SidebarRow icon={<Clock size={14} />} label="Tarih">
                      {dateDisplay}
                    </SidebarRow>

                    {/* Time */}
                    {event.time && (
                      <SidebarRow icon={<Clock size={14} />} label="Saat">
                        {event.time}{event.end_time ? ` – ${event.end_time}` : ''}
                      </SidebarRow>
                    )}

                    {/* Location */}
                    {event.location && (
                      <SidebarRow icon={<MapPin size={14} />} label="Yer">
                        {event.location} — Metrogarden AVM
                      </SidebarRow>
                    )}

                    {/* Organizer */}
                    {event.organizer && (
                      <SidebarRow icon={<Share2 size={14} />} label="Organizatör">
                        {event.organizer}
                      </SidebarRow>
                    )}

                    {/* Ticket status */}
                    {(event.is_free !== undefined || event.ticket_price) && (
                      <SidebarRow icon={<Ticket size={14} />} label="Bilet">
                        {event.is_free ? (
                          <span className="inline-flex items-center gap-1.5 text-[#2d6a4f]">
                            <span className="h-2 w-2 rounded-full bg-[#2d6a4f]" />
                            Ücretsiz
                          </span>
                        ) : (
                          <span>{event.ticket_price ?? 'Ücretli'}</span>
                        )}
                      </SidebarRow>
                    )}
                  </div>

                  {/* Ticket button */}
                  {event.ticket_url && !isPast && (
                    <a
                      href={event.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-6 flex w-full items-center justify-center gap-2.5 bg-champagne py-3.5 font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-champagne-80"
                    >
                      <Ticket size={13} />
                      Bilet Al
                      <ExternalLink size={11} className="opacity-60" />
                    </a>
                  )}

                  {/* Google Maps button */}
                  {event.location && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${event.location} Metrogarden AVM Kartal İstanbul`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-3 flex w-full items-center justify-center gap-2.5 border border-mist bg-white py-3 font-sans text-[12px] font-medium text-graphite transition-all duration-300 hover:border-carbon hover:text-carbon"
                    >
                      <MapPin size={13} />
                      Google Maps\'te Aç
                    </a>
                  )}

                  {/* Share buttons */}
                  <div className="mt-6 border-t border-mist/60 pt-5">
                    <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ash">
                      Paylaş
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter\'da paylaş"
                        className="flex h-8 w-8 items-center justify-center border border-mist text-graphite transition-all hover:border-champagne/50 hover:text-champagne"
                      >
                        <Twitter size={13} />
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook\'ta paylaş"
                        className="flex h-8 w-8 items-center justify-center border border-mist text-graphite transition-all hover:border-champagne/50 hover:text-champagne"
                      >
                        <Facebook size={13} />
                      </a>
                      <button
                        onClick={handleCopyLink}
                        aria-label="Bağlantıyı kopyala"
                        className={cn(
                          'flex h-8 w-8 items-center justify-center border transition-all',
                          copied
                            ? 'border-[#2d6a4f] text-[#2d6a4f]'
                            : 'border-mist text-graphite hover:border-champagne/50 hover:text-champagne',
                        )}
                      >
                        {copied ? <Check size={13} /> : <LinkIcon size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ── Related Events ───────────────────────────────────── */}
      <RelatedEvents events={related} />
    </>
  )
}

/* ── Helper sub-component ────────────────────────────────── */
function SidebarRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="mt-px flex h-7 w-7 shrink-0 items-center justify-center border border-mist text-champagne">
        {icon}
      </div>
      <div>
        <p className="mb-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-ash">
          {label}
        </p>
        <div className="font-sans text-[13px] font-light leading-relaxed text-carbon">
          {children}
        </div>
      </div>
    </div>
  )
}
