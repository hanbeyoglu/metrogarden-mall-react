import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { fadeInUp, fadeInLeft, fadeInRight, scrollRevealViewport } from '@/lib/motion'
import { cn } from '@/lib/cn'

type RevealDirection = 'up' | 'left' | 'right' | 'none'

const VARIANT_MAP = {
  up: fadeInUp,
  left: fadeInLeft,
  right: fadeInRight,
  none: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
}

interface ScrollRevealProps {
  children: ReactNode
  direction?: RevealDirection
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'article' | 'li'
}

/**
 * Wraps children in a Motion element that animates into view on scroll.
 * Respects prefers-reduced-motion via CSS (see globals.css).
 *
 * Usage:
 *   <ScrollReveal delay={100}>
 *     <StoreCard ... />
 *   </ScrollReveal>
 */
export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const baseVariant = VARIANT_MAP[direction]

  const variant = delay > 0
    ? {
        ...baseVariant,
        visible: {
          ...baseVariant.visible,
          transition: {
            ...('transition' in baseVariant.visible
              ? (baseVariant.visible as { transition?: Record<string, unknown> }).transition
              : {}),
            delay: delay / 1000,
          },
        },
      }
    : baseVariant

  return (
    <motion.div
      // Cast to any to allow the `as` polymorphism — motion doesn't support generics yet
      className={cn(className)}
      variants={variant}
      initial="hidden"
      whileInView="visible"
      viewport={scrollRevealViewport}
      {...(Tag !== 'div' ? { style: { display: 'contents' } } : {})}
    >
      {children}
    </motion.div>
  )
}
