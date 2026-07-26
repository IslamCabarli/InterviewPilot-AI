import { api } from '../lib/axios'
import type { LoginInput, RegisterInput } from '../lib/validation'

export interface User {
  id: number
  name: string
  email: string
  roles?: string[]
}

interface AuthResponse {
  user: User
  token: string
}

export const registerRequest = async (data: RegisterInput): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/register', data)
  return res.data
}

export const loginRequest = async (data: LoginInput): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/login', data)
  return res.data
}

export const logoutRequest = async (): Promise<void> => {
  await api.post('/auth/logout')
}

export const getMeRequest = async (): Promise<User> => {
  const res = await api.get<User>('/auth/me')
  return res.data
}