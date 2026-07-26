import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authKeys } from './queryKeys'
import { getMeRequest, loginRequest, registerRequest, logoutRequest } from '../api/auth'
import { useAuthStore } from './authStore'
import type { LoginInput, RegisterInput } from '../lib/validation'

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
      // onSettled istifadə edirik ki, logout sorğusu şəbəkə xətası versə belə
      // (məs. token onsuz da etibarsızdır) client-side state hər halda təmizlənsin.
      clearToken()
      queryClient.removeQueries({ queryKey: authKeys.me })
    },
  })
}