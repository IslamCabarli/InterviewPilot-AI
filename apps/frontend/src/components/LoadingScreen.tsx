export default function LoadingScreen() {
  return (
    <div role="status" aria-label="Yüklənir" className="flex min-h-dvh items-center justify-center bg-bg">
      <div aria-hidden className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
    </div>
  )
}