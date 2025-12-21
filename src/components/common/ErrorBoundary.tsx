import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="text-4xl">😵</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            エラーが発生しました
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {this.state.error?.message || '予期せぬエラーが発生しました'}
          </p>
          <button
            onClick={this.handleRetry}
            className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 transition-colors"
          >
            再試行
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
