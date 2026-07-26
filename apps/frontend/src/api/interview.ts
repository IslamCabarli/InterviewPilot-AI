import { api } from '../lib/axios'

export interface Answer {
  id: number
  question_id: number
  content: string
  score: number | null
  ai_feedback: string | null
}

export interface Question {
  id: number
  interview_id: number
  content: string
  order: number
  answer: Answer | null
}

export interface Interview {
  id: number
  type: string
  difficulty: string
  status: 'in_progress' | 'completed' | 'cancelled'
  questions: Question[]
}

export const startInterview = async (type: string, difficulty: string) => {
  const res = await api.post<{ interview: Interview; question: Question }>('/interviews', {
    type,
    difficulty,
  })
  return res.data
}

export const submitAnswer = async (interviewId: number, questionId: number, content: string) => {
  const res = await api.post<{ question: Question }>(`/interviews/${interviewId}/answer`, {
    question_id: questionId,
    content,
  })
  return res.data
}

export const getInterview = async (interviewId: number) => {
  const res = await api.get<{ interview: Interview }>(`/interviews/${interviewId}`)
  return res.data.interview
}

export const completeInterview = async (interviewId: number) => {
  const res = await api.post<{ interview: Interview }>(`/interviews/${interviewId}/complete`)
  return res.data.interview
}