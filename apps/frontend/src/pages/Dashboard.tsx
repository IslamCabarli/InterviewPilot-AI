import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts'
import { useAuth } from '../auth/useAuth'
import { getGamificationStats } from '../api/gamification'
import BadgeCard from '../components/BadgeCard'
import PageTransition from '../components/PageTransition'
import { getDashboardStats, getRecentInterviews  } from '../api/dashboard'
import { useNavigate } from 'react-router'
import { getActiveInterview } from '../api/interview'


function StatCard({
  label,
  value,
  unit,
}: {
  label: string
  value: number
  unit?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </p>

      <p className="mt-2 font-mono text-3xl font-medium text-text-primary">
        {value}
        {unit && (
          <span className="ml-1 text-base text-text-secondary">
            {unit}
          </span>
        )}
      </p>
    </div>
  )
}

export default function Dashboard() {


  const { user } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  })

  const { data: gamification } = useQuery({
    queryKey: ['gamification-stats'],
    queryFn: getGamificationStats,
  })

  const { data: recentInterviews } = useQuery({
    queryKey: ['recent-interviews'],
    queryFn: getRecentInterviews,
  })

  const { data: activeInterview } = useQuery({
    queryKey: ['active-interview'],
    queryFn: getActiveInterview,
  })

  const hasData = (data?.completedInterviews ?? 0) > 0

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-8 py-10">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Xoş gəldin, {user?.name}
            </h1>

            <p className="mt-1 text-sm text-text-secondary">
              Bugünkü tərəqqinə nəzər sal.
            </p>
          </div>

          {gamification && (
            <div className="text-right">
              <p className="font-mono text-2xl font-medium text-text-primary">
                Səviyyə {gamification.level}
              </p>

              <div className="mt-1 h-1 w-32 rounded-full bg-border">
                <div
                  className="h-1 rounded-full bg-accent"
                  style={{
                    width: `${(gamification.xpIntoLevel /
                        gamification.xpForNextLevel) *
                      100
                      }%`,
                  }}
                />
              </div>

              <p className="mt-1 font-mono text-[10px] text-text-secondary">
                {gamification.xpIntoLevel}/{gamification.xpForNextLevel} XP
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="Bugünkü təcrübə"
            value={data?.todayPractice ?? 0}
          />

          <StatCard
            label="Ortalama bal"
            value={data?.averageScore ?? 0}
            unit="/100"
          />

          <StatCard
            label="Tamamlanmış"
            value={data?.completedInterviews ?? 0}
          />

          <StatCard
            label="Seriya"
            value={data?.weeklyStreak ?? 0}
            unit="gün"
          />
        </div>

        {activeInterview && (
          <div className="mt-6 flex items-center justify-between rounded-lg border border-accent/30 bg-accent/5 p-4">
            <p className="text-sm text-text-primary">Bitirilməmiş bir müsahibən var.</p>
            <button
              onClick={() => navigate('/interview')}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
            >
              Davam et
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !hasData && (
          <div className="mt-8 rounded-lg border border-border bg-surface p-8 text-center">
            <p className="text-sm text-text-secondary">
              Hələ heç bir müsahibə keçirməmisən.
            </p>

            <button
              onClick={() => navigate('/interview')}
              className="mt-4 rounded-md bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/90"
            >
              İlk müsahibəni başlat
            </button>
          </div>
        )}

        {/* Charts */}
        {hasData && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Weekly progress */}
            <div className="rounded-lg border border-border bg-surface p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Həftəlik tərəqqi
              </p>

              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.weeklyProgress}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E4E4E7"
                    />

                    <XAxis
                      dataKey="date"
                      tick={{
                        fontSize: 12,
                        fill: '#6B6F76',
                      }}
                      axisLine={{
                        stroke: '#E4E4E7',
                      }}
                    />

                    <YAxis
                      domain={[0, 100]}
                      tick={{
                        fontSize: 12,
                        fill: '#6B6F76',
                      }}
                      axisLine={{
                        stroke: '#E4E4E7',
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: 6,
                        border: '1px solid #E4E4E7',
                        fontSize: 12,
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2554F6"
                      strokeWidth={2}
                      dot={{
                        r: 3,
                        fill: '#2554F6',
                      }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skill radar */}
            <div className="rounded-lg border border-border bg-surface p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Bacarıq xəritəsi
              </p>

              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={data?.skillRadar}>
                    <PolarGrid stroke="#E4E4E7" />

                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{
                        fontSize: 11,
                        fill: '#6B6F76',
                      }}
                    />

                    <Radar
                      dataKey="value"
                      stroke="#2554F6"
                      fill="#2554F6"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Badges */}
        {gamification && (
          <div className="mt-6 rounded-lg border border-border bg-surface p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Nailiyyətlər
            </p>

            <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
              {gamification.badges.map((badge) => (
                <BadgeCard
                  key={badge.key}
                  badge={badge}
                />
              ))}
            </div>
          </div>
        )}
        {recentInterviews && recentInterviews.length > 0 && (
          <div className="mt-6 rounded-lg border border-border bg-surface p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Son müsahibələr
            </p>
            <div className="space-y-2">
              {recentInterviews.map((interview) => (
                <button
                  key={interview.id}
                  onClick={() => navigate(`/interviews/${interview.id}/report`)}
                  className="flex w-full items-center justify-between rounded-md border border-border px-4 py-3 text-left hover:border-accent"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {interview.type} · {interview.difficulty}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(interview.completed_at).toLocaleDateString('az-AZ')}
                    </p>
                  </div>
                  <p className="font-mono text-lg font-medium text-text-primary">
                    {interview.overall_score ?? '—'}
                    <span className="text-xs text-text-secondary">/100</span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
        {/* New interview */}
        <div className="mt-6 rounded-lg border border-border bg-surface p-6 text-center">
          <button
            onClick={() => navigate('/interview')}
            className="rounded-md bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            Yeni müsahibə başlat
          </button>
        </div>

      </div>
    </PageTransition>
  )
}