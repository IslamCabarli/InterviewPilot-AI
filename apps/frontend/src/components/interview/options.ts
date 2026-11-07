import { Container, Layers, Monitor, Network, Server, Users } from 'lucide-react'

export const interviewTypes = [
  { value: 'backend', label: 'Backend', description: 'API, verilənlər bazası, arxitektura', icon: Server },
  { value: 'frontend', label: 'Frontend', description: 'React, TypeScript, istifadəçi interfeysi', icon: Monitor },
  { value: 'fullstack', label: 'Full Stack', description: 'Frontend və backend birlikdə', icon: Layers },
  { value: 'devops', label: 'DevOps', description: 'Docker, CI/CD, serverlər', icon: Container },
  { value: 'system-design', label: 'System Design', description: 'Miqyaslanma və dizayn qərarları', icon: Network },
  { value: 'hr', label: 'HR', description: 'Davranış və motivasiya sualları', icon: Users },
] as const

export const difficulties = [
  { value: 'easy', label: 'Easy', description: 'Əsas anlayışlar. Yeni başlayanlar üçün.', level: 1 },
  { value: 'medium', label: 'Medium', description: 'Orta səviyyəli suallar və praktik ssenarilər.', level: 2 },
  { value: 'hard', label: 'Hard', description: 'Dərin texniki suallar və mürəkkəb problemlər.', level: 3 },
  { value: 'senior', label: 'Senior', description: 'Arxitektura, trade-off-lar və liderlik.', level: 4 },
] as const

export function getTypeLabel(value: string): string {
  return interviewTypes.find((item) => item.value === value)?.label ?? value
}

export function getDifficultyLabel(value: string): string {
  return difficulties.find((item) => item.value === value)?.label ?? value
}