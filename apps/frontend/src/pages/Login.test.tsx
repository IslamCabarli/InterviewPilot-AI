import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '../test/render.tsx'
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

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Şifrə')).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Login />)

    await user.click(screen.getByRole('button', { name: /daxil ol/i }))

    expect(await screen.findByText(/düzgün email daxil edin/i)).toBeInTheDocument()
  })

  it('shows an error for invalid email format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Login />)

    await user.type(screen.getByPlaceholderText('Email'), 'not-an-email')
    await user.type(screen.getByPlaceholderText('Şifrə'), 'somepassword')
    await user.click(screen.getByRole('button', { name: /daxil ol/i }))

    expect(await screen.findByText(/düzgün email daxil edin/i)).toBeInTheDocument()
  })
})