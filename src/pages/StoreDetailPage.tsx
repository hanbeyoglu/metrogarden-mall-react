import { useNavigate, useParams, Link } from 'react-router'
import { useEffect, useState } from 'react'
import {
  Clock, Phone, Globe, MapPin, Instagram, Facebook, Twitter, Youtube,
  ChevronRight, ArrowLeft,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useMeta } from '@/hooks'
import { useStoreContent, useStoreDetailContent } from '@/hooks/useCmsContent'
import { ROUTES } from '@/lib/constants'
import { formatCategory, formatFloor } from '@/lib/format'
import { cn } from '@/lib/cn'
import { StoreGallery } from '@/components/stores/StoreGallery'
import { RelatedStores } from '@/components/stores/RelatedStores'
import { useAnalyticsView } from '@/hooks/useAnalyticsView'

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

export function StoreDetailPage() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const { stores: allStores } = useStoreContent()
  const storeDetail = useStoreDetailContent(slug)
  const navigate = useNavigate()
  const [logoFailed, setLogoFailed] = useState(false)

  const store = storeDetail.data ?? allStores.find((s) => s.slug === slug && s.is_active)
  useAnalyticsView({ entityType: 'STORE', eventType: 'STORE_VIEW', entityId: store?.analytics_id, source: 'store-detail' })

  useMeta({
    title: store?.name,
    description: store?.description?.slice(0, 160),
    ogImage: store?.cover_image,
  })

  /* Redirect if store not found */
  useEffect(() => {
    if (!store && !storeDetail.isLoading) navigate(ROUTES.STORES, { replace: true })
  }, [store, storeDetail.isLoading, navigate])

  useEffect(() => {
    setLogoFailed(false)
  }, [store?.logo])

  if (!store) return null

  /* Related stores: same category, exclude self, max 4 */
  const related = allStores
    .filter((s) => s.id !== store.id && s.category === store.category && s.is_active)
    .slice(0, 4)

  const initialBg = CATEGORY_INITIAL_BG[store.category] ?? 'bg-carbon'
  const badgeStyle = CATEGORY_BADGE[store.category] ?? 'bg-fog text-graphite'
  const gallery = store.images ?? []

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] overflow-hidden bg-obsidian" aria-label={store.name}>
        {/* Background */}
        <div className="absolute inset-0">
          {store.cover_image ? (
            <img
              src={store.cover_image}
              alt={store.name}
              className="img-cover"
              loading="eager"
              fetchPriority="high"
            />
          ) : (
            <div className={cn('h-full w-full', initialBg)} />
          )}
        </div>

        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute left-0 right-0 top-0 z-10 px-6 pt-[90px] lg:px-12 lg:pt-[100px]">
          <div className="mx-auto max-w-[1440px]">
            <nav className="flex items-center gap-1.5 font-sans text-[11px] text-white/40" aria-label="Sayfa konumu">
              <Link to={ROUTES.HOME} className="transition-colors hover:text-white/70">Ana Sayfa</Link>
              <ChevronRight size={11} className="text-white/25" />
              <Link to={ROUTES.STORES} className="transition-colors hover:text-white/70">Mağazalar</Link>
              <ChevronRight size={11} className="text-white/25" />
              <span className="text-white/65">{store.name}</span>
            </nav>
          </div>
        </div>

        {/* Store identity — bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 lg:px-12 lg:pb-14">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex items-end gap-6">
              {/* Brand logo, with an initial fallback when the media URL fails */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden sm:h-[80px] sm:w-[80px] lg:h-[96px] lg:w-[96px]',
                  store.logo && !logoFailed ? 'bg-white p-2.5 sm:p-3.5' : initialBg,
                )}
              >
                {store.logo && !logoFailed ? (
                  <img
                    src={store.logo}
                    alt={`${store.name} logosu`}
                    className="max-h-full max-w-full object-contain"
                    onError={() => setLogoFailed(true)}
                  />
                ) : (
                  <span className="font-display text-3xl font-light text-white/75 sm:text-4xl lg:text-5xl">
                    {store.name.charAt(0)}
                  </span>
                )}
              </motion.div>

              <div>
                {/* Category + Floor badges */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="mb-3 flex flex-wrap items-center gap-2"
                >
                  {store.category && <span className={cn('px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.1em]', badgeStyle)}>
                    {formatCategory(store.category, store.category_label)}
                  </span>}
                  {store.floor && <span className="border border-white/20 bg-black/40 px-2.5 py-1 font-sans text-[10px] font-medium tracking-wide text-white/70 backdrop-blur-sm">
                    {formatFloor(store.floor, store.floor_label)}
                  </span>}
                </motion.div>

                {/* Store name */}
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="font-display text-4xl font-light text-white lg:text-5xl xl:text-6xl"
                >
                  {store.name}
                </motion.h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────── */}
      <section className="bg-ivory py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Left — Description */}
            <div className="lg:col-span-2">
              {/* Back link */}
              <Link
                to={ROUTES.STORES}
                className="group mb-8 inline-flex items-center gap-2 font-sans text-[13px] text-graphite transition-colors hover:text-carbon"
              >
                <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
                Tüm Mağazalar
              </Link>

              {/* Description heading */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-champagne" />
                  <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-champagne">
                    Hakkında
                  </span>
                </div>
                <h2 className="mb-6 font-display text-2xl font-light text-carbon lg:text-3xl">
                  {store.name} Metrogarden'da
                </h2>
                {store.description && (
                  <p className="font-sans text-[15px] leading-[1.85] text-graphite">
                    {store.description}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Right — Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="border border-mist/60 bg-white p-6 lg:p-7">
                <h3 className="mb-6 border-b border-mist/60 pb-5 font-display text-xl font-light text-carbon">
                  Mağaza Bilgileri
                </h3>

                <div className="space-y-5">
                  {/* Working Hours */}
                  {store.working_hours && (
                    <InfoRow icon={<Clock size={14} />} label="Çalışma Saatleri">
                      {typeof store.working_hours === 'string' ? (
                        store.working_hours
                      ) : (
                        <>
                          {store.working_hours.schedule && <p>{store.working_hours.schedule}</p>}
                          {store.working_hours.days && (
                            <ul className="space-y-1">
                              {store.working_hours.days.map(({ day, open, from, to }) => (
                                <li key={day} className="flex justify-between gap-4">
                                  <span>{t(`pages.services.weekdays.${day}`)}</span>
                                  <span className="text-right">
                                    {open ? [from, to].filter(Boolean).join(' – ') : t('pages.services.closed')}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </InfoRow>
                  )}

                  {/* Floor */}
                  {store.floor && <InfoRow icon={<MapPin size={14} />} label="Konum">
                    {formatFloor(store.floor, store.floor_label)} — Metrogarden AVM
                  </InfoRow>}

                  {/* Phone */}
                  {store.phone && (
                    <InfoRow icon={<Phone size={14} />} label="Telefon">
                      <a
                        href={`tel:${store.phone.replace(/\s/g, '')}`}
                        className="transition-colors hover:text-champagne"
                      >
                        {store.phone}
                      </a>
                    </InfoRow>
                  )}

                  {/* Website */}
                  {store.website && (
                    <InfoRow icon={<Globe size={14} />} label="Web Sitesi">
                      <a
                        href={store.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all transition-colors hover:text-champagne"
                      >
                        {store.website.replace(/^https?:\/\//, '')}
                      </a>
                    </InfoRow>
                  )}
                </div>

                {/* Social Links */}
                {store.social_links && Object.values(store.social_links).some(Boolean) && (
                  <div className="mt-6 border-t border-mist/60 pt-6">
                    <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ash">
                      Sosyal Medya
                    </p>
                    <div className="flex items-center gap-2.5">
                      {store.social_links.instagram && (
                        <SocialButton href={store.social_links.instagram} label="Instagram">
                          <Instagram size={14} />
                        </SocialButton>
                      )}
                      {store.social_links.facebook && (
                        <SocialButton href={store.social_links.facebook} label="Facebook">
                          <Facebook size={14} />
                        </SocialButton>
                      )}
                      {store.social_links.twitter && (
                        <SocialButton href={store.social_links.twitter} label="Twitter/X">
                          <Twitter size={14} />
                        </SocialButton>
                      )}
                      {store.social_links.youtube && (
                        <SocialButton href={store.social_links.youtube} label="YouTube">
                          <Youtube size={14} />
                        </SocialButton>
                      )}
                    </div>
                  </div>
                )}

                {/* Direction CTA */}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${store.name} Metrogarden AVM Kartal İstanbul`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2.5 bg-champagne py-3.5 font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-champagne-80"
                >
                  <MapPin size={13} />
                  Mağazayı Bul
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────── */}
      {gallery.length > 0 && (
        <section className="bg-fog py-16 lg:py-20">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-champagne" />
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-champagne">
                  Galeri
                </span>
              </div>
              <h2 className="font-display text-2xl font-light text-carbon lg:text-3xl">
                Mağaza Görselleri
              </h2>
            </motion.div>

            <StoreGallery images={gallery} storeName={store.name} />
          </div>
        </section>
      )}

      {/* ── Related Stores ───────────────────────────────────── */}
      <RelatedStores stores={related} />
    </>
  )
}

/* ── Helper sub-components ───────────────────────────────────── */

function InfoRow({
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

function SocialButton({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center border border-mist text-graphite transition-all duration-200 hover:border-champagne/50 hover:text-champagne"
    >
      {children}
    </a>
  )
}
