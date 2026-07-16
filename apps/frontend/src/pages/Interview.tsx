import PageTransition  from '../components/PageTransition'

const interviewTypes = [
  'Frontend', 'Backend', 'Full Stack', 'DevOps', 'System Design', 'HR',
]


const difficulties = ['Easy', 'Medium', 'Hard', 'Senior']

export default function Interview(){
    return(
        <PageTransition>
      <div className="mx-auto max-w-3xl px-8 py-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Yeni müsahibə
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Növü və çətinlik səviyyəsini seç.
        </p>

        <div className="mt-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Müsahibə növü
          </p>
          <div className="flex flex-wrap gap-2">
            {interviewTypes.map((type) => (
              <button
                key={type}
                className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:border-accent hover:text-accent"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Çətinlik
          </p>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((level) => (
              <button
                key={level}
                className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:border-accent hover:text-accent"
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button className="mt-10 w-full rounded-md bg-accent py-3 text-sm font-medium text-white hover:bg-accent/90">
          Müsahibəyə başla
        </button>
      </div>
    </PageTransition>
    )
}