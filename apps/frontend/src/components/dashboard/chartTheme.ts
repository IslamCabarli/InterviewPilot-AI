export const chartColors = {
  accent: 'var(--accent)',
  border: 'var(--border)',
  surface: 'var(--surface)',
  text: 'var(--text-primary)',
  muted: 'var(--text-secondary)',
} as const

export const axisTick = { fill: chartColors.muted, fontSize: 12 }

export const tooltipStyle = {
  backgroundColor: chartColors.surface,
  border: `1px solid ${chartColors.border}`,
  borderRadius: 8,
  fontSize: 12,
  color: chartColors.text,
}