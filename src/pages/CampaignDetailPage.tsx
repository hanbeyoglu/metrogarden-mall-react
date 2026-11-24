import { useNavigate, useParams, Link } from 'react-router'
import { useEffect, useState } from 'react'
import {
  Clock, ArrowRight, ChevronRight, ArrowLeft, AlertTriangle, ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useMeta } from '@/hooks'
import { useCampaignContent, useCampaignDetailContent } from '@/hooks/useCmsContent'
import { ROUTES, STORE_CATEGORIES } from '@/lib/constants'
import { formatDateRange, formatDateFull } from '@/lib/format'
import { cn } from '@/lib/cn'
import { RelatedCampaigns } from '@/components/campaigns/RelatedCampaigns'
import { RichTextContent } from '@/components/shared/RichTextContent'
import { useAnalyticsView } from '@/hooks/useAnalyticsView'

const STATUS_CONFIG = {
  'ending-soon': {
    label: 'pages.campaigns.endingSoonStatus',
    className: 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]',
    icon: <AlertTriangle size={13} className="shrink-0" />,
  },
  expired: {
    label: 'pages.campaigns.expiredStatus',
    className: 'bg-[#f3f4f6] text-[#6b7280] border border-[#e5e7eb]',
    icon: <Clock size={13} className="shrink-0" />,
  },
  active: null,
  upcoming: null,
} as const

export function CampaignDetailPage() {
  const { t, i18n } = useTranslation()
  const locale = (i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en-US' : 'tr-TR'
  const { slug } = useParams<{ slug: string }>()
  const { campaigns: allCampaigns } = useCampaignContent()
  const campaignDetail = useCampaignDetailContent(slug)
  const navigate = useNavigate()
  const [termsOpen, setTermsOpen] = useState(false)

  const campaign = campaignDetail.data ?? allCampaigns.find((c) => c.slug === slug)
  useAnalyticsView({ entityType: 'CAMPAIGN', eventType: 'CAMPAIGN_VIEW', entityId: campaign?.analytics_id, source: 'campaign-detail' })

  useMeta({
    title: campaign?.title,
    description: campaign?.short_description ?? campaign?.description?.slice(0, 160),
    ogImage: campaign?.hero_image ?? campaign?.image,
  })

  useEffect(() => {
    if (!campaign && !campaignDetail.isLoading) navigate(ROUTES.CAMPAIGNS, { replace: true })
  }, [campaign, campaignDetail.isLoading, navigate])

  if (!campaign) return null

  const isExpired = campaign.status === 'expired'
  const heroImage = campaign.hero_image ?? campaign.image

  /* Related: same category OR same store, exclude self, max 3 */
  const related = allCampaigns
    .filter(
      (c) =>
        c.id !== campaign.id &&
        (c.category === campaign.category || c.store?.slug === campaign.store?.slug),
    )
    .slice(0, 3)

  const statusConfig = STATUS_CONFIG[campaign.status]

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className={cn('relative min-h-[52vh] overflow-hidden bg-obsidian', isExpired && 'opacity-80')}
        aria-label={campaign.title}
      >
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={campaign.title}
            className={cn('img-cover', isExpired && 'grayscale')}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute left-0 right-0 top-0 z-10 px-6 pt-[90px] lg:px-12 lg:pt-[100px]">
          <div className="mx-auto max-w-[1440px]">
            <nav className="flex items-center gap-1.5 font-sans text-[11px] text-white/40" aria-label={t('common.breadcrumb')}>
              <Link to={ROUTES.HOME} className="transition-colors hover:text-white/70">{t('pages.notFound.links.home')}</Link>
              <ChevronRight size={11} className="text-white/25" />
              <Link to={ROUTES.CAMPAIGNS} className="transition-colors hover:text-white/70">{t('pages.campaigns.detail.breadcrumb')}</Link>
              <ChevronRight size={11} className="text-white/25" />
              <span className="line-clamp-1 text-white/65">{campaign.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 lg:px-12 lg:pb-14">
          <div className="mx-auto max-w-[1440px]">
            {/* Discount badge */}
            {campaign.discount_label && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <span className={cn(
                  'inline-block bg-champagne px-5 py-2 font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-white',
                  isExpired && 'grayscale opacity-60',
                )}>
                  {campaign.discount_label}
                </span>
              </motion.div>
            )}

            {/* Store */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-2 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-champagne/90"
            >
                {campaign.store?.name ?? t('pages.campaigns.mallCampaign')}
                {campaign.category && (
                  <span className="ml-3 font-normal tracking-[0.06em] text-white/40">
                    · {STORE_CATEGORIES[campaign.category]}
                  </span>
                )}
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="font-display text-4xl font-light text-white lg:text-5xl xl:text-6xl"
            >
              {campaign.title}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────── */}
      <section className="bg-ivory py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">

            {/* Left — Description */}
            <div className="lg:col-span-2">
              <Link
                to={ROUTES.CAMPAIGNS}
                className="group mb-8 inline-flex items-center gap-2 font-sans text-[13px] text-graphite transition-colors hover:text-carbon"
              >
                <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
                {t('common.backToCampaigns')}
              </Link>

              {/* Status banner */}
              {statusConfig && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={cn('mb-8 flex items-center gap-2.5 px-4 py-3 font-sans text-[13px] font-medium', statusConfig.className)}
                >
                  {statusConfig.icon}
                {t(statusConfig.label)}
                </motion.div>
              )}

              {/* Section heading */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-champagne" />
                  <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-champagne">
                    {t('pages.campaigns.detail.eyebrow')}
                  </span>
                </div>
                <h2 className="mb-6 font-display text-2xl font-light text-carbon lg:text-3xl">
                  {t('common.description')}
                </h2>

                {campaign.description && (
                  <RichTextContent content={campaign.description} className="font-sans text-[15px] leading-[1.85] text-graphite" />
                )}
              </motion.div>

              {/* Terms & Conditions accordion */}
              {campaign.terms && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="mt-10 border-t border-mist/60"
                >
                  <button
                    onClick={() => setTermsOpen((o) => !o)}
                    className="flex w-full items-center justify-between py-5 text-left"
                    aria-expanded={termsOpen}
                  >
                    <span className="font-sans text-[14px] font-medium text-carbon">
                      {t('pages.campaigns.terms')}
                    </span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        'text-graphite transition-transform duration-300',
                        termsOpen && 'rotate-180',
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {termsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <RichTextContent content={campaign.terms} className="pb-6 font-sans text-[13px] leading-[1.8] text-graphite" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
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
                  {t('pages.campaigns.detail.infoTitle')}
                </h3>

                <div className="space-y-5">
                  {/* Discount */}
                  {campaign.discount_label && (
                    <div>
                      <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-ash">
                        {t('pages.campaigns.detail.discount')}
                      </p>
                      <p className="font-sans text-[15px] font-semibold text-champagne">
                        {campaign.discount_label}
                      </p>
                    </div>
                  )}

                  {/* Status */}
                  <div>
                    <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-ash">
                      {t('common.status')}
                    </p>
                    <span className={cn(
                      'font-sans text-[13px] font-medium',
                      campaign.status === 'active' && 'text-[#2d6a4f]',
                      campaign.status === 'ending-soon' && 'text-[#d97706]',
                      campaign.status === 'expired' && 'text-graphite',
                    )}>
                      {campaign.status === 'active' && `● ${t('status.active')}`}
                      {campaign.status === 'ending-soon' && `● ${t('pages.campaigns.endingSoonStatus')}`}
                      {campaign.status === 'expired' && `○ ${t('status.expired')}`}
                      {campaign.status === 'upcoming' && `◌ ${t('status.upcoming')}`}
                    </span>
                  </div>

                  {/* Validity */}
                  {(campaign.start_date || campaign.end_date) && (
                    <div>
                      <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-ash">
                        {t('common.validity')}
                      </p>
                      <p className="font-sans text-[13px] font-light text-carbon">
                        {campaign.end_date
                          ? formatDateRange(campaign.start_date, campaign.end_date, locale)
                          : formatDateFull(campaign.start_date, locale)}
                      </p>
                      {campaign.end_date && !isExpired && (
                        <p className="mt-0.5 font-sans text-[11px] text-ash">
                          {t('common.lastDay')}: {formatDateFull(campaign.end_date, locale)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Store info */}
                  <div>
                    <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-ash">
                      {t('pages.campaigns.campaignScope')}
                    </p>
                    <p className="font-sans text-[13px] font-light text-carbon">
                      {campaign.store?.name ?? t('pages.campaigns.mallCampaign')}
                    </p>
                    {campaign.store && campaign.category && (
                      <p className="mt-0.5 font-sans text-[11px] text-ash">
                        {STORE_CATEGORIES[campaign.category]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Store CTA */}
                {campaign.store && (
                  <Link
                    to={ROUTES.STORE_DETAIL(campaign.store.slug)}
                    className="group mt-7 flex w-full items-center justify-center gap-2.5 bg-carbon py-3.5 font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-ivory transition-all duration-300 hover:bg-champagne"
                  >
                    {t('pages.campaigns.detail.viewStore')}
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Related Campaigns ────────────────────────────────── */}
      <RelatedCampaigns campaigns={related} />
    </>
  )
}
