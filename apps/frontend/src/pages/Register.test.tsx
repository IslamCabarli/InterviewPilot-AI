import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '../test/render'
import Register from './Register'

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe('Register', () => {
  it('renders all registration fields', () => {
    renderWithProviders(<Register />)

    expect(screen.getByPlaceholderText('Ad Soyad')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Şifrə')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Şifrəni təsdiqlə')).toBeInTheDocument()
  })

  it('shows an error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Register />)

    await user.type(screen.getByPlaceholderText('Ad Soyad'), 'Test User')
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Şifrə'), 'password123')
    await user.type(screen.getByPlaceholderText('Şifrəni təsdiqlə'), 'different123')
    await user.click(screen.getByRole('button', { name: /qeydiyyatdan keç/i }))

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument()
  })

  it('shows an error for a short password', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Register />)

    await user.type(screen.getByPlaceholderText('Şifrə'), 'short')
    await user.click(screen.getByRole('button', { name: /qeydiyyatdan keç/i }))

    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument()
  })
})