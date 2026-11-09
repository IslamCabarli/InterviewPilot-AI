import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import SkillRadarChart from './SkillRadarChart'

describe('SkillRadarChart', () => {
  it('shows an empty state without data', () => {
    render(<SkillRadarChart data={[]} />)

    expect(screen.getByText('Hələ bacarıq məlumatı yoxdur')).toBeInTheDocument()
  })

  it('falls back to score bars when there are too few axes for a radar', () => {
    render(
      <SkillRadarChart
        data={[
          { skill: 'Texniki', value: 20, max: 25 },
          { skill: 'Özünəinam', value: 12, max: 15 },
        ]}
      />,
    )

    const meters = screen.getAllByRole('meter')
    expect(meters).toHaveLength(2)
    expect(screen.getByRole('meter', { name: 'Texniki' })).toHaveAttribute('aria-valuenow', '20')
    expect(screen.getByRole('meter', { name: 'Texniki' })).toHaveAttribute('aria-valuemax', '25')
  })
})