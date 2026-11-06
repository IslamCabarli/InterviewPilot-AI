import { Monitor, Moon, Sun } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useThemeStore } from '../../theme/themeStore'

const options = [
  { value: 'light', icon: Sun, label: 'İşıqlı' },
  { value: 'system', icon: Monitor, label: 'Sistem' },
  { value: 'dark', icon: Moon, label: 'Tünd' },
] as const

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  return (
    <div role="group" aria-label="Tema" className="inline-flex rounded-md border border-border bg-surface p-0.5">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-pressed={theme === value}
          aria-label={label}
          title={label}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded transition-colors',
            theme === value
              ? 'bg-surface-muted text-text-primary'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}