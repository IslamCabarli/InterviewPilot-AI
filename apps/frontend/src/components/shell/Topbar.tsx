import Logo from '../Logo'
import { ThemeToggle } from '../ui'
import UserMenu from './UserMenu'

export default function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-bg px-4 sm:px-6">
      <div className="md:hidden">
        <Logo />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        <UserMenu />
      </div>
    </header>
  )
}