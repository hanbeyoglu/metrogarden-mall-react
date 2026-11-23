import type { JSX, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ContainerSize = 'text' | 'narrow' | 'standard' | 'wide' | 'full'

const SIZE_CLASSES: Record<ContainerSize, string> = {
  text: 'max-w-[720px]',      // Article / legal body
  narrow: 'max-w-[960px]',   // Editorial content, forms
  standard: 'max-w-[1280px]', // Main content (default)
  wide: 'max-w-[1440px]',    // Full-width sections
  full: 'max-w-none',        // Truly full-bleed
}

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: ContainerSize
  as?: keyof JSX.IntrinsicElements
}

export function Container({
  children,
  className,
  size = 'standard',
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16',
        SIZE_CLASSES[size],
        className,
      )}
    >
      {children}
    </Tag>
  )
}
