import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import BadgesCard from './BadgesCard'

const badges = [
  { key: 'a', label: 'İlk addım', description: 'İlk müsahibəni tamamla', unlocked: true },
  { key: 'b', label: 'Davamlılıq', description: '5 müsahibə tamamla', unlocked: false },
]

describe('BadgesCard', () => {
  it('shows how many badges are unlocked', () => {
    render(<BadgesCard badges={badges} />)

    expect(screen.getByText('1/2')).toBeInTheDocument()
  })

  it('tells locked and unlocked badges apart for assistive technology', () => {
    render(<BadgesCard badges={badges} />)

    expect(screen.getByText('Qazanılıb')).toBeInTheDocument()
    expect(screen.getByText('Kilidli')).toBeInTheDocument()
  })
})