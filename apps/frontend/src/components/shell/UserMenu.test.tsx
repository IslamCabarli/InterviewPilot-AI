import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '../../test/render'
import UserMenu from './UserMenu'

const { logout } = vi.hoisted(() => ({ logout: vi.fn() }))

vi.mock('../../auth/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Islam Cabarli', email: 'islam@example.com' },
    isAuthenticated: true,
    isBootstrapping: false,
  }),
}))
vi.mock('../../auth/queries', () => ({
  useLogout: () => ({ mutate: logout, isPending: false }),
}))

describe('UserMenu', () => {
  beforeEach(() => {
    logout.mockClear()
  })

  it('shows the initials and keeps the menu closed', () => {
    renderWithProviders(<UserMenu />)

    const trigger = screen.getByRole('button', { name: 'Hesab menyusu' })
    expect(trigger).toHaveTextContent('IC')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('islam@example.com')).not.toBeInTheDocument()
  })

  it('opens with the account details and navigation links', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserMenu />)

    await user.click(screen.getByRole('button', { name: 'Hesab menyusu' }))

    expect(screen.getByText('islam@example.com')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Profil' })).toHaveAttribute('href', '/profile')
    expect(screen.getByRole('link', { name: 'Tənzimləmələr' })).toHaveAttribute('href', '/settings')
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserMenu />)

    const trigger = screen.getByRole('button', { name: 'Hesab menyusu' })
    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(screen.queryByText('islam@example.com')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes when clicking outside', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserMenu />)

    await user.click(screen.getByRole('button', { name: 'Hesab menyusu' }))
    await user.click(document.body)

    expect(screen.queryByText('islam@example.com')).not.toBeInTheDocument()
  })

  it('logs the user out', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserMenu />)

    await user.click(screen.getByRole('button', { name: 'Hesab menyusu' }))
    await user.click(screen.getByRole('button', { name: 'Çıxış' }))

    expect(logout).toHaveBeenCalledTimes(1)
  })
})