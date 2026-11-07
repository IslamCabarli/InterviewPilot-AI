import type { ReactNode } from 'react'
import { Check, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

interface OptionCardProps {
  selected: boolean
  onSelect: () => void
  title: string
  description: string
  icon?: LucideIcon
  meta?: ReactNode
}

export default function OptionCard({
                                     selected,
                                     onSelect,
                                     title,
                                     description,
                                     icon: Icon,
                                     meta,
                                   }: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'group flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        selected
          ? 'border-accent bg-accent/5'
          : 'border-border bg-surface hover:border-accent/50',
      )}
    >
      {Icon && (
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors',
            selected
              ? 'border-accent/40 bg-accent/10 text-accent'
              : 'border-border bg-surface-muted text-text-secondary group-hover:text-text-primary',
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="font-display text-sm font-semibold tracking-tight">{title}</span>
          {meta}
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-text-secondary">{description}</span>
      </span>

      <span
        aria-hidden
        className={cn(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
          selected ? 'border-accent bg-accent text-accent-foreground' : 'border-border',
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  )
}