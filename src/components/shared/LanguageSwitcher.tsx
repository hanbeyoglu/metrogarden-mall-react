import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguage, type SupportedLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/cn'

type Variant = 'dark' | 'light'

interface LanguageSwitcherProps {
  variant?: Variant
  className?: string
}

const LANGUAGES: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: 'tr', label: 'Türkçe', native: 'TR' },
  { code: 'en', label: 'English', native: 'EN' },
]

export function LanguageSwitcher({ variant = 'light', className }: LanguageSwitcherProps) {
  const { t } = useTranslation()
  const { currentLanguage, changeLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  /* Close on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  /* Close on Escape */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

  const isDark = variant === 'dark'
  const current = LANGUAGES.find((l) => l.code === currentLanguage) ?? LANGUAGES[0]

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('lang.switchTo')}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 font-sans text-[12px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne',
          isDark
            ? 'text-white/50 hover:text-white/80'
            : 'text-graphite hover:text-carbon',
        )}
      >
        <Globe
          size={13}
          strokeWidth={1.5}
          className={isDark ? 'text-white/30' : 'text-ash'}
        />
        <span style={{ letterSpacing: '0.06em' }}>{current.native}</span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t('lang.label')}
          className={cn(
            'absolute right-0 z-50 mt-1 min-w-[110px] overflow-hidden border py-1 shadow-lg',
            isDark
              ? 'border-white/10 bg-[#1a1a1a]'
              : 'border-mist bg-white',
          )}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={currentLanguage === lang.code}
              onClick={() => {
                changeLanguage(lang.code)
                setIsOpen(false)
              }}
              className={cn(
                'flex w-full items-center justify-between px-3 py-2 font-sans text-[12px] transition-colors duration-150',
                isDark
                  ? currentLanguage === lang.code
                    ? 'bg-white/[0.06] text-white'
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
                  : currentLanguage === lang.code
                    ? 'bg-fog text-carbon'
                    : 'text-graphite hover:bg-fog/60 hover:text-carbon',
              )}
            >
              <span>{lang.label}</span>
              {currentLanguage === lang.code && (
                <Check size={11} className={isDark ? 'text-champagne' : 'text-champagne'} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
