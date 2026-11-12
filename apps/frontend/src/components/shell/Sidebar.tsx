import { ArrowUpRight, Plus } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { cn } from '../../lib/cn'
import { GITHUB_URL } from '../../lib/links'
import Logo from '../Logo'
import { buttonStyles } from '../ui/buttonStyles'
import { navItems } from './navItems'

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="flex h-14 shrink-0 items-center border-b border-border px-5">
        <Logo />
      </div>

      {pathname !== '/interview' && (
        <div className="px-3 pt-4">
          <Link to="/interview" className={buttonStyles({ className: 'w-full' })}>
            <Plus className="h-4 w-4" aria-hidden />
            Yeni müsahibə
          </Link>
        </div>
      )}

      <nav aria-label="Əsas naviqasiya" className="mt-4 flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = item.matches(pathname)
            const Icon = item.icon

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    active
                      ? 'bg-surface-muted text-text-primary'
                      : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary',
                  )}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent"
                    />
                  )}
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-5 py-4">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-text-secondary transition-colors hover:text-text-primary"
        >
          GitHub
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </a>
        <p className="mt-1 font-mono text-[11px] text-text-secondary">Açıq mənbə · MIT</p>
      </div>
    </aside>
  )
}