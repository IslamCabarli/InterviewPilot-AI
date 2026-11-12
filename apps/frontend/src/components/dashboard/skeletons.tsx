import { Card, Skeleton } from '../ui'

export function StatsSkeleton() {
  return (
    <div role="status" aria-label="Statistikalar yüklənir" className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index} className="p-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-8 w-16" />
        </Card>
      ))}
    </div>
  )
}

export function ChartsSkeleton() {
  return (
    <div role="status" aria-label="Qrafiklər yüklənir" className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 2 }, (_, index) => (
        <Card key={index}>
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-5 h-56 w-full" />
        </Card>
      ))}
    </div>
  )
}

export function BadgesSkeleton() {
  return (
    <Card role="status" aria-label="Nailiyyətlər yüklənir">
      <Skeleton className="h-3 w-28" />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
    </Card>
  )
}

export function RecentSkeleton() {
  return (
    <Card role="status" aria-label="Son müsahibələr yüklənir" className="p-0">
      <div className="px-6 pb-3 pt-6">
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="divide-y divide-border border-t border-border">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex items-center justify-between px-6 py-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </Card>
  )
}