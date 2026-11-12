import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Send, Volume2, VolumeX } from 'lucide-react'
import { useNavigate } from 'react-router'
import { completeInterview, submitAnswer } from '../../api/interview'
import { transcribeAudio } from '../../api/speech'
import { useAudioRecorder } from '../../hooks/useAudioRecorder'
import { useSpeech } from '../../hooks/useSpeech'
import { createEcho } from '../../lib/echo'
import { getApiErrorMessage } from '../../lib/errors'
import { toast } from '../../lib/toast'
import AvatarOrb, { type AvatarState } from '../AvatarOrb'
import ChatBubble from '../ChatBubble'
import MicButton from '../MicButton'
import PageTransition from '../PageTransition'
import TypingIndicator from '../TypingIndicator'
import { Badge, Button, Modal, Textarea } from '../ui'
import { getDifficultyLabel, getTypeLabel } from './options'
import type { ChatMessage, SessionSeed } from './types'
import Waveform from './Waveform'

export default function InterviewSession({ seed }: { seed: SessionSeed }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [messages, setMessages] = useState<ChatMessage[]>(seed.messages)
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(seed.currentQuestionId)
  const [input, setInput] = useState('')
  const [streamingText, setStreamingText] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { isRecording, stream, startRecording, stopRecording } = useAudioRecorder()
  const {
    enabled: voiceEnabled,
    isSpeaking,
    speak,
    stop: stopSpeaking,
    toggle: toggleVoice,
  } = useSpeech()

  const answerMutation = useMutation({
    mutationFn: ({ questionId, content }: { questionId: number; content: string }) =>
      submitAnswer(seed.interviewId, questionId, content),
    onSuccess: ({ question }) => {
      setCurrentQuestionId(question.id)
      setMessages((prev) => [...prev, { role: 'ai', content: question.content }])
      setStreamingText('')
      void speak(question.content)
    },
    onError: (error, { content }) => {
      setStreamingText('')
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        return last?.role === 'user' && last.content === content ? prev.slice(0, -1) : prev
      })
      setInput((current) => (current.trim() ? current : content))
      toast.error(getApiErrorMessage(error, 'Cavab göndərilə bilmədi. Yenidən cəhd et.'))
    },
  })

  const completeMutation = useMutation({
    mutationFn: () => completeInterview(seed.interviewId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['active-interview'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      void queryClient.invalidateQueries({ queryKey: ['gamification-stats'] })
      void queryClient.invalidateQueries({ queryKey: ['recent-interviews'] })
      navigate(`/interviews/${seed.interviewId}/report`)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Müsahibəni bitirmək mümkün olmadı. Yenidən cəhd et.'))
    },
  })

  useEffect(() => {
    const echo = createEcho()
    echo
      .private(`interview.${seed.interviewId}`)
      .listen('.AiResponseChunk', (data: { chunk: string; done: boolean }) => {
        if (!data.done) setStreamingText((prev) => prev + data.chunk)
      })

    return () => {
      echo.leaveChannel(`interview.${seed.interviewId}`)
      echo.disconnect()
    }
  }, [seed.interviewId])

  useEffect(() => {
    if (!seed.speakInitial) return
    const last = seed.messages[seed.messages.length - 1]
    if (last?.role === 'ai') void speak(last.content)
  }, [seed, speak])

  const isThinking = answerMutation.isPending

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: streamingText ? 'auto' : 'smooth',
      block: 'end',
    })
  }, [messages, streamingText, isThinking])

  const avatarState: AvatarState = isRecording
    ? 'listening'
    : isSpeaking
      ? 'speaking'
      : isThinking
        ? 'thinking'
        : 'idle'

  const answeredCount = messages.filter((message) => message.role === 'user').length
  const canSend =
    input.trim().length > 0 &&
    currentQuestionId !== null &&
    !isThinking &&
    !isRecording &&
    !isTranscribing

  const handleSend = () => {
    const content = input.trim()
    if (!content || currentQuestionId === null || !canSend) return

    stopSpeaking()
    setMessages((prev) => [...prev, { role: 'user', content }])
    setInput('')
    answerMutation.mutate({ questionId: currentQuestionId, content })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleMicClick = async () => {
    if (isRecording) {
      try {
        const audio = await stopRecording()
        setIsTranscribing(true)
        const text = (await transcribeAudio(audio)).trim()

        if (text) {
          setInput((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text))
        } else {
          toast.info('Səs tanınmadı. Yenidən cəhd et.')
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Səs mətnə çevrilə bilmədi. Cavabı yaza bilərsən.'))
      } finally {
        setIsTranscribing(false)
      }
      return
    }

    try {
      stopSpeaking()
      await startRecording()
    } catch {
      toast.error('Mikrofona çıxış mümkün olmadı. Brauzer icazəsini yoxla.')
    }
  }

  return (
    <PageTransition className="h-full">
      <div className="mx-auto flex h-full max-w-2xl flex-col px-4 sm:px-8">

        <header className="flex items-center justify-between gap-3 border-b border-border py-4">
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-semibold tracking-tight">
              {getTypeLabel(seed.type)} müsahibəsi
            </h1>
            <div className="mt-1.5">
              <Badge>{getDifficultyLabel(seed.difficulty)}</Badge>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 px-0"
              onClick={toggleVoice}
              aria-label="AI səsi"
              aria-pressed={voiceEnabled}
              title={voiceEnabled ? 'AI səsini söndür' : 'AI səsini aç'}
            >
              {voiceEnabled ? (
                <Volume2 className="h-4 w-4" aria-hidden />
              ) : (
                <VolumeX className="h-4 w-4" aria-hidden />
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmOpen(true)}
              disabled={isThinking || isRecording}
              loading={completeMutation.isPending}
            >
              {completeMutation.isPending ? 'Qiymətləndirilir...' : 'Müsahibəni bitir'}
            </Button>
          </div>
        </header>

        <div className="flex justify-center py-5 [@media(max-height:640px)]:hidden">
          <AvatarOrb state={avatarState} size="lg" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div
            role="log"
            aria-live="polite"
            aria-label="Müsahibə söhbəti"
            className="flex flex-col gap-4 pb-4"
          >
            {messages.map((message, index) => (
              <ChatBubble key={index} role={message.role} content={message.content} />
            ))}

            {streamingText && (
              <div aria-hidden="true">
                <ChatBubble role="ai" content={streamingText} streaming />
              </div>
            )}

            {isThinking && !streamingText && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-border py-4">
          <div className="flex items-end gap-2">
            <MicButton
              isRecording={isRecording}
              isProcessing={isTranscribing}
              onClick={handleMicClick}
            />

            <div className="min-w-0 flex-1">
              {isRecording ? (
                <div className="flex h-[58px] items-center gap-4 rounded-md border border-danger/40 bg-surface px-4">
                  <Waveform stream={stream} />
                  <span className="shrink-0 font-mono text-xs text-text-secondary">Dinləyir</span>
                </div>
              ) : (
                <Textarea
                  aria-label="Cavabın"
                  rows={2}
                  value={input}
                  disabled={isTranscribing}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isTranscribing
                      ? 'Mətnə çevrilir...'
                      : 'Cavabını yaz və ya mikrofonla danış...'
                  }
                />
              )}
            </div>

            <Button
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Göndər"
              className="w-10 px-0 sm:w-auto sm:px-4"
            >
              <Send className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Göndər</span>
            </Button>
          </div>

          <p className="mt-2 hidden text-xs text-text-secondary sm:block">
            Enter göndərir · Shift+Enter yeni sətir
          </p>
        </div>

        <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Müsahibəni bitirmək?">
          <p className="text-sm leading-relaxed text-text-secondary">
            {answeredCount === 0
              ? 'Hələ heç bir suala cavab verməmisən, ona görə hesabat mənalı olmaya bilər.'
              : 'AI cavablarını qiymətləndirib hesabat hazırlayacaq. Bu bir neçə saniyə çəkə bilər.'}
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmOpen(false)}
              disabled={completeMutation.isPending}
            >
              Davam et
            </Button>
            <Button onClick={() => completeMutation.mutate()} loading={completeMutation.isPending}>
              Bitir və hesabat al
            </Button>
          </div>
        </Modal>
      </div>
    </PageTransition>
  )
}