import { api } from '../lib/axios'

export interface DashboardStats {
  todayPractice: number
  averageScore: number
  completedInterviews: number
  weeklyStreak: number
  weeklyProgress: { date: string; score: number | null }[]
  skillRadar: { skill: string; value: number }[]
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get<DashboardStats>('/dashboard/stats')
  return res.data
}

export interface RecentInterview {
  id: number
  type: string
  difficulty: string
  overall_score: number | null
  completed_at: string
}

export const getRecentInterviews = async (): Promise<RecentInterview[]> => {
  const res = await api.get<{ interviews: RecentInterview[] }>('/dashboard/recent-interviews')
  return res.data.interviews
}