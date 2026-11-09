import { LayoutDashboard, Mic, Settings, User, type LucideIcon } from 'lucide-react'

export interface NavItemConfig {
  to: string
  label: string
  icon: LucideIcon
  matches: (pathname: string) => boolean
}

export const navItems: NavItemConfig[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    matches: (pathname) => pathname === '/dashboard',
  },
  {
    to: '/interview',
    label: 'Müsahibə',
    icon: Mic,
    // Hesabat səhifəsi də müsahibə bölməsinə aiddir
    matches: (pathname) => pathname === '/interview' || pathname.startsWith('/interviews/'),
  },
  {
    to: '/profile',
    label: 'Profil',
    icon: User,
    matches: (pathname) => pathname === '/profile',
  },
  {
    to: '/settings',
    label: 'Tənzimləmələr',
    icon: Settings,
    matches: (pathname) => pathname === '/settings',
  },
]