import { Link } from 'react-router'
import { ArrowRight, Clock } from 'lucide-react'
import { motion } from 'motion/react'
import type { Campaign } from '@/types'
import { ROUTES } from '@/lib/constants'
import { formatDateRange } from '@/lib/format'
import { cn } from '@/lib/cn'
import { trackAnalytics } from '@/lib/analytics'

interface RelatedCampaignsProps {
  campaigns: Campaign[]
}

export function RelatedCampaigns({ campaigns }: RelatedCampaignsProps) {
  if (campaigns.length === 0) return null

  return (
    <section className="bg-fog py-20 lg:py-28" aria-labelledby="related-campaigns-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="mb-3 flex items-center gap-3"
            >
              <span className="h-px w-8 bg-champagne" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-champagne">
                İlgili Fırsatlar
              </span>
            </motion.div>
            <motion.h2
              id="related-campaigns-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl font-light text-carbon lg:text-4xl"
            >
              Benzer Kampanyalar
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to={ROUTES.CAMPAIGNS}
              className="group hidden items-center gap-2 font-sans text-[13px] font-medium text-graphite transition-all duration-300 hover:text-carbon md:flex"
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-carbon after:transition-all after:duration-300 group-hover:after:w-full">
                Tüm Kampanyalar
              </span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Grid — always 3 columns max */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {campaigns.map((campaign, i) => {
            const isExpired = campaign.status === 'expired'
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className={cn(isExpired && 'opacity-55')}
              >
                <Link
                  to={ROUTES.CAMPAIGN_DETAIL(campaign.slug)}
                  data-analytics-event="CAMPAIGN_CLICK"
                  onClick={() => void trackAnalytics({ entityType: 'CAMPAIGN', eventType: 'CAMPAIGN_CLICK', entityId: campaign.analytics_id, path: ROUTES.CAMPAIGN_DETAIL(campaign.slug), source: 'related-campaigns' })}
                  className={cn(
                    'group block overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-500',
                    !isExpired && 'hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]',
                  )}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className={cn(
                        'img-cover transition-transform duration-600',
                        !isExpired && 'group-hover:scale-[1.04]',
                        isExpired && 'grayscale',
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />

                    {campaign.discount_label && (
                      <div className="absolute left-0 top-4">
                        <span className={cn(
                          'bg-champagne py-1 pl-4 pr-3 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-white',
                          isExpired && 'grayscale opacity-60',
                        )}>
                          {campaign.discount_label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {campaign.store && (
                      <p className="mb-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-champagne">
                        {campaign.store.name}
                      </p>
                    )}
                    <h3 className={cn(
                      'mb-3 font-display text-xl font-light leading-snug text-carbon transition-colors duration-300',
                      !isExpired && 'group-hover:text-champagne',
                    )}>
                      {campaign.title}
                    </h3>
                    {campaign.end_date && (
                      <div className="flex items-center gap-1.5 font-sans text-[11px] text-ash">
                        <Clock size={11} className="shrink-0" />
                        <span>
                          {isExpired
                            ? 'Süresi doldu'
                            : `${formatDateRange(campaign.start_date, campaign.end_date)} arası`}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isExpired && (
                    <div className="h-[2px] w-0 bg-champagne transition-all duration-500 group-hover:w-full" />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
