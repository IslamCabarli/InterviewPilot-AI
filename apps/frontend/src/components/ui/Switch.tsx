import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

interface SwitchProps extends Omit<ComponentProps<'button'>, 'onChange'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export default function Switch({ checked, onCheckedChange, className, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'border-accent bg-accent' : 'border-border-strong bg-surface-muted',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          'block h-4 w-4 rounded-full transition-transform',
          checked ? 'translate-x-6 bg-accent-foreground' : 'translate-x-1 bg-text-secondary',
        )}
      />
    </button>
  )
}