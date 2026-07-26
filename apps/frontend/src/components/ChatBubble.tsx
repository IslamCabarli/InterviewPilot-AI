import { motion } from 'framer-motion'

interface ChatBubbleProps {
  role: 'ai' | 'user'
  content: string
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isAi = role === 'ai'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[75%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
          isAi
            ? 'border border-border bg-surface text-text-primary'
            : 'bg-accent text-white'
        }`}
      >
        {!isAi && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-white/70">
            Sən
          </p>
        )}
        {isAi && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
            İnterviewer
          </p>
        )}
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </motion.div>
  )
}