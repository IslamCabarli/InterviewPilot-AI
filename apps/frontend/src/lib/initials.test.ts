import { describe, expect, it } from 'vitest'
import { getInitials } from './initials'

describe('getInitials', () => {
  it('uses the first letters of the first and last name', () => {
    expect(getInitials('Islam Cabarli')).toBe('IC')
    expect(getInitials('Ali Veli Məmmədov')).toBe('AM')
  })

  it('works with a single name and Azerbaijani letters', () => {
    expect(getInitials('islam')).toBe('I')
    expect(getInitials('Əli Vəliyev')).toBe('ƏV')
  })

  it('falls back to a placeholder when there is no name', () => {
    expect(getInitials('   ')).toBe('?')
    expect(getInitials(undefined)).toBe('?')
  })
})