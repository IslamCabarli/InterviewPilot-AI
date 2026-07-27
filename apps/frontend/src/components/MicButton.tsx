interface MicButtonProps {
  isRecording: boolean
  isProcessing: boolean
  onClick: () => void
}

export default function MicButton({ isRecording, isProcessing, onClick }: MicButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isProcessing}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition-colors ${
        isRecording
          ? 'border-red-500 bg-red-500 text-white'
          : 'border-border bg-surface text-text-secondary hover:border-accent hover:text-accent'
      } disabled:cursor-not-allowed disabled:opacity-40`}
      title={isRecording ? 'Dayandır' : 'Danışmağa başla'}
    >
      {isRecording ? (
        // Dayandırma ikonu (kvadrat)
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <rect width="14" height="14" rx="2" />
        </svg>
      ) : (
        // Mikrofon ikonu
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
          <line x1="12" y1="18" x2="12" y2="22" />
        </svg>
      )}
    </button>
  )
}