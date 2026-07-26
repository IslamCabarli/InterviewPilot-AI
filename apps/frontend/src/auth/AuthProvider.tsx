import type { ReactNode } from 'react'
import { useAuth } from './useAuth'
import LoadingScreen from '../components/LoadingScreen'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isBootstrapping } = useAuth()

  // Yalnız tətbiqin ilkin açılışında (token var, user hələ təsdiqlənməyib)
  // loading göstəririk. Sonrakı naviqasiyalarda bu şərt artıq false-dur,
  // çünki useCurrentUser cache-lənmiş data qaytarır.
  if (isBootstrapping) {
    return <LoadingScreen />
  }

  return <>{children}</>
}