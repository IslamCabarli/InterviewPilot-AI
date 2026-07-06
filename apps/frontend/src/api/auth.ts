import { api } from '../lib/axios'
import type { RegisterInput, LoginInput } from '../lib/validation'

interface AuthResponse {
    user: { id: number; name: string; email: string }
    token: string
}

export const registerUser = async (data: RegisterInput): Promise<AuthResponse> => {
    const res = await api.post('/register', data)
    return res.data
}

export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
    const res = await api.post('/login', data)
    return res.data
}