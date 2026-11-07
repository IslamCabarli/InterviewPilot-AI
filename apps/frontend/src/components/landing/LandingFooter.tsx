import { GITHUB_URL } from '../../lib/links'
import Logo from '../Logo'

export default function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center">
        <Logo />
        <div className="flex items-center gap-6 text-xs text-text-secondary">
          <span>© {new Date().getFullYear()} InterviewPilot AI · MIT lisenziyası</span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-text-primary"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}