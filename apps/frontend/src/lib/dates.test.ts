import { describe, expect, it } from 'vitest'
import { formatDate } from './dates'

describe('formatDate', () => {
  it('uses Azerbaijani month names', () => {
    expect(formatDate('2026-11-09T12:00:00')).toBe('9 noyabr')
    expect(formatDate('2026-01-15T12:00:00', { year: true })).toBe('15 yanvar 2026')
  })

  it('returns an empty string for missing or invalid values', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
    expect(formatDate('not-a-date')).toBe('')
  })
})