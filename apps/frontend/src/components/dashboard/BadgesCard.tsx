import type { Badge } from '../../api/gamification'
import BadgeCard from '../BadgeCard'
import { Card, Eyebrow } from '../ui'

export default function BadgesCard({ badges }: { badges: Badge[] }) {
  const unlocked = badges.filter((badge) => badge.unlocked).length

  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <Eyebrow>Nailiyyətlər</Eyebrow>
        <span className="font-mono text-xs text-text-secondary">
          {unlocked}/{badges.length}
        </span>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {badges.map((badge) => (
          <li key={badge.key}>
            <BadgeCard badge={badge} />
          </li>
        ))}
      </ul>
    </Card>
  )
}