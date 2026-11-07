import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Target, type LucideIcon } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { getInterviewReport } from '../api/interview'
import ScoreBar from '../components/ScoreBar'
import PageTransition from '../components/PageTransition'
import { getDifficultyLabel, getTypeLabel } from '../components/interview/options'
import ScoreRing, { type ScoreTone } from '../components/interview/ScoreRing'
import { Badge, Card, Eyebrow, Skeleton } from '../components/ui'
import { buttonStyles } from '../components/ui/buttonStyles'
import { cn } from '../lib/cn'

type ReportData = Awaited<ReturnType<typeof getInterviewReport>>

const scoreLabels: Record<string, { label: string; max: number }> = {
  technical: { label: 'Texniki bilik', max: 25 },
  communication: { label: 'Kommunikasiya', max: 20 },
  confidence: { label: 'Özünəinam', max: 15 },
  problem_solving: { label: 'Problem həlli', max: 20 },
  best_practices: { label: 'Best practices', max: 20 },
}

function getVerdict(score: number): { label: string; tone: ScoreTone } {
  if (score >= 85) return { label: 'Əla nəticə', tone: 'positive' }
  if (score >= 70) return { label: 'Yaxşı nəticə', tone: 'positive' }
  if (score >= 50) return { label: 'Orta nəticə', tone: 'accent' }
  return { label: 'İnkişaf etməlisən', tone: 'danger' }
}

function PointList({
                     title,
                     icon: Icon,
                     iconClass,
                     dotClass,
                     items,
                     emptyText,
                   }: {
  title: string
  icon: LucideIcon
  iconClass: string
  dotClass: string
  items: string[]
  emptyText: string
}) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <Icon className={cn('h-4 w-4', iconClass)} aria-hidden />
        <Eyebrow>{title}</Eyebrow>
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex gap-3 text-sm leading-relaxed">
              <span aria-hidden className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', dotClass)} />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-text-secondary">{emptyText}</p>
      )}
    </Card>
  )
}

function ReportSkeleton() {
  return (
    <div role="status" aria-label="Hesabat yüklənir" className="mt-6 space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-52 w-full" />
      <Skeleton className="h-48 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  )
}

function ReportMissing() {
  return (
    <Card className="mt-6 py-12 text-center">
      <p className="text-sm text-text-secondary">Hesabat tapılmadı.</p>
      <Link to="/dashboard" className={buttonStyles({ variant: 'secondary', className: 'mt-4' })}>
        Dashboard-a qayıt
      </Link>
    </Card>
  )
}

function ReportContent({ data }: { data: ReportData }) {
  const { interview, report } = data
  const score = interview.overall_score
  const breakdown = interview.score_breakdown
  const verdict = score === null ? null : getVerdict(score)

  return (
    <div className="mt-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Müsahibə hesabatı</h1>
        <div className="mt-3 flex items-center gap-2">
          <Badge>{getTypeLabel(interview.type)}</Badge>
          <Badge>{getDifficultyLabel(interview.difficulty)}</Badge>
        </div>
      </div>

      <Card className="flex flex-col items-center gap-8 p-8 text-center md:flex-row md:text-left">
        {score !== null && verdict ? (
          <>
            <ScoreRing score={score} tone={verdict.tone} />
            <div>
              <Eyebrow>Ümumi nəticə</Eyebrow>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                {verdict.label}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{report.summary}</p>
            </div>
          </>
        ) : (
          <div>
            <Eyebrow>Ümumi nəticə</Eyebrow>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              Qiymətləndirmə tamamlanmadı
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{report.summary}</p>
            <p className="mt-2 text-sm text-text-secondary">
              AI bu müsahibə üçün bal hesablaya bilmədi. Yenidən müsahibə keçməyi sına.
            </p>
          </div>
        )}
      </Card>

      {breakdown && (
        <Card className="p-8">
          <Eyebrow>Bal bölgüsü</Eyebrow>
          <div className="mt-6 space-y-5">
            {Object.entries(breakdown).map(([key, value], index) => (
              <ScoreBar
                key={key}
                label={scoreLabels[key]?.label ?? key}
                value={value}
                max={scoreLabels[key]?.max ?? 25}
                delay={0.15 + index * 0.08}
              />
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <PointList
          title="Güclü tərəflər"
          icon={CheckCircle2}
          iconClass="text-positive"
          dotClass="bg-positive"
          items={report.strong_points}
          emptyText="Qeyd olunmayıb."
        />
        <PointList
          title="İnkişaf nöqtələri"
          icon={Target}
          iconClass="text-danger"
          dotClass="bg-danger"
          items={report.weak_points}
          emptyText="Qeyd olunmayıb."
        />
      </div>

      {report.recommended_topics.length > 0 && (
        <Card className="p-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-accent" aria-hidden />
            <Eyebrow>Öyrənməli mövzular</Eyebrow>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {report.recommended_topics.map((topic, index) => (
              <Badge key={index} className="px-3 py-1 text-sm text-text-primary">
                {topic}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link to="/interview" className={buttonStyles({ size: 'lg' })}>
          Yeni müsahibə başlat
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link to="/dashboard" className={buttonStyles({ variant: 'secondary', size: 'lg' })}>
          Dashboard
        </Link>
      </div>
    </div>
  )
}

export default function InterviewReport() {
  const { id } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['interview-report', id],
    queryFn: () => getInterviewReport(Number(id)),
    enabled: !!id,
  })

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8">
        <Link
          to="/dashboard"
          className={buttonStyles({ variant: 'ghost', size: 'sm', className: '-ml-3' })}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Dashboard
        </Link>

        {isLoading && <ReportSkeleton />}
        {!isLoading && (isError || !data) && <ReportMissing />}
        {data && <ReportContent data={data} />}
      </div>
    </PageTransition>
  )
}