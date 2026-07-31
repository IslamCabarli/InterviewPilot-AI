import { motion } from 'framer-motion'

type AvatarState = 'idle' | 'speaking' | 'listening'

interface AvatarOrbProps {
  state: AvatarState
  level?: number // 0-1, yalnız 'speaking' zamanı istifadə olunur
}

export default function AvatarOrb({ state, level = 0 }: AvatarOrbProps) {
  const scale = state === 'speaking' ? 1 + level * 0.25 : 1

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
          animate={{ scale }}
          transition={{ duration: 0.08, ease: 'linear' }}
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