import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useToastStore, type ToastTone } from '../../lib/toast'

const icons = { success: CheckCircle2, error: AlertCircle, info: Info } as const

const tones: Record<ToastTone, string> = {
  success: 'text-positive',
  error: 'text-danger',
  info: 'text-accent',
}

export default function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      role="region"
      aria-label="Bildirişlər"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = icons[t.tone]
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-border bg-surface p-4"
            >
              <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', tones[t.tone])} aria-hidden />
              <p className="flex-1 text-sm text-text-primary">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Bağla"
                className="text-text-secondary transition-colors hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}