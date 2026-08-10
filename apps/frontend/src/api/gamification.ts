import { api } from '../lib/axios'

export interface Badge {
  key: string
  label: string
  description: string
  unlocked: boolean
}

export interface GamificationStats {
  totalXp: number
  level: number
  xpIntoLevel: number
  xpForNextLevel: number
  streak: number
  badges: Badge[]
}

export const getGamificationStats = async (): Promise<GamificationStats> => {
  const res = await api.get<GamificationStats>('/gamification/stats')
  return res.data
}