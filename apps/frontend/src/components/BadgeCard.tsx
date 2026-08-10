import type { Badge } from '../api/gamification'

export default function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <div
      className={`rounded-lg border p-4 text-center transition-opacity ${
        badge.unlocked ? 'border-border bg-surface' : 'border-border bg-surface opacity-40'
      }`}
    >
      <div
        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${
          badge.unlocked ? 'bg-accent/10' : 'bg-text-secondary/10'
        }`}
      >
        <span className={`h-2.5 w-2.5 rounded-full ${badge.unlocked ? 'bg-accent' : 'bg-text-secondary/40'}`} />
      </div>
      <p className="mt-2 text-xs font-medium text-text-primary">{badge.label}</p>
      <p className="mt-0.5 text-[10px] text-text-secondary">{badge.description}</p>
    </div>
  )
}