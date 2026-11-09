import { Award, Lock } from 'lucide-react'
import type { Badge } from '../api/gamification'
import { cn } from '../lib/cn'

export default function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <div
      className={cn(
        'flex h-full flex-col items-center rounded-lg border border-border p-4 text-center',
        badge.unlocked ? 'bg-surface' : 'bg-surface-muted',
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full',
          badge.unlocked ? 'bg-accent/10 text-accent' : 'bg-border/60 text-text-secondary',
        )}
      >
        {badge.unlocked ? (
          <Award className="h-4 w-4" aria-hidden />
        ) : (
          <Lock className="h-4 w-4" aria-hidden />
        )}
      </div>
      <p className={cn('mt-2 text-xs font-medium', !badge.unlocked && 'text-text-secondary')}>
        {badge.label}
      </p>
      <p className="mt-0.5 text-[11px] leading-snug text-text-secondary">{badge.description}</p>
      <span className="sr-only">{badge.unlocked ? 'Qazanılıb' : 'Kilidli'}</span>
    </div>
  )
}