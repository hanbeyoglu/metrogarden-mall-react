import { Link } from 'react-router'
import { Instagram, Facebook, Twitter, Youtube, Settings2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMallContent } from '@/hooks/useCmsContent'
import { ROUTES } from '@/lib/constants'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { Logo } from '@/components/shared/Logo'

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
} as const

export function Footer() {
  const mall = useMallContent()
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const QUICK_LINKS = [
    { label: t('footer.links.stores'), href: ROUTES.STORES },
    { label: t('footer.links.campaigns'), href: ROUTES.CAMPAIGNS },
    { label: t('footer.links.events'), href: ROUTES.EVENTS },
    { label: t('footer.links.cinema'), href: ROUTES.CINEMA },
    { label: t('footer.links.services'), href: ROUTES.SERVICES },
    { label: t('footer.links.about'), href: ROUTES.ABOUT },
    { label: t('footer.links.contact'), href: ROUTES.CONTACT },
  ]

  const LEGAL_LINKS = [
    { label: t('footer.links.kvkk'), href: ROUTES.KVKK },
    { label: t('footer.links.privacy'), href: ROUTES.PRIVACY },
    { label: t('footer.links.cookie'), href: ROUTES.COOKIE_POLICY },
  ]

  return (
    <footer className="bg-obsidian" aria-label={t('footer.ariaLabel')}>
      {/* Main Footer */}
      <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-12 lg:px-12 lg:pt-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {/* Column 1 — Brand */}
          <div>
            <Link
              to={ROUTES.HOME}
              className="mb-5 inline-flex items-center focus-visible:outline-none"
              aria-label={t('nav.homeAriaLabel')}
            >
              <Logo variant="light" size="lg" />
            </Link>

            <p className="mb-7 max-w-[200px] font-sans text-[13px] font-light leading-[1.7] text-white/40">
              {mall.tagline}
            </p>

            {/* Social Links */}
            {mall.social_links && (
              <div className="flex items-center gap-2.5">
                {(Object.entries(mall.social_links) as [keyof typeof SOCIAL_ICONS, string][]).map(
                  ([platform, url]) => {
                    const Icon = SOCIAL_ICONS[platform]
                    if (!Icon || !url) return null
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${mall.name} ${platform}`}
                        className="flex h-8 w-8 items-center justify-center border border-white/[0.1] text-white/30 transition-all duration-300 hover:border-champagne/40 hover:text-champagne"
                      >
                        <Icon size={13} />
                      </a>
                    )
                  },
                )}
              </div>
            )}
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="mb-6 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              {t('footer.explore')}
            </h3>
            <ul className="space-y-3.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group inline-flex font-sans text-[13px] font-light text-white/50 transition-colors duration-200 hover:text-white/90"
                  >
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white/50 after:transition-all after:duration-300 group-hover:after:w-full">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact Info */}
          <div>
            <h3 className="mb-6 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              {t('footer.contactTitle')}
            </h3>
            <div className="space-y-4">
              <p className="font-sans text-[13px] font-light leading-[1.7] text-white/50">
                {mall.address}
              </p>
              <a
                href={`tel:${mall.phone.replace(/\s/g, '')}`}
                className="block font-sans text-[13px] font-light text-white/50 transition-colors hover:text-white/80"
              >
                {mall.phone}
              </a>
              <a
                href={`mailto:${mall.email}`}
                className="block font-sans text-[13px] font-light text-white/50 transition-colors hover:text-white/80"
              >
                {mall.email}
              </a>
              {mall.working_hours && (
                <div className="pt-1">
                  <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25">
                    {t('footer.workingHours')}
                  </p>
                  <p className="font-sans text-[13px] font-light text-white/50">
                    {mall.working_hours.schedule}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Column 4 — Legal + Language */}
          <div>
            <h3 className="mb-6 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              {t('footer.legal')}
            </h3>
            <ul className="mb-7 space-y-3.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group inline-flex font-sans text-[13px] font-light text-white/50 transition-colors duration-200 hover:text-white/90"
                  >
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white/50 after:transition-all after:duration-300 group-hover:after:w-full">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Cookie Settings */}
            <button
              onClick={() => {
                /* Cookie consent modal — future sprint */
              }}
              className="mb-5 flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.1em] text-white/25 transition-colors duration-200 hover:text-white/50"
              aria-label={t('footer.cookieAriaLabel')}
            >
              <Settings2 size={12} />
              {t('footer.cookieSettings')}
            </button>

            {/* Language switcher */}
            <LanguageSwitcher variant="dark" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-6 py-5 sm:flex-row lg:px-12">
          <p className="font-sans text-[11px] text-white/20">
            © {currentYear} {mall.name}. {t('footer.copyright')}
          </p>
          <p className="font-sans text-[11px] text-white/15">
            {t('footer.operator')}
          </p>
        </div>
      </div>
    </footer>
  )
}
