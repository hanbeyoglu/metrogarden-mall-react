import { Link } from 'react-router'
import { Clock, ArrowRight, AlertTriangle } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { Campaign } from '@/types'
import { ROUTES } from '@/lib/constants'
import { formatDateRange } from '@/lib/format'
import { cn } from '@/lib/cn'
import { RichTextContent } from '@/components/shared/RichTextContent'
import { trackAnalytics } from '@/lib/analytics'

interface CampaignCardProps {
  campaign: Campaign
  index?: number
}

const STATUS_BADGE = {
  'ending-soon': {
    label: 'status.lastDays',
    className: 'bg-[#d97706] text-white',
    icon: <AlertTriangle size={10} className="shrink-0" />,
  },
  expired: {
    label: 'status.expiredBadge',
    className: 'bg-[#4a4a4a] text-white/70',
    icon: null,
  },
} as const

export function CampaignCard({ campaign, index = 0 }: CampaignCardProps) {
  const { t, i18n } = useTranslation()
  const locale = (i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en-US' : 'tr-TR'
  const isExpired = campaign.status === 'expired'
  const isEndingSoon = campaign.status === 'ending-soon'
  const statusBadge = isExpired
    ? STATUS_BADGE.expired
    : isEndingSoon
      ? STATUS_BADGE['ending-soon']
      : null

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.08, 0.32) }}
      className={cn(isExpired && 'opacity-55')}
    >
      <Link
        to={ROUTES.CAMPAIGN_DETAIL(campaign.slug)}
        data-analytics-event="CAMPAIGN_CLICK"
        onClick={() => void trackAnalytics({ entityType: 'CAMPAIGN', eventType: 'CAMPAIGN_CLICK', entityId: campaign.analytics_id, path: ROUTES.CAMPAIGN_DETAIL(campaign.slug), source: 'campaign-list' })}
        className={cn(
          'group block overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-500',
          !isExpired && 'hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]',
        )}
        aria-label={campaign.title}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
          <img
            src={campaign.image}
            alt={campaign.title}
            className={cn(
              'img-cover transition-transform duration-700',
              !isExpired && 'group-hover:scale-[1.04]',
              isExpired && 'grayscale',
            )}
          />
          {/* Gradient for badge legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

          {/* Discount badge */}
          {campaign.discount_label && (
            <div className="absolute left-0 top-5">
              <span className={cn(
                'inline-flex items-center bg-champagne py-1.5 pl-5 pr-4 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-white shadow-lg',
                isExpired && 'grayscale opacity-60',
              )}>
                {campaign.discount_label}
              </span>
            </div>
          )}

          {/* Status badge */}
          {statusBadge && (
            <div className="absolute right-0 top-5">
              <span className={cn(
                'inline-flex items-center gap-1.5 py-1.5 pl-3 pr-4 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] shadow-lg',
                statusBadge.className,
              )}>
                {statusBadge.icon}
                {t(statusBadge.label)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Store name */}
          <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">
            {campaign.store?.name ?? t('pages.campaigns.mallCampaign')}
          </p>

          {/* Title */}
          <h3 className={cn(
            'mb-3 font-display text-2xl font-light leading-tight text-carbon transition-colors duration-300',
            !isExpired && 'group-hover:text-champagne',
          )}>
            {campaign.title}
          </h3>

          {/* Short description */}
          {campaign.short_description && (
            <RichTextContent
              content={campaign.short_description}
              className="mb-4 line-clamp-2 font-sans text-[13px] leading-[1.7] text-graphite"
            />
          )}

          {/* Validity + CTA row */}
          <div className="flex items-center justify-between gap-2">
            {campaign.end_date ? (
              <div className="flex items-center gap-1.5 font-sans text-[11px] text-ash">
                <Clock size={11} className="shrink-0" />
                <span>
                  {isExpired
                    ? t('status.expired')
                    : t('pages.campaigns.dateRange', { range: formatDateRange(campaign.start_date, campaign.end_date, locale) })}
                </span>
              </div>
            ) : <span />}

            <span className={cn(
              'flex shrink-0 items-center gap-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-300',
              isExpired ? 'text-ash' : 'text-champagne group-hover:text-carbon',
            )}>
              {t('common.viewDetails')}
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>

        {/* Bottom accent */}
        {!isExpired && (
          <div className="h-[2px] w-0 bg-champagne transition-all duration-500 group-hover:w-full" />
        )}
      </Link>
    </motion.article>
  )
}
