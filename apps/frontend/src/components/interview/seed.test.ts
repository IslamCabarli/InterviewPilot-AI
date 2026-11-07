import { describe, it, expect } from 'vitest'
import type { Interview, Question } from '../../api/interview'
import { seedFromInterview, seedFromStart } from './seed'

function question(id: number, order: number, content: string, answer?: string): Question {
  return {
    id,
    interview_id: 7,
    content,
    order,
    answer: answer
      ? { id: id * 10, question_id: id, content: answer, score: null, ai_feedback: null }
      : null,
  }
}

function interview(questions: Question[]): Interview {
  return { id: 7, type: 'backend', difficulty: 'medium', status: 'in_progress', questions }
}

describe('seedFromStart', () => {
  it('starts with the first question and speaks it', () => {
    const seed = seedFromStart(interview([]), question(1, 1, 'Salam!'))

    expect(seed.currentQuestionId).toBe(1)
    expect(seed.messages).toEqual([{ role: 'ai', content: 'Salam!' }])
    expect(seed.speakInitial).toBe(true)
  })
})

describe('seedFromInterview', () => {
  it('rebuilds the conversation in order, even if questions arrive unsorted', () => {
    const seed = seedFromInterview(
      interview([question(2, 2, 'İkinci sual'), question(1, 1, 'Birinci sual', 'Birinci cavab')]),
    )

    expect(seed.messages).toEqual([
      { role: 'ai', content: 'Birinci sual' },
      { role: 'user', content: 'Birinci cavab' },
      { role: 'ai', content: 'İkinci sual' },
    ])
  })

  it('points at the unanswered question', () => {
    const seed = seedFromInterview(
      interview([question(1, 1, 'A', 'cavab'), question(2, 2, 'B')]),
    )

    expect(seed.currentQuestionId).toBe(2)
  })

  it('falls back to the last question when everything is answered', () => {
    const seed = seedFromInterview(
      interview([question(1, 1, 'A', 'cavab'), question(2, 2, 'B', 'cavab')]),
    )

    expect(seed.currentQuestionId).toBe(2)
  })

  it('does not speak when restoring', () => {
    expect(seedFromInterview(interview([question(1, 1, 'A')])).speakInitial).toBe(false)
  })
})