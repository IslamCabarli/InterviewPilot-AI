import { Link } from 'react-router'
import Logo from '../Logo'
import { ThemeToggle } from '../ui'
import { buttonStyles } from '../ui/buttonStyles'

const links = [
  { href: '#features', label: 'Xüsusiyyətlər' },
  { href: '#how', label: 'Necə işləyir' },
]

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Logo />
          <nav aria-label="Əsas" className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="mr-1 hidden sm:block">
            <ThemeToggle />
          </div>
          <Link to="/login" className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
            Daxil ol
          </Link>
          <Link to="/register" className={buttonStyles({ size: 'sm' })}>
            Başla
          </Link>
        </div>
      </div>
    </header>
  )
}