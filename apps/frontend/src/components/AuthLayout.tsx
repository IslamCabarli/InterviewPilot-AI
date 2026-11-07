import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import Logo from './Logo'
import { ThemeToggle } from './ui'

const points = [
  'Səslə real müsahibə təcrübəsi',
  'Hər müsahibədən sonra ətraflı AI hesabatı',
  'Məlumatların öz kompüterində qalır',
]

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden border-r border-border bg-surface-muted lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Logo />

        <div className="relative z-10 max-w-md">
          <p className="font-display text-3xl font-semibold leading-tight tracking-tight">
            Hər müsahibə səni bir addım irəli aparır.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-text-secondary">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 font-mono text-xs text-text-secondary">Açıq mənbə · MIT</p>

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full border border-border"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full border border-border"
        />
      </aside>

      <main className="flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Logo className="lg:invisible" />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-16 sm:px-10">
          <div className="w-full max-w-sm">
            <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-text-secondary">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <p className="mt-6 text-center text-sm text-text-secondary">{footer}</p>
          </div>
        </div>
      </main>
    </div>
  )
}