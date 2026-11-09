import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMeRequest, loginRequest, logoutRequest, registerRequest } from '../api/auth'
import { useAuthStore } from './authStore'
import { authKeys } from './queryKeys'

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: authKeys.me,
    queryFn: getMeRequest,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const setToken = useAuthStore((s) => s.setToken)

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      queryClient.removeQueries()
      setToken(data.token)
      queryClient.setQueryData(authKeys.me, data.user)
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  const setToken = useAuthStore((s) => s.setToken)

  return useMutation({
    mutationFn: registerRequest,
    onSuccess: (data) => {
      queryClient.removeQueries()
      setToken(data.token)
      queryClient.setQueryData(authKeys.me, data.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const clearToken = useAuthStore((s) => s.clearToken)

  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      // Server sorğusu uğursuz olsa belə (məs. token onsuz da etibarsızdır), lokal vəziyyət təmizlənir
      clearToken()
      queryClient.removeQueries()
    },
  })
}