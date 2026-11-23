import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

interface EmptyStateAction {
  label: string
  href?: string
  onClick?: () => void
  /** When true, renders as a plain text link instead of a Button */
  variant?: 'button' | 'link'
}

interface EmptyStateProps {
  icon: LucideIcon
  headline: string
  message?: string
  action?: EmptyStateAction
  className?: string
}

/**
 * Used when a data-fetched section returns an empty array
 * or when a filter returns no results.
 *
 * Never shows on load — only after data arrives.
 */
export function EmptyState({
  icon: Icon,
  headline,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-20 text-center',
        className,
      )}
    >
      <Icon
        size={48}
        strokeWidth={1}
        className="mb-6 text-ash"
        aria-hidden="true"
      />

      <p className="font-display text-2xl text-carbon">{headline}</p>

      {message && (
        <p className="mt-3 max-w-sm font-sans text-[15px] leading-relaxed text-graphite">
          {message}
        </p>
      )}

      {action && (
        <div className="mt-8">
          {action.href ? (
            action.variant === 'link' ? (
              <Link
                to={action.href}
                className="font-sans text-sm text-champagne underline-offset-4 hover:underline"
              >
                {action.label}
              </Link>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to={action.href}>{action.label}</Link>
              </Button>
            )
          ) : (
            <Button variant="outline" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
