# Changelog

## 1.1.0

### Added
- Public landing page and redesigned login/registration
- App shell: sidebar, topbar, account menu, mobile navigation
- Guided interview setup, focus-mode interview, voice waveform, animated report
- Dashboard: loading skeletons, empty states, recent interviews, theme-aware charts, retry on errors
- Light/dark/system theme, toast notifications, reduced-motion support
- Accessibility: skip link, route announcements, focus management, axe tests
- Demo data seeder (local only)

### Changed
- Interviewer responses are streamed live
- Ollama runs on the host instead of Docker and uses the GPU automatically
- Routes are lazy loaded

### Fixed
- Resuming an unfinished interview after leaving the page
- Stale dashboard data after switching accounts