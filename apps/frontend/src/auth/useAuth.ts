import { useAuthStore } from './authStore'
import { useCurrentUser } from './queries'

export function useAuth() {
  const token = useAuthStore((s) => s.token)
  const { data: user, isLoading } = useCurrentUser()

  return {
    user,
    isAuthenticated: !!token && !!user,
    isBootstrapping: !!token && isLoading,
  }
}