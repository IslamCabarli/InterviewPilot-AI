import { motion } from 'framer-motion'

interface ScoreBarProps {
  label: string
  value: number
  max: number
  delay?: number
}

export default function ScoreBar({ label, value, max, delay = 0 }: ScoreBarProps) {
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-text-primary">{label}</p>
        <p className="font-mono text-sm text-text-secondary">
          {value}
          <span className="text-text-secondary/50">/{max}</span>
        </p>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="mt-1.5 h-1 overflow-hidden rounded-full bg-border"
      >
        <motion.div
          className="h-full origin-left rounded-full bg-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: ratio }}
          transition={{ duration: 0.7, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}