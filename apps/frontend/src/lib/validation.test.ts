import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from './validation'

const valid = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  password_confirmation: 'password123',
}

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects an invalid email format', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'not-an-email' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('email'))).toBe(true)
    }
  })

  it('rejects mismatched passwords with a clear message', () => {
    const result = registerSchema.safeParse({ ...valid, password_confirmation: 'different123' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.map((i) => i.message)).toContain('Şifrələr uyğun gəlmir')
    }
  })

  it('rejects a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: 'short',
      password_confirmation: 'short',
    })

    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('rejects an invalid email format', () => {
    expect(loginSchema.safeParse({ email: 'not-an-email', password: 'secret' }).success).toBe(false)
  })

  it('rejects an empty password', () => {
    expect(loginSchema.safeParse({ email: 'test@example.com', password: '' }).success).toBe(false)
  })

  it('accepts valid login data', () => {
    expect(loginSchema.safeParse({ email: 'test@example.com', password: 'anything' }).success).toBe(true)
  })
})