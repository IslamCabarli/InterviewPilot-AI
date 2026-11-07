import { motion } from 'framer-motion'
import { cn } from '../lib/cn'

interface ChatBubbleProps {
  role: 'ai' | 'user'
  content: string
  streaming?: boolean
}

export default function ChatBubble({ role, content, streaming = false }: ChatBubbleProps) {
  const isAi = role === 'ai'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex', isAi ? 'justify-start' : 'justify-end')}
    >
      <div
        className={cn(
          'max-w-[88%] rounded-lg px-4 py-3 text-sm leading-relaxed sm:max-w-[85%]',
          isAi
            ? 'border border-border bg-surface text-text-primary'
            : 'bg-accent text-accent-foreground',
        )}
      >
        <p
          className={cn(
            'mb-1 text-[10px] font-medium uppercase tracking-wide',
            isAi ? 'text-text-secondary' : 'opacity-70',
          )}
        >
          {isAi ? 'İnterviewer' : 'Sən'}
        </p>
        <p className="whitespace-pre-wrap">
          {content}
          {streaming && (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-accent motion-reduce:animate-none"
            />
          )}
        </p>
      </div>
    </motion.div>
  )
}