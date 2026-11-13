import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

let shouldThrow = true

function Fragile() {
  if (shouldThrow) throw new Error('boom')
  return <p>Hər şey qaydasındadır</p>
}

describe('ErrorBoundary', () => {
  afterEach(() => {
    shouldThrow = true
    vi.restoreAllMocks()
  })

  it('shows a friendly fallback instead of a blank screen', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Fragile />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Nəsə düzgün getmədi')
    expect(screen.getByRole('button', { name: 'Səhifəni yenilə' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ana səhifə' })).toHaveAttribute('href', '/')
  })

  it('renders its children when nothing fails', () => {
    shouldThrow = false
    render(
      <ErrorBoundary>
        <Fragile />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Hər şey qaydasındadır')).toBeInTheDocument()
  })

  it('recovers when the reset key changes, e.g. after navigating away', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { rerender } = render(
      <ErrorBoundary variant="inline" resetKey="/a">
        <Fragile />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()

    shouldThrow = false
    rerender(
      <ErrorBoundary variant="inline" resetKey="/b">
        <Fragile />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Hər şey qaydasındadır')).toBeInTheDocument()
  })
})