import ScoreBar from '../ScoreBar'

export default function HeroPreview() {
  return (
    <div aria-hidden="true" className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-display text-sm font-semibold tracking-tight">Backend müsahibəsi</p>
          <p className="text-xs text-text-secondary">Medium səviyyə</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
            Danışır
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="max-w-[85%] rounded-lg border border-border bg-bg px-3 py-2.5 text-sm leading-relaxed">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-text-secondary">
            İnterviewer
          </p>
          Can you explain how dependency injection works in Laravel, and why it matters?
        </div>
        <div className="ml-auto max-w-[85%] rounded-lg bg-accent px-3 py-2.5 text-sm leading-relaxed text-accent-foreground">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide opacity-90">Sən</p>
          The service container resolves a class&apos;s dependencies automatically, so code stays
          loosely coupled and easy to test.
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Hesabat</p>
          <p className="font-mono text-2xl font-medium">
            82<span className="text-sm text-text-secondary">/100</span>
          </p>
        </div>
        <div className="mt-3 space-y-3">
          <ScoreBar label="Texniki bilik" value={22} max={25} />
          <ScoreBar label="Kommunikasiya" value={17} max={20} />
          <ScoreBar label="Problem həlli" value={15} max={20} />
        </div>
      </div>
    </div>
  )
}