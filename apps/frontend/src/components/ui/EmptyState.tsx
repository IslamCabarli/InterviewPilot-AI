import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({
                                     icon: Icon,
                                     title,
                                     description,
                                     action,
                                     className,
                                   }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-10 text-center', className)}>
      {Icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-muted text-text-secondary">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      )}
      <h3 className={cn('font-display text-base font-semibold tracking-tight', Icon && 'mt-4')}>
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}