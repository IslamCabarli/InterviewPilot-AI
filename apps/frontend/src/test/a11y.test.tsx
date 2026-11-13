import { describe, it, vi } from 'vitest'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Register from '../pages/Register'
import Settings from '../pages/Settings'
import { expectNoA11yViolations } from './axe'
import { renderWithProviders } from './render'

vi.mock('../auth/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Islam Cabarli', email: 'islam@example.com' },
    isAuthenticated: true,
    isBootstrapping: false,
  }),
}))

describe('accessibility (axe)', () => {
  it('landing page has no violations', async () => {
    const { container } = renderWithProviders(<Landing />)
    await expectNoA11yViolations(container)
  }, 20_000)

  it('login page has no violations', async () => {
    const { container } = renderWithProviders(<Login />)
    await expectNoA11yViolations(container)
  }, 20_000)

  it('register page has no violations', async () => {
    const { container } = renderWithProviders(<Register />)
    await expectNoA11yViolations(container)
  }, 20_000)

  it('404 page has no violations', async () => {
    const { container } = renderWithProviders(<NotFound />)
    await expectNoA11yViolations(container)
  }, 20_000)

  it('settings page has no violations', async () => {
    const { container } = renderWithProviders(<Settings />)
    await expectNoA11yViolations(container)
  }, 20_000)
})