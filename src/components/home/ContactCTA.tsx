import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import { useMallContent } from '@/hooks/useCmsContent'

export function ContactCTA() {
  const mall = useMallContent()
  return (
    <section
      className="relative overflow-hidden bg-carbon py-24 lg:py-32"
      aria-labelledby="contact-heading"
    >
      {/* Subtle radial light — top right */}
      <div
        className="pointer-events-none absolute -right-64 -top-64 h-[600px] w-[600px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #b8965a 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left — Headline + Stats */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="mb-4 flex items-center gap-3"
            >
              <span className="h-px w-8 bg-champagne" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-champagne">
                Bize Ulaşın
              </span>
            </motion.div>

            <motion.h2
              id="contact-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="mb-6 font-display text-4xl font-light leading-[1.05] text-silver lg:text-5xl xl:text-6xl"
            >
              İstanbul'un Kalbinde{' '}
              <br className="hidden lg:block" />
              <span className="text-champagne">Sizi Bekliyoruz</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12 max-w-sm font-sans text-[15px] font-light leading-[1.8] text-white/45"
            >
              {mall.tagline}
            </motion.p>

            {/* Stats */}
            {mall.stats && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-3 gap-0 border-t border-white/[0.08] pt-10"
              >
                {[
                  { value: `${mall.stats.store_count}+`, label: 'Mağaza' },
                  { value: `${mall.stats.floor_count}`, label: 'Kat' },
                  { value: mall.stats.parking_capacity.toLocaleString('tr-TR'), label: 'Araçlık Park' },
                ].map(({ value, label }, i) => (
                  <div key={label} className={i > 0 ? 'border-l border-white/[0.08] pl-8' : 'pr-8'}>
                    <p className="font-display text-4xl font-light text-silver lg:text-5xl">
                      {value}
                    </p>
                    <p className="mt-2 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
                      {label}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right — Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <div className="border border-white/[0.08] bg-white/[0.04] p-8 backdrop-blur-sm lg:p-10">
              {/* Mall Name */}
              <div className="mb-8 border-b border-white/[0.08] pb-6">
                <h3 className="font-display text-2xl font-light text-silver">
                  {mall.name}
                </h3>
                <p className="mt-1 font-sans text-[12px] text-white/30">
                  İstanbul — Kartal
                </p>
              </div>

              {/* Info Items */}
              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="mt-px flex h-8 w-8 shrink-0 items-center justify-center border border-white/[0.1]">
                    <MapPin size={14} className="text-champagne" />
                  </div>
                  <div>
                    <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                      Adres
                    </p>
                    <p className="font-sans text-[13px] font-light leading-[1.65] text-white/70">
                      {mall.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="mt-px flex h-8 w-8 shrink-0 items-center justify-center border border-white/[0.1]">
                    <Clock size={14} className="text-champagne" />
                  </div>
                  <div>
                    <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                      Çalışma Saatleri
                    </p>
                    <p className="font-sans text-[13px] font-light text-white/70">
                      {mall.working_hours?.schedule}
                    </p>
                    {mall.working_hours?.exceptions && (
                      <p className="mt-1 font-sans text-[11px] leading-relaxed text-white/30">
                        {mall.working_hours.exceptions}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="mt-px flex h-8 w-8 shrink-0 items-center justify-center border border-white/[0.1]">
                    <Phone size={14} className="text-champagne" />
                  </div>
                  <div>
                    <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                      Telefon
                    </p>
                    <a
                      href={`tel:${mall.phone.replace(/\s/g, '')}`}
                      className="font-sans text-[13px] font-light text-white/70 transition-colors duration-200 hover:text-champagne"
                    >
                      {mall.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              {mall.google_maps_url && (
                <a
                  href={mall.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 flex w-full items-center justify-center gap-3 bg-champagne py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-champagne-80"
                >
                  Yol Tarifi Al
                  <ExternalLink
                    size={13}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
