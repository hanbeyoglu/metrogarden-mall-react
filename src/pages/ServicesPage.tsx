import { useMemo, useState } from 'react'
import { ConciergeBell, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMeta } from '@/hooks'
import { useMallContent, useServiceContent } from '@/hooks/useCmsContent'
import { PageHero } from '@/components/shared/PageHero'
import { EmptyState } from '@/components/shared/EmptyState'
import { SkeletonCampaignCard } from '@/components/shared/LoadingSkeleton'
import { ServiceCard } from '@/components/services/ServiceCard'
import { ServiceFilterBar } from '@/components/services/ServiceFilterBar'
import { ROUTES } from '@/lib/constants'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=85&fit=crop'

export function ServicesPage() {
  const { t } = useTranslation()
  const mall = useMallContent()
  const { services, isLoading, isError, isConfigured } = useServiceContent()
  const [category, setCategory] = useState('')

  useMeta({
    title: t('pages.services.heroTitle'),
    description: t('pages.services.metaDescription'),
  })

  const categories = useMemo(() => {
    const values = new Set<string>()
    services.forEach((service) => {
      if (service.category?.trim()) values.add(service.category.trim())
    })
    return [...values].sort((a, b) => a.localeCompare(b, 'tr'))
  }, [services])

  const filteredServices = useMemo(() => {
    if (!category) return services
    return services.filter((service) => service.category === category)
  }, [services, category])

  return (
    <>
      <PageHero
        title={t('pages.services.heroTitle')}
        subtitle={t('pages.services.heroSubtitle')}
        image={mall.stores_hero_image || HERO_IMAGE}
        breadcrumbs={[
          { label: t('pages.notFound.links.home'), href: ROUTES.HOME },
          { label: t('nav.services') },
        ]}
        height="md"
      />

      <section className="bg-ivory py-14 lg:py-20" aria-labelledby="services-intro-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-champagne" />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">
                {t('pages.services.introEyebrow')}
              </span>
              <span className="h-px w-8 bg-champagne" />
            </div>
            <h2
              id="services-intro-heading"
              className="font-display text-3xl font-light text-carbon lg:text-4xl"
            >
              {t('pages.services.introTitle')}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl font-sans text-[15px] leading-[1.85] text-graphite">
              {t('pages.services.introDesc')}
            </p>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <ServiceFilterBar
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          resultCount={filteredServices.length}
          totalCount={services.length}
        />
      )}

      <section className="bg-white py-12 lg:py-16" aria-label={t('pages.services.listAriaLabel')}>
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" aria-busy="true">
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonCampaignCard key={i} />
              ))}
              <span className="sr-only">{t('common.loading')}</span>
            </div>
          ) : isError || !isConfigured ? (
            <EmptyState
              icon={AlertCircle}
              headline={t('pages.services.errorTitle')}
              message={t('pages.services.errorDesc')}
            />
          ) : filteredServices.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {filteredServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ConciergeBell}
              headline={
                category ? t('pages.services.emptyFilteredTitle') : t('pages.services.emptyTitle')
              }
              message={
                category ? t('pages.services.emptyFilteredDesc') : t('pages.services.emptyDesc')
              }
              action={
                category
                  ? {
                      label: t('common.clearFilters'),
                      onClick: () => setCategory(''),
                    }
                  : undefined
              }
            />
          )}
        </div>
      </section>
    </>
  )
}
