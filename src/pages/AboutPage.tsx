import { Link } from 'react-router'
import { ArrowRight, Leaf, Users, Lightbulb, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'
import { useMeta } from '@/hooks'
import { ROUTES } from '@/lib/constants'
import { PageHero } from '@/components/shared/PageHero'
import { ContentBlock } from '@/components/shared/ContentBlock'
import { Timeline, type TimelineItem } from '@/components/shared/Timeline'
import { StatsSection, type Stat } from '@/components/shared/StatsSection'
import { useCmsPageContent } from '@/hooks/useCmsContent'
import { CmsPageContent } from '@/components/shared/CmsPageContent'

/* ── Data ───────────────────────────────────────────────── */

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=900&fit=crop&q=85'

const STORY_IMAGE =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&h=700&fit=crop&q=85'

const COMMUNITY_IMAGE =
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&h=700&fit=crop&q=85'

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    year: '2010',
    title: 'Metrogarden AVM\'nin Açılışı',
    description:
      'Kartal\'ın kalbinde 150 mağaza ve 3 kattan oluşan alışveriş merkezimiz, Anadolu Yakası sakinlerini ağırlamaya başladı. Açılış günü 40.000\'i aşkın ziyaretçiyle tarihe geçti.',
    highlight: false,
  },
  {
    year: '2013',
    title: 'Sinema ve Eğlence Katı',
    description:
      'Yeni sinema salonları, çocuk eğlence alanı ve açık hava amfitiyatrosu ile Metrogarden bir yaşam merkezi kimliğine kavuştu. Yıllık etkinlik sayısı 200\'ü aştı.',
    highlight: false,
  },
  {
    year: '2016',
    title: 'Kapsamlı Yenileme Projesi',
    description:
      '18 aylık yenileme sürecinin ardından tüm ortak alanlar, yeme-içme katı ve otopark modern bir tasarıma kavuştu. Ziyaretçi memnuniyet skoru %91\'e yükseldi.',
    highlight: false,
  },
  {
    year: '2019',
    title: '200+ Mağaza Dönemi',
    description:
      'Yeni mağaza blokları devreye alınarak kapasite 220 mağazaya çıkarıldı. Uluslararası markalar listesi büyüdü; Metrogarden İstanbul\'un en tercih edilen AVM\'leri arasına girdi.',
    highlight: true,
  },
  {
    year: '2022',
    title: 'LEED Gold Sertifikası',
    description:
      'Güneş enerjisi panelleri, gri su geri dönüşüm sistemi ve enerji tasarruflu aydınlatma altyapısı ile Metrogarden, Türkiye\'deki ilk LEED Gold sertifikalı AVM\'ler arasına girdi.',
    highlight: false,
  },
  {
    year: '2024',
    title: 'Dijital Dönüşüm',
    description:
      'Metrogarden Mobil Uygulaması ve yeni web platformunun lansmanıyla dijital yolculuk başladı. Mağaza navigasyonu, kampanya takibi ve etkinlik kayıtları artık tek ekranda.',
    highlight: false,
  },
]

const STATS: Stat[] = [
  { value: '240K', label: 'Metrekare', sublabel: 'Toplam kapalı alan' },
  { value: '220+', label: 'Mağaza', sublabel: 'Ulusal ve uluslararası marka' },
  { value: '10M+', label: 'Yıllık Ziyaretçi', sublabel: 'Ortalama yıllık trafik' },
  { value: '16 Yıl', label: 'Hizmet', sublabel: '2010\'dan bu yana' },
]

const CORE_VALUES = [
  {
    icon: Users,
    title: 'Müşteri Odaklılık',
    description:
      'Her kararımızın merkezinde ziyaretçi deneyimi yer alır. Memnuniyetinizi ölçer, dinler ve sürekli iyileştiririz.',
  },
  {
    icon: Leaf,
    title: 'Sürdürülebilirlik',
    description:
      'LEED Gold sertifikalı binamız, yenilenebilir enerji kullanımı ve atık yönetim programlarıyla çevreye saygılı bir işletme modeli benimsiyoruz.',
  },
  {
    icon: Lightbulb,
    title: 'Yenilikçilik',
    description:
      'Dijital dönüşüm, akıllı otopark çözümleri ve veri odaklı operasyon yönetimiyle alışveriş deneyimini sürekli yeniden tanımlıyoruz.',
  },
  {
    icon: ShieldCheck,
    title: 'Güven & Şeffaflık',
    description:
      'Mağaza ortaklarımıza, çalışanlarımıza ve ziyaretçilerimize karşı dürüst, şeffaf ve adil bir yaklaşım benimsiyoruz.',
  },
]

/* ─────────────────────────────────────────────────────────── */

export function AboutPage() {
  const cmsPage = useCmsPageContent('about')
  useMeta({
    title: cmsPage?.meta?.title ?? cmsPage?.title ?? 'Hakkımızda',
    description: cmsPage?.meta?.description ?? 'Metrogarden AVM hakkında bilgi edinin. Hikayemiz, değerlerimiz ve Anadolu Yakası\'nın en prestijli alışveriş merkezinin tarihi.',
  })

  if (cmsPage) {
    return (
      <>
        <PageHero
          title={cmsPage.title}
          subtitle={cmsPage.meta?.description}
          image={cmsPage.meta?.og_image || HERO_IMAGE}
          breadcrumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: cmsPage.title }]}
          height="md"
        />
        <CmsPageContent page={cmsPage} />
      </>
    )
  }

  return (
    <>
      <PageHero
        title="Hakkımızda"
        subtitle="İstanbul'un kalbinde, alışverişin ötesinde bir deneyim."
        image={HERO_IMAGE}
        breadcrumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Hakkımızda' }]}
        height="md"
      />

      {/* ── Intro ─────────────────────────────────────────── */}
      <section className="bg-ivory py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-champagne" />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-champagne">
                Metrogarden AVM
              </span>
              <span className="h-px w-10 bg-champagne" />
            </div>
            <p className="font-display text-2xl font-light leading-[1.6] text-carbon lg:text-3xl">
              2010'dan bu yana Kartal'da yaşamın merkezi olmaya devam ediyoruz.
            </p>
            <p className="mx-auto mt-6 max-w-2xl font-sans text-[15px] leading-[1.85] text-graphite">
              Metrogarden AVM, yalnızca bir alışveriş merkezi değil; İstanbul Anadolu Yakası'nın en dinamik sosyal buluşma noktasıdır. 220'yi aşkın mağazamız, düzenli etkinliklerimiz ve sürdürülebilir yapımızla her yaştan ziyaretçiye eşsiz bir deneyim sunuyoruz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Story (ContentBlock) ──────────────────────────── */}
      <ContentBlock
        eyebrow="Hikayemiz"
        title="Bir Hayalin Gerçeğe Dönüşmesi"
        text={[
          "2010 yılında kapılarını açan Metrogarden AVM, 240.000 m\u00b2 üzerinde yükselen modern mimarisi ve 220'yi aşkın mağazasıyla Kartal'ın çehresini değiştirdi. Projenin temelinde yalnızca bir alışveriş mekânı inşa etmek değil; insanların buluştuğu, eğlendiği ve deneyim yaşadığı yaşayan bir şehir parçası yaratmak yatıyordu.",
          "O günden bu yana her yıl 10 milyonun üzerinde ziyaretçiye ev sahipliği yapıyoruz. Her sezon yenilenen mağaza çeşitliliği, dünya markaları, etkinlikler ve gastronomi deneyimiyle Metrogarden sadece bir alışveriş değil, bir yaşam tarzı sunmaktadır.",
        ]}
        image={STORY_IMAGE}
        imageAlt="Metrogarden AVM iç mekân"
      />

      {/* ── Timeline ──────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28" aria-labelledby="timeline-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-champagne" />
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">
                  Kilometre Taşları
                </span>
              </div>
              <h2 id="timeline-heading" className="mb-6 font-display text-3xl font-light text-carbon lg:text-4xl">
                16 Yıllık Başarı<br />Yolculuğu
              </h2>
              <p className="font-sans text-[14px] leading-[1.85] text-graphite">
                2010'dan bugüne uzanan bu süreçte yalnızca büyümekle kalmadık; aynı zamanda değiştik, dönüştük ve daha iyiyi hedefledik.
              </p>
            </motion.div>

            <Timeline items={TIMELINE_ITEMS} />
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <StatsSection stats={STATS} eyebrow="Rakamlarla Metrogarden" />

      {/* ── Community (ContentBlock reversed) ────────────── */}
      <ContentBlock
        eyebrow="Sürdürülebilirlik"
        title="Yarınlar İçin Bugün Hareket Ediyoruz"
        text={[
          'Metrogarden, çevreye duyarlı bir işletme anlayışıyla LEED Gold sertifikasına sahip Türkiye\'nin ilk AVM\'lerinden biridir. Çatımızdaki güneş panelleri yıllık enerji tüketimimizin %35\'ini karşılarken, gri su geri dönüşüm sistemi ile tüketilen su miktarını önemli ölçüde azaltıyoruz.',
          'Plastik kullanımını minimize etme, organik atık kompostlama ve yerel üretici pazarları gibi çeşitli programlarla topluluk bilinci oluşturma konusundaki çalışmalarımız her yıl genişlemeye devam etmektedir.',
        ]}
        image={COMMUNITY_IMAGE}
        imageAlt="Sürdürülebilirlik projeleri"
        reverse
        cta={{ label: 'İletişime Geçin', href: ROUTES.CONTACT }}
      />

      {/* ── Core Values ───────────────────────────────────── */}
      <section className="bg-ivory py-20 lg:py-28" aria-labelledby="values-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-champagne" />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">
                Değerlerimiz
              </span>
              <span className="h-px w-8 bg-champagne" />
            </div>
            <h2 id="values-heading" className="font-display text-3xl font-light text-carbon lg:text-4xl">
              Bizi Biz Yapan İlkeler
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {CORE_VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.09 }}
                className="border border-mist bg-white p-7"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center border border-champagne/30 text-champagne">
                  <value.icon size={18} strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 font-display text-lg font-light text-carbon">
                  {value.title}
                </h3>
                <p className="font-sans text-[13px] leading-[1.75] text-graphite">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="bg-carbon py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-champagne/50" />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-champagne/80">
                Bizi Ziyaret Edin
              </span>
              <span className="h-px w-8 bg-champagne/50" />
            </div>
            <h2 className="mb-5 font-display text-3xl font-light text-white lg:text-4xl">
              Sizi Aramızda Görmekten<br />Mutluluk Duyarız
            </h2>
            <p className="mb-8 max-w-md font-sans text-[14px] leading-relaxed text-white/40">
              Her gün 10:00–22:00 saatleri arasında Kartal'da 220'den fazla marka ve sınırsız deneyimle sizi bekliyoruz.
            </p>
            <Link
              to={ROUTES.CONTACT}
              className="group flex items-center gap-3 border border-white/20 px-8 py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:border-champagne hover:bg-champagne"
            >
              İletişime Geçin
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
