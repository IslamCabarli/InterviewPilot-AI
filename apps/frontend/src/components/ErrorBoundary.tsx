import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Runtime error caught by ErrorBoundary:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
          <p className="font-mono text-sm text-text-secondary">Xəta baş verdi</p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-text-primary">
            Nəsə düzgün getmədi
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Səhifəni yeniləməyi sına, problem davam edərsə bizə bildir.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-md bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            Səhifəni yenilə
          </button>
        </div>
      )
    }

    return this.props.children
  }
}