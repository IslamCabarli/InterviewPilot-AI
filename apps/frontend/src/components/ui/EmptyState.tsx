import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  headingLevel?: 2 | 3
  className?: string
}

export default function EmptyState({
   icon: Icon,
   title,
   description,
   action,
   headingLevel = 2,
   className,
  }: EmptyStateProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <div className={cn('flex flex-col items-center px-6 py-10 text-center', className)}>
      {Icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-muted text-text-secondary">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      )}
      <Heading className={cn('font-display text-base font-semibold tracking-tight', Icon && 'mt-4')}>
        {title}
      </Heading>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}