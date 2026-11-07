import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '../test/render'
import Login from './Login'

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe('Login', () => {
  it('renders email and password fields', () => {
    renderWithProviders(<Login />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Şifrə')).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Login />)

    await user.click(screen.getByRole('button', { name: 'Daxil ol' }))

    expect(await screen.findByText('Düzgün email daxil edin')).toBeInTheDocument()
    expect(screen.getByText('Şifrə tələb olunur')).toBeInTheDocument()
  })

  it('shows an error for an invalid email format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Login />)

    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.type(screen.getByLabelText('Şifrə'), 'somepassword')
    await user.click(screen.getByRole('button', { name: 'Daxil ol' }))

    expect(await screen.findByText('Düzgün email daxil edin')).toBeInTheDocument()
  })

  it('links to registration', () => {
    renderWithProviders(<Login />)

    expect(screen.getByRole('link', { name: 'Qeydiyyatdan keç' })).toHaveAttribute('href', '/register')
  })
})