import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

type Tone = 'neutral' | 'accent' | 'positive' | 'danger'

const tones: Record<Tone, string> = {
  neutral: 'border-border text-text-secondary',
  accent: 'border-accent/30 bg-accent/10 text-accent',
  positive: 'border-positive/30 bg-positive/10 text-positive',
  danger: 'border-danger/30 bg-danger/10 text-danger',
}

interface BadgeProps extends ComponentProps<'span'> {
  tone?: Tone
}

export default function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}