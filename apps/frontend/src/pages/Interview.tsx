import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import PageTransition from '../components/PageTransition'
import ChatBubble from '../components/ChatBubble'
import TypingIndicator from '../components/TypingIndicator'
import { startInterview, submitAnswer, completeInterview, type Question, type Report } from '../api/interview'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { transcribeAudio, synthesizeSpeech } from '../api/speech'
import MicButton from '../components/MicButton'
import { useAudioLevel } from '../hooks/useAudioLevel'
import AvatarOrb from '../components/AvatarOrb'
import { createEcho } from '../lib/echo'

const interviewTypes = [
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'fullstack', label: 'Full Stack' },
  { value: 'devops', label: 'DevOps' },
  { value: 'system-design', label: 'System Design' },
  { value: 'hr', label: 'HR' },
]

const difficulties = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'senior', label: 'Senior' },
]

interface ChatMessage {
  role: 'ai' | 'user'
  content: string
}

export default function Interview() {
  const [type, setType] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<string | null>(null)
  const [interviewId, setInterviewId] = useState<number | null>(null)
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [report, setReport] = useState<Report | null>(null)
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const audioLevel = useAudioLevel(audioRef)
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()

  const avatarState: 'idle' | 'speaking' | 'listening' = isRecording
    ? 'listening'
    : isAiSpeaking
      ? 'speaking'
      : 'idle'

  const [isTranscribing, setIsTranscribing] = useState(false)


  const handleMicClick = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording()
      setIsTranscribing(true)
      try {
        const text = await transcribeAudio(audioBlob)
        setInput((prev) => (prev ? `${prev} ${text}` : text))
      } catch {
        // Səssiz uğursuzluq — istifadəçi yaza bilər, funksiya bloklanmır
      } finally {
        setIsTranscribing(false)
      }
    } else {
      await startRecording()
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]

    if (!lastMessage || lastMessage.role !== 'ai') return

    let url: string | null = null

    synthesizeSpeech(lastMessage.content)
      .then((audioUrl) => {
        url = audioUrl

        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.play().catch(() => { })
        }
      })
      .catch(() => { })
      .finally(() => {
        if (url) {
          setTimeout(() => URL.revokeObjectURL(url!), 10000)
        }
      })
  }, [messages])

  useEffect(() => {
    if (!interviewId) return

    const echo = createEcho()
    const channel = echo.private(`interview.${interviewId}`)

    channel.listen('.AiResponseChunk', (data: { chunk: string; done: boolean }) => {
      if (data.done) {
        setIsStreaming(false)
        return
      }
      setIsStreaming(true)
      setStreamingText((prev) => prev + data.chunk)
    })

    return () => {
      echo.leaveChannel(`interview.${interviewId}`)
      echo.disconnect()
    }
  }, [interviewId])

  const startMutation = useMutation({
    mutationFn: () => startInterview(type!, difficulty!),
    onSuccess: (data) => {
      setInterviewId(data.interview.id)
      setCurrentQuestionId(data.question.id)

      setMessages([{ role: 'ai', content: data.question.content }])

    },
  })

  const answerMutation = useMutation({
    mutationFn: (content: string) => submitAnswer(interviewId!, currentQuestionId!, content),
    onSuccess: (data: { question: Question }) => {
      setCurrentQuestionId(data.question.id)
      setMessages((prev) => [...prev, { role: 'ai', content: data.question.content }])
      setStreamingText('')
    },
  })

  const completeMutation = useMutation({
    mutationFn: () => completeInterview(interviewId!),
    onSuccess: (data) => {
      setReport(data.report)
      setIsCompleted(true)
    },
  })

  const handleSend = () => {
    if (!input.trim() || answerMutation.isPending) return
    setMessages((prev) => [...prev, { role: 'user', content: input }])
    answerMutation.mutate(input)
    setInput('')
  }

  // --- Setup ekranı ---
  if (!interviewId) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-3xl px-8 py-10">
          <h1 className="font-display text-2xl font-semibold tracking-tight">Yeni müsahibə</h1>
          <p className="mt-1 text-sm text-text-secondary">Növü və çətinlik səviyyəsini seç.</p>

          <div className="mt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Müsahibə növü
            </p>
            <div className="flex flex-wrap gap-2">
              {interviewTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${type === t.value
                    ? 'border-accent bg-accent text-white'
                    : 'border-border bg-surface text-text-primary hover:border-accent hover:text-accent'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Çətinlik
            </p>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${difficulty === d.value
                    ? 'border-accent bg-accent text-white'
                    : 'border-border bg-surface text-text-primary hover:border-accent hover:text-accent'
                    }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {startMutation.isError && (
            <p className="mt-4 text-sm text-red-500">
              Müsahibəni başlatmaq mümkün olmadı. Ollama-nın işlədiyinə əmin ol.
            </p>
          )}

          <button
            onClick={() => startMutation.mutate()}
            disabled={!type || !difficulty || startMutation.isPending}
            className="mt-10 w-full rounded-md bg-accent py-3 text-sm font-medium text-white hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {startMutation.isPending ? 'Hazırlanır...' : 'Müsahibəyə başla'}
          </button>
        </div>
      </PageTransition>
    )
  }

  // --- Tamamlandı ekranı ---
  if (isCompleted) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl px-8 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Müsahibə tamamlandı
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Nəticələr hazırlanır. Hesabat funksiyası tezliklə əlavə olunacaq.
          </p>
        </div>
      </PageTransition>
    )
  }

  // --- Chat ekranı ---
  return (
    <PageTransition>
      <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-3xl flex-col px-8 py-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="font-display text-lg font-semibold tracking-tight">
              {interviewTypes.find((t) => t.value === type)?.label} müsahibəsi
            </h1>
            <p className="text-xs text-text-secondary">
              {difficulties.find((d) => d.value === difficulty)?.label} səviyyə
            </p>
          </div>

          <div className="flex items-center gap-6">
            <AvatarOrb state={avatarState} />
            <button
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isPending}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-accent hover:text-accent"
            >
              Müsahibəni bitir
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto py-6">
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {isStreaming && streamingText && <ChatBubble role="ai" content={streamingText} />}
          {answerMutation.isPending && !isStreaming && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 border-t border-border pt-4">
          <MicButton
            isRecording={isRecording}
            isProcessing={isTranscribing}
            onClick={handleMicClick}
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={isTranscribing ? 'Mətnə çevrilir...' : 'Cavabını yaz və ya danış...'}
            rows={2}
            className="flex-1 resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || answerMutation.isPending}
            className="rounded-md bg-accent px-5 text-sm font-medium text-white hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Göndər
          </button>
        </div>
      </div>
      <audio ref={audioRef}
        className="hidden"
        onPlay={() => setIsAiSpeaking(true)}
        onPause={() => setIsAiSpeaking(false)}
        onEnded={() => setIsAiSpeaking(false)} />
    </PageTransition>
  )
}