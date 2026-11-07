import { useEffect } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'

export type ScoreTone = 'positive' | 'accent' | 'danger'

const toneClass: Record<ScoreTone, string> = {
  positive: 'text-positive',
  accent: 'text-accent',
  danger: 'text-danger',
}

const SIZE = 144
const STROKE = 8
const RADIUS = (SIZE - STROKE) / 2

function CountUp({ value }: { value: number }) {
  const reduceMotion = useReducedMotion()
  const count = useMotionValue(reduceMotion ? value : 0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    if (reduceMotion) {
      count.set(value)
      return
    }

    const controls = animate(count, value, { duration: 0.9, ease: 'easeOut' })
    return () => controls.stop()
  }, [count, reduceMotion, value])

  return <motion.span>{rounded}</motion.span>
}

export default function ScoreRing({ score, tone }: { score: number; tone: ScoreTone }) {
  const ratio = Math.min(Math.max(score / 100, 0), 1)

  return (
    <div role="img" aria-label={`Ümumi bal: ${score} / 100`} className="relative h-36 w-36 shrink-0">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full -rotate-90" aria-hidden>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-border"
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          className={toneClass[tone]}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: ratio }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-mono text-4xl font-medium leading-none">
          <CountUp value={score} />
        </p>
        <p className="mt-1.5 font-mono text-xs text-text-secondary">/ 100</p>
      </div>
    </div>
  )
}