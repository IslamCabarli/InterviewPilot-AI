import { Link } from 'react-router'
import PageTransition from '../components/PageTransition'

export default function NotFound() {
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
        <p className="font-mono text-sm text-text-secondary">404</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-text-primary">
          Səhifə tapılmadı
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Axtardığın səhifə mövcud deyil və ya köçürülüb.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 rounded-md bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/90"
        >
          Dashboard-a qayıt
        </Link>
      </div>
    </PageTransition>
  )
}