import { api } from '../lib/axios'

export interface WeeklyProgressPoint {
  date: string
  score: number | null
}

export interface SkillRadarPoint {
  skill: string
  value: number
  max?: number
}

export interface DashboardStats {
  todayPractice: number
  averageScore: number
  completedInterviews: number
  weeklyStreak: number
  weeklyProgress: WeeklyProgressPoint[]
  skillRadar: SkillRadarPoint[]
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get<DashboardStats>('/dashboard/stats')
  return res.data
}