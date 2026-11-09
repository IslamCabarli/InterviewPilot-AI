import { describe, expect, it, vi } from 'vitest'
import { Route, Routes } from 'react-router'
import { renderWithProviders, screen, within } from '../test/render'
import Layout from './Layout'

vi.mock('../auth/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Islam Cabarli', email: 'islam@example.com' },
    isAuthenticated: true,
    isBootstrapping: false,
  }),
}))
vi.mock('../auth/queries', () => ({
  useLogout: () => ({ mutate: vi.fn(), isPending: false }),
}))

function renderAt(route: string) {
  return renderWithProviders(
    <Routes>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<p>Dashboard məzmunu</p>} />
        <Route path="/interview" element={<p>Müsahibə məzmunu</p>} />
        <Route path="/interviews/:id/report" element={<p>Hesabat məzmunu</p>} />
      </Route>
    </Routes>,
    { route },
  )
}

describe('Layout', () => {
  it('renders the page inside the main landmark', () => {
    renderAt('/dashboard')

    expect(screen.getByRole('main')).toHaveTextContent('Dashboard məzmunu')
  })

  it('offers a skip link to the main content', () => {
    renderAt('/dashboard')

    expect(screen.getByRole('link', { name: 'Məzmuna keç' })).toHaveAttribute('href', '#main')
  })

  it('marks the current page in the sidebar', () => {
    renderAt('/dashboard')

    const sidebar = screen.getByRole('navigation', { name: 'Əsas naviqasiya' })
    expect(within(sidebar).getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')
    expect(within(sidebar).getByRole('link', { name: 'Profil' })).not.toHaveAttribute('aria-current')
  })

  it('keeps the interview section active on the report page', () => {
    renderAt('/interviews/5/report')

    const sidebar = screen.getByRole('navigation', { name: 'Əsas naviqasiya' })
    expect(within(sidebar).getByRole('link', { name: 'Müsahibə' })).toHaveAttribute('aria-current', 'page')
  })

  it('shows the mobile navigation on regular pages', () => {
    renderAt('/dashboard')

    expect(screen.getByRole('navigation', { name: 'Mobil naviqasiya' })).toBeInTheDocument()
  })

  it('hides the mobile navigation during the interview to leave room for the chat', () => {
    renderAt('/interview')

    expect(screen.queryByRole('navigation', { name: 'Mobil naviqasiya' })).not.toBeInTheDocument()
  })
})