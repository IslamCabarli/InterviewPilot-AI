import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import type { RecentInterview } from '../../api/dashboard'
import { getScoreTone } from '../../lib/score'
import { getDifficultyLabel, getTypeLabel } from '../interview/options'
import { Badge, Card, Eyebrow } from '../ui'
import { formatDate } from '../../lib/dates'


export default function RecentInterviews({ interviews }: { interviews: RecentInterview[] }) {
  if (interviews.length === 0) return null

  return (
    <Card className="p-0">
      <div className="flex items-baseline justify-between px-6 pb-3 pt-6">
        <Eyebrow>Son müsahibələr</Eyebrow>
        <span className="font-mono text-xs text-text-secondary">Son {interviews.length}</span>
      </div>

      <ul className="divide-y divide-border border-t border-border">
        {interviews.map((interview) => (
          <li key={interview.id}>
            <Link
              to={`/interviews/${interview.id}/report`}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{getTypeLabel(interview.type)}</p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {getDifficultyLabel(interview.difficulty)}
                  {formatDate(interview.completed_at) && ` · ${formatDate(interview.completed_at)}`}
                </p>
              </div>

              {interview.overall_score === null ? (
                <span className="font-mono text-sm text-text-secondary">—</span>
              ) : (
                <Badge tone={getScoreTone(interview.overall_score)} className="font-mono">
                  {interview.overall_score}/100
                </Badge>
              )}

              <ChevronRight className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}