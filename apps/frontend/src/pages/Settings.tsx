import PageTransition from '../components/PageTransition'

export default function Settings() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-8 py-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Tənzimləmələr</h1>

        <div className="mt-8 rounded-lg border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            AI Provider
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Müsahibəni aparan AI mühərrikini seç.
          </p>
          <select className="mt-4 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm">
            <option>Ollama (lokal)</option>
            <option>OpenAI</option>
            <option>Claude</option>
          </select>
        </div>
      </div>
    </PageTransition>
  )
}