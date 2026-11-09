import { Card, Eyebrow } from '../ui'

interface StatCardProps {
  label: string
  value: number
  unit?: string
}

export default function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <Card role="group" aria-label={label} className="p-5">
      <Eyebrow>{label}</Eyebrow>
      <p className="mt-3 font-mono text-3xl font-medium leading-none">
        {value}
        {unit && <span className="ml-1 text-base text-text-secondary">{unit}</span>}
      </p>
    </Card>
  )
}