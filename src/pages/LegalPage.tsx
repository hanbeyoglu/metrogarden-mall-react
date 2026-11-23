import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Printer, ChevronRight, Calendar } from 'lucide-react'
import { motion } from 'motion/react'
import { useMeta } from '@/hooks'
import { ROUTES } from '@/lib/constants'
import { LEGAL_DOCUMENTS } from '@/data/legal'
import { cn } from '@/lib/cn'
import { useCmsPageContent } from '@/hooks/useCmsContent'
import { CmsPageContent } from '@/components/shared/CmsPageContent'

const SLUG_MAP: Record<string, string> = {
  kvkk: 'kvkk',
  privacy: 'privacy',
  'cookie-policy': 'cookie-policy',
}

export function LegalPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<string>('')
  const contentRef = useRef<HTMLDivElement>(null)

  const docKey = slug && SLUG_MAP[slug] ? slug : null
  const doc = docKey ? LEGAL_DOCUMENTS[docKey] : null
  const cmsPage = useCmsPageContent(docKey ?? undefined)

  useMeta({
    title: cmsPage?.meta?.title ?? cmsPage?.title ?? doc?.title ?? 'Yasal Bilgi',
    description: cmsPage?.meta?.description ?? doc?.intro?.slice(0, 160),
  })

  /* Redirect if slug is unknown */
  useEffect(() => {
    if (!doc && !cmsPage) navigate(ROUTES.HOME, { replace: true })
  }, [doc, cmsPage, navigate])

  /* Scroll-spy: track active section */
  useEffect(() => {
    if (!doc || cmsPage) return
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>('[data-legal-section]')
      let current = ''
      sections.forEach((el) => {
        if (el.getBoundingClientRect().top <= 120) current = el.id
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [doc, cmsPage])

  if (cmsPage) {
    return (
      <div className="min-h-screen bg-ivory">
        <header className="border-b border-mist/60 bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12 lg:py-20">
            <h1 className="font-display text-4xl font-light text-carbon lg:text-5xl">{cmsPage.title}</h1>
            {cmsPage.last_updated && (
              <p className="mt-4 font-sans text-[12px] text-ash">
                Son güncelleme: {new Date(cmsPage.last_updated).toLocaleDateString('tr-TR')}
              </p>
            )}
          </div>
        </header>
        <CmsPageContent page={cmsPage} />
      </div>
    )
  }

  if (!doc) return null

  const otherDocs = [
    { title: 'KVKK Aydınlatma Metni', href: ROUTES.KVKK, active: docKey === 'kvkk' },
    { title: 'Gizlilik Politikası', href: ROUTES.PRIVACY, active: docKey === 'privacy' },
    { title: 'Çerez Politikası', href: ROUTES.COOKIE_POLICY, active: docKey === 'cookie-policy' },
  ]

  return (
    <div className="min-h-screen bg-ivory">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="border-b border-mist/60 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12 lg:py-20">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center gap-1.5 font-sans text-[11px] text-ash"
            aria-label="Sayfa konumu"
          >
            <a href={ROUTES.HOME} className="hover:text-carbon">Ana Sayfa</a>
            <ChevronRight size={11} />
            <span className="text-carbon">{doc.title}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-champagne" />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne">
                Yasal Belgeler
              </span>
            </div>
            <h1 className="mb-4 font-display text-4xl font-light text-carbon lg:text-5xl">
              {doc.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-sans text-[12px] text-ash">
                <Calendar size={12} />
                Son güncelleme: {doc.lastUpdated}
              </span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 font-sans text-[12px] text-graphite transition-colors hover:text-carbon"
              >
                <Printer size={12} />
                Yazdır
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────── */}
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">

          {/* ── Sidebar: TOC + other docs ────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-[92px] space-y-8">
              {/* Table of Contents */}
              <div>
                <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ash">
                  İçindekiler
                </p>
                <nav aria-label="Sayfa içeriği" className="space-y-1">
                  {doc.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className={cn(
                        'block border-l-2 py-1.5 pl-3 font-sans text-[12px] leading-snug transition-all duration-200',
                        activeSection === section.id
                          ? 'border-champagne text-carbon'
                          : 'border-transparent text-ash hover:border-mist hover:text-graphite',
                      )}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Other legal docs */}
              <div>
                <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ash">
                  Diğer Belgeler
                </p>
                <div className="space-y-2">
                  {otherDocs.map((d) => (
                    <a
                      key={d.href}
                      href={d.href}
                      className={cn(
                        'block font-sans text-[12px] py-1 transition-colors',
                        d.active ? 'font-medium text-carbon pointer-events-none' : 'text-ash hover:text-graphite',
                      )}
                    >
                      {d.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Document Content ─────────────────────────── */}
          <div ref={contentRef} className="min-w-0">
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 rounded-none border-l-2 border-champagne bg-white px-6 py-5"
            >
              <p className="font-sans text-[14px] leading-[1.85] text-graphite">
                {doc.intro}
              </p>
            </motion.div>

            {/* Sections */}
            <div className="space-y-12">
              {doc.sections.map((section, i) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  data-legal-section=""
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="scroll-mt-28"
                  aria-labelledby={`heading-${section.id}`}
                >
                  <h2
                    id={`heading-${section.id}`}
                    className="mb-5 font-display text-xl font-light text-carbon lg:text-2xl"
                  >
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.content.map((para, j) => (
                      <p
                        key={j}
                        className="font-sans text-[14px] leading-[1.85] text-graphite"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>

            {/* Mobile: other docs */}
            <div className="mt-14 border-t border-mist pt-8 lg:hidden">
              <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-ash">
                Diğer Belgeler
              </p>
              <div className="flex flex-wrap gap-4">
                {otherDocs.filter((d) => !d.active).map((d) => (
                  <a
                    key={d.href}
                    href={d.href}
                    className="flex items-center gap-1.5 font-sans text-[13px] text-graphite hover:text-champagne"
                  >
                    <ChevronRight size={12} />
                    {d.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
