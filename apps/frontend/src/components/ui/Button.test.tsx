import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  it('is disabled and marked busy while loading', () => {
    render(<Button loading>Saxla</Button>)

    const button = screen.getByRole('button', { name: /saxla/i })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('defaults to type="button" so it never submits forms by accident', () => {
    render(<Button>Davam et</Button>)

    expect(screen.getByRole('button', { name: /davam et/i })).toHaveAttribute('type', 'button')
  })
})