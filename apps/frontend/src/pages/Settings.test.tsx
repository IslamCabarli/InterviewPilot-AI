import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { useThemeStore } from '../theme/themeStore'
import { useVoicePreference } from '../lib/voicePreference'
import { renderWithProviders, screen } from '../test/render'
import Settings from './Settings'

vi.mock('../auth/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Islam Cabarli', email: 'islam@example.com' },
    isAuthenticated: true,
    isBootstrapping: false,
  }),
}))

describe('Settings', () => {
  beforeEach(() => {
    localStorage.clear()
    useVoicePreference.setState({ enabled: true })
  })

  afterEach(() => {
    useThemeStore.getState().setTheme('light')
  })

  it('shows the account details', () => {
    renderWithProviders(<Settings />)

    expect(screen.getByText('Islam Cabarli')).toBeInTheDocument()
    expect(screen.getByText('islam@example.com')).toBeInTheDocument()
  })

  it('persists the AI voice preference', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Settings />)

    const toggle = screen.getByRole('switch', { name: 'AI səsi' })
    expect(toggle).toHaveAttribute('aria-checked', 'true')

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-checked', 'false')
    expect(localStorage.getItem('voice-output')).toBe('off')
  })

  it('switches the theme', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Settings />)

    await user.click(screen.getByRole('button', { name: 'Tünd' }))

    expect(document.documentElement).toHaveClass('dark')
  })
})