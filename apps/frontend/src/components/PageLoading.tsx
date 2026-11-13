export default function PageLoading() {
  return (
    <div role="status" aria-label="Yüklənir" className="flex h-64 items-center justify-center">
      <div aria-hidden className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
    </div>
  )
}