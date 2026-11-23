/* eslint-disable react-refresh/only-export-components */
import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Custom fallback — if omitted, renders default SectionError */
  fallback?: ReactNode
  /** Called after error is caught, useful for error reporting */
  onError?: (error: Error, info: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Class-based error boundary — React 19 still requires class components for this.
 * Wrap sections that fetch data or render dynamic content.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <CampaignHighlights />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info)
    console.error('[ErrorBoundary] Caught:', error, info.componentStack)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <SectionError
          error={this.state.error}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

// ── Section-scoped error UI ────────────────────────────────────────────────────

interface SectionErrorProps {
  error?: Error | null
  onReset?: () => void
}

function SectionError({ onReset }: SectionErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <p className="font-sans text-base text-graphite">İçerik yüklenirken bir hata oluştu.</p>
      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="mt-4"
        >
          Tekrar Dene
        </Button>
      )}
    </div>
  )
}
