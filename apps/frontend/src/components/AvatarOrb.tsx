import { motion } from 'framer-motion'

type AvatarState = 'idle' | 'speaking' | 'listening'

interface AvatarOrbProps {
  state: AvatarState
}

export default function AvatarOrb({ state }: AvatarOrbProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-16 w-16 items-center justify-center">
        {state === 'listening' && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-red-500"
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <motion.div
          animate={
            state === 'speaking'
              ? { scale: [1, 1.18, 1] }
              : { scale: 1 }
          }
          transition={
            state === 'speaking'
              ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.2 }
          }
          className={`h-11 w-11 rounded-full transition-colors ${
            state === 'speaking'
              ? 'bg-accent'
              : state === 'listening'
                ? 'bg-red-500'
                : 'bg-text-secondary/25'
          }`}
        />
      </div>

      <p className="font-mono text-[10px] uppercase tracking-wide text-text-secondary">
        {state === 'speaking' ? 'Danışır' : state === 'listening' ? 'Dinləyir' : 'Gözləyir'}
      </p>
    </div>
  )
}