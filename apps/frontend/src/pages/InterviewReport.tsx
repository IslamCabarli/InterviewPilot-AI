import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import PageTransition from '../components/PageTransition'
import ScoreBar from '../components/ScoreBar'
import { getInterviewReport } from '../api/interview'

const scoreLabels: Record<string, { label: string; max: number }> = {
  technical: { label: 'Texniki bilik', max: 25 },
  communication: { label: 'Kommunikasiya', max: 20 },
  confidence: { label: 'Özünəinam', max: 15 },
  problem_solving: { label: 'Problem həlli', max: 20 },
  best_practices: { label: 'Best practices', max: 20 },
}

export default function InterviewReport() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['interview-report', id],
    queryFn: () => getInterviewReport(Number(id)),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-3xl px-8 py-16 text-center text-sm text-text-secondary">
          Hesabat yüklənir...
        </div>
      </PageTransition>
    )
  }

  if (isError || !data) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-3xl px-8 py-16 text-center">
          <p className="text-sm text-text-secondary">Hesabat tapılmadı.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-sm text-accent"
          >
            Dashboard-a qayıt
          </button>
        </div>
      </PageTransition>
    )
  }

  const { interview, report } = data

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-8 py-10">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Müsahibə hesabatı
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {interview.type} · {interview.difficulty} səviyyə
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-4xl font-medium text-text-primary">
              {interview.overall_score ?? '—'}
              <span className="text-lg text-text-secondary">/100</span>
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Xülasə
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-primary">{report.summary}</p>
        </div>

        {interview.score_breakdown && (
          <div className="mt-6 rounded-lg border border-border bg-surface p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Bal bölgüsü
            </p>
            <div className="space-y-4">
              {Object.entries(interview.score_breakdown).map(([key, value]) => (
                <ScoreBar
                  key={key}
                  label={scoreLabels[key]?.label ?? key}
                  value={value}
                  max={scoreLabels[key]?.max ?? 25}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-positive">
              Güclü tərəflər
            </p>
            <ul className="mt-3 space-y-2">
              {report.strong_points.map((point, i) => (
                <li key={i} className="text-sm text-text-primary">
                  · {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-red-500">
              Zəif tərəflər
            </p>
            <ul className="mt-3 space-y-2">
              {report.weak_points.map((point, i) => (
                <li key={i} className="text-sm text-text-primary">
                  · {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Tövsiyə olunan mövzular
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.recommended_topics.map((topic, i) => (
              <span
                key={i}
                className="rounded-md border border-border bg-bg px-3 py-1 text-xs font-medium text-text-primary"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate('/interview')}
          className="mt-10 w-full rounded-md bg-accent py-3 text-sm font-medium text-white hover:bg-accent/90"
        >
          Yeni müsahibə başlat
        </button>
      </div>
    </PageTransition>
  )
}