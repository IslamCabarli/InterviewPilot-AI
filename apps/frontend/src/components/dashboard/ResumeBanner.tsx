import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { Interview } from '../../api/interview'
import { getDifficultyLabel, getTypeLabel } from '../interview/options'
import { Card } from '../ui'
import { buttonStyles } from '../ui/buttonStyles'

export default function ResumeBanner({ interview }: { interview: Interview }) {
  const answered = interview.questions.filter((question) => question.answer).length

  return (
    <Card className="flex flex-wrap items-center justify-between gap-4 border-accent/30 bg-accent/5">
      <div className="flex items-center gap-4">
        <span aria-hidden className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
        <div>
          <p className="text-sm font-medium">Bitirilməmiş müsahibən var</p>
          <p className="mt-0.5 text-xs text-text-secondary">
            {getTypeLabel(interview.type)} · {getDifficultyLabel(interview.difficulty)} · {answered}{' '}
            cavab verilib
          </p>
        </div>
      </div>
      <Link to="/interview" className={buttonStyles({ size: 'sm' })}>
        Davam et
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </Card>
  )
}