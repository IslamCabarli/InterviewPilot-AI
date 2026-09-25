import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AvatarOrb from './AvatarOrb'

describe('AvatarOrb', () => {
  it('shows "Gözləyir" label in idle state', () => {
    render(<AvatarOrb state="idle" />)
    expect(screen.getByText('Gözləyir')).toBeInTheDocument()
  })

  it('shows "Danışır" label in speaking state', () => {
    render(<AvatarOrb state="speaking" />)
    expect(screen.getByText('Danışır')).toBeInTheDocument()
  })

  it('shows "Dinləyir" label in listening state', () => {
    render(<AvatarOrb state="listening" />)
    expect(screen.getByText('Dinləyir')).toBeInTheDocument()
  })
})