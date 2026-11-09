import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { getCvStatus, uploadCv } from '../api/cv'
import { useToastStore } from '../lib/toast'
import { renderWithProviders, screen, waitFor } from '../test/render'
import Profile from './Profile'

vi.mock('../auth/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Islam Cabarli', email: 'islam@example.com' },
    isAuthenticated: true,
    isBootstrapping: false,
  }),
}))
vi.mock('../api/cv', () => ({
  getCvStatus: vi.fn(),
  uploadCv: vi.fn(),
  deleteCv: vi.fn(),
}))

const pdf = () => new File(['%PDF-1.4'], 'cv.pdf', { type: 'application/pdf' })
const lastToast = () => useToastStore.getState().toasts.at(-1)

describe('Profile', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useToastStore.setState({ toasts: [] })
    vi.mocked(getCvStatus).mockResolvedValue({ hasCv: false, uploadedAt: null })
  })

  it('shows the account details', async () => {
    renderWithProviders(<Profile />)

    expect(await screen.findByText('Islam Cabarli')).toBeInTheDocument()
    expect(screen.getByText('islam@example.com')).toBeInTheDocument()
  })

  it('invites the user to upload a CV when none exists', async () => {
    renderWithProviders(<Profile />)

    expect(await screen.findByText('PDF-i buraya sürüklə')).toBeInTheDocument()
  })

  it('shows that a CV is already uploaded', async () => {
    vi.mocked(getCvStatus).mockResolvedValue({ hasCv: true, uploadedAt: '2026-01-15T10:00:00Z' })
    renderWithProviders(<Profile />)

    expect(await screen.findByText('CV yüklənib')).toBeInTheDocument()
    expect(screen.getByText('Yeni PDF ilə əvəz et')).toBeInTheDocument()
  })

  it('uploads a valid PDF', async () => {
    vi.mocked(uploadCv).mockResolvedValue({ message: 'ok', preview: '' })
    const user = userEvent.setup()
    renderWithProviders(<Profile />)

    const file = pdf()
    await user.upload(await screen.findByLabelText('CV faylı (PDF)'), file)

    await waitFor(() => expect(uploadCv).toHaveBeenCalledWith(file))
    await waitFor(() => expect(lastToast()?.tone).toBe('success'))
  })

  it('rejects files that are not PDFs', async () => {
    const user = userEvent.setup({ applyAccept: false })
    renderWithProviders(<Profile />)

    const notes = new File(['hello'], 'notes.txt', { type: 'text/plain' })
    await user.upload(await screen.findByLabelText('CV faylı (PDF)'), notes)

    expect(uploadCv).not.toHaveBeenCalled()
    expect(lastToast()?.message).toMatch(/PDF/)
  })

  it('rejects files larger than 5 MB', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Profile />)

    const big = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'big.pdf', { type: 'application/pdf' })
    await user.upload(await screen.findByLabelText('CV faylı (PDF)'), big)

    expect(uploadCv).not.toHaveBeenCalled()
    expect(lastToast()?.message).toMatch(/5 MB/)
  })
})