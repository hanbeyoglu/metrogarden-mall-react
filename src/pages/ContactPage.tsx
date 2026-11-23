import { MapPin, Phone, Mail, Clock, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { useMeta } from '@/hooks'
import { ROUTES } from '@/lib/constants'
import { PageHero } from '@/components/shared/PageHero'
import { ContactForm } from '@/components/contact/ContactForm'
import { MapPlaceholder } from '@/components/contact/MapPlaceholder'
import { useMallContent } from '@/hooks/useCmsContent'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=900&fit=crop&q=85'

export function ContactPage() {
  const mall = useMallContent()
  const contactInfo = [
    { icon: MapPin, label: 'Adres', lines: [mall.address] },
    { icon: Phone, label: 'Telefon', lines: [mall.phone], href: `tel:${mall.phone.replace(/\s/g, '')}` },
    { icon: Mail, label: 'E-posta', lines: [mall.email], href: `mailto:${mall.email}` },
    { icon: Clock, label: 'Çalışma Saatleri', lines: [mall.working_hours?.schedule ?? ''] },
  ]
  useMeta({
    title: 'İletişim',
    description: 'Metrogarden AVM ile iletişime geçin. Adres, telefon, e-posta ve çalışma saatleri.',
  })

  return (
    <>
      <PageHero
        title="İletişim"
        subtitle="Sorularınız, önerileriniz veya mağaza başvurularınız için buradayız."
        image={HERO_IMAGE}
        breadcrumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'İletişim' }]}
        height="sm"
      />

      <section className="bg-ivory py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">

            {/* ── Left: Contact Form ──────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-8 bg-champagne" />
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">
                    Bize Yazın
                  </span>
                </div>
                <h2 className="mb-3 font-display text-3xl font-light text-carbon lg:text-4xl">
                  Mesaj Gönderin
                </h2>
                <p className="font-sans text-[14px] leading-relaxed text-graphite">
                  Aşağıdaki formu doldurarak bize ulaşabilirsiniz. Genellikle 1–2 iş günü içinde yanıt veriyoruz.
                </p>
              </div>

              <ContactForm />
            </motion.div>

            {/* ── Right: Info + Map ───────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-8"
            >
              {/* Contact Info */}
              <div>
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-px w-8 bg-champagne" />
                    <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">
                      AVM Bilgileri
                    </span>
                  </div>
                  <h2 className="font-display text-3xl font-light text-carbon lg:text-4xl">
                    Bizi Bulun
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="border border-mist bg-white p-5">
                      <div className="mb-3 flex h-8 w-8 items-center justify-center border border-champagne/30 text-champagne">
                        <item.icon size={14} strokeWidth={1.5} />
                      </div>
                      <p className="mb-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ash">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="group font-sans text-[13px] leading-relaxed text-carbon transition-colors hover:text-champagne"
                        >
                          {item.lines.join('\n')}
                        </a>
                      ) : (
                        item.lines.map((line, j) => (
                          <p key={j} className="font-sans text-[13px] leading-relaxed text-carbon">
                            {line}
                          </p>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <MapPlaceholder
                embedUrl={mall.google_maps_embed_url}
                mapUrl={mall.google_maps_url}
                address={mall.address}
              />

              {/* Additional info */}
              <div className="border-t border-mist pt-6">
                <p className="mb-3 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-ash">
                  Hızlı Bağlantılar
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to={ROUTES.KVKK}
                    className="group flex items-center gap-1.5 font-sans text-[12px] text-graphite transition-colors hover:text-champagne"
                  >
                    <ChevronRight size={12} />
                    KVKK Aydınlatma Metni
                  </Link>
                  <Link
                    to={ROUTES.ABOUT}
                    className="group flex items-center gap-1.5 font-sans text-[12px] text-graphite transition-colors hover:text-champagne"
                  >
                    <ChevronRight size={12} />
                    Hakkımızda
                  </Link>
                  <Link
                    to={ROUTES.STORES}
                    className="group flex items-center gap-1.5 font-sans text-[12px] text-graphite transition-colors hover:text-champagne"
                  >
                    <ChevronRight size={12} />
                    Mağazalar
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
