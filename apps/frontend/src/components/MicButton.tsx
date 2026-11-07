import { Loader2, Mic, Square } from 'lucide-react'
import { cn } from '../lib/cn'

interface MicButtonProps {
  isRecording: boolean
  isProcessing: boolean
  onClick: () => void
}

export default function MicButton({ isRecording, isProcessing, onClick }: MicButtonProps) {
  const label = isRecording
    ? 'Yazını dayandır'
    : isProcessing
      ? 'Mətnə çevrilir'
      : 'Mikrofonla danış'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isProcessing}
      aria-pressed={isRecording}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isRecording
          ? 'border-danger bg-danger text-accent-foreground'
          : 'border-border bg-surface text-text-secondary hover:border-accent hover:text-accent',
      )}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : isRecording ? (
        <Square className="h-3.5 w-3.5 fill-current" aria-hidden />
      ) : (
        <Mic className="h-4 w-4" aria-hidden />
      )}
    </button>
  )
}