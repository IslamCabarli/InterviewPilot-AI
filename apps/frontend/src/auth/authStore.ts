import { create } from 'zustand'

const TOKEN_STORAGE_KEY = 'token'

interface AuthState {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
  setToken: (token) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    set({ token })
  },
  clearToken: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    set({ token: null })
  },
}))