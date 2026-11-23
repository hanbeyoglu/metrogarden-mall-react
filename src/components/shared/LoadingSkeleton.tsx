import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/shared/Logo'


// ── Primitive skeleton blocks ────────────────────────────────────────────────

interface SkeletonTextProps {
  lines?: number
  className?: string
  /** Widths for each line — cycles if fewer than line count */
  widths?: string[]
}

export function SkeletonText({ lines = 3, className, widths }: SkeletonTextProps) {
  const defaultWidths = ['w-full', 'w-4/5', 'w-3/5']

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', widths?.[i % widths.length] ?? defaultWidths[i % defaultWidths.length])}
        />
      ))}
    </div>
  )
}

// ── Composite skeletons per content type ─────────────────────────────────────

export function SkeletonStoreCard() {
  return (
    <div className="overflow-hidden rounded-sm bg-white">
      {/* Logo area — 3:2 */}
      <Skeleton className="aspect-store w-full" />
      <div className="space-y-2 p-5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-3 h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonCampaignCard() {
  return (
    <div className="overflow-hidden rounded-sm bg-white">
      {/* Image — 4:3 */}
      <Skeleton className="aspect-card w-full" />
      <div className="space-y-2 p-6">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="mt-2 h-3 w-1/4" />
      </div>
    </div>
  )
}

export function SkeletonEventRow() {
  return (
    <div className="flex items-center gap-8 border-b border-mist py-6">
      {/* Date block */}
      <div className="hidden min-w-[80px] flex-col items-center sm:flex">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="mt-2 h-3 w-8" />
      </div>
      {/* Image */}
      <Skeleton className="hidden h-[130px] w-[200px] shrink-0 rounded-sm sm:block" />
      {/* Content */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  )
}

export function SkeletonMovieRow() {
  return (
    <div className="flex gap-8 py-8">
      {/* Poster — 2:3 */}
      <Skeleton className="aspect-poster w-[200px] shrink-0 rounded-sm" />
      <div className="flex-1 space-y-3 pt-2">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/4" />
        <div className="flex gap-3 pt-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-20 rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonPageHero({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const heightClasses = { sm: 'h-[280px]', md: 'h-[360px]', lg: 'h-[480px]' }

  return <Skeleton className={cn('w-full', heightClasses[size])} />
}

export function SkeletonSection({ height = 400 }: { height?: number }) {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-[1280px] px-8">
        {/* Section header */}
        <div className="mb-16 space-y-4">
          <Skeleton className="mx-auto h-3 w-24" />
          <Skeleton className="mx-auto h-10 w-64" />
          <Skeleton className="mx-auto h-4 w-96" />
        </div>
        {/* Content placeholder */}
        <Skeleton className={cn('w-full rounded-sm')} style={{ height }} />
      </div>
    </div>
  )
}

/** Full-page loading state — used by Suspense boundaries */
export function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Sayfa yükleniyor"
      className="flex min-h-dvh items-center justify-center bg-ivory"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Pulsing logo placeholder */}
        <Logo variant="dark" size="lg" className="animate-pulse opacity-80" />
        <Skeleton className="h-0.5 w-20 bg-champagne" />
      </div>
    </div>
  )
}
