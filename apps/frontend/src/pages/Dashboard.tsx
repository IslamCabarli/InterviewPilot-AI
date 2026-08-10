import { useQuery } from '@tanstack/react-query'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts'
import { useAuth } from '../auth/useAuth'
import PageTransition from '../components/PageTransition'
import { getDashboardStats } from '../api/dashboard'
import { useNavigate } from 'react-router'

function StatCard({ label, value, unit }: { label: string; value: number; unit?: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-2 font-mono text-3xl font-medium text-text-primary">
        {value}
        {unit && <span className="ml-1 text-base text-text-secondary">{unit}</span>}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({ queryKey: ['dashboard-stats'], queryFn: getDashboardStats })

  const hasData = (data?.completedInterviews ?? 0) > 0

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-8 py-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Xoş gəldin, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">Bugünkü tərəqqinə nəzər sal.</p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Bugünkü təcrübə" value={data?.todayPractice ?? 0} />
          <StatCard label="Ortalama bal" value={data?.averageScore ?? 0} unit="/100" />
          <StatCard label="Tamamlanmış" value={data?.completedInterviews ?? 0} />
          <StatCard label="Seriya" value={data?.weeklyStreak ?? 0} unit="gün" />
        </div>

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

        {hasData && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Həftəlik tərəqqi
              </p>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B6F76' }} axisLine={{ stroke: '#E4E4E7' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6B6F76' }} axisLine={{ stroke: '#E4E4E7' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 6, border: '1px solid #E4E4E7', fontSize: 12 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2554F6"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#2554F6' }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Bacarıq xəritəsi
              </p>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={data?.skillRadar}>
                    <PolarGrid stroke="#E4E4E7" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#6B6F76' }} />
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