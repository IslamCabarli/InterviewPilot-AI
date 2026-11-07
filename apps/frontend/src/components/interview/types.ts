export interface ChatMessage {
  role: 'ai' | 'user'
  content: string
}

export interface SessionSeed {
  interviewId: number
  type: string
  difficulty: string
  currentQuestionId: number | null
  messages: ChatMessage[]
  speakInitial: boolean
}