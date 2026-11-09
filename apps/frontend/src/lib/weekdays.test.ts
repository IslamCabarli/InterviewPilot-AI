import { describe, expect, it } from 'vitest'
import { getWeekdayLabel } from './weekdays'

describe('getWeekdayLabel', () => {
  it('translates every short weekday name', () => {
    expect(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(getWeekdayLabel)).toEqual([
      'B.e',
      'Ç.a',
      'Çər',
      'C.a',
      'Cüm',
      'Şən',
      'Baz',
    ])
  })

  it('returns unknown values unchanged', () => {
    expect(getWeekdayLabel('???')).toBe('???')
  })
})