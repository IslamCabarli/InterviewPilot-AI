import { useReducedMotion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { WeeklyProgressPoint } from '../../api/dashboard'
import { getWeekdayLabel } from '../../lib/weekdays'
import { Card, EmptyState, Eyebrow } from '../ui'
import { axisTick, chartColors, tooltipStyle } from './chartTheme'

export default function WeeklyProgressChart({ data }: { data: WeeklyProgressPoint[] }) {
  const reduceMotion = useReducedMotion()

  const scores = data.flatMap((point) => (point.score === null ? [] : [point.score]))
  const average =
    scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0
  const points = data.map((point) => ({ day: getWeekdayLabel(point.date), score: point.score }))

  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <Eyebrow>Həftəlik tərəqqi</Eyebrow>
        <span className="font-mono text-xs text-text-secondary">Son 7 gün</span>
      </div>

      {scores.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="Son 7 gündə müsahibə yoxdur"
          description="Bu həftə müsahibə keçdikcə balların burada görünəcək."
          className="py-14"
        />
      ) : (
        <div role="img" aria-label={`Son 7 gündə orta bal ${average} / 100`} className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke={chartColors.border} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                interval={0}
                tick={axisTick}
                tickLine={false}
                axisLine={{ stroke: chartColors.border }}
              />
              <YAxis
                width={32}
                domain={[0, 100]}
                ticks={[0, 50, 100]}
                tick={axisTick}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={{ stroke: chartColors.border }} contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="score"
                name="Bal"
                stroke={chartColors.accent}
                strokeWidth={2}
                dot={{ r: 3, fill: chartColors.accent, stroke: chartColors.surface, strokeWidth: 1.5 }}
                activeDot={{ r: 5 }}
                connectNulls
                isAnimationActive={!reduceMotion}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}