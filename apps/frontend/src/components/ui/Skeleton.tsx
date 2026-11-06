import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

export default function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div aria-hidden className={cn('animate-pulse rounded-md bg-border', className)} {...props} />
}