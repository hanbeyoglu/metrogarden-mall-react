import { MapPin, Phone, Mail, Globe, ExternalLink, ConciergeBell, Clock } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { MallService } from '@/types'

interface ServiceCardProps {
  service: MallService
  index?: number
}

function locationLine(service: MallService): string | undefined {
  const parts = [service.location_label, service.floor, service.unit_no].filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : undefined
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const { t } = useTranslation()
  const location = locationLine(service)
  const workingHours = service.working_hours
  const hasWorkingHours = Boolean(workingHours?.schedule || workingHours?.days?.length)
  const hasContact = Boolean(service.phone || service.email || service.website || service.map_url)
  const imageSrc = service.cover_image || service.icon
  const imageAlt = service.cover_image
    ? (service.cover_alt || service.name)
    : service.icon
      ? (service.icon_alt || service.name)
      : undefined

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.05, 0.3) }}
      className="flex h-full flex-col border border-mist bg-white"
      aria-labelledby={`service-${service.id}-title`}
    >
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-fog">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt ?? ''}
            className={service.cover_image ? 'img-cover' : 'max-h-[48%] max-w-[48%] object-contain'}
            loading="lazy"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center border border-champagne/30 text-champagne" aria-hidden>
            <ConciergeBell size={22} strokeWidth={1.4} />
          </div>
        )}

        {service.is_soon && (
          <span className="absolute right-3 top-3 bg-carbon px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-white/85">
            {t('status.comingSoon')}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {service.category && (
          <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-champagne">
            {service.category}
          </p>
        )}

        <h3
          id={`service-${service.id}-title`}
          className="mb-3 font-display text-2xl font-light leading-snug text-carbon"
        >
          {service.name}
        </h3>

        {service.description && (
          <p className="mb-5 font-sans text-[14px] leading-[1.75] text-graphite">
            {service.description}
          </p>
        )}

        {location && (
          <div className="mb-4 flex items-start gap-2.5 text-graphite">
            <MapPin size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-champagne" aria-hidden />
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ash">
                {t('common.location')}
              </p>
              <p className="mt-1 font-sans text-[13px] leading-relaxed text-carbon">{location}</p>
            </div>
          </div>
        )}

        {hasWorkingHours && workingHours && (
          <div className="mb-4 flex items-start gap-2.5 text-graphite">
            <Clock size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-champagne" aria-hidden />
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ash">
                {t('common.workingHours')}
              </p>
              {workingHours.schedule && (
                <p className="mt-1 whitespace-pre-line font-sans text-[13px] leading-relaxed text-carbon">
                  {workingHours.schedule}
                </p>
              )}
              {workingHours.days && (
                <ul className="mt-1 space-y-1 font-sans text-[13px] leading-relaxed text-carbon">
                  {workingHours.days.map(({ day, open, from, to }) => (
                    <li key={day} className="flex justify-between gap-4">
                      <span>{t(`pages.services.weekdays.${day}`)}</span>
                      <span className="text-right">{open ? [from, to].filter(Boolean).join(' – ') : t('pages.services.closed')}</span>
                    </li>
                  ))}
                </ul>
              )}
              {workingHours.exceptions && (
                <p className="mt-1 font-sans text-[11px] leading-relaxed text-ash">
                  {workingHours.exceptions}
                </p>
              )}
            </div>
          </div>
        )}

        {hasContact && (
          <ul className="mt-auto space-y-2.5 border-t border-mist pt-4">
            {service.phone && (
              <li>
                <a
                  href={`tel:${service.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 font-sans text-[13px] text-graphite transition-colors hover:text-carbon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                >
                  <Phone size={14} strokeWidth={1.5} aria-hidden />
                  <span>
                    <span className="sr-only">{t('common.phone')}: </span>
                    {service.phone}
                  </span>
                </a>
              </li>
            )}
            {service.email && (
              <li>
                <a
                  href={`mailto:${service.email}`}
                  className="inline-flex items-center gap-2 font-sans text-[13px] text-graphite transition-colors hover:text-carbon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                >
                  <Mail size={14} strokeWidth={1.5} aria-hidden />
                  <span>
                    <span className="sr-only">{t('common.email')}: </span>
                    {service.email}
                  </span>
                </a>
              </li>
            )}
            {service.website && (
              <li>
                <a
                  href={service.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans text-[13px] text-graphite transition-colors hover:text-carbon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                >
                  <Globe size={14} strokeWidth={1.5} aria-hidden />
                  <span>{t('common.website')}</span>
                  <ExternalLink size={12} strokeWidth={1.5} aria-hidden />
                </a>
              </li>
            )}
            {service.map_url && (
              <li>
                <a
                  href={service.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans text-[13px] text-graphite transition-colors hover:text-carbon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                >
                  <MapPin size={14} strokeWidth={1.5} aria-hidden />
                  <span>{t('common.openInMaps')}</span>
                  <ExternalLink size={12} strokeWidth={1.5} aria-hidden />
                </a>
              </li>
            )}
          </ul>
        )}
      </div>
    </motion.article>
  )
}
