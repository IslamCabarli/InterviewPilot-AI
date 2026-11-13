import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { useNavigate } from 'react-router'
import { renderWithProviders, screen } from '../test/render'
import RouteEffects from './RouteEffects'

function Harness() {
  const navigate = useNavigate()

  return (
    <>
      <RouteEffects />
      <button type="button" onClick={() => navigate('/settings')}>
        keç
      </button>
      <main id="main" tabIndex={-1}>
        məzmun
      </main>
    </>
  )
}

describe('RouteEffects', () => {
  it('sets the page title on load without stealing focus', () => {
    renderWithProviders(<Harness />, { route: '/dashboard' })

    expect(document.title).toBe('Dashboard · InterviewPilot AI')
    expect(screen.getByRole('main')).not.toHaveFocus()
  })

  it('updates the title, announces and focuses the main content on navigation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Harness />, { route: '/dashboard' })

    await user.click(screen.getByRole('button', { name: 'keç' }))

    expect(document.title).toBe('Tənzimləmələr · InterviewPilot AI')
    expect(screen.getByRole('status')).toHaveTextContent('Tənzimləmələr · InterviewPilot AI')
    expect(screen.getByRole('main')).toHaveFocus()
  })
})