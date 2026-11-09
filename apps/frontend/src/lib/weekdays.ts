const LABELS: Record<string, string> = {
  Mon: 'B.e',
  Tue: 'Ç.a',
  Wed: 'Çər',
  Thu: 'C.a',
  Fri: 'Cüm',
  Sat: 'Şən',
  Sun: 'Baz',
}

export function getWeekdayLabel(short: string): string {
  return LABELS[short] ?? short
}