import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '../lib/cn'
import { buttonStyles } from './ui/buttonStyles'

interface ErrorBoundaryProps {
  children: ReactNode
  variant?: 'page' | 'inline'
  /** Bu dəyər dəyişəndə (məs. başqa səhifəyə keçəndə) xəta vəziyyəti sıfırlanır. */
  resetKey?: string
}

interface ErrorBoundaryState {
  error: Error | null
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Runtime error caught by ErrorBoundary:', error, info.componentStack)
  }

  componentDidUpdate(previous: ErrorBoundaryProps) {
    if (this.state.error && previous.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const { variant = 'page' } = this.props
    const Heading = variant === 'page' ? 'h1' : 'h2'

    return (
      <div
        role="alert"
        className={cn(
          'flex flex-col items-center justify-center px-6 text-center',
          variant === 'page' ? 'min-h-dvh bg-bg' : 'py-24',
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-muted text-danger">
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </div>
        <p className="mt-5 font-mono text-sm text-text-secondary">Xəta</p>
        <Heading className="mt-2 font-display text-2xl font-semibold tracking-tight">
          Nəsə düzgün getmədi
        </Heading>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">
          Gözlənilməz xəta baş verdi. Səhifəni yeniləməyi sına, problem davam edərsə GitHub-da bildir.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className={buttonStyles()}>
            Səhifəni yenilə
          </button>
          <a href="/" className={buttonStyles({ variant: 'secondary' })}>
            Ana səhifə
          </a>
        </div>

        {import.meta.env.DEV && (
          <pre className="mt-8 max-w-xl overflow-x-auto rounded-md border border-border bg-surface-muted p-3 text-left font-mono text-xs text-text-secondary">
            {error.message}
          </pre>
        )}
      </div>
    )
  }
}