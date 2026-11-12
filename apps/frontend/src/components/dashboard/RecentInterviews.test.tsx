import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '../../test/render'
import RecentInterviews from './RecentInterviews'

const interviews = [
  { id: 12, type: 'backend', difficulty: 'medium', overall_score: 82, completed_at: '2026-10-05T10:00:00Z' },
  { id: 9, type: 'frontend', difficulty: 'easy', overall_score: null, completed_at: null },
]

describe('RecentInterviews', () => {
  it('links every interview to its report', () => {
    renderWithProviders(<RecentInterviews interviews={interviews} />)

    expect(screen.getByRole('link', { name: /Backend/ })).toHaveAttribute('href', '/interviews/12/report')
    expect(screen.getByRole('link', { name: /Frontend/ })).toHaveAttribute('href', '/interviews/9/report')
  })

  it('shows the score, or a dash when the AI could not score it', () => {
    renderWithProviders(<RecentInterviews interviews={interviews} />)

    expect(screen.getByText('82/100')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders nothing for an empty list', () => {
    const { container } = renderWithProviders(<RecentInterviews interviews={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})