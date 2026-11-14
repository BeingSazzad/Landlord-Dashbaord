import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[60vh] w-full flex-col items-center justify-center p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">Something went wrong</h2>
          <p className="mt-1.5 max-w-md text-xs text-slate-500">
            An unexpected error occurred in this view. You can reload the page or return to the overview.
          </p>
          {this.state.error && (
            <div className="mt-3 max-w-lg rounded-xl bg-slate-100 p-3 text-left font-mono text-[11px] text-slate-600 overflow-x-auto">
              {this.state.error.message}
            </div>
          )}
          <div className="mt-5 flex items-center gap-3">
            <Button variant="secondary" onClick={this.handleReset}>
              Try Again
            </Button>
            <Button variant="primary" onClick={this.handleReload} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
