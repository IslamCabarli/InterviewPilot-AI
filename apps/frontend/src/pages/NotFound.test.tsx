import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders, screen } from '../test/render'
import NotFound from './NotFound'

const auth = vi.hoisted(() => ({ isAuthenticated: false }))

vi.mock('../auth/useAuth', () => ({
  useAuth: () => ({ user: undefined, isAuthenticated: auth.isAuthenticated, isBootstrapping: false }),
}))

describe('NotFound', () => {
  beforeEach(() => {
    auth.isAuthenticated = false
  })

  it('explains the problem with a single main heading', () => {
    renderWithProviders(<NotFound />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Səhifə tapılmadı')
  })

  it('sends guests back to the landing page', () => {
    renderWithProviders(<NotFound />)

    expect(screen.getByRole('link', { name: 'Ana səhifəyə qayıt' })).toHaveAttribute('href', '/')
  })

  it('sends signed-in users back to the dashboard', () => {
    auth.isAuthenticated = true
    renderWithProviders(<NotFound />)

    expect(screen.getByRole('link', { name: 'Dashboard-a qayıt' })).toHaveAttribute('href', '/dashboard')
  })
})