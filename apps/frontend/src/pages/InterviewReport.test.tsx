import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Route, Routes } from 'react-router'
import { getInterviewReport } from '../api/interview'
import { renderWithProviders, screen } from '../test/render'
import InterviewReport from './InterviewReport'

vi.mock('../api/interview', () => ({ getInterviewReport: vi.fn() }))

type ReportData = Awaited<ReturnType<typeof getInterviewReport>>

const reportData = {
  interview: {
    id: 5,
    type: 'backend',
    difficulty: 'medium',
    status: 'completed',
    questions: [],
    overall_score: 82,
    score_breakdown: {
      technical: 22,
      communication: 17,
      confidence: 12,
      problem_solving: 16,
      best_practices: 15,
    },
  },
  report: {
    id: 1,
    interview_id: 5,
    summary: 'Güclü texniki bilik.',
    weak_points: ['Testing'],
    strong_points: ['Architecture'],
    recommended_topics: ['TDD'],
  },
} as ReportData

function renderReport() {
  return renderWithProviders(
    <Routes>
      <Route path="/interviews/:id/report" element={<InterviewReport />} />
    </Routes>,
    { route: '/interviews/5/report' },
  )
}

describe('InterviewReport', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows the summary, breakdown, points and topics', async () => {
    vi.mocked(getInterviewReport).mockResolvedValue(reportData)
    renderReport()

    expect(await screen.findByText('Güclü texniki bilik.')).toBeInTheDocument()
    expect(screen.getByText('Yaxşı nəticə')).toBeInTheDocument()
    expect(screen.getByText('Texniki bilik')).toBeInTheDocument()
    expect(screen.getByText('Architecture')).toBeInTheDocument()
    expect(screen.getByText('Testing')).toBeInTheDocument()
    expect(screen.getByText('TDD')).toBeInTheDocument()
  })

  it('explains when the AI could not produce a score', async () => {
    vi.mocked(getInterviewReport).mockResolvedValue({
      ...reportData,
      interview: { ...reportData.interview, overall_score: null, score_breakdown: null },
    })
    renderReport()

    expect(await screen.findByText('Qiymətləndirmə tamamlanmadı')).toBeInTheDocument()
  })

  it('shows a message when the report is missing', async () => {
    vi.mocked(getInterviewReport).mockRejectedValue(new Error('404'))
    renderReport()

    expect(await screen.findByText('Hesabat tapılmadı.')).toBeInTheDocument()
  })
})