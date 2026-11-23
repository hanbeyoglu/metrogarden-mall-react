import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'

interface ContentBlockCTA {
  label: string
  href: string
  external?: boolean
}

export interface ContentBlockProps {
  eyebrow?: string
  title: string
  /** Single string or array of paragraphs */
  text: string | string[]
  image: string
  imageAlt?: string
  /** Flip image to the right side */
  reverse?: boolean
  cta?: ContentBlockCTA
  /** Optional accent colour class applied to eyebrow & CTA (default: text-champagne) */
  accentClass?: string
  className?: string
}

export function ContentBlock({
  eyebrow,
  title,
  text,
  image,
  imageAlt = '',
  reverse = false,
  cta,
  accentClass = 'text-champagne',
  className,
}: ContentBlockProps) {
  const paragraphs = Array.isArray(text) ? text : [text]

  return (
    <div className={cn('grid gap-0 overflow-hidden lg:grid-cols-2', className)}>
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={cn('relative overflow-hidden', { 'lg:order-last': reverse })}
        style={{ minHeight: 360 }}
      >
        <img src={image} alt={imageAlt || title} className="img-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? -24 : 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="flex flex-col justify-center bg-white px-8 py-14 lg:px-12 xl:px-16"
      >
        {eyebrow && (
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-current opacity-40" />
            <span className={cn('font-sans text-[11px] font-semibold uppercase tracking-[0.22em]', accentClass)}>
              {eyebrow}
            </span>
          </div>
        )}

        <h2 className="mb-6 font-display text-3xl font-light leading-snug text-carbon lg:text-4xl">
          {title}
        </h2>

        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-sans text-[15px] leading-[1.85] text-graphite">
              {p}
            </p>
          ))}
        </div>

        {cta && (
          <div className="mt-8">
            {cta.external ? (
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group inline-flex items-center gap-2.5 font-sans text-[13px] font-medium transition-all duration-300',
                  accentClass,
                )}
              >
                {cta.label}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            ) : (
              <Link
                to={cta.href}
                className={cn(
                  'group inline-flex items-center gap-2.5 font-sans text-[13px] font-medium transition-all duration-300',
                  accentClass,
                )}
              >
                {cta.label}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
