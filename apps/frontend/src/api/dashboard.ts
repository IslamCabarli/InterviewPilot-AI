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