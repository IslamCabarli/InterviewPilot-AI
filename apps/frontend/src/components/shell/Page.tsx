import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import PageTransition from '../PageTransition'

const widths = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
} as const

interface PageContainerProps {
  size?: keyof typeof widths
  className?: string
  children: ReactNode
}

export function PageContainer({ size = 'lg', className, children }: PageContainerProps) {
  return (
    <PageTransition>
      <div className={cn('mx-auto w-full px-6 py-8 sm:px-8 sm:py-10', widths[size], className)}>
        {children}
      </div>
    </PageTransition>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-text-secondary">{description}</p>}
      </div>
      {actions}
    </div>
  )
}