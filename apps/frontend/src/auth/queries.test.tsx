import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { logoutRequest } from '../api/auth'
import { useAuthStore } from './authStore'
import { useLogout } from './queries'

vi.mock('../api/auth', () => ({
  getMeRequest: vi.fn(),
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
  logoutRequest: vi.fn(),
}))

function setup() {
  const queryClient = new QueryClient()
  queryClient.setQueryData(['dashboard-stats'], { completedInterviews: 3 })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return { queryClient, ...renderHook(() => useLogout(), { wrapper }) }
}

describe('useLogout', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useAuthStore.setState({ token: 'abc' })
  })

  it('clears the token and every cached query so the next user never sees stale data', async () => {
    vi.mocked(logoutRequest).mockResolvedValue(undefined)
    const { queryClient, result } = setup()

    await act(async () => {
      await result.current.mutateAsync()
    })

    expect(useAuthStore.getState().token).toBeNull()
    expect(queryClient.getQueryData(['dashboard-stats'])).toBeUndefined()
  })

  it('still logs out locally when the server call fails', async () => {
    vi.mocked(logoutRequest).mockRejectedValue(new Error('offline'))
    const { queryClient, result } = setup()

    await act(async () => {
      await result.current.mutateAsync().catch(() => undefined)
    })

    expect(useAuthStore.getState().token).toBeNull()
    expect(queryClient.getQueryData(['dashboard-stats'])).toBeUndefined()
  })
})