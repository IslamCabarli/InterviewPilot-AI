import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { getCvStatus } from '../../api/cv'
import { startInterview } from '../../api/interview'
import { renderWithProviders, screen, waitFor } from '../../test/render'
import InterviewSetup from './InterviewSetup'

vi.mock('../../api/interview', () => ({ startInterview: vi.fn() }))
vi.mock('../../api/cv', () => ({ getCvStatus: vi.fn() }))

const started = {
  interview: {
    id: 9,
    type: 'backend',
    difficulty: 'medium',
    status: 'in_progress' as const,
    questions: [],
  },
  question: { id: 1, interview_id: 9, content: 'Salam!', order: 1, answer: null },
}

async function goToLastStep(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /^Backend/ }))
  await user.click(screen.getByRole('button', { name: 'Davam et' }))
  await user.click(screen.getByRole('button', { name: /^Medium/ }))
  await user.click(screen.getByRole('button', { name: 'Davam et' }))
}

describe('InterviewSetup', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(getCvStatus).mockResolvedValue({ hasCv: false, uploadedAt: null })
    vi.mocked(startInterview).mockResolvedValue(started)
  })

  it('requires a selection before continuing', () => {
    renderWithProviders(<InterviewSetup onStarted={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Davam et' })).toBeDisabled()
  })

  it('walks through the steps and can go back', async () => {
    const user = userEvent.setup()
    renderWithProviders(<InterviewSetup onStarted={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /^Backend/ }))
    await user.click(screen.getByRole('button', { name: 'Davam et' }))

    expect(screen.getByRole('heading', { name: 'Çətinlik səviyyəsini seç' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Geri' }))

    expect(screen.getByRole('heading', { name: 'Müsahibə növünü seç' })).toBeInTheDocument()
  })

  it('starts the interview with the chosen options', async () => {
    const user = userEvent.setup()
    const onStarted = vi.fn()
    renderWithProviders(<InterviewSetup onStarted={onStarted} />)

    await goToLastStep(user)
    await user.click(screen.getByRole('button', { name: 'Müsahibəyə başla' }))

    await waitFor(() =>
      expect(onStarted).toHaveBeenCalledWith(
        expect.objectContaining({ interviewId: 9, currentQuestionId: 1, speakInitial: true }),
      ),
    )
    expect(startInterview).toHaveBeenCalledWith('backend', 'medium', false)
  })

  it('uses the CV by default when one is uploaded', async () => {
    vi.mocked(getCvStatus).mockResolvedValue({ hasCv: true, uploadedAt: '2026-01-01' })
    const user = userEvent.setup()
    renderWithProviders(<InterviewSetup onStarted={vi.fn()} />)

    await goToLastStep(user)

    expect(await screen.findByLabelText(/CV-mə uyğunlaşdır/)).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Müsahibəyə başla' }))

    await waitFor(() => expect(startInterview).toHaveBeenCalledWith('backend', 'medium', true))
  })

  it('shows an error when the interview cannot be started', async () => {
    vi.mocked(startInterview).mockRejectedValue(new Error('boom'))
    const user = userEvent.setup()
    renderWithProviders(<InterviewSetup onStarted={vi.fn()} />)

    await goToLastStep(user)
    await user.click(screen.getByRole('button', { name: 'Müsahibəyə başla' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Müsahibəni başlatmaq mümkün olmadı.')
  })
})