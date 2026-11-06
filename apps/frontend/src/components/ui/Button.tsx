import type { ComponentProps } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-foreground hover:bg-accent/90',
  secondary:
    'border border-border bg-surface text-text-primary hover:border-accent hover:text-accent',
  ghost: 'text-text-secondary hover:bg-surface-muted hover:text-text-primary',
  danger: 'bg-danger text-accent-foreground hover:bg-danger/90',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-sm',
}

interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export default function Button({
                                 variant = 'primary',
                                 size = 'md',
                                 loading = false,
                                 disabled,
                                 className,
                                 children,
                                 type = 'button',
                                 ...props
                               }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}