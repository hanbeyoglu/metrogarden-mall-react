import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type SectionBackground = 'ivory' | 'fog' | 'white' | 'obsidian' | 'midnight'

const BG_CLASSES: Record<SectionBackground, string> = {
  ivory: 'bg-ivory',
  fog: 'bg-fog',
  white: 'bg-white',
  obsidian: 'bg-obsidian',
  midnight: 'bg-midnight',
}

interface SectionProps {
  children: ReactNode
  className?: string
  background?: SectionBackground
  id?: string
  /** Remove the default vertical padding (e.g., for full-bleed image sections) */
  noPadding?: boolean
  as?: 'section' | 'div' | 'article' | 'aside'
}

export function Section({
  children,
  className,
  background = 'ivory',
  id,
  noPadding = false,
  as: Tag = 'section',
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        BG_CLASSES[background],
        !noPadding && 'py-20 md:py-24 lg:py-32 xl:py-36',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
