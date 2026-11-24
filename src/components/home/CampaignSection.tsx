import { Link } from 'react-router'
import { ArrowRight, Clock } from 'lucide-react'
import { motion } from 'motion/react'
import { useCampaignContent } from '@/hooks/useCmsContent'
import { ROUTES } from '@/lib/constants'
import { trackAnalytics } from '@/lib/analytics'

function formatEndDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
  })
}

export function CampaignSection() {
  const { featuredCampaigns: campaigns } = useCampaignContent()
  return (
    <section className="bg-fog py-24 lg:py-32" aria-labelledby="campaigns-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-14 flex items-end justify-between">
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
                Fırsatlar
              </span>
            </motion.div>
            <motion.h2
              id="campaigns-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl font-light leading-[1.05] text-carbon lg:text-5xl"
            >
              Kampanyalar
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
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

        {/* Campaign Grid */}
        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {campaigns.map((campaign, i) => (
            <motion.article
              key={campaign.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
            >
              <Link
                to={ROUTES.CAMPAIGN_DETAIL(campaign.slug)}
                data-analytics-event="CAMPAIGN_CLICK"
                onClick={() => void trackAnalytics({ entityType: 'CAMPAIGN', eventType: 'CAMPAIGN_CLICK', entityId: campaign.analytics_id, path: ROUTES.CAMPAIGN_DETAIL(campaign.slug), source: 'home' })}
                className="group block overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
              >
                {/* Image */}
                <div className="relative aspect-card overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="img-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {/* Soft top gradient for badge legibility */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

                  {/* Discount Badge */}
                  {campaign.discount_label && (
                    <div className="absolute left-0 top-5">
                      <span className="inline-flex items-center bg-champagne pl-5 pr-4 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-white shadow-lg">
                        {campaign.discount_label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Store */}
                  {campaign.store && (
                    <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">
                      {campaign.store.name}
                    </p>
                  )}

                  {/* Title */}
                  <h3 className="mb-4 font-display text-2xl font-light leading-tight text-carbon transition-colors duration-300 group-hover:text-champagne">
                    {campaign.title}
                  </h3>

                  {/* End Date */}
                  {campaign.end_date && (
                    <div className="flex items-center gap-2 font-sans text-xs text-ash">
                      <Clock size={12} className="shrink-0" />
                      <span>{formatEndDate(campaign.end_date)} tarihine kadar</span>
                    </div>
                  )}
                </div>

                {/* Bottom accent line */}
                <div className="h-[2px] w-0 bg-champagne transition-all duration-500 group-hover:w-full" />
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 flex justify-center md:hidden"
        >
          <Link
            to={ROUTES.CAMPAIGNS}
            className="group inline-flex items-center gap-2.5 border border-carbon px-7 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-carbon transition-all duration-300 hover:bg-carbon hover:text-ivory"
          >
            Tüm Kampanyalar
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
