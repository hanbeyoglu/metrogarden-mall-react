import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavbarTransparency } from '@/hooks'
import { cn } from '@/lib/cn'
import { ROUTES } from '@/lib/constants'
import { useSearch } from '@/contexts/SearchContext'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { Logo } from '@/components/shared/Logo'

export function Navbar() {
  const isTransparent = useNavbarTransparency(80)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { open: openSearch } = useSearch()
  const { t } = useTranslation()

  const NAV_LINKS = [
    { label: t('nav.stores'), href: ROUTES.STORES },
    { label: t('nav.campaigns'), href: ROUTES.CAMPAIGNS },
    { label: t('nav.events'), href: ROUTES.EVENTS },
    { label: t('nav.cinema'), href: ROUTES.CINEMA },
    { label: t('nav.services'), href: ROUTES.SERVICES },
    { label: t('nav.contact'), href: ROUTES.CONTACT },
  ] as const

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const scrolled = !isTransparent || menuOpen

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-[100] transition-all duration-500',
          scrolled
            ? 'border-b border-mist/60 bg-white/96 backdrop-blur-md'
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="flex h-[68px] items-center justify-between lg:h-[76px]">
            {/* Logo */}
            <Link
              to={ROUTES.HOME}
              className="flex items-center focus-visible:outline-none"
              aria-label={t('nav.homeAriaLabel')}
            >
              <Logo variant="adaptive" scrolled={scrolled} size="md" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-9 lg:flex" aria-label={t('nav.mainMenu')}>
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.href
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'relative font-sans text-[13px] font-medium transition-colors duration-300',
                      'after:absolute after:bottom-[-4px] after:left-0 after:h-px after:bg-current',
                      'after:transition-all after:duration-300',
                      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full',
                      scrolled
                        ? isActive
                          ? 'text-carbon'
                          : 'text-graphite hover:text-carbon'
                        : isActive
                          ? 'text-white'
                          : 'text-white/75 hover:text-white',
                    )}
                    style={{ letterSpacing: '0.04em' }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop right: Search + Language */}
            <div className="hidden items-center gap-2 lg:flex">
              {/* Language switcher */}
              <LanguageSwitcher variant={scrolled ? 'light' : 'dark'} />

              {/* Search button */}
              <button
                onClick={openSearch}
                className={cn(
                  'flex items-center gap-2 border border-current/20 px-3 py-1.5 transition-all duration-300 hover:border-current/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne',
                  scrolled ? 'text-graphite hover:text-carbon' : 'text-white/70 hover:text-white',
                )}
                aria-label={t('nav.openSearch')}
                aria-keyshortcuts="/ Meta+k"
              >
                <Search size={13} strokeWidth={1.5} />
                <span className="font-sans text-[12px]" style={{ letterSpacing: '0.03em' }}>
                  {t('nav.search')}
                </span>
                <kbd className="ml-1 font-sans text-[10px] opacity-50">{t('nav.searchShortcut')}</kbd>
              </button>
            </div>

            {/* Mobile: Search + Hamburger */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                onClick={openSearch}
                className={cn(
                  'flex h-10 w-10 items-center justify-center transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne',
                  scrolled ? 'text-carbon hover:text-graphite' : 'text-white hover:text-white/70',
                )}
                aria-label={t('nav.openSearch')}
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              <button
                className={cn(
                  'flex h-10 w-10 items-center justify-center transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne',
                  scrolled ? 'text-carbon hover:text-graphite' : 'text-white hover:text-white/70',
                )}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              >
                {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[99] flex flex-col bg-[#0c0c0c] transition-all duration-500 lg:hidden',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden={!menuOpen}
      >
        <div className="mx-auto w-full max-w-[1440px] flex flex-1 flex-col px-6">
          {/* Header-height spacer */}
          <div className="h-[68px] shrink-0" />

          <nav
            className="flex flex-1 flex-col justify-center gap-0 pb-20"
            aria-label={t('nav.openMenu')}
          >
            {/* Mobile Search trigger */}
            <button
              onClick={() => { setMenuOpen(false); openSearch() }}
              className={cn(
                'flex items-center gap-3 border-b border-white/[0.07] py-5 text-left transition-all duration-300',
                menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
              )}
              style={{
                transition: `opacity 0.5s ease 60ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) 60ms`,
              }}
              aria-label={t('nav.openSearch')}
            >
              <Search size={22} strokeWidth={1} className="text-white/40" />
              <span className="font-display text-[28px] font-light text-white/50">
                {t('nav.search')}
              </span>
            </button>

            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'border-b border-white/[0.07] py-6 font-display text-[32px] font-light text-white/80 transition-all duration-300 hover:text-white hover:pl-2',
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
                )}
                style={{
                  transition: `opacity 0.5s ease ${(i + 1) * 60 + 80}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${(i + 1) * 60 + 80}ms, padding-left 0.3s ease`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom row: phone + language */}
          <div
            className={cn(
              'mb-10 flex items-center justify-between gap-5 transition-all duration-500',
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
            )}
            style={{ transitionDelay: menuOpen ? '420ms' : '0ms' }}
          >
            <div className="flex items-center gap-5">
              <a
                href="tel:+902165550100"
                className="font-sans text-[13px] text-white/40 transition-colors hover:text-white/70"
              >
                +90 216 555 01 00
              </a>
              <span className="h-3 w-px bg-white/15" />
              <span className="font-sans text-[13px] text-white/40">10:00 – 22:00</span>
            </div>

            {/* Language switcher — mobile dark */}
            <LanguageSwitcher variant="dark" />
          </div>
        </div>
      </div>
    </>
  )
}
