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

    expect(screen.getByLabelText('Ad Soyad')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Şifrə')).toBeInTheDocument()
    expect(screen.getByLabelText('Şifrəni təsdiqlə')).toBeInTheDocument()
  })

  it('shows an error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Register />)

    await user.type(screen.getByLabelText('Ad Soyad'), 'Test User')
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Şifrə'), 'password123')
    await user.type(screen.getByLabelText('Şifrəni təsdiqlə'), 'different123')
    await user.click(screen.getByRole('button', { name: 'Qeydiyyatdan keç' }))

    expect(await screen.findByText('Şifrələr uyğun gəlmir')).toBeInTheDocument()
  })

  it('shows an error for a short password', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Register />)

    await user.type(screen.getByLabelText('Şifrə'), 'short')
    await user.click(screen.getByRole('button', { name: 'Qeydiyyatdan keç' }))

    expect(await screen.findByText('Şifrə ən azı 8 simvol olmalıdır')).toBeInTheDocument()
  })

  it('links to login', () => {
    renderWithProviders(<Register />)

    expect(screen.getByRole('link', { name: 'Daxil ol' })).toHaveAttribute('href', '/login')
  })
})