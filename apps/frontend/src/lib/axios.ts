import axios from 'axios'
import { useAuthStore } from '../auth/authStore'
import { queryClient } from '../app/queryClient'
import { authKeys } from '../auth/queryKeys'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Bizim backend-də login/register yanlış credential-lar üçün 422 qaytarır
    // (bax: AuthController — ValidationException), 401 yalnız etibarsız/vaxtı
    // keçmiş token deməkdir. Ona görə 401-i qeydsiz-şərtsiz qlobal logout kimi
    // işləmək təhlükəsizdir.
    if (error.response?.status === 401) {
      useAuthStore.getState().clearToken()
      queryClient.removeQueries({ queryKey: authKeys.me })
    }
    return Promise.reject(error)
  },
)
