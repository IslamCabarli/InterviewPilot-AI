import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { getDashboardStats, type DashboardStats } from '../api/dashboard'
import { getGamificationStats, type GamificationStats } from '../api/gamification'
import { getActiveInterview } from '../api/interview'
import { renderWithProviders, screen, within } from '../test/render'
import Dashboard from './Dashboard'

vi.mock('../api/dashboard', () => ({ getDashboardStats: vi.fn() }))
vi.mock('../api/gamification', () => ({ getGamificationStats: vi.fn() }))
vi.mock('../api/interview', () => ({ getActiveInterview: vi.fn() }))
vi.mock('../auth/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Islam Cabarli', email: 'islam@example.com' },
    isAuthenticated: true,
    isBootstrapping: false,
  }),
}))
vi.mock('../components/dashboard/WeeklyProgressChart', () => ({
  default: () => <div data-testid="weekly-chart" />,
}))
vi.mock('../components/dashboard/SkillRadarChart', () => ({
  default: () => <div data-testid="radar-chart" />,
}))

const stats: DashboardStats = {
  todayPractice: 1,
  averageScore: 82,
  completedInterviews: 4,
  weeklyStreak: 3,
  weeklyProgress: [],
  skillRadar: [],
}

const gamification: GamificationStats = {
  totalXp: 320,
  level: 2,
  xpIntoLevel: 120,
  xpForNextLevel: 200,
  streak: 3,
  badges: [
    { key: 'a', label: 'İlk addım', description: 'İlk müsahibəni tamamla', unlocked: true },
    { key: 'b', label: 'Davamlılıq', description: '5 müsahibə tamamla', unlocked: false },
  ],
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(getDashboardStats).mockResolvedValue(stats)
    vi.mocked(getGamificationStats).mockResolvedValue(gamification)
    vi.mocked(getActiveInterview).mockResolvedValue(null)
  })

  it('shows skeletons while the data loads', () => {
    vi.mocked(getDashboardStats).mockReturnValue(new Promise<DashboardStats>(() => {}))
    vi.mocked(getGamificationStats).mockReturnValue(new Promise<GamificationStats>(() => {}))
    renderWithProviders(<Dashboard />)

    expect(screen.getByRole('status', { name: 'Statistikalar yüklənir' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Qrafiklər yüklənir' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Nailiyyətlər yüklənir' })).toBeInTheDocument()
  })

  it('greets the user and shows the stats, level and streak', async () => {
    renderWithProviders(<Dashboard />)

    expect(await screen.findByRole('heading', { name: 'Salam, Islam' })).toBeInTheDocument()
    expect(screen.getByText(/3 gündür ardıcıl təcrübə/)).toBeInTheDocument()
    expect(within(screen.getByRole('group', { name: 'Ortalama bal' })).getByText('82')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Ortalama bal' })).toHaveTextContent('82/100')
    expect(screen.getByRole('group', { name: 'Tamamlanmış' })).toHaveTextContent('4')
    expect(screen.getByText('Səviyyə 2')).toBeInTheDocument()
  })

  it('shows the charts and badges once there is data', async () => {
    renderWithProviders(<Dashboard />)

    expect(await screen.findByTestId('weekly-chart')).toBeInTheDocument()
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument()
    expect(await screen.findByText('1/2')).toBeInTheDocument()
  })

  it('invites a new user to start the first interview instead of showing empty charts', async () => {
    vi.mocked(getDashboardStats).mockResolvedValue({ ...stats, completedInterviews: 0, weeklyStreak: 0 })
    renderWithProviders(<Dashboard />)

    expect(await screen.findByText('Hələ müsahibə keçirməmisən')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'İlk müsahibəni başlat' })).toHaveAttribute('href', '/interview')
    expect(screen.queryByTestId('weekly-chart')).not.toBeInTheDocument()
  })

  it('offers to resume an unfinished interview', async () => {
    vi.mocked(getActiveInterview).mockResolvedValue({
      id: 7,
      type: 'backend',
      difficulty: 'medium',
      status: 'in_progress',
      questions: [
        {
          id: 1,
          interview_id: 7,
          content: 'A',
          order: 1,
          answer: { id: 1, question_id: 1, content: 'cavab', score: null, ai_feedback: null },
        },
        { id: 2, interview_id: 7, content: 'B', order: 2, answer: null },
      ],
    })
    renderWithProviders(<Dashboard />)

    expect(await screen.findByText('Bitirilməmiş müsahibən var')).toBeInTheDocument()
    expect(screen.getByText(/1 cavab verilib/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Davam et' })).toHaveAttribute('href', '/interview')
  })

  it('lets the user retry when the stats fail to load', async () => {
    vi.mocked(getDashboardStats).mockRejectedValueOnce(new Error('offline')).mockResolvedValue(stats)
    const user = userEvent.setup()
    renderWithProviders(<Dashboard />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Statistikanı yükləmək mümkün olmadı.')

    await user.click(screen.getByRole('button', { name: 'Yenidən yoxla' }))

    expect(await screen.findByRole('group', { name: 'Ortalama bal' })).toBeInTheDocument()
  })
})