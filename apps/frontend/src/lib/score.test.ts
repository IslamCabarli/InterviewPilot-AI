import { describe, expect, it } from 'vitest'
import { getScoreTone } from './score'

describe('getScoreTone', () => {
  it('maps scores to tones', () => {
    expect(getScoreTone(85)).toBe('positive')
    expect(getScoreTone(70)).toBe('positive')
    expect(getScoreTone(55)).toBe('accent')
    expect(getScoreTone(49)).toBe('danger')
  })
})