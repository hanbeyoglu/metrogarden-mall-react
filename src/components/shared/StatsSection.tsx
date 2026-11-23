import { motion } from 'motion/react'
import { cn } from '@/lib/cn'

export interface Stat {
  value: string
  label: string
  sublabel?: string
}

interface StatsSectionProps {
  stats: Stat[]
  eyebrow?: string
  className?: string
  darkMode?: boolean
}

export function StatsSection({ stats, eyebrow, className, darkMode = false }: StatsSectionProps) {
  return (
    <div className={cn('py-16 lg:py-20', darkMode ? 'bg-carbon' : 'bg-fog', className)}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <span
              className={cn(
                'font-sans text-[11px] font-semibold uppercase tracking-[0.24em]',
                darkMode ? 'text-champagne/60' : 'text-champagne',
              )}
            >
              {eyebrow}
            </span>
          </motion.div>
        )}

        <div
          className={cn(
            'grid divide-y border',
            darkMode ? 'divide-white/5 border-white/5' : 'divide-mist border-mist',
            stats.length === 3 ? 'sm:grid-cols-3 sm:divide-y-0 sm:divide-x' : 'sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4 lg:divide-y-0',
          )}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              className={cn(
                'flex flex-col items-center px-8 py-10 text-center',
                darkMode ? 'text-white' : 'text-carbon',
              )}
            >
              <span
                className={cn(
                  'mb-1 font-display text-5xl font-light tracking-tight lg:text-6xl',
                  darkMode ? 'text-white' : 'text-carbon',
                )}
              >
                {stat.value}
              </span>
              <span
                className={cn(
                  'mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em]',
                  darkMode ? 'text-champagne/70' : 'text-champagne',
                )}
              >
                {stat.label}
              </span>
              {stat.sublabel && (
                <span
                  className={cn(
                    'mt-1 font-sans text-[12px]',
                    darkMode ? 'text-white/30' : 'text-ash',
                  )}
                >
                  {stat.sublabel}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
