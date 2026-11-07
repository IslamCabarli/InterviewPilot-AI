import { describe, it, expect } from 'vitest'
import { AxiosError, type AxiosResponse } from 'axios'
import { getAuthErrorMessage } from './errors'

const withStatus = (status: number) =>
  new AxiosError('failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
    status,
    data: {},
  } as AxiosResponse)

describe('getAuthErrorMessage', () => {
  it('returns the fallback for credential errors', () => {
    expect(getAuthErrorMessage(withStatus(422), 'Yanlışdır')).toBe('Yanlışdır')
  })

  it('explains rate limiting', () => {
    expect(getAuthErrorMessage(withStatus(429), 'x')).toMatch(/çox sayda cəhd/i)
  })

  it('reports server failures', () => {
    expect(getAuthErrorMessage(withStatus(500), 'x')).toMatch(/serverdə xəta/i)
  })

  it('reports a missing connection when there is no response', () => {
    expect(getAuthErrorMessage(new AxiosError('Network Error'), 'x')).toMatch(/qoşulmaq mümkün olmadı/i)
  })

  it('returns the fallback for non-axios errors', () => {
    expect(getAuthErrorMessage(new Error('boom'), 'Yanlışdır')).toBe('Yanlışdır')
  })
})