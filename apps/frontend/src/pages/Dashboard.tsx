import { useQuery } from '@tanstack/react-query'
import { Mic } from 'lucide-react'
import { Link } from 'react-router'
import { lazy, Suspense } from 'react'
import { getDashboardStats, getRecentInterviews  } from '../api/dashboard'
import RecentInterviews from '../components/dashboard/RecentInterviews'
import { getGamificationStats } from '../api/gamification'
import { getActiveInterview } from '../api/interview'
import { useAuth } from '../auth/useAuth'
import BadgesCard from '../components/dashboard/BadgesCard'
import { LevelProgress, LevelProgressSkeleton } from '../components/dashboard/LevelProgress'
import ResumeBanner from '../components/dashboard/ResumeBanner'
import SectionError from '../components/dashboard/SectionError'
import { BadgesSkeleton, ChartsSkeleton, RecentSkeleton, StatsSkeleton } from '../components/dashboard/skeletons'
import StatCard from '../components/dashboard/StatCard'
import { PageContainer, PageHeader } from '../components/shell/Page'
import { Card, EmptyState } from '../components/ui'
import { buttonStyles } from '../components/ui/buttonStyles'
const WeeklyProgressChart = lazy(() => import('../components/dashboard/WeeklyProgressChart'))
const SkillRadarChart = lazy(() => import('../components/dashboard/SkillRadarChart'))

export default function Dashboard() {
  const { user } = useAuth()

  const stats = useQuery({ queryKey: ['dashboard-stats'], queryFn: getDashboardStats })
  const gamification = useQuery({ queryKey: ['gamification-stats'], queryFn: getGamificationStats })
  const active = useQuery({ queryKey: ['active-interview'], queryFn: getActiveInterview })
  const recent = useQuery({ queryKey: ['recent-interviews'], queryFn: getRecentInterviews })

  const firstName = user?.name?.trim().split(/\s+/)[0]
  const hasData = (stats.data?.completedInterviews ?? 0) > 0
  const streak = stats.data?.weeklyStreak ?? 0

  const levelProgress = gamification.data ? (
    <LevelProgress
      level={gamification.data.level}
      xpIntoLevel={gamification.data.xpIntoLevel}
      xpForNextLevel={gamification.data.xpForNextLevel}
    />
  ) : gamification.isPending ? (
    <LevelProgressSkeleton />
  ) : null

  return (
    <PageContainer>
      <PageHeader
        title={firstName ? `Salam, ${firstName}` : 'Salam'}
        description={
          streak > 0 ? `${streak} gündür ardıcıl təcrübə edirsən. Belə davam et.` : 'Bugünkü tərəqqinə nəzər sal.'
        }
        actions={levelProgress}
      />

      <div className="mt-8 space-y-6">
        {active.data && <ResumeBanner interview={active.data} />}

        {stats.isPending ? (
          <>
            <StatsSkeleton />
            <ChartsSkeleton />
          </>
        ) : stats.isError ? (
          <SectionError
            message="Statistikanı yükləmək mümkün olmadı."
            onRetry={() => void stats.refetch()}
            retrying={stats.isFetching}
          />
        ) : (
          <>
            <section aria-label="Statistika" className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatCard label="Bugünkü təcrübə" value={stats.data.todayPractice} />
              <StatCard label="Ortalama bal" value={stats.data.averageScore} unit="/100" />
              <StatCard label="Tamamlanmış" value={stats.data.completedInterviews} />
              <StatCard label="Seriya" value={stats.data.weeklyStreak} unit="gün" />
            </section>

            {hasData ? (
              <Suspense fallback={<ChartsSkeleton />}>
                <div className="grid gap-4 lg:grid-cols-2">
                  <WeeklyProgressChart data={stats.data.weeklyProgress} />
                  <SkillRadarChart data={stats.data.skillRadar} />
                </div>
              </Suspense>
            ) : (
              <Card>
                <EmptyState
                  icon={Mic}
                  title="Hələ müsahibə keçirməmisən"
                  description="İlk müsahibəni tamamla: statistikan, bal qrafikin və bacarıq xəritən burada görünəcək."
                  action={
                    <Link to="/interview" className={buttonStyles()}>
                      İlk müsahibəni başlat
                    </Link>
                  }
                />
              </Card>
            )}
            {hasData &&
              (recent.isPending ? (
                <RecentSkeleton />
              ) : recent.isError ? (
                <SectionError
                  message="Son müsahibələri yükləmək mümkün olmadı."
                  onRetry={() => void recent.refetch()}
                  retrying={recent.isFetching}
                />
              ) : (
                <RecentInterviews interviews={recent.data} />
              ))}
          </>
        )}

        {gamification.isPending ? (
          <BadgesSkeleton />
        ) : gamification.isError ? (
          <SectionError
            message="Nailiyyətləri yükləmək mümkün olmadı."
            onRetry={() => void gamification.refetch()}
            retrying={gamification.isFetching}
          />
        ) : (
          <BadgesCard badges={gamification.data.badges} />
        )}
      </div>
    </PageContainer>
  )
}