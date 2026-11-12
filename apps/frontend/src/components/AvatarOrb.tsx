import { motion, type Transition } from 'framer-motion'
import { cn } from '../lib/cn'

export type AvatarState = 'idle' | 'speaking' | 'listening' | 'thinking'
type AvatarSize = 'md' | 'lg'

interface AvatarOrbProps {
  state: AvatarState
  size?: AvatarSize
}

const labels: Record<AvatarState, string> = {
  idle: 'Gözləyir',
  speaking: 'Danışır',
  listening: 'Dinləyir',
  thinking: 'Düşünür',
}

const sizes: Record<AvatarSize, { box: string; orb: string }> = {
  md: { box: 'h-16 w-16', orb: 'h-11 w-11' },
  lg: { box: 'h-24 w-24', orb: 'h-16 w-16' },
}

const tones: Record<AvatarState, string> = {
  idle: 'bg-text-secondary/25',
  speaking: 'bg-accent',
  listening: 'bg-danger',
  thinking: 'bg-accent/40',
}

const animations: Record<AvatarState, { scale: number | number[] }> = {
  idle: { scale: 1 },
  listening: { scale: 1 },
  speaking: { scale: [1, 1.18, 1] },
  thinking: { scale: [1, 1.07, 1] },
}

const transitions: Record<AvatarState, Transition> = {
  idle: { duration: 0.2 },
  listening: { duration: 0.2 },
  speaking: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
  thinking: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
}

export default function AvatarOrb({ state, size = 'md' }: AvatarOrbProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('relative flex items-center justify-center', sizes[size].box)}>
        {state === 'listening' && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-danger"
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <motion.div
          aria-hidden
          animate={animations[state]}
          transition={transitions[state]}
          className={cn('rounded-full transition-colors', sizes[size].orb, tones[state])}
        />
      </div>

      <p
        role="status"
        className="font-mono text-[11px] uppercase tracking-wide text-text-secondary"
      >
        {labels[state]}
      </p>
    </div>
  )
}