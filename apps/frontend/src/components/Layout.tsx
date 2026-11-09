import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import MobileNav from './shell/MobileNav'
import Sidebar from './shell/Sidebar'
import Topbar from './shell/Topbar'

export default function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const focusMode = pathname === '/interview'

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [pathname])

  return (
    <div className="flex h-dvh bg-bg text-text-primary">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-4 focus:py-2 focus:text-sm"
      >
        Məzmuna keç
      </a>

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main id="main" ref={mainRef} tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto outline-none">
          <Outlet />
        </main>
        {!focusMode && <MobileNav />}
      </div>
    </div>
  )
}