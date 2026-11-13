const MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avqust',
  'sentyabr',
  'oktyabr',
  'noyabr',
  'dekabr',
]

export function formatDate(
  value: string | null | undefined,
  options: { year?: boolean } = {},
): string {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const text = `${date.getDate()} ${MONTHS[date.getMonth()]}`
  return options.year ? `${text} ${date.getFullYear()}` : text
}