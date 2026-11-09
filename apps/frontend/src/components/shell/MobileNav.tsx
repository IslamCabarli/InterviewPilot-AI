import { Link, useLocation } from 'react-router'
import { cn } from '../../lib/cn'
import { navItems } from './navItems'

export default function MobileNav() {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Mobil naviqasiya"
      className="shrink-0 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-4">
        {navItems.map((item) => {
          const active = item.matches(pathname)
          const Icon = item.icon

          return (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent',
                  active ? 'text-accent' : 'text-text-secondary hover:text-text-primary',
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}