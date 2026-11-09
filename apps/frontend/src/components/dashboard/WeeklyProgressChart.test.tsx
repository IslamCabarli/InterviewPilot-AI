import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import WeeklyProgressChart from './WeeklyProgressChart'

const emptyWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((date) => ({
  date,
  score: null,
}))

describe('WeeklyProgressChart', () => {
  it('explains that there were no interviews in the last 7 days', () => {
    render(<WeeklyProgressChart data={emptyWeek} />)

    expect(screen.getByText('Son 7 gündə müsahibə yoxdur')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})