import logoDark from '@/assets/metrogarden-logo-dark.png'
import logoLight from '@/assets/metrogarden-logo-light.png'
import { cn } from '@/lib/cn'

export interface LogoProps {
  /**
   * 'dark': dark text for light backgrounds
   * 'light': light/white text for dark backgrounds
   * 'adaptive': switches based on scrolled state (scrolled ? dark : light)
   */
  variant?: 'dark' | 'light' | 'adaptive'
  scrolled?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  alt?: string
}

export function Logo({
  variant = 'dark',
  scrolled = false,
  size = 'md',
  className,
  alt = 'Metrogarden Mall',
}: LogoProps) {
  const isLightText = variant === 'light' || (variant === 'adaptive' && !scrolled)
  const logoSrc = isLightText ? logoLight : logoDark

  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-13 sm:h-14',
    xl: 'h-18 sm:h-20',
  }[size]

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={cn('w-auto object-contain transition-all duration-300', heightClasses, className)}
    />
  )
}
