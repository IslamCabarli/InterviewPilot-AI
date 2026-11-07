import { useEffect, useState } from 'react'
import { getActiveInterview } from '../api/interview'
import InterviewSession from '../components/interview/InterviewSession'
import InterviewSetup from '../components/interview/InterviewSetup'
import { seedFromInterview } from '../components/interview/seed'
import type { SessionSeed } from '../components/interview/types'
import { Skeleton } from '../components/ui'

function InterviewSkeleton() {
  return (
    <div
      role="status"
      aria-label="Müsahibə yoxlanılır"
      className="mx-auto max-w-3xl space-y-6 px-6 py-10 sm:px-8"
    >
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  )
}

export default function Interview() {
  const [session, setSession] = useState<SessionSeed | null>(null)
  const [restoring, setRestoring] = useState(true)

  useEffect(() => {
    let cancelled = false

    getActiveInterview()
      .then((active) => {
        if (!cancelled && active) setSession(seedFromInterview(active))
      })
      .catch(() => {
        // Aktiv müsahibə yoxlanıla bilmədisə, yeni müsahibə ekranı göstərilir
      })
      .finally(() => {
        if (!cancelled) setRestoring(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (restoring) return <InterviewSkeleton />
  if (!session) return <InterviewSetup onStarted={setSession} />

  return <InterviewSession key={session.interviewId} seed={session} />
}