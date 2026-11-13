import { describe, expect, it } from 'vitest'
import { getPageTitle } from './pageTitle'

describe('getPageTitle', () => {
  it('titles known pages', () => {
    expect(getPageTitle('/dashboard')).toBe('Dashboard · InterviewPilot AI')
    expect(getPageTitle('/settings')).toBe('Tənzimləmələr · InterviewPilot AI')
  })

  it('titles pages with parameters', () => {
    expect(getPageTitle('/interviews/12/report')).toBe('Müsahibə hesabatı · InterviewPilot AI')
  })

  it('uses a product title for the landing page', () => {
    expect(getPageTitle('/')).toBe('InterviewPilot AI — AI ilə texniki müsahibə təcrübəsi')
  })

  it('titles unknown pages as not found', () => {
    expect(getPageTitle('/nope')).toBe('Səhifə tapılmadı · InterviewPilot AI')
  })
})