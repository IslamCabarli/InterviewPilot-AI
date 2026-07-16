import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import PageTransition from '../components/PageTransition'

// Hələ backend endpoint-i yoxdur — statik data ilə struktur qururuq
const fetchDashboardStats = async () => {
  await new Promise((r) => setTimeout(r, 300))
  return {
    todayPractice: 0,
    averageScore: 0,
    completedInterviews: 0,
    weeklyStreak: 0,
  }
}

function StatCard({ label, value, unit }: { label: string; value: number; unit?: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </p>
      <p className="mt-2 font-mono text-3xl font-medium text-text-primary">
        {value}
        {unit && <span className="ml-1 text-base text-text-secondary">{unit}</span>}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const { data } = useQuery({ queryKey: ['dashboard-stats'], queryFn: fetchDashboardStats })

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-8 py-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Xoş gəldin, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Bugünkü tərəqqinə nəzər sal.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Bugünkü təcrübə" value={data?.todayPractice ?? 0} />
          <StatCard label="Ortalama bal" value={data?.averageScore ?? 0} unit="/100" />
          <StatCard label="Tamamlanmış" value={data?.completedInterviews ?? 0} />
          <StatCard label="Həftəlik seriya" value={data?.weeklyStreak ?? 0} unit="gün" />
        </div>

        <div className="mt-8 rounded-lg border border-border bg-surface p-8 text-center">
          <p className="text-sm text-text-secondary">
            Hələ heç bir müsahibə keçirməmisən.
          </p>
          <button className="mt-4 rounded-md bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/90">
            İlk müsahibəni başlat
          </button>
        </div>
      </div>
    </PageTransition>
  )
}