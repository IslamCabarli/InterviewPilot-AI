import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { getPageTitle } from '../lib/pageTitle'

export default function RouteEffects() {
  const { pathname } = useLocation()
  const previousPath = useRef<string | null>(null)
  const announcerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const title = getPageTitle(pathname)
    document.title = title

    const navigated = previousPath.current !== null && previousPath.current !== pathname
    previousPath.current = pathname
    if (!navigated) return

    if (announcerRef.current) announcerRef.current.textContent = title
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])

  return <div ref={announcerRef} role="status" aria-live="polite" className="sr-only" />
}