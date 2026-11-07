import { Navigate, Outlet } from 'react-router'
import { useAuth } from './useAuth'

export function GuestRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}