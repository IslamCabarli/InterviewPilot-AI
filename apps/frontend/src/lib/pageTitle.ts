import { matchPath } from 'react-router'

const SITE = 'InterviewPilot AI'

const routes = [
  { path: '/', title: '' },
  { path: '/login', title: 'Daxil ol' },
  { path: '/register', title: 'Qeydiyyat' },
  { path: '/dashboard', title: 'Dashboard' },
  { path: '/interview', title: 'Müsahibə' },
  { path: '/interviews/:id/report', title: 'Müsahibə hesabatı' },
  { path: '/profile', title: 'Profil' },
  { path: '/settings', title: 'Tənzimləmələr' },
  { path: '/ui', title: 'UI Kit' },
]

export function getPageTitle(pathname: string): string {
  const match = routes.find((route) => matchPath({ path: route.path, end: true }, pathname))

  if (!match) return `Səhifə tapılmadı · ${SITE}`
  if (!match.title) return `${SITE} — AI ilə texniki müsahibə təcrübəsi`

  return `${match.title} · ${SITE}`
}