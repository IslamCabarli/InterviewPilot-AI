interface ScoreBarProps {
  label: string
  value: number
  max: number
}

export default function ScoreBar({ label, value, max }: ScoreBarProps) {
  const percentage = (value / max) * 100

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-text-primary">{label}</p>
        <p className="font-mono text-sm text-text-secondary">
          {value}<span className="text-text-secondary/50">/{max}</span>
        </p>
      </div>
      <div className="mt-1.5 h-1 rounded-full bg-border">
        <div
          className="h-1 rounded-full bg-accent transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}