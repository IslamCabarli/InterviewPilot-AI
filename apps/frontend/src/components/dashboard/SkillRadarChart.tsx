import { useReducedMotion } from 'framer-motion'
import { Target } from 'lucide-react'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts'
import type { SkillRadarPoint } from '../../api/dashboard'
import ScoreBar from '../ScoreBar'
import { Card, EmptyState, Eyebrow } from '../ui'
import { chartColors } from './chartTheme'

const MIN_RADAR_AXES = 3

function toPercent(point: SkillRadarPoint): number {
  const max = point.max && point.max > 0 ? point.max : 100
  return Math.round(Math.min(point.value / max, 1) * 100)
}

export default function SkillRadarChart({ data }: { data: SkillRadarPoint[] }) {
  const reduceMotion = useReducedMotion()

  const chartData = data.map((point) => ({ skill: point.skill, percent: toPercent(point) }))
  const summary = data
    .map((point) => `${point.skill} ${point.value}${point.max ? ` / ${point.max}` : ''}`)
    .join(', ')

  return (
    <Card>
      <Eyebrow>Bacarıq xəritəsi</Eyebrow>

      {data.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Hələ bacarıq məlumatı yoxdur"
          description="Müsahibə tamamlandıqdan sonra bacarıq xəritən burada yaranacaq."
          className="py-14"
        />
      ) : data.length < MIN_RADAR_AXES ? (
        <div className="mt-5 space-y-4">
          {data.map((point) => (
            <ScoreBar key={point.skill} label={point.skill} value={point.value} max={point.max ?? 100} />
          ))}
        </div>
      ) : (
        <>
          <div role="img" aria-label={`Bacarıq xəritəsi: ${summary}`} className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} outerRadius="70%">
                <PolarGrid stroke={chartColors.border} />
                <PolarAngleAxis dataKey="skill" tick={{ fill: chartColors.muted, fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Səviyyə"
                  dataKey="percent"
                  stroke={chartColors.accent}
                  fill={chartColors.accent}
                  fillOpacity={0.15}
                  strokeWidth={2}
                  isAnimationActive={!reduceMotion}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-xs text-text-secondary">
            Hər ox maksimal balın faizini göstərir.
          </p>
        </>
      )}
    </Card>
  )
}