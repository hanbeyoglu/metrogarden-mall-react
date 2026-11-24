import { Link } from 'react-router'
import { ArrowRight, Leaf, Users, Lightbulb, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
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

/* ─────────────────────────────────────────────────────────── */

export function AboutPage() {
  const { t } = useTranslation()
  const cmsPage = useCmsPageContent('about')
  const timelineItems = t('pages.about.timelineItems', { returnObjects: true }) as TimelineItem[]
  const stats = t('pages.about.statItems', { returnObjects: true }) as Stat[]
  const valueItems = t('pages.about.valueItems', { returnObjects: true }) as { title: string; description: string }[]
  const coreValues = valueItems.map((value, index) => ({
    ...value,
    icon: [Users, Leaf, Lightbulb, ShieldCheck][index] ?? Users,
  }))
  useMeta({
    title: cmsPage?.meta?.title ?? cmsPage?.title ?? t('pages.about.heroTitle'),
    description: cmsPage?.meta?.description ?? t('pages.about.metaDescription'),
  })

  if (cmsPage) {
    return (
      <>
        <PageHero
          title={cmsPage.title}
          subtitle={cmsPage.meta?.description}
          image={cmsPage.meta?.og_image || HERO_IMAGE}
          breadcrumbs={[{ label: t('pages.notFound.links.home'), href: '/' }, { label: cmsPage.title }]}
          height="md"
        />
        <CmsPageContent page={cmsPage} />
      </>
    )
  }

  return (
    <>
      <PageHero
        title={t('pages.about.heroTitle')}
        subtitle={t('pages.about.heroSubtitle')}
        image={HERO_IMAGE}
        breadcrumbs={[{ label: t('pages.notFound.links.home'), href: '/' }, { label: t('pages.about.heroTitle') }]}
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
              {t('pages.about.introLead')}
            </p>
            <p className="mx-auto mt-6 max-w-2xl font-sans text-[15px] leading-[1.85] text-graphite">
              {t('pages.about.introDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Story (ContentBlock) ──────────────────────────── */}
      <ContentBlock
        eyebrow={t('pages.about.intro')}
        title={t('pages.about.storyTitle')}
        text={[t('pages.about.storyParagraph1'), t('pages.about.storyParagraph2')]}
        image={STORY_IMAGE}
        imageAlt={t('pages.about.mallImageAlt')}
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
                  {t('pages.about.timeline')}
                </span>
              </div>
              <h2 id="timeline-heading" className="mb-6 font-display text-3xl font-light text-carbon lg:text-4xl">
                {t('pages.about.timelineTitle')}
              </h2>
              <p className="font-sans text-[14px] leading-[1.85] text-graphite">
                {t('pages.about.timelineDescription')}
              </p>
            </motion.div>

            <Timeline items={timelineItems} />
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <StatsSection stats={stats} eyebrow={t('pages.about.stats')} />

      {/* ── Community (ContentBlock reversed) ────────────── */}
      <ContentBlock
        eyebrow={t('pages.about.sustainability')}
        title={t('pages.about.sustainabilityTitle')}
        text={[t('pages.about.sustainabilityParagraph1'), t('pages.about.sustainabilityParagraph2')]}
        image={COMMUNITY_IMAGE}
        imageAlt={t('pages.about.sustainabilityImageAlt')}
        reverse
        cta={{ label: t('pages.about.ctaButton'), href: ROUTES.CONTACT }}
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
                {t('pages.about.values')}
              </span>
              <span className="h-px w-8 bg-champagne" />
            </div>
            <h2 id="values-heading" className="font-display text-3xl font-light text-carbon lg:text-4xl">
              {t('pages.about.valuesTitle')}
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {coreValues.map((value, i) => (
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
                {t('pages.about.visitEyebrow')}
              </span>
              <span className="h-px w-8 bg-champagne/50" />
            </div>
            <h2 className="mb-5 font-display text-3xl font-light text-white lg:text-4xl">
              {t('pages.about.visitTitle')}
            </h2>
            <p className="mb-8 max-w-md font-sans text-[14px] leading-relaxed text-white/40">
              {t('pages.about.visitDescription')}
            </p>
            <Link
              to={ROUTES.CONTACT}
              className="group flex items-center gap-3 border border-white/20 px-8 py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:border-champagne hover:bg-champagne"
            >
              {t('pages.about.ctaButton')}
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
