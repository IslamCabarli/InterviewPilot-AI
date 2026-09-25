import { describe, it, expect } from 'vitest'
import { registerSchema, LoginSchema } from './validation'

describe('registerSchema', () => {
  it('rejects an invalid email format', () => {
    const result = registerSchema.safeParse({
      name: 'Test User',
      email: 'not-an-email',
      password: 'password123',
      password_confirmation: 'password123',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('email'))).toBe(true)
    }
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'different123',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('password_confirmation'))).toBe(true)
    }
  })

  it('rejects a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'short',
      password_confirmation: 'short',
    })

    expect(result.success).toBe(false)
  })

  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
    })

    expect(result.success).toBe(true)
  })
})

describe('LoginSchema', () => {
  it('rejects an invalid email format', () => {
    const result = LoginSchema.safeParse({
      email: 'not-an-email',
      password: 'somepassword',
    })

    expect(result.success).toBe(false)
  })

  it('rejects an empty password', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    })

    expect(result.success).toBe(false)
  })

  it('accepts valid login data', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com',
      password: 'anything',
    })

    expect(result.success).toBe(true)
  })
})