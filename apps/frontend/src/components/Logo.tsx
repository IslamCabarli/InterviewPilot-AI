import { Link } from 'react-router'
import { cn } from '../lib/cn'

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        'inline-flex items-center gap-2 rounded-md font-display text-base font-semibold tracking-tight',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent',
        className,
      )}
    >
      <span aria-hidden className="h-3 w-3 rounded-full bg-accent" />
      InterviewPilot
    </Link>
  )
}