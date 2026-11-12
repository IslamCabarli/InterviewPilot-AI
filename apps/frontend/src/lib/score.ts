export type ScoreTone = 'positive' | 'accent' | 'danger'

export function getScoreTone(score: number): ScoreTone {
  if (score >= 70) return 'positive'
  if (score >= 50) return 'accent'
  return 'danger'
}