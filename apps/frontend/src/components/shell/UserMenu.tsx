import { useEffect, useId, useRef, useState } from 'react'
import { LogOut, Settings, User } from 'lucide-react'
import { Link } from 'react-router'
import { useLogout } from '../../auth/queries'
import { useAuth } from '../../auth/useAuth'
import { cn } from '../../lib/cn'
import { getInitials } from '../../lib/initials'
import { ThemeToggle } from '../ui'

const itemStyles = cn(
  'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-text-primary transition-colors',
  'hover:bg-surface-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent',
  'disabled:cursor-not-allowed disabled:opacity-50',
)

export default function UserMenu() {
  const { user } = useAuth()
  const logout = useLogout()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return

    const isOutside = (target: EventTarget | null) =>
      !rootRef.current?.contains(target as Node | null)

    const handlePointerDown = (event: PointerEvent) => {
      if (isOutside(event.target)) setOpen(false)
    }
    const handleFocusIn = (event: FocusEvent) => {
      if (isOutside(event.target)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const name = user?.name ?? 'İstifadəçi'

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Hesab menyusu"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-muted',
          'text-xs font-medium text-text-primary transition-colors hover:border-accent',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        )}
      >
        {getInitials(user?.name)}
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute right-0 top-full z-40 mt-2 w-64 rounded-lg border border-border bg-surface p-1"
        >
          <div className="border-b border-border px-3 py-3">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="mt-0.5 truncate text-xs text-text-secondary">{user?.email}</p>
          </div>

          <div className="py-1">
            <Link to="/profile" onClick={() => setOpen(false)} className={itemStyles}>
              <User className="h-4 w-4 text-text-secondary" aria-hidden />
              Profil
            </Link>
            <Link to="/settings" onClick={() => setOpen(false)} className={itemStyles}>
              <Settings className="h-4 w-4 text-text-secondary" aria-hidden />
              Tənzimləmələr
            </Link>
          </div>

          <div className="flex items-center justify-between border-t border-border px-3 py-2 sm:hidden">
            <span className="text-sm text-text-secondary">Tema</span>
            <ThemeToggle />
          </div>

          <div className="border-t border-border pt-1">
            <button
              type="button"
              disabled={logout.isPending}
              onClick={() => {
                setOpen(false)
                logout.mutate()
              }}
              className={itemStyles}
            >
              <LogOut className="h-4 w-4 text-text-secondary" aria-hidden />
              Çıxış
            </button>
          </div>
        </div>
      )}
    </div>
  )
}