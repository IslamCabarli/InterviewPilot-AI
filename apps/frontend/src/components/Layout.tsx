import { useEffect, useRef, Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'
import PageLoading from './PageLoading'
import ErrorBoundary from './ErrorBoundary'
import MobileNav from './shell/MobileNav'
import Sidebar from './shell/Sidebar'
import Topbar from './shell/Topbar'
import SkipLink from './SkipLink'

export default function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const focusMode = pathname === '/interview'

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0
  }, [pathname])

  return (
    <div className="flex h-dvh bg-bg text-text-primary">
      <SkipLink />

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main id="main" ref={mainRef} tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto outline-none">
          <ErrorBoundary variant="inline" resetKey={pathname}>
            <Suspense fallback={<PageLoading />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
        {!focusMode && <MobileNav />}
      </div>
    </div>
  )
}