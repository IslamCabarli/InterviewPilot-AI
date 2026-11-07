import type { Interview, Question } from '../../api/interview'
import type { ChatMessage, SessionSeed } from './types'

export function seedFromStart(interview: Interview, question: Question): SessionSeed {
  return {
    interviewId: interview.id,
    type: interview.type,
    difficulty: interview.difficulty,
    currentQuestionId: question.id,
    messages: [{ role: 'ai', content: question.content }],
    speakInitial: true,
  }
}

export function seedFromInterview(interview: Interview): SessionSeed {
  const questions = [...interview.questions].sort((a, b) => a.order - b.order)
  const messages: ChatMessage[] = []
  let pendingQuestionId: number | null = null

  for (const question of questions) {
    messages.push({ role: 'ai', content: question.content })

    if (question.answer) {
      messages.push({ role: 'user', content: question.answer.content })
    } else {
      pendingQuestionId = question.id
    }
  }

  const lastQuestion = questions[questions.length - 1]

  return {
    interviewId: interview.id,
    type: interview.type,
    difficulty: interview.difficulty,
    currentQuestionId: pendingQuestionId ?? lastQuestion?.id ?? null,
    messages,
    speakInitial: false,
  }
}