import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../test/render'
import Landing from './Landing'

describe('Landing', () => {
  it('presents the product with a single main heading', () => {
    renderWithProviders(<Landing />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/müsahibəçi ilə hazırlaş/i)
  })

  it('links the primary call to action to registration', () => {
    renderWithProviders(<Landing />)

    expect(screen.getByRole('link', { name: 'Pulsuz başla' })).toHaveAttribute('href', '/register')
  })

  it('links to login from the header', () => {
    renderWithProviders(<Landing />)

    expect(screen.getByRole('link', { name: 'Daxil ol' })).toHaveAttribute('href', '/login')
  })

  it('lists the core features', () => {
    renderWithProviders(<Landing />)

    expect(screen.getByRole('heading', { name: 'Səsli müsahibə' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lokal AI' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ətraflı hesabat' })).toBeInTheDocument()
  })
})