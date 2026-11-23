import { motion } from 'motion/react'
import { cn } from '@/lib/cn'

export interface TimelineItem {
  year: string
  title: string
  description: string
  highlight?: boolean
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Vertical line */}
      <div className="absolute left-[56px] top-0 hidden h-full w-px bg-mist/60 sm:block" />

      <div className="space-y-0">
        {items.map((item, i) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
            className="relative flex gap-8 pb-10 sm:pb-12"
          >
            {/* Year label + dot */}
            <div className="relative flex shrink-0 flex-col items-end gap-1 sm:w-[56px]">
              <span
                className={cn(
                  'font-display text-[13px] font-light leading-none transition-colors',
                  item.highlight ? 'text-champagne' : 'text-ash',
                )}
              >
                {item.year}
              </span>
              {/* Dot on the line */}
              <div
                className={cn(
                  'absolute right-[-4.5px] top-[4px] hidden h-2.5 w-2.5 rounded-full border-2 sm:block',
                  item.highlight
                    ? 'border-champagne bg-champagne'
                    : 'border-mist bg-white',
                )}
              />
            </div>

            {/* Content */}
            <div className="flex-1 pb-1">
              <h3
                className={cn(
                  'mb-1.5 font-display text-lg font-light leading-snug',
                  item.highlight ? 'text-carbon' : 'text-carbon/80',
                )}
              >
                {item.title}
              </h3>
              <p className="font-sans text-[13px] leading-[1.75] text-graphite">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
