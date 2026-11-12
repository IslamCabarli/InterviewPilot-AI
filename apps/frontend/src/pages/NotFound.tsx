import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth'
import Logo from '../components/Logo'
import SkipLink from '../components/SkipLink'
import { ThemeToggle } from '../components/ui'
import { buttonStyles } from '../components/ui/buttonStyles'

export default function NotFound() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <SkipLink />

      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Logo />
        <ThemeToggle />
      </header>

      <main
        id="main"
        tabIndex={-1}
        className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center outline-none"
      >
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">Səhifə tapılmadı</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
          Axtardığın səhifə mövcud deyil, köçürülüb və ya ünvan səhv yazılıb.
        </p>
        <Link to={isAuthenticated ? '/dashboard' : '/'} className={buttonStyles({ className: 'mt-8' })}>
          {isAuthenticated ? 'Dashboard-a qayıt' : 'Ana səhifəyə qayıt'}
        </Link>
      </main>
    </div>
  )
}