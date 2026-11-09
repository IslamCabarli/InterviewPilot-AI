import { motion } from 'framer-motion'
import { Skeleton } from '../ui'

interface LevelProgressProps {
  level: number
  xpIntoLevel: number
  xpForNextLevel: number
}

export function LevelProgress({ level, xpIntoLevel, xpForNextLevel }: LevelProgressProps) {
  const ratio = xpForNextLevel > 0 ? Math.min(xpIntoLevel / xpForNextLevel, 1) : 0

  return (
    <div className="w-40 sm:text-right">
      <p className="font-mono text-lg font-medium leading-none">{`Səviyyə ${level}`}</p>
      <div
        role="progressbar"
        aria-label="Növbəti səviyyəyə irəliləyiş"
        aria-valuemin={0}
        aria-valuemax={xpForNextLevel}
        aria-valuenow={xpIntoLevel}
        className="mt-2 h-1 overflow-hidden rounded-full bg-border"
      >
        <motion.div
          className="h-full origin-left rounded-full bg-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: ratio }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <p className="mt-1.5 font-mono text-[10px] text-text-secondary">
        {xpIntoLevel} / {xpForNextLevel} XP
      </p>
    </div>
  )
}

export function LevelProgressSkeleton() {
  return (
    <div role="status" aria-label="Səviyyə yüklənir" className="w-40 space-y-2 sm:ml-auto">
      <Skeleton className="h-5 w-28 sm:ml-auto" />
      <Skeleton className="h-1 w-full" />
      <Skeleton className="h-3 w-20 sm:ml-auto" />
    </div>
  )
}